import { App, request, TFile, TFolder, normalizePath, ListItemCache, Notice, FrontMatterCache } from 'obsidian';
import RSSTrackerPlugin from './main';
import { TrackedRSSfeed, IRssMedium } from './FeedAssembler';
import * as path from 'path';
import { RSSfileManager } from './RSSFileManager';
import { HTMLxlate } from './HTMLxlate';
import { RSSfeedProxy } from './RSSproxies';


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
    private _app: App;
    private _plugin: RSSTrackerPlugin;
    private _html: HTMLxlate;

    private get _filemgr(): RSSfileManager {
        return this._plugin.filemgr;
    }

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this._app = app;
        this._plugin = plugin;
        this._html = HTMLxlate.instance;
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
     * @param xml - XML file containing an RSS feed.
     * @returns the feed proxy
     */
    async createFeedFromFile(xml: TFile): Promise<RSSfeedProxy> {
        const feedXML = await this._app.vault.read(xml);
        return RSSfeedProxy.create(this._plugin, new TrackedRSSfeed(feedXML, "https://localhost/" + xml.path));
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
    * @returns The feed proxy.
    */
    async createFeedFromUrl(url: string): Promise<RSSfeedProxy> {
        const feedXML = await request({
            url: url,
            method: "GET"
        });
        return RSSfeedProxy.create(this._plugin, new TrackedRSSfeed(feedXML, url));
    }

    /**
     * Update an RSS feed according to the configured frequency.
     * @param feed The proxy of the RSS feed to update.
     * @param force `true` to update even if it is not due.
     * @returns
     */
    async updateFeed(feed: RSSfeedProxy, force: boolean): Promise<RSSfeedProxy> {
        if (feed.suspended) {
            return feed;
        }

        if (!force) {
            const
                now = new Date().valueOf(),
                lastUpdate = feed.updated,
                span = feed.interval * 60 * 60 * 1000; // millis
            if ((lastUpdate + span) > now) {
                return feed; // time has not come
            }
        }
        try {
            const
                feedXML = await request({
                    url: feed.feedurl,
                    method: "GET"
                }),
                rssfeed = new TrackedRSSfeed(feedXML, feed.feedurl);
            // compute the new update interval in hours
            feed.interval = rssfeed.avgPostInterval;
            await feed.update(rssfeed);
        } catch (err: any) {
            feed.error = err.message;
        }
        await feed.commitFrontmatterChanges();

        console.log(`Feed ${feed.file.name} update status: ${status}`);
        return feed;
    }

    async markFeedItemsRead(feed: RSSfeedProxy) {
        for (const item of feed.items) {
            await item.completeReadingTask();
        }
    }

    getFeeds(): RSSfeedProxy[] {
        const feedFolder = this._app.vault.getFolderByPath(this._plugin.settings.rssFeedFolderPath);
        if (feedFolder) {
            return feedFolder.children
                .map(f => f instanceof TFile ? this._filemgr.getProxy(f) : null)
                .filter(p => p instanceof RSSfeedProxy) as RSSfeedProxy[];
        }
        return [];
    }

    async updateAllRSSfeeds(force: boolean) {
        await this._plugin.tagmgr.updateTagMap();
        const feeds = this.getFeeds();
        let n: number = 0;
        const notice = new Notice(`0/${feeds.length} feeds updated`, 0);

        for (const feed of feeds) {
            try {
                if ((await this.updateFeed(feed, force))) {
                    n++;
                    notice.setMessage(`${n}/${feeds.length} RSS feeds updated`);
                }
            } catch (ex: any) {
                console.error(`Feed update failed: ${ex.message}`);
            }
        }
        notice.hide();
        console.log(`Update of ${n}/${feeds.length} feeds complete.`)
        new Notice(`${n}/${feeds.length} RSS feeds successfully updated`, 30000);
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
                article: string | null = await this._html.articleAsMarkdown(itemHTML, link);
            if (article) {
                if (article.length > 0) {
                    this._plugin.tagmgr.registerFileForPostProcessing(item.path);
                    return this._app.vault.append(item, article);
                }
            }
        }
    }
}