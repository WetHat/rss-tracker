import { App, request, TFile, TFolder, Notice, FrontMatterCache } from 'obsidian';
import RSSTrackerPlugin from './main';
import { TrackedRSSfeed } from './FeedAssembler';
import { RSSfileManager } from './RSSFileManager';
import { HTMLxlate } from './HTMLxlate';
import { RSSfeedAdapter, RSScollectionAdapter, RSSdashboardAdapter } from './RSSAdapter';


/**
 * Manage RSS feeds in Obsidian.
 *
 * Currently available functionality:
 *
 * - Building a Markdown representation of RSS feeds including feed dashboards.
 *   {@link createFeedFromFile} and  {@link createFeedFromUrl}
 *
 * - Updating feeds (individual or all). {@link FeedManager.updateFeed} and {@link FeedManager.updateFeeds}
 *
 * - Setting all items on a feed as _read_. See {@link FeedManager.completeReadingTasks}
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
     * @returns the feed adapter
     */
    async createFeedFromFile(xml: TFile): Promise<RSSfeedAdapter> {
        await this._plugin.tagmgr.updateTagMap();
        const
            feedXML = await this._app.vault.read(xml),
            settings = this._plugin.settings,
            feed = await RSSfeedAdapter.create(this._plugin, new TrackedRSSfeed(feedXML, "https://localhost/" + xml.path));
        // make sure the settings are properly persisted if taken from `Folder Notes`.
        await settings.commit();
        return feed;
    }

    /**
    * Create an RSS feed Markdown representation from a hyperlink.
    *
    * The Markdown representation consists of
    * - a feed dashboard
    * - a directory whic has the same name as the dashboard (without the .md extension)
    *   containing the RSS items of the feed,
    *
    * The file system layout of an Obsidian RSS feed looks like this (placement = "parentFolder"):
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
    * @returns The feed adapter.
    */
    async createFeedFromUrl(url: string): Promise<RSSfeedAdapter> {
        const feedXML = await request({
            url: url,
            method: "GET"
        });
        await this._plugin.tagmgr.updateTagMap();
        const
            settings = this._plugin.settings,
            feed = await RSSfeedAdapter.create(this._plugin, new TrackedRSSfeed(feedXML, url));
        // make sure settings are properly persisted if taken from `Folder Notes`
        await settings.commit();
        return feed;
    }

    /**
     * Update an RSS feed according to the configured frequency.
     * @param feed - The adapter of the RSS feed to update.
     * @param force - `true` to update even if it is not due.
     * @returns the number of new items
     */
    private async updateFeed(feed: RSSfeedAdapter, force: boolean): Promise<number> {
        if (feed.suspended) {
            return 0;
        }

        if (!force) {
            const
                now = new Date().valueOf(),
                lastUpdate = feed.updated,
                span = feed.interval * 60 * 60 * 1000; // millis
            if ((lastUpdate + span) > now) {
                return 0; // time has not come
            }
        }

        let itemCount = 0;
        try {
            const
                feedXML = await request({
                    url: feed.feedurl,
                    contentType: "text/xml",
                    method: "GET"
                }),
                rssfeed = new TrackedRSSfeed(feedXML, feed.feedurl);
            itemCount = await feed.update(rssfeed);
        } catch (err: any) {
            console.log(`feed '${feed.file.basename}' update failed: ${err.message}`);
            feed.error = err.message;
            await feed.commitFrontmatterChanges();
        }
        return itemCount;
    }

    get feeds(): RSSfeedAdapter[] {
        const
            placement = this._plugin.settings.rssDashboardPlacement,
            feedFolder = this._app.vault.getFolderByPath(this._plugin.settings.rssFeedFolderPath);
        if (feedFolder) {
            return feedFolder.children
                .filter(f => f instanceof TFolder)
                .map(f => RSSdashboardAdapter.createFromFolder(RSSfeedAdapter,this._plugin, f as TFolder, placement))
                .filter(p => p instanceof RSSfeedAdapter) as RSSfeedAdapter[];
        }
        return [];
    }

    private async updateFeeds(feeds: RSSfeedAdapter[], force: boolean): Promise<number> {
        let
            feedCount: number = 0,
            newItemCount = 0;
        const notice = new Notice(`0/${feeds.length} feeds updated`, 0);

        for (const feed of feeds) {
            try {
                newItemCount += await this.updateFeed(feed, force);
                feedCount++;
                notice.setMessage(`${feedCount}/${feeds.length} RSS feeds updated`);
            } catch (ex: any) {
                console.error(`Update failed: ${ex.message}`);
            }
        }
        notice.hide();
        console.log(`${feedCount}/${feeds.length} feeds updated.`)
        new Notice(`${feedCount}/${feeds.length} RSS feeds successfully updated`, 30000);
        return newItemCount;
    }

    async update(force: boolean, adapter?: RSSfeedAdapter | RSScollectionAdapter) : Promise<void> {
        await this._plugin.tagmgr.updateTagMap();
        if (adapter instanceof RSSfeedAdapter) {
            const itemCount = await this.updateFeed(adapter,force);
            new Notice(`Feed '${adapter.file.basename}' has '${itemCount}' new items`,20000);
        } else if (adapter instanceof RSScollectionAdapter) {
            const itemCount = await this.updateFeeds(adapter.feeds,force);
            new Notice(`Collection '${adapter.file.basename}' has '${itemCount}' new items`,20000);
        } else {
            const
                feeds = this.feeds,
                itemCount = await this.updateFeeds(feeds,force);
            new Notice(`'${itemCount}' new items in ${feeds.length} feeds.`,20000);
        }
    }

    async completeReadingTasks(adapter: RSScollectionAdapter | RSSfeedAdapter): Promise<void> {
        let completed = await adapter.completeReadingTasks;
        new Notice(`${completed} items taken off the '${adapter.file.basename}' reading list`, 30000);
    }

    /**
     * A predicate to determine if a file has a link to a downloadable article.
     *
     * @param item - An Obsidian Markdown file.
     * @returns `true` if the file is a RSS item with a link to a downloadable article.
     */
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