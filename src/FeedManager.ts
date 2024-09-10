import { App, request, TFile, TFolder, htmlToMarkdown, normalizePath, ListItemCache, Notice, FrontMatterCache } from 'obsidian';
import RSSTrackerPlugin from './main';
import { TrackedRSSfeed, TrackedRSSitem, IRssMedium } from './FeedAssembler';
import * as path from 'path';
import { extractFromHtml, ArticleData, Transformation, addTransformations } from '@extractus/article-extractor'
import { RSSfileManager } from './RSSFileManager';
import { InputUrlModal } from './commands';


/**
 * RSS feed configuration data.
 */
export class FeedConfig {
    feedUrl: string; // rss feed location
    itemLimit: number; // Maximum number of RSS items to cache on the filesystem.
    source: TFile; // The dashboard Markdown file of the feed.

    /**
     * Factory method to parse the feed configuration from a
     * RSS feed dashboard (Markdown file).
     * @param app - The Obsidian application object
     * @param file - Dashboard file
     * @returns The RSS feed configuration. `null` if the
     *          file does not exist or is not a feed dashboard.
     */
    static fromFile(app: App, file: TFile): FeedConfig | null {
        if (!file) {
            return null;
        }
        // read file frontmatter to determine if this is a feed dashboard
        const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
        if (!frontmatter) {
            return null;
        }
        const { feedurl, itemlimit } = frontmatter
        if (!feedurl || !itemlimit) {
            return null;
        }

        return new FeedConfig(feedurl, itemlimit, file);

    }

    constructor(feedurl: string, itemlimit: string, source: TFile) {
        this.feedUrl = feedurl;
        this.itemLimit = parseInt(itemlimit);
        this.source = source;
    }
}

/**
 * Annotated RSS item with selected Frontmatter properties.
 */
type TAnnotatedItem = {
    item: TFile;
    pinned: boolean,
    published: number;
}

/**
 * Manage RSS feeds in Obsidian.
 *
 * Currently available functionality:
 * - Building a Markdown representation of RSS feeds including feed dashboards.
 *   @see {@link createFeedFromFile} and  @see {@link createFeedFromUrl}
 * - Updating feeds (individual or all). @see {@link updateFeed} and @see {@link}
 * - Setting all items on a feed as _read_. see {@link markFeedItemsRead}
 */
export class FeedManager {
    private static readonly HASH_FINDER = /(?<!\]\([^\s]*|\[\[[^\s]*|[\w&/#$])#(?![\da-fA-F]+\b|\W)/gu;
    private static VALIDATTR = /^[a-zA-Z_-]*$/; // match valid attribute names

    private _app: App;
    private _plugin: RSSTrackerPlugin;
    private get _filemgr(): RSSfileManager {
        return this._plugin.filemgr;
    }

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this._app = app;
        this._plugin = plugin;

        // configure the article extractor to make the returned content
        // more Obsidian friendly
        const tm: Transformation = {
            patterns: [
                /.*/ // apply to all websites
            ],
            pre: document => {
                // remove all weird attributes
                const allElements = document.body.querySelectorAll("*")
                    .forEach(e => {
                        const
                            illegalNames = [],
                            attribs = e.attributes,
                            attCount = attribs.length;

                        for (let i = 0; i < attCount; i++) {
                            const
                                att = attribs[i],
                                name = att.name;
                            if (!FeedManager.VALIDATTR.test(name)) {
                                illegalNames.push(name);
                            }
                        }
                        for (const name of illegalNames) {
                            e.removeAttribute(name);
                        }
                    });
                return document;
            },
            post: document => {
                // look for <pre> tags and make sure their first child is always a <code> tag.
                const pres = document.body.getElementsByTagName("pre");
                for (let i = 0; i < pres.length; i++) {
                    const pre = pres[i];
                    let firstChild = pre.firstChild;
                    if (firstChild && firstChild.nodeName !== "code") {
                        const code = document.createElement("code");
                        let child;
                        while (firstChild) {
                            code.append(firstChild);
                            firstChild = pre.firstChild;
                        }
                        pre.append(code);
                    }
                }
                return document;
            }
        };
        addTransformations([tm]);
    }

    private getItemFolderPath(feed: TFile) {
        return normalizePath(path.join(feed.parent?.path ?? "", feed.basename));
    }


    private formatImage(image: IRssMedium): string {
        const { src, width, height } = image as IRssMedium;
        return `![image|400](${src}){.rss-image}`;
    }

    private formatTags(tags: string[]): string {
        const tagmgr = this._plugin.tagmgr;
        // add `#` for mapping and remove it afterwards
        return tags.map(t => tagmgr.mapHashtag("#" + t.replaceAll(" ", "_")).slice(1)).join(",");
    }

    private async saveFeedItem(itemFolder: TFolder, item: TrackedRSSitem): Promise<TFile> {
        let { id, tags, title, link, description, published, author, image, content } = item;

        if (description) {
            description = htmlToMarkdown(description);
        }
        if (content) {
            content = htmlToMarkdown(content);
        }

        const byline = author ? ` by ${author}` : "";
        title = `${title}${byline} - ${published}`;

        if (!content && description && description.length > 500) {
            content = description
        }

        const defaultImage = await this._plugin.settings.getRssDefaultImagePath();

        if (description) {
            const teaser = (description.length > 500 ? (description.substring(0, 500) + "⋯") : description);
            description = teaser.replaceAll("\n", "\n> ");
        }

        // fill in the template
        const dataMap = {
            "{{id}}": id,
            "{{author}}": author ?? itemFolder.name,
            "{{link}}": link ?? "",
            "{{publishDate}}": published ?? "",
            "{{tags}}": this.formatTags(tags),
            "{{title}}": title ?? "",
            "{{image}}": image ? this.formatImage(image) : `![[${defaultImage}|200x200]]{.rss-image}`,
            "{{description}}": description ?? "",
            "{{content}}": content ?? "",
            "{{feedFileName}}": itemFolder.name,
        };
        return this._filemgr.createFile(itemFolder.path, item.fileName, "RSS Item", dataMap, true);
    }

    private async updateFeedItems(feedConfig: FeedConfig, feed: TrackedRSSfeed): Promise<number> {
        const { itemLimit, source } = feedConfig;

        // TODO: move that to FileManager
        // create the folder for the feed items (if needed)
        const itemFolderPath = this.getItemFolderPath(source);
        let itemFolder = this._app.vault.getFolderByPath(itemFolderPath);
        if (!itemFolder) {
            itemFolder = await this._app.vault.createFolder(itemFolderPath);
        }

        // build a map of RSS items already existing in the feed follder
        const
            meta = this._app.metadataCache,
            oldItemsMap = new Map<string, TAnnotatedItem>(); // mapping item ID -> annotated item
        for (const itemFile of itemFolder.children.filter((fof) => fof instanceof TFile).map(f => f as TFile)) {
            const frontmatter = meta.getFileCache(itemFile)?.frontmatter;
            if (frontmatter) {
                const { pinned, published, id } = frontmatter;
                if (published && id) {
                    oldItemsMap.set(id, { item: itemFile, published: published, pinned: !!pinned });
                } else {
                    console.log(`${itemFile.path} missing property 'id' or 'published'`);
                }
            } else {
                console.log(`${itemFile.path} has no frontmatter`);
            }
        }

        // Inspect the downloaded feed and determine which of its items are not already present
        // and need to be saved to disk.
        const newRSSitems: TrackedRSSitem[] = feed.items
            .slice(0,itemLimit) // do not use anything beyond the item limit
            .filter(itm => !oldItemsMap.has(itm.id));

        if (newRSSitems.length === 0) {
            return 0; // nothing new
        }

        // optain an oldest-first list of remainong RSS item files
        const oldItems: TAnnotatedItem[] = Array.from(oldItemsMap.values())
            .filter(it => !it.pinned) // do not consider pinned items for deletion
            .sort((a, b) => a.published - b.published); // oldest first

        // remove item files which are too much with respect to the folder limit
        const deleteCount = oldItems.length + newRSSitems.length - itemLimit;
        if (deleteCount > 0) {
            // we have to delete these many of the old items from the feed folder
            for (let i = 0; i < deleteCount; i++) {
                const itm = oldItems[i];
                try {
                    await this._app.vault.delete(itm.item);
                } catch (err: any) {
                    console.error(`Failed to delete '${itm.item.basename}': ${err.message}`);
                }
            }
        }

        // create new files for new items
        for (const newItem of newRSSitems) {
            try {
                await this.saveFeedItem(itemFolder, newItem);
            } catch (err: any) {
                console.error(`Failed to save RSS item '${newItem.title}' in feed '${feedConfig.source.name}'; error: ${err.message}`);
                new Notice(`Could not save '${newItem.fileName}' in feed '${feedConfig.source.name}': ${err.message}`);
            }
        }

        return newRSSitems.length;
    }

    /**
     * Create an RSS feed Markdown representaiton from a local XML file.
     *
     * The Markdown representation consists of
     * - a feed dashboard
     * - a directory whic has the same name as the dashboard (without the .md extension)
     *   containing the RSS items of the feed,
     *
     * The file system layout of an Obsidian RSS feed looks like this:
     * ~~~
     * 📂
     *  ├─ <feedname>.md ← dashboard
     *  ╰─ 📂<feedname>
     *        ├─ <item-1>.md
     *        ├─ …
     *        ╰─ <item-n>.md
     * ~~~
     *
     * ⚠ the base url to make relative urls absolute is synthesized as `https://localhost`.
     * @param xml - XML file representing an RSS feed.
     * @param location - The obsidian folder where to create the Markdown files
     *                   representing the feed.
     * @returns The dashboard Markdown file.
     */
    async createFeedFromFile(xml: TFile, location: TFolder): Promise<TFile> {
        const feedXML = await this._app.vault.read(xml);
        return this.createFeed(new TrackedRSSfeed(feedXML, "https://localhost/" + xml.path), location);
    }

    /**
    * Create an RSS feed Markdown representaiton from a hyperlink.
    *
    * The Markdown representation consists of
    * - a feed dashboard
    * - a directory whic has the same name as the dashboard (without the .md extension)
    *   containingthe RSS items of the feed,
    *
    * The file system layout of an Obsidian RSS feed looks like this:
    * ~~~
    * 📂
    *  ├─ <feedname>.md ← dashboard
    *  ╰─ 📂<feedname>
    *        ├─ <item-1>.md
    *        ├─ …
    *        ╰─ <item-n>.md
    * ~~~
    *
    * @param url - A hyperlink pointing to an RSS feed on the web.
    * @param location - The obsidian folder where to create the Markdown files
    *                   representing the feed.
    * @returns The dashboard Markdown file.
    */
    async createFeedFromUrl(url: string, location: TFolder): Promise<TFile> {
        const feedXML = await request({
            url: url,
            method: "GET"
        });
        return this.createFeed(new TrackedRSSfeed(feedXML, url), location);
    }

    private async createFeed(feed: TrackedRSSfeed, location: TFolder): Promise<TFile> {
        const
            { title, site, description } = feed,
            defaultImage: string = await this._plugin.settings.getRssDefaultImagePath(),
            image: IRssMedium | string | undefined = feed.image;
        const dataMap = {
            "{{feedUrl}}": feed.source,
            "{{siteUrl}}": site ?? "",
            "{{title}}": htmlToMarkdown(title ?? ""),
            "{{description}}": description ? htmlToMarkdown(description) : "",
            "{{image}}": image ? this.formatImage(image) : `![[${defaultImage}|200x200]]{.rss-image}`
        };

        // create the feed dashboard file
        const
            dashboard = await this._filemgr.createFile(location.path, feed.fileName, "RSS Feed", dataMap),
            itemlimit = this._app.metadataCache.getFileCache(dashboard)?.frontmatter?.itemlimit,
            cfg = new FeedConfig(feed.source ?? "", itemlimit ?? "100", dashboard);

        if (dashboard && cfg) {
            let status: string;
            try {
                await this.updateFeedItems(cfg, feed);
                status = "OK";
            } catch (err: any) {
                console.error(err);
                status = err.message;
            }

            let itemLimit;
            this._app.fileManager.processFrontMatter(dashboard, frontmatter => {
                frontmatter.status = status;
                frontmatter.updated = new Date().toISOString();
                frontmatter.interval = feed.avgPostInterval;
            });
        }
        return dashboard;
    }

    /**
     *
     */
    async updateFeed(feedConfig: FeedConfig | null, force: boolean): Promise<number> {
        if (!feedConfig) {
            return -1;
        }

        if (!force) {
            // check if it time to update
            const meta = this._app.metadataCache.getFileCache(feedConfig.source),
                fm = meta?.frontmatter;
            if (fm?.updated && fm?.interval) {
                const now = new Date().valueOf(),
                    lastUpdate = new Date(fm.updated).valueOf(),
                    span = parseInt(fm.interval) * 60 * 60 * 1000;
                if ((lastUpdate + span) > now) {
                    return 0; // time has not come
                }
            }
        }

        let
            interval = 1, // default 1h
            status = "OK",
            promise;
        try {
            const
                feedXML = await request({
                    url: feedConfig.feedUrl,
                    method: "GET"
                }),
                feed = new TrackedRSSfeed(feedXML, feedConfig.feedUrl);
            // compute the new update interval in hours
            interval = feed.avgPostInterval;
            promise = this.updateFeedItems(feedConfig, feed);
        } catch (err: any) {
            status = err.message;
        }

        this._app.fileManager.processFrontMatter(feedConfig.source, fm => {
            fm.status = status;
            fm.updated = new Date().toISOString();
            fm.interval = interval
        });

        console.log(`Feed ${feedConfig.source.name} update status: ${status}`);
        return promise ?? -1;
    }

    async markFeedItemsRead(feed: TFile) {
        const itemFolder: TFolder | null = this._app.vault.getFolderByPath(this.getItemFolderPath(feed));
        if (itemFolder) {
            const meta = this._app.metadataCache;
            let items: TFile[] = itemFolder.children.filter((fof) => fof instanceof TFile)
                .map(f => f as TFile)
                .filter(f => {
                    const fm = meta.getFileCache(f)?.frontmatter;
                    return fm?.["id"] && fm?.["feed"]
                });
            for (let item of items) {

                const tasks = meta.getFileCache(item)
                    ?.listItems
                    ?.filter((li: ListItemCache) => li.task === " ");
                const first = tasks?.first();
                if (first) {
                    const data = await this._app.vault.read(item),
                        s = first.position.start.offset,
                        e = first.position.end.offset,
                        newdata = data.substring(0, s) + "- [x]" + data.substring(s + 5);
                    this._app.vault.modify(item, newdata);
                }
            }
        }
    }

    async updateAllRSSfeeds(force: boolean) {
        await this._plugin.tagmgr.updateTagMap();
        const promises: Promise<number>[] = this._plugin.filemgr.getFeeds()
            .map(feed => FeedConfig.fromFile(this._app, feed))
            .filter(cfg => cfg)
            .map(cfg => this.updateFeed(cfg, force));
        let n: number = 0;
        const notice = new Notice(`0/${promises.length} feeds updated`, 0);
        for (let promise of promises) {
            try {
                if ((await promise) >= 0) {
                    n++;
                    notice.setMessage(`${n}/${promises.length} RSS feeds updated`);
                }
            } catch (ex: any) {
                console.error(`Feed update failed: ${ex.message}`);
            }
        }
        notice.hide();
        console.log(`Update of ${n}/${promises.length} feeds complete.`)
        new Notice(`${n}/${promises.length} RSS feeds successfully updated`, 30000);
    }

    canDownloadArticle(item: TFile): boolean {
        const fm: FrontMatterCache | undefined = this._app.metadataCache.getFileCache(item)?.frontmatter;
        return fm !== undefined && fm["role"] === "rssitem";
    }

    async downloadArticle(item: TFile) {
        const
            fm: FrontMatterCache | undefined = this._app.metadataCache.getFileCache(item)?.frontmatter,
            link: string | undefined = fm?.["link"];
        if (link) {
            // download the article
            const
                itemHTML = await request({
                    url: link,
                    method: "GET"
                }),
                article: ArticleData | null = await extractFromHtml(itemHTML, link);
            if (article) {
                const { title, content } = article;
                let articleContent: string = "\n";
                if (title) {
                    articleContent += "# " + title + " ⬇️";
                }

                if (content) {
                    articleContent += "\n\n" + htmlToMarkdown(content);
                }
                if (articleContent.length > 0) {
                    this._plugin.tagmgr.registerFileForPostProcessing(item.path);
                    return this._app.vault.append(item, articleContent);
                }
            }
        }
    }
}