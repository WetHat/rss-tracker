import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';
/**
 * A utility tpye to specify the intial state of an expandable table.
 *
 * Supported states:
 * - 'undefined' to render the table immediately using a generic dataview table;
 * - 'true' to render the table immediately and expand the table by default;
 * - 'false' to collapse the table by default and render the table on-demand.
 */
declare type TExpandState = boolean | undefined;
/** An annotated page object returned from Dataview */
declare type TRecord = TPropertyBag;
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
     * @see {@link TPageRecord}
     */
    file: any;
    length: number;
};
declare type TPageRecords = TRecords;
declare type TTaskRecords = TRecords;
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
     * @param topic The topic file containing the tag filter definition in its frontmatter.
     * @returns A FROM expression suitable for use with `dv.pages`.
     */
    private fromItemsOfTopic;
    private fromItemsOfCollection;
    /**
     * @retun A **FROM** expression to get all items from all feed folders.
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
     * @param path Obsidian path to a folder
     * @param type Type of the pages to get.
     * @returns The dataview array of files in a given folder with a given type.
     */
    private getPagesOfFolder;
    /**
     * Get a list of all RSS items of a feed.
     *
     * @param feed The RSS feed to get the items from.
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
     * @param items list of RSS items to get the reading tasks for
     * @param read `false` to return unread items; `true` to return read items. If `undefined`
     *             all reading tasks are returned
     * @returns reading tasks matching the given reading status
     */
    rssReadingTasks(items: TPageRecords, read?: boolean): TTaskRecords;
    /**
     * Get duplicate items which link to the same article
     * @param item The RSS item to get publicates for
     * @returns List of duplicates, if any.
     */
    rssDuplicateItems(item: TPageRecord): Promise<TPageRecords>;
    /**
     * get a task list for items which refer to the same article.
     * @param item RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    private rssDuplicateItemsTasks;
    rssItemHeader(item: TPageRecord): Promise<void>;
    /**
    * Event handler render a dataview table on demand.
    * @param {object} dv The dataview object
    * @param {HTMLDetailsElement} details the expandable block containing a dataview table.
    */
    private renderTable;
    /**
     * Create an expandable dataview table of pages.
     *
     * The table is rendered in a collapsible `<details>` block on-demand.
     *
     * @param header The table header.
     * @param rows The table rows.
     * @param [label="Files"] The expander label
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
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
     * @param collections List of RSS collection pages.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssCollectionTable(collections: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a table of RSS topics.
     *
     * @param topics List of RSS topic pages.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssTopicTable(topics: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a table of RSS feeds.
     *
     * @param feeds collecion of RSS feeds
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssFeedTable(feeds: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a dashboard table of RSS feeds .
     *
     * @param feeds List of RSS feeds
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssFeedDashboard(feeds: TPageRecords, expand?: TExpandState): Promise<void>;
    /**
     * Render a table of RSS items.
     *
     * @param items A collection of RSS items.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     * @param [label="Items"] The label for the expander control.
     */
    rssItemTable(items: TPageRecords, expand?: TExpandState, label?: string): Promise<void>;
    /**
     * Render a table of RSS items grouped by feed.
     *
     * **Note**The expander control is labeled with the feed name.
     *
     * @param items A collection of RSS items.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
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
     * @param details The `<details>` HTML block element containing a collapsible task list.
     */
    private renderTaskList;
    /**
     * Render a list of reading tasks on-demand in a collapsible block.
     *
     * @param tasks The list of reading tasks to render.
     * @param expand `undefined` render immediately using a generic dataview table;
     *               `true` render table immediately and expand the table by default;
     *               `false` to collapse the table by default and render the table on-demand.
     * @param [header="Items"] The header text for the expander control.
     */
    private rssTaskList;
    /**
     * Create a collapsible list of reading tasks with on-demand rendering.
     *
     * If the given feed has no reading tasks which have the state matching the
     * `read` parameter, no UI is generated.
     * @param items The RSS items to get the reading tasks from
     * @param read `false` to collect unchecked (unread) reading tasks; `true` otherwise.
     * @param expand `undefined` render immediately using a generic dataview table;
     *               `true` render table immediately and expand the table by default;
     *               `false` to collapse the table by default and render the table on-demand.
     * @param [header="Items"] Optional header text to display for the expander control.
     */
    rssReadingList(items: TPageRecords, read: boolean, expand: boolean, header?: string): Promise<void>;
    /**
     * Display collapsible reading tasks grouped by feed.
     *
     * @param feeds Collection of feeds
     * @param read `false` to collect and display unchecked (unread) reading tasks: `true` otherwise.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssReadingListByFeed(items: TPageRecords, read?: boolean, expand?: boolean): Promise<void>;
}
export {};
