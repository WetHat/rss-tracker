import { App } from 'obsidian';
import { EventRef } from 'obsidian';
import { FeedEntry } from '@extractus/feed-extractor';
import { MetadataCache } from 'obsidian';
import { Plugin as Plugin_2 } from 'obsidian';
import { PluginManifest } from 'obsidian';
import { ReaderOptions } from '@extractus/feed-extractor';
import { TFile } from 'obsidian';
import { TFolder } from 'obsidian';

/**
 * Decorator class to provide additional functionality related to RSS to dataviewjs queries.
 *
 * ```svgbob
 * ┌───────────────┐      ┌─────────────────┐
 * │ ~~~dataviewjs │      │                 │
 * │ dvjs....      │─────▶│ DataViewJSTools │
 * │ ~~~           │      │                 │
 * └───────────────┘      └─────────────────┘
 *         │                       │
 *         │                       │
 *         │                       ▼
 *         │               ┌───────────────┐
 *         │               │               │
 *         └──────────────▶│ Dataview API  │
 *                         │     (dv)      │
 *                         └───────────────┘
 * ```
 *
 * The arrows indicate the direction of interaction, showing that a `dataviewjs` interacts with the `dataview`
 * API through the {@link DataViewJSTools}.
 */
export declare class DataViewJSTools {
    private static toHashtag;
    private static getHashtagsAsString;
    /**
     * The dataview API object.
     */
    dv: TPropertyBag;
    /**
     * The settings object describing the RSS related folder structure and settings.
     */
    private settings;
    constructor(dv: TPropertyBag, settings: RSSTrackerSettings);
    /**
     * Generate a dataview FROM expression to get pages matching a tag filter.
     *
     * The required frontmatter properties to build the expression are:
     * - `tags`: pages with any of these tags are included
     * - `allof`: pages must have all of these tags to be included
     * - `noneof` - paged with any of these tags are excluded
     * @param page - A page defining 3 tag lists
     * @returns A FROM expression suitable for `dv.pages`.
     */
    fromTags(page: TPageRecord): string;
    /**
     * Generate a dataview FROM expressing to capture all Markdown file in the `Feeds` folder.
     */
    private get fromFeedsFolder();
    /**
     * Generate a dataview FROM expressing to get all items of an RSS topic.
     *
     * The **FROM** expression consists of two parts:
     * 1. Specification of the RSS `Feeds` folder to narrow down the search scope to RSS feed related files.
     * 2. The tag filter expression as defined by the frontmatter properties of the topic.
     *
     * **Note**: The **FROM** expression will capture Markdown files which are not of type `rssitem`,
     *
     * @param topic - The topic file containing the tag filter definition in its frontmatter.
     * @returns A FROM expression suitable for use with `dv.pages`.
     */
    private fromItemsOfTopic;
    private fromItemsOfCollection;
    /**
     * @returns A **FROM** expression to get all items from all feed folders.
     */
    private get fromFeeds();
    private fromFeedsOfCollection;
    /**
     * Get a list of all RSS items.
     *
     * @returns RSS item list
     */
    get rssItems(): TPageRecords;
    /**
     * Get all pages of a folder of a specific type.
     *
     * @param path - Obsidian path to a folder
     * @param type - Type of the pages to get.
     * @returns The dataview array of files in a given folder with a given type.
     */
    private getPagesOfFolder;
    /**
     * Get a list of all RSS items of a feed.
     *
     * @param feed - The RSS feed to get the items from.
     * @returns dataview array of RSS items.
     */
    rssItemsOfFeed(feed: TPageRecord): TPageRecords;
    /**
     * Get a list of all RSS feeds.
     *
     * @returns a dataview array of all RSS feeds.
     */
    get rssFeeds(): TPageRecords;
    rssFeedsOfCollection(collection: TPageRecord): TPageRecords;
    rssItemsOfCollection(collection: TPageRecord): TPageRecords;
    rssItemsOfTopic(topic: TPageRecord): TPageRecords;
    /**
     * @returns a dataview array of all RSS feed collections.
     */
    get rssCollections(): TPageRecords;
    /**
     * @returns a dataview array of all RSS topics.
     */
    get rssTopics(): TPageRecords;
    private itemReadingTask;
    /**
     * Get a list of reading tasks for the given RSS items.
     * @param items - list of RSS items to get the reading tasks for
     * @param read - `false` to return unread items; `true` to return read items. If `undefined`
     *             all reading tasks are returned
     * @returns reading tasks matching the given reading status
     */
    rssReadingTasks(items: TPageRecords, read?: boolean): TTaskRecords;
    /**
     * Get duplicate items which link to the same article
     * @param item - The RSS item to get publicates for
     * @returns List of duplicates, if any.
     */
    rssDuplicateItems(item: TPageRecord): Promise<TPageRecords>;
    /**
     * get a task list for items which refer to the same article.
     * @param item - RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    private rssDuplicateItemsTasks;
    rssItemHeader(item: TPageRecord): Promise<void>;
    /**
     * Event handler render a dataview table on demand.
     * @param details - the expandable block containing a dataview table.
     */
    private renderTable;
    /**
     * Create an expandable dataview table of pages.
     *
     * The table is rendered in a collapsible `<details>` block on-demand.
     *
     * @param header - The table header.
     * @param rows - The table rows.
     * @param label - The expander label
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    private expandableTable;
    /**
     * Headers for RSS related tables.
     */
    private static TABLE_HEADER;
    /**
     * Render a table of RSS collections.
     *
     * @param collections - List of RSS collection pages.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssCollectionTable(collections: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a table of RSS topics.
     *
     * @param topics - List of RSS topic pages.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssTopicTable(topics: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a table of RSS feeds.
     *
     * @param feeds - collecion of RSS feeds
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssFeedTable(feeds: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a dashboard table of RSS feeds .
     *
     * @param feeds - List of RSS feeds
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssFeedDashboard(feeds: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a table of RSS items.
     *
     * @param items - A collection of RSS items.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     * @param label - The label for the expander control.
     */
    rssItemTable(items: TPageRecords, expand?: TExpandState, label?: string): Promise<void>;
    /**
     * Render a table of RSS items grouped by feed.
     *
     * **Note**The expander control is labeled with the feed name.
     *
     * @param items - A collection of RSS items.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssItemTableByFeed(items: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * On-demand rendering of a task list on expansion of a 'details' element.
     *
     * Used by {@link rssTaskList} to render a task list on-demand,
     * the first time the `<details>` block is expanded.
     *
     * The `<details>` element is expected to be decorated with a `readingList` property which holds
     * a {@link TTaskRecords} object that provides the data for a dataview `taskList`.
     * The task list is rendered the first time the `<details>` block is expanded.
     *
     * @param details - The `<details>` HTML block element containing a collapsible task list.
     */
    private renderTaskList;
    /**
     * Render a list of reading tasks on-demand in a collapsible block.
     *
     * @param tasks - The list of reading tasks to render.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *               `true` render table immediately and expand the table by default;
     *               `false` to collapse the table by default and render the table on-demand.
     * @param header - The header text for the expander control.
     */
    private rssTaskList;
    /**
     * Create a collapsible list of reading tasks with on-demand rendering.
     *
     * If the given feed has no reading tasks which have the state matching the
     * `read` parameter, no UI is generated.
     * @param items - The RSS items to get the reading tasks from
     * @param read - `false` to collect unchecked (unread) reading tasks; `true` otherwise.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *               `true` render table immediately and expand the table by default;
     *               `false` to collapse the table by default and render the table on-demand.
     * @param header - Optional header text to display for the expander control.
     */
    rssReadingList(items: TPageRecords, read: boolean, expand: boolean, header?: string): Promise<void>;
    /**
     * Display collapsible reading tasks grouped by feed.
     *
     * @param feeds - Collection of feeds
     * @param read - `false` to collect and display unchecked (unread) reading tasks: `true` otherwise.
     * @param expand - `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssReadingListByFeed(items: TPageRecords, read?: boolean, expand?: boolean): Promise<void>;
}

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

/**
 * Specification of a parsed RSS item including canonical and
 * specifically tracked properties.
 */
declare interface IEntryDataExtended extends IEntryDataTracked, FeedEntry {
}

/**
 * Specification of the tracked properties of an RSS item.
 * Some properties overlap with the property specification in the
 * {@link FeedEntry}  interface. These will get special attention during
 * parsing.
 */
declare interface IEntryDataTracked {
    id: string;
    title?: string;
    description?: string;
    published?: string;
    category?: string[] | object[];
    creator?: string | string[] | object[];
    image?: IRssMedium;
    media: IRssMedium[];
    content?: string;
}

/**
 * Specification of a medium object reference within an RSS feed.
 */
declare interface IRssMedium {
    src: string;
    type: MediumType;
    width?: string;
    height?: string;
}

declare interface IRSSTrackerSettings {
    [key: string]: any;
    autoUpdateFeeds: boolean;
    rssHome: string;
    rssFeedFolderName: string;
    rssCollectionsFolderName: string;
    rssTopicsFolderName: string;
    rssTemplateFolder: string;
    rssDashboardName: string;
    rssTagmapName: string;
    rssDefaultImage: string;
    defaultItemLimit: number;
}

/**
 * Enumeration of recognized media types.
 */
declare enum MediumType {
    Unknown = "?",
    Image = "image",
    Video = "video",
    Audio = "audio"
}

declare type MetadataCacheEx = MetadataCache & {
    getTags(): TPropertyBag;
};

/**
 * THe base of all specialized adapter implementations for RSS related files in Obsidian.
 *
 * ```svgbob
 * ┌───────────────┐      ┌───────────────┐
 * │ RSSManager    │      │ Obsidian      │
 * └───────────────┘      └───────────────┘
 *         │                     │
 *         ▼                     ▼
 * ┌───────────────┐      ┌───────────────┐
 * │ RSSAdapter    │─────▶│ TFile         │
 * └───────────────┘      └───────────────┘
 * ```
 *
 * Support for transactional frontmatter property changes is available via
 * {@link commitFrontmatterChanges}.
 *
 * Derived classes implement specific get/set methods to access relevant frontmatter
 * properties.
 */
declare abstract class RSSAdapter {
    protected frontmatter: TFrontmatter;
    plugin: RSSTrackerPlugin;
    protected static toPlaintags(hashtags?: string[]): string[];
    /**
     * The Obsidian file an instance of a derived classes is an adapter to.
     */
    file: TFile;
    get tags(): string[];
    get filemgr(): RSSfileManager;
    protected constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter);
    /**
     * Commit all pending frontmatter changes.
     */
    commitFrontmatterChanges(): Promise<void>;
}

declare class RSScollectionAdapter extends RSSAdapter {
    static create(plugin: RSSTrackerPlugin): Promise<RSScollectionAdapter>;
    constructor(plugin: RSSTrackerPlugin, collection: TFile, frontmatter?: TFrontmatter);
    get feeds(): RSSfeedAdapter[];
    completeReadingTasks(): Promise<number>;
}

declare class RSSfeedAdapter extends RSSAdapter {
    static readonly SUSPENDED_STATUS_ICON = "\u23F9\uFE0F";
    static readonly RESUMED_STATUS_ICON = "\u25B6\uFE0F";
    static readonly ERROR_STATUS_ICON = "\u274C";
    static readonly OK_STATUS_ICON = "\u2705";
    private _folder?;
    static create(plugin: RSSTrackerPlugin, feed: TrackedRSSfeed): Promise<RSSfeedAdapter>;
    constructor(plugin: RSSTrackerPlugin, feed: TFile, frontmatter?: TFrontmatter);
    /**
     * Get the feed status.
     *
     * @returns a string containing one of:
     * - ✅ if the feed was updated without issues
     * - ⏹️ if the feed is suspended
     * - ▶️ if updates are resumed but have not happened yet
     * - ❌ if feed update failed with an error
     * - `?` if the status is unknown
     */
    get status(): string;
    private set status(value);
    /**
     * Get the feed update interval.
     * @returns the feed update interval in hours.
     */
    get interval(): number;
    /**
     * Set the feed update interval
     * @param value - the update interval in hours,
     */
    set interval(value: number);
    /**
     * The timestamp when the feed was last updated.
     * @returns the time in milliseconds since Jan 1st 1970.
     */
    get updated(): number;
    set updated(value: number);
    /**
     * Get the link to the rss feed
     * @returns hyperlink to the RSS feed.
     */
    get feedurl(): string;
    get itemlimit(): number;
    set itemlimit(value: number);
    /**
     * Get the fedd suspension state.
     * @returns `true` if feed updates are suspended, `false` otherwise.
     */
    get suspended(): boolean;
    set suspended(value: boolean);
    set error(message: string);
    private get itemFolderPath();
    itemFolder(): Promise<TFolder>;
    /**
     * Get all items in this RSS feed currently in Obsidian.
     * @returns proxies for all RSS items in an RSS feed.
     */
    get items(): RSSitemAdapter[];
    rename(newBasename: string): Promise<boolean>;
    /**
     * Update the RSS feed.
     *
     * @param feed - the adapter of the feed to update.
     * @returns the number of new items
     */
    update(feed: TrackedRSSfeed): Promise<number>;
    completeReadingTasks(): Promise<number>;
}

/**
 * A utility class to manage RSS related files.
 */
declare class RSSfileManager {
    /**
     * Regular expression to split a template string into and array
     * where all mustache tokens of the form `{{mustache}}` have their
     * own slot.
     */
    private static readonly TOKEN_SPLITTER;
    private _app;
    private _vault;
    private _plugin;
    get settings(): RSSTrackerSettings;
    get app(): App;
    get metadataCache(): MetadataCacheEx;
    constructor(app: App, plugin: RSSTrackerPlugin);
    /**
     * Factory method to create proxies for RSS files
     * @param file - An RSS file to create the adapter for.
     * @returns The appropriate adapter, if it exists.
     */
    getAdapter(file: TFile): RSSfeedAdapter | RSSitemAdapter | RSScollectionAdapter | undefined;
    /**
     * Expand `{{mustache}}` placeholders with data from a property bag.
     * @param template - A template string with `{{mustache}}` placeholders.
     * @param properties - A property bag for replacing `{{mustache}}` placeholdes with data.
     * @returns template with `{{mustache}}` placeholders substituted.
     */
    private expandTemplate;
    /**
     * Read the content of a template from the RSS template folder.
     *
     * If the template does not esist, it is installed,
     *
     * @param templateName - Name of the template to read
     * @returns Template contents
     */
    private readTemplate;
    /**
     * Rename a folder
     * @param oldFolderPath - path to an existing folder
     * @param newFolderPath - new folder path.
     * @returns `true` if renaming was successful; `false` otherwise.
     */
    renameFolder(oldFolderPath: string, newFolderPath: string): Promise<boolean>;
    /**
     * Rename/move a file.
     * @param oldFilePath - Path to file to rename
     * @param newFilePath - new path and name of the file
     * @returns `true` if file was successfully renamed/moved; `false otherwise`
     */
    renameFile(oldFilePath: string, newFilePath: string): Promise<boolean>;
    ensureFolderExists(path: string): Promise<TFolder> | TFolder;
    /**
     * Create a file from an RSS template.
     *
     * If a file with the same basename already exists in the given folder location, a new unique basename
     * is generated.
     *
     * ❗The mustache token `{{fileName}}` is automatically added to the data object. This token maps to the unique
     * basename of the generated file (no file extension) and can be used to create wiki-links.
     *
     * @param folderPath - THe location of the new file
     * @param basename - The basename of the new file (without fie extension)
     * @param templateName - The template to use
     * @param data - Optional data map for replacing the mustache tokens in the template with custom data.
     * @param postProcess - Flag indicating if this file requires post processing
     * @returns The new file created
     */
    createFile(folderPath: string, basename: string, templateName: TTemplateName, data?: TPropertyBag, postProcess?: boolean): Promise<TFile>;
}

/**
 * The adapter to an RSS item.
 */
declare class RSSitemAdapter extends RSSAdapter {
    static readonly EMBEDDING_MATCHER: RegExp;
    /**
     * **Note**. This property can only be changed by the user.
     * @returns `true` if the item is pinned and will not be deleted; `false` otherwise.
     */
    get pinned(): boolean;
    set feed(value: string);
    /**
     * Get the date the article described by this item was published.
     * @returns the date published in millisecondes since Jan 1st, 1970,
     */
    get published(): number;
    /**
     * The article link.
     *
     * @returns the hyperlink to the original article.
     */
    get link(): string;
    /**
     * THe unique id of this item
     * @returns A unique item identifier,
     */
    get id(): string;
    set tags(value: string[]);
    completeReadingTask(): Promise<boolean>;
    /**
     * Factory methos to create a new instance of an RSS item
     * @param item - the parse item of an RSS feed.
     * @param feed - The feed this item is a part of
     * @returns A new instance of a RSS item file adapter.
     */
    static create(item: TrackedRSSitem, feed: RSSfeedAdapter): Promise<RSSitemAdapter>;
    constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter: TFrontmatter);
    remove(): Promise<void>;
}

/**
 * Utility class to orchestrate the mapping of rss tags to tags into the domain
 * of the local knowledge graph.
 */
declare class RSSTagManager {
    private _app;
    private _vault;
    private _plugin;
    private _metadataCache;
    private _tagmapMutex;
    /**
     * A snapshot of the tags cached by Obsidian.
     * Used by {@link mapHashtag} to hoist tags from RSS items directly
     * into the domain of the users's knowledge graph.
     */
    private _knownTagsCache;
    private _postProcessingRegistry;
    private _tagmap;
    private _pendingMappings;
    constructor(app: App, plugin: RSSTrackerPlugin);
    /**
     * Register a file for post processing hashtags in the note body.
     *
     * Post processing is performed by the event handler returnd from
     * {@link rssTagPostProcessor}.
     *
     * @param path - Vault relative path to file
     * @returns the registered path
     */
    registerFileForPostProcessing(path: string): string;
    /**
     * Get or create the tag map file handle.
     * @returns a valid file handle to the tag map file located at {@link RSSTrackerSettings.rssTagmapPath}.
     */
    private getTagmapFile;
    /**
     * Update the in-memory tag map.
     *
     * The map is updated from:
     * - The persisted mapping table at {@link RSSTrackerSettings.rssTagmapPath}
     * - Hashtags in the rss domain from the Obsidian metadata cache.
     *
     * All unused mappings are removed
     */
    updateTagMap(): Promise<void>;
    /**
     * Commit any pending changes to the tag map file.
     */
    private commit;
    /**
     * Map a tag found in an rss item into the domain of the local knowledge graph.
     *
     * Following rules are applied:
     * - if the tag has already been cached by Obsidian, the hashtag is passed through unchanged
     * - if the tag is new, it is put into the rss domain and a default mapping is aaded to the tag map
     *   file located at {@link RSSTrackerSettings.rssTagmapPath}.
     * - if there is a mapping defined in the map file {@link RSSTrackerSettings.rssTagmapPath},
     *   the tag is mapped and changed in the text.
     *
     * @param rssHashtag - A hashtag found in RSS item contents.
     * @returns mapped tag
     */
    mapHashtag(rssHashtag: string): string;
    /**
     * Load the mapping data into memory.
     *
     * Mappings are read from:
     * - the tag map file located at: {@link RSSTrackerSettings.rssTagmapPath}
     * - the tags cached by Obsidian.
     *
     */
    private loadTagmap;
    /**
     * Get the event handler to post-process RSS items.
     *
     * In order fo a RSS item file to be postprocessed it has to be registered with
     * {@link registerFileForPostProcessing} first.
     *
     * @returns Event handler reference object
     */
    get rssTagPostProcessor(): EventRef;
}

declare class RSSTrackerPlugin extends Plugin_2 {
    private _settings;
    private _feedmgr;
    private _filemgr;
    private _tagmgr;
    get settings(): RSSTrackerSettings;
    get feedmgr(): FeedManager;
    get filemgr(): RSSfileManager;
    get tagmgr(): RSSTagManager;
    constructor(app: App, manifest: PluginManifest);
    getDVJSTools(dv: TPropertyBag): DataViewJSTools;
    /**
     * Refresh the dataview blocks on the currently active Obsidian note.
     *
     * Calls the _Dataview: Rebuild current view_ command via an undocumented API call.
     * Found at: https://forum.obsidian.md/t/triggering-an-obsidian-command-from-within-an-event-callback/37158
     */
    refreshActiveFile(): void;
    onload(): Promise<void>;
    onunload(): void;
}
export default RSSTrackerPlugin;

export declare class RSSTrackerSettings implements IRSSTrackerSettings {
    private static RSS_DEFAULT_IMAGE;
    plugin: RSSTrackerPlugin;
    app: App;
    private get _filemgr();
    static getTemplateFilename(templateName: TTemplateName): string;
    /**
     * The persisted settings settings
     */
    private _data;
    get autoUpdateFeeds(): boolean;
    set autoUpdateFeeds(value: boolean);
    private _rssHome?;
    private _rssFeedFolder?;
    private _rssCollectionsFolder?;
    private _rssTopicsFolder?;
    private _rssTemplateFolder?;
    private _rssDashboardName?;
    private _rssTagmapName?;
    private _defaultItemLimit?;
    get rssHome(): string;
    set rssHome(value: string);
    get rssFeedFolderName(): string;
    set rssFeedFolderName(value: string);
    get rssCollectionsFolderName(): string;
    set rssCollectionsFolderName(value: string);
    get rssTopicsFolderName(): string;
    set rssTopicsFolderName(value: string);
    get rssTemplateFolder(): string;
    set rssTemplateFolder(value: string);
    get rssDashboardName(): string;
    set rssDashboardName(value: string);
    get rssTagmapName(): string;
    set rssTagmapName(value: string);
    get defaultItemLimit(): number;
    set defaultItemLimit(value: number);
    /**
     * Get the path to the RSS default image
     */
    get rssDefaultImage(): string;
    getRssDefaultImagePath(): Promise<string>;
    commit(): Promise<void>;
    constructor(app: App, plugin: RSSTrackerPlugin);
    loadData(): Promise<void>;
    saveData(): Promise<void>;
    install(): Promise<void>;
    get rssFeedFolderPath(): string;
    get rssCollectionsFolderPath(): string;
    get rssTopicsFolderPath(): string;
    get rssTemplateFolderPath(): string;
    get rssDashboardPath(): string;
    get rssTagmapPath(): string;
    getTemplatePath(templateName: TTemplateName): string;
}

/**
 * A utility tpye to specify the intial state of an expandable table.
 *
 * Supported states:
 * - 'undefined' to render the table immediately using a generic dataview table;
 * - 'true' to render the table immediately and expand the table by default;
 * - 'false' to collapse the table by default and render the table on-demand.
 */
declare type TExpandState = boolean | undefined;

declare type TFrontmatter = TPropertyBag;

/**
 * Dataview record object describing an Obsidian page.
 *
 * Contains all frontmatter properties
 */
declare type TPageRecord = TRecord & {
    /**
     * Annotated File obect as documentes in
     * {@link https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/}
     */
    file: TPropertyBag;
};

declare type TPageRecords = TRecords;

/**
 * Type for property bag objects (key -\> value) with unknown content.
 */
declare type TPropertyBag = {
    [key: string]: any;
};

/**
 * Representation of an RSS feed with a canonical set of properties
 * collected from available sources.
 */
declare class TrackedRSSfeed {
    title?: string;
    description?: string;
    site?: string;
    image?: IRssMedium;
    items: TrackedRSSitem[];
    source: string;
    /**
     * Assemble an RSS feed from its XML representation.
     * Collect a all necessary data that are available data nad backfill
     * canonical properties.
     *
     * @param xml - XML representation of an RSS feed.
     * @param source - The location where the xml data came from. Usually a url or file path.
     * @param options - Optional Parsing options.
     * @returns Feed object {@link TrackedRSSfeed} containing all relevant properties that
     *          were available in the feed.
     */
    constructor(xml: string, source: string, options?: ReaderOptions);
    /**
     * Get the a filename for this RSS feed.
     * @returns A valid filename.
     */
    get fileName(): string;
    /**
     * @returns the avarage time interval between posts of the feed in hours.
     */
    get avgPostInterval(): number;
}

/**
 * A tracked RSS feed item with a canonical set of properties
 * collected from available sources.
 */
declare class TrackedRSSitem {
    id: string;
    tags: string[];
    description?: string;
    title: string;
    link?: string;
    published: string;
    author?: string;
    image?: IRssMedium;
    media: IRssMedium[];
    content?: string;
    /**
     * Build a RSS item representation object.
     * @param entry - The parsed RSS item data.
     */
    constructor(entry: IEntryDataExtended);
    /**
     * Get a filename which is derived from the item*s title and is suitable for
     * writing this item to disk.
     * @returns Filename for this item
     */
    get fileName(): string;
}

/** An annotated page object returned from Dataview */
declare type TRecord = TPropertyBag;

/**
 * A collection of records returned from Dataview.
 */
declare type TRecords = {
    /**
     *  Map indexes to dataview object properties.
     */
    [index: number]: any;
    /**
     * Swizzling of fields. Equivalent to implicitly calling `array.to("field")`
     */
    [field: string]: any;
    /**
     * Record list iterator
     */
    [Symbol.iterator](): Iterator<TPageRecord>;
    /**
     * A Swizzled field.
     * {@link TPageRecord}
     */
    file: any;
    length: number;
};

declare type TTaskRecords = TRecords;

/**
 * The basenames of templates used for RSS content.
 */
declare type TTemplateName = "RSS Feed" | "RSS Item" | "RSS Topic" | "RSS Collection" | "RSS Dashboard" | "RSS Tagmap";

export { }
