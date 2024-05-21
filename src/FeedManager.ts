import { App, request, TFile, TFolder, htmlToMarkdown, normalizePath, ListItemCache } from "obsidian";
import RSSTrackerPlugin from './main';
import { TrackedRSSfeed, TrackedRSSitem, IRSSimage, TPropertyBag } from "./FeedAssembler"
import * as path from 'path';

export class FeedConfig {
    feedUrl: string;
    itemLimit: number;
    source: TFile;

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

    private constructor(feedurl: string, itemlimit: string, source: TFile) {
        this.feedUrl = feedurl;
        this.itemLimit = parseInt(itemlimit);
        this.source = source;
    }
}

export class FeedManager {
    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;
    private static readonly ILLEGAL_FS_CHARS = /[#\\><\/|\[\]:?^]/g;
    private static readonly HASH_FINDER = /(?<!\]\([^[\]()]+)#(?=\b)/g;
    private app: App;
    private plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    private getItemFolderPath(feed: TFile) {
        return normalizePath(path.join(feed.parent?.path ?? "", feed.basename));
    }

    private expandTemplate(template: string, properties: TPropertyBag): string {
        return template.split(FeedManager.TOKEN_SPLITTER).map(s => s.startsWith("{{") ? (properties[s] ?? s) : s).join("");
    }

    private formatImage(image: IRSSimage): string {
        const { url, width, height } = image;
        let size = "";
        if (width) {
            size = `|${width}`;
            if (height) {
                size += `x${height}`
            }
        }
        return `![image${size}](${url})`;
    }

    private formatFilename(name: string): string {
        return name.replace(/\w+:\/\/.*/, "")
            .replace(FeedManager.ILLEGAL_FS_CHARS, "🔹")
            .replace(/🔹{2,🔹}|🔹\s+/g, "🔹")
            .substring(0, 60)
            .replace(/[.\s🔹]*$/, "");
    }
    private formatTags(tags: string[]): string {
        return "[" + tags.map(t => "rss/" + t.replace(" ", "_")).join(",") + "]";
    }
    private formatHashTags(md: string): string {
        return md.replace(FeedManager.HASH_FINDER, "#rss/");
    }

    private async saveFeedItem(itemFolder: TFolder, item: TrackedRSSitem): Promise<TFile> {
        let { id, tags, title, link, description, published, author, image, content } = item;

        if (description) {
            description = this.formatHashTags(htmlToMarkdown(description));
        }
        if (content) {
            content = this.formatHashTags(htmlToMarkdown(content));
        }
        title = this.formatHashTags(title);

        const byline = author ? ` by ${author}` : "";
        let abstract = `> [!abstract] [${title}](${link})${byline} - ${published}`;

        if (description && item.content) {
            abstract += "\n> " + description;
        }
        if (image) {
            abstract += "\n> " + this.formatImage(image);
        }

        if (!content) {
            content = description
        }
        const basename = this.formatFilename(item.title);
        let itemPath = normalizePath(path.join(itemFolder.path, `${basename}.md`));

        // make sure the name is unique
        let uniqueBasename = basename,
            counter: number = 1;
        while (this.app.vault.getFileByPath(itemPath)) {
            uniqueBasename = `${basename} (${counter})`;
            itemPath = normalizePath(path.join(itemFolder.path, `${uniqueBasename}.md`));
            counter++;
        }

        // fill in the template
        const itemContent = this.expandTemplate(this.plugin.settings.itemTemplate, {
            "{{id}}": id,
            "{{title}}": '"' + title + '"',
            "{{feedName}}": '"' + itemFolder.name + '"',
            "{{author}}": author ? ('"' + author + '"') : ('"' + itemFolder.name + '"'),
            "{{link}}": link ?? "",
            "{{publishDate}}": published ?? "",
            "{{tags}}": this.formatTags(tags),
            "{{content}}": abstract + "\n" + content,
            "{{fileName}}": uniqueBasename,
        });

        return this.app.vault.create(itemPath, itemContent).catch(reason => { throw reason });
    }

    private async updateFeedItems(feedConfig: FeedConfig, feed: TrackedRSSfeed) {
        const { itemLimit, source } = feedConfig;

        // create the folder for the feed items (if needed)
        const itemFolderPath = this.getItemFolderPath(source);
        let itemFolder = this.app.vault.getFolderByPath(itemFolderPath);
        if (!itemFolder) {
            itemFolder = await this.app.vault.createFolder(itemFolderPath);
        }

        const meta = this.app.metadataCache;
        // get all existing items from the items directory. Oldest items first.
        let items: TFile[] = itemFolder.children.filter((fof) => fof instanceof TFile)
            .map(f => f as TFile)
            .filter(f => {
                const fm = meta.getFileCache(f)?.frontmatter;
                return fm?.["id"] && fm?.["feed"]
            })
            .sort((a, b) => b.stat.mtime - a.stat.mtime);

        // find new items
        const knownIDs = new Set<string>(items.map(it => meta.getFileCache(it)?.frontmatter?.["id"])),
            newItems = feed.items.filter(it => !knownIDs.has(it.id));
        // determine how many items needs to be purged
        const deleteCount = Math.min(items.length + newItems.length - itemLimit, items.length);

        // remove feed obsolete items from disk
        for (let index = 0; index < deleteCount; index++) {
            const item = items[index];
            this.app.vault.delete(item);
        }

        // save items
        const n = Math.min(itemLimit, newItems.length)
        for (let index = 0; index < n; index++) {
            const item = newItems[index];
            await this.saveFeedItem(itemFolder, item).catch(reason => { throw reason });
        }
    }

    async createFeed(url: string, location: TFolder): Promise<TFile> {
        const feedXML = await request({
            url: url,
            method: "GET"
        }),
            feed = TrackedRSSfeed.assembleFromXml(feedXML);
        const { title, site, description } = feed,
            basename = this.formatFilename(title ?? "Anonymous Feed"),
            itemfolderPath = normalizePath(path.join(location.path, basename)),
            content = this.expandTemplate(this.plugin.settings.feedTemplate, {
                "{{feedUrl}}": url,
                "{{siteUrl}}": site ?? "",
                "{{title}}": title ?? "",
                "{{description}}": description ? this.formatHashTags(htmlToMarkdown(description)) : "",
                "{{folderPath}}": itemfolderPath
            });


        // create the feed configuration file
        const dashboard = await this.app.vault.create(normalizePath(path.join(location.path, `${basename}.md`)), content),
            cfg = FeedConfig.fromFile(this.app, dashboard);

        if (dashboard && cfg) {
            let status: string;
            try {
                await this.updateFeedItems(cfg, feed);
                status = "OK";
                this.app.fileManager.processFrontMatter(dashboard, frontmatter => {
                    frontmatter.status = status;
                    frontmatter.updated = new Date().toISOString();
                });
            } catch (err: any) {
                console.error(err);
                status = err.message;
            }
        }
        return dashboard;
    }

    async updateFeed(feedConfig: FeedConfig) {
        const feedXML = await request({
            url: feedConfig.feedUrl,
            method: "GET"
        });
        this.updateFeedItems(feedConfig, TrackedRSSfeed.assembleFromXml(feedXML));
    }

    async markFeedItemsRead(feed: TFile) {
        const itemFolder: TFolder | null = this.app.vault.getFolderByPath(this.getItemFolderPath(feed));
        if (itemFolder) {
            const meta = this.app.metadataCache;
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
                    const data = await this.app.vault.read(item),
                        s = first.position.start.offset,
                        e = first.position.end.offset,
                        newdata = data.substring(0, s) + "- [x]" + data.substring(s + 5);
                    this.app.vault.modify(item,newdata);
                    console.log(`Task at ${s} ... ${e}: >${data.substring(s, s + 4)}<`);
                }
            }
        }
    }
}