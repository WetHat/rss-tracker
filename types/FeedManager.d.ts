import { App, TFile } from 'obsidian';
import RSSTrackerPlugin from './main';
import { RSSfeedAdapter, RSScollectionAdapter } from './RSSAdapter';
/**
 * Manage RSS feeds in Obsidian.
 *
 * Currently available functionality:
 *
 * - Building a Markdown representation of RSS feeds including feed dashboards.
 *   {@link FeedManager.createFeedFromFile} and  {@link FeedManager.createFeedFromUrl}
 *
 * - Updating feeds (individual or all). {@link FeedManager.updateFeed} and {@link FeedManager.updateFeeds}
 *
 * - Setting all items on a feed as _read_. See {@link FeedManager.completeReadingTasks}
 */
export declare class FeedManager {
    private _app;
    private _plugin;
    private _html;
    private get _filemgr();
    constructor(app: App, plugin: RSSTrackerPlugin);
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
    createFeedFromFile(xml: TFile): Promise<RSSfeedAdapter>;
    /**
    * Create an RSS feed Markdown representation from a hyperlink.
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
    * @returns The feed adapter.
    */
    createFeedFromUrl(url: string): Promise<RSSfeedAdapter>;
    /**
     * Update an RSS feed according to the configured frequency.
     * @param feed - The adapter of the RSS feed to update.
     * @param force - `true` to update even if it is not due.
     * @returns the number of new items
     */
    private updateFeed;
    get feeds(): RSSfeedAdapter[];
    private updateFeeds;
    update(force: boolean, adapter?: RSSfeedAdapter | RSScollectionAdapter): Promise<void>;
    completeReadingTasks(adapter: RSSfeedAdapter | RSScollectionAdapter): Promise<void>;
    /**
     * A predicate to determine if a file has a link to a downloadable article.
     *
     * @param item - An Obsidian Markdown file.
     * @returns `true` if the file is a RSS item with a link to a downloadable article.
     */
    canDownloadArticle(item: TFile): boolean;
    downloadArticle(item: TFile): Promise<void>;
}
