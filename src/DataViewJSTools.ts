import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';
import { TFile, Plugin } from 'obsidian';
import { TFrontmatter } from './RSSproxies';

//#region Type definitions
type TDashboardRole = "rsscollection" | "rsstopic" | "rssdashboard";
/**
 * A lambda function type to build a dataview table row for an RSS
 * feed related page.
 */
type TRowBuilder = (rec: TPageRecord) => object[];

/**
 * Sort order specification for page records.
 * @see {@link TPageRecord}
 */
type TSortOrder = "asc" | "desc";

type TRSSoptions = {};

/**
 * Table layouts specifying property names amd their table
 * column labels.
 *
 * @example
 * ~~~ts
 * {
 *    ID: "File",
 *    updates: "Updates",
 *    ...
 * }
 * ~~~
 */
type TTableLayout = { [key: string]: string };

/**
 * Options for displaying RSS related pages in a table.
 */
type TRSStableOptions = TRSSoptions & {

    /**
     * Table colums and headers.
     */
    layout: TTableLayout;

    /**
     * The type of RSS file this table is displaying.
     *
     * This refers to the value of the `type` frontmatter property
     * od an RSS relaed file.
     */
    type: string;

    /**
     * Name of the property to sort the table by.
     */
    sortBy: string;

    /**
     * Sort order
     */
    sortOrder: TSortOrder;

    /**
     * Optional file name to group the table by
     */
    groupBy?: string;

    /**
     * Optional grouo sort order.
     */
    groupBySortOrder?: TSortOrder;

    /**
     * Optional switch to show the `from query as table footer`
     */
    showQuery?: boolean;

}

type TRSSitemHeaderOptions = TRSSoptions & {
    showDuplicates: boolean,
    showTags: boolean
}

/** An annotated page object returned from Dataview */
type TRecord = TPropertyBag;

/**
 * Dataview record object describing an Obsidian page.
 *
 * Contains all frontmatter properties
 */
type TPageRecord = TRecord & {
    /**
     * Annotated File obect as documentes in
     * {@link https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-pages/}
     */
    file: TPropertyBag
};

/**
 * Dataview record object describing an Obsidian task.
 *
 * A full list of propertiws in described in {@link https://blacksmithgu.github.io/obsidian-dataview/annotation/metadata-tasks/}.
 */
type TTaskRecord = TRecord & {
    /**
     * Whether or not this specific task has been completed;
     */
    completed: boolean
};

type TRecords = {
    /**
     *  Map indexes to values.
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
     * Swizzled field.
     * @see {@link TPageRecord}
     */
    file: any

    length: number;
}
type TPageRecords = TRecords;
type TTaskRecords = TRecords;

/** Function type to filter a pagg list */
type TItemPredicate = (fileRecord: TPageRecord) => boolean;
//#endregion

/**
 * Utility class to map RSS feeds to RSS collections where they are a member of.
 */
export class FeedToCollectionMap extends Map<string, TPageRecord[]> {
    /**
     * Get all collections the given feed is a member of.
     * @returns a list of collections.
     */
    rssFeedToCollections(feed: TPageRecord): TPageRecord[] {
        // now lookup the collections
        return this.get(feed.file.path) ?? [];
    }

    private constructor() {
        super();
    }

    /**
     * Factory method to build a map of RSS feeds to RSS Collections
     * where they are a member of.
     * @param dvjs An instance of {@link DataViewJSTools}.
     * @returns the map of feeds to owning collections.
     */
    static async initialize(dvjs: DataViewJSTools): Promise<FeedToCollectionMap> {
        // create a map
        const map = new FeedToCollectionMap();

        /**
        const collections; //= await dvjs.rssDashboards("rsscollection");
        for (const collection of collections) {
            const feeds = await dvjs.dv.pages(dvjs.fromFeeds);
            for (const feed of feeds) {
                const key = feed.file.path;
                let clist = map.get(key);
                if (clist === undefined) {
                    this, map.set(key, [collection]);
                } else {
                    clist.push(collection);
                }
            }
        }
        */
        return map;
    }
}

/**
 * Utility class providing tools for dataviewjs queries in RSS related Markdown pages.
 */
export class DataViewJSTools {
    /**
     * The dataview object.
     */
    dv: TPropertyBag;
    /**
     * THe settings object describing the RSS related golder structure
     */
    private settings: RSSTrackerSettings;

    /**
     * Turn a tag or category into a hashtag.
     *
     * **Note**: The tag or category **must not contain whitespaces**-
     * @param tag - a Tag or category
     * @returns A hashtag with a `#` prefix.
     */
    static hashtag(tag: string): string {
        return tag.startsWith("#") ? tag : "#" + tag;
    }

    /**
     * Get the list of hashtags from a page (frontmatter nad content)
     * @param pageRecord The page record object.
     * @returns hashtag list
     */
    static hashtags(pageRecord: TPageRecord): string[] {
        return pageRecord.file.etags.map((t: string) => DataViewJSTools.hashtag(t))
    }

    constructor(dv: TPropertyBag, settings: RSSTrackerSettings) {
        this.dv = dv;
        this.settings = settings;
    }

    /**
     * Get a space separated list of hashtags from a page,
     *
     * This function is typically used in `TRowBuilder` functions.
     * @param pageRecord - Page object
     * @returns Space separated tagline.
     */
    hashtagLine(pageRecord: TPageRecord): string {
        return DataViewJSTools.hashtags(pageRecord).join(" ");
    }

    fileLink(fileRecord: TPageRecord): string {
        return this.dv.fileLink(fileRecord.file.path);
    }

    fileLinks(fileRecords: TPageRecord[]): string {
        return fileRecords
            .map((rec: TPageRecord) => this.fileLink(rec))
            .join(", ");
    }

    //#region Dataview queries
    /**
     * Generate a dataview FROM expressing to get pages matching a tag filter.
     *
     * The required frontmatter tag list properties:
     * - `tags`: pages with any of these tags are included
     * - `allof`: pages must have all of these tags to be included
     * - `noneof` - paged with any of these tags are excluded
     * @param page - A page defining 3 tag lists
     * @returns A FROM expression suitable for `dv.pages`.
     */
    fromTags(page: TPageRecord): string {
        const
            anyTags: string[] = page.file.etags?.map((t: string) => DataViewJSTools.hashtag(t)) ?? [],
            allTags: string[] = page?.allof?.map((t: string) => DataViewJSTools.hashtag(t)) ?? [],
            noneTags: string[] = page?.noneof?.map((t: string) => DataViewJSTools.hashtag(t)) ?? [];

        let from = [
            anyTags.length > 0 ? "( " + anyTags.join(" OR ") + " )" : null,
            allTags.length > 0 ? allTags.join(" AND ") : null,
            noneTags.length > 0 ? "-( " + noneTags.join(" OR ") + " )" : null
        ].filter(expr => expr);
        return from.length > 0 ? from.join(" AND ") : "#nil";
    }

    /**
     * Get a dataview query expression to get RSS items for a context.
     *
     * Inspects the context page to figure out which RSS items it refers to
     * and creates an expression suitable for `dv.pages(from)`.
     *
     * **Note**: The expression does not guarantee that all items returned
     * from `dv.pages(from)` have the correct type.
     *
     * @param context An optional RSS feed or RSS collection page. If omitted
     *                all RSS items are returned.
     * @returns A `FROM` expression suitable for `dv.pages(from)`.
     */
    async fromItemsOf(context?: TPageRecord): Promise<string> {
        let from: string;
        if (context) {
            switch (context.role) {
                case "rssfeed":
                    from = this.fromItemsOfFeed(context);
                    break;
                case "rsscollection":
                    from = await this.fromItemsOfCollection(context);
                    break;
                case "rsstopic":
                    from = this.fromItemsOfTopic(context);
                    break;
                default:
                    from = this.fromItems;
                    break;
            }
            if (!from) {
                from = '"undefined"';
            }
        } else {
            from = this.fromItems;
        }
        return from;
    }

    private get fromItems(): string {
        return `"${this.settings.rssFeedFolderPath}"`;
    }

    /**
     * Generate a dataview FROM expressing to get all items of an RSS feed.
     * @param feed Ths RSS feed to get the items from.
     * @returns A FROM expression suitable for `dv.pages`.
     */
    private fromItemsOfFeed(feed: TPageRecord): string {
        return '[[' + feed.file.path + ']]';
    }

    private fromItemsOfTopic(topic: TPageRecord): string {
        return this.fromItems + " AND " + this.fromTags(topic);
    }

    private async fromItemsOfCollection(collection: TPageRecord): Promise<string> {
        const
            feeds: TPageRecords = await this.dv.pages(this.fromFeedsOf(collection)),
            feedFolderPath = this.settings.rssFeedFolderPath;
        return feeds.file.map((f: TPropertyBag) => `"${feedFolderPath}/${f.name}"`).join(" OR ");
    }

    get fromFeeds(): string {
        const
            settings = this.settings,
            feedsFolder = settings.app.vault.getFolderByPath(settings.rssFeedFolderPath);
        if (feedsFolder) {
            const feeds = feedsFolder.children
                .filter(fof => {
                    if (fof instanceof TFile) {
                        const frontmatter = this.settings.app.metadataCache.getFileCache(fof)?.frontmatter;
                        return frontmatter?.role === "rssfeed";
                    }
                    return false;
                })
                .map(f => '"' + f.path + '"');
            return feeds.length > 1
                ? "(" + feeds.join(" OR ") + ")"
                : feeds.join(" OR ");
        } else {
            return '"' + this.settings.rssFeedFolderPath + '"';
        }
    }

    private fromFeedsOfCollection(collection: TPageRecord): string {
        return this.fromFeeds + " AND " + this.fromTags(collection);
    }

    private get fromFeedsFolder(): string { // deprecated: use fromItems or from feeds
        return '"' + this.settings.rssFeedFolderPath + '"';
    }

    //#endregion Dataview queries

    private itemReadingTask(item: TPageRecord): TTaskRecord | null {
        const tasks = item.file.tasks.where((t: TTaskRecord) => t.text.startsWith("[["));
        return tasks.length > 0 ? tasks[0] : null;
    }

    /**
     * Get a list of reading tasks for the given RSS items.
     * @param items list of RSS items to get the reading tasks for
     * @param read `false` to return unread items; `true` to return read items. If `undefined`
     *             all reading tasks are returned
     * @returns reading tasks matching the given reading status
     */
    rssReadingTasks(items: TPageRecords, read?: boolean): TTaskRecords {
        return items
            .map((item: TPageRecord) => this.itemReadingTask(item))
            .where((t: TTaskRecord | null) => t && (read === undefined || t.completed === read));
    }

    /**
     * Get duplicate items which link to the same article
     * @param item The RSS item to get publicates for
     * @returns List of duplicates, if any.
     */
    async rssDuplicateItems(item: TPageRecord): Promise<TPageRecords> {
        const
            link = item.link,
            path = item.file.path,
            pages = await this.dv.pages(this.fromItems);
        return pages.where((rec: TPageRecord) => rec.role === "rssitem" && rec.link === link && rec.file.path !== path);
    }

    /**
     * get a task list for items which refer to the same article.
     * @param item RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    async rssDuplicateItemsTasks(item: TPageRecord): Promise<TTaskRecords> {
        const duplicates = await this.rssDuplicateItems(item);
        return duplicates
            .map((rec: TPageRecord): TTaskRecord | null => {
                const
                    feed = rec.feed,
                    pinned = rec.pinned ? " 📍 " : " 📌 ",
                    task = this.itemReadingTask(rec);
                if (task) {
                    task.visual = this.fileLink(rec)
                        + pinned
                        + "**∈** "
                        + feed;
                } else {
                    return null;
                }
                return task;
            })
            .where((t: TTaskRecord) => t);
    }

    async mapFeedsToCollections(): Promise<FeedToCollectionMap> {
        return FeedToCollectionMap.initialize(this);
    }

    ///////

    /**
     * Create a dataview task list consisting of rss items already read or still to read.
     *
     * @param items - List of rss item page records
     * @param read - `true` to create a list or items read, `false` to create a list of items to read.
     * @param header - Optional header text for the list
     * @see this.rssItemPagesOfFeed
     * @see this.rssItemPages
     * @returns number of items in the list
     */
    readingList(items: TPageRecords, read: boolean, header?: string): number {
        const
            tasks = this.rssReadingTasks(items, read),
            taskCount = tasks.length;
        if (taskCount > 0) {
            if (header) {
                this.dv.header(2, header + " (" + taskCount + ")");
            }
            this.dv.taskList(tasks, false);
        }
        return taskCount;
    }

    async groupedReadingList(feeds: TPageRecords, read: boolean = false): Promise<number> {
        let totalTaskCount = 0;

        for (const feed of feeds) {
            const items = await this.dv.pages(await this.fromItemsOf(feed));
            totalTaskCount += this.readingList(items, read, this.fileLink(feed));
        }
        return totalTaskCount;
    }

    //////////////////////////////////////// Next GEN API

    private getFileRecordProperty(page: TPageRecord, name: string): any {
        switch (name) {
            case "ID":
                return page.file.link;
            case "tags":
                return this.hashtagLine(page);
        }
        return page[name] ?? page.file.name;
    }

    private getFileRecordProperties(page: TPageRecord, names: string[]): any[] {
        return names.map(name => this.getFileRecordProperty(page, name));
    }

    /**
     * Get Options for dataviewJS RSS tools from the plugin settings.
     *
     * @param key option key
     * @returns Options object for that key.
     */
    getOptions(key: string): TRSSitemHeaderOptions | TRSStableOptions | TRSSoptions {
        let options: TRSSitemHeaderOptions | TRSStableOptions | TRSSoptions;

        // TODO get from settings
        switch (key) {
            case "rss_item_header":
                options = {
                    showDuplicates: true,
                    showTags: true
                };
                break;
            case "rss_feed_items":
                return {
                    type: "rssitem",
                    layout: {
                        ID: "Item",
                        tags: "Tags",
                        published: "Published"
                    },
                    sortBy: "name",
                    sortOrder: "asc"
                };
            case "rss_context_items":
                return {
                    type: "rssitem",
                    layout: {
                        ID: "Item",
                        tags: "Tags",
                        feed: "Feed",
                        published: "Published",
                    },
                    sortBy: "name",
                    sortOrder: "asc"
                };
            case "rss_context_feeds":
                return {
                    type: "rssfeed",
                    layout: {
                        ID: "Item",
                        status: "Status",
                        updated: "Updated",
                        tags: "Tags"
                    },
                    sortBy: "updates",
                    sortOrder: "desc"
                };
            default:
                options = {};
                break;
        }
        return options;
    }

    async rssItemHeader(item: TPageRecord, options?: TRSSitemHeaderOptions) {
        const opts = options ?? this.getOptions("rss_item_header") as TRSSitemHeaderOptions;
        if (opts.showDuplicates) {
            const tasks = await this.rssDuplicateItemsTasks(item);
            if (tasks.length > 0) {
                this.dv.header(1, "⚠ Other RSS items are also referring to the same article");
                this.dv.taskList(tasks, false);
            }
        }
        if (opts.showTags) {
            const tags = this.hashtagLine(item);
            if (tags) {
                this.dv.span(tags);
            }
        }
    }

    /**
     * Displays a configurable table of RSS related pages of the same type.
     *
     * The pages are tyically obtained by a call to `dv.pages(frmm)`.
     *
     * @param pages the se
     * @param options table options {@link getOptions}
     * @example
     * A list all pinned rss items using the `rss_pinned_feed_item` configuration:
     *
     * ```js
     * ~~~dataviewjs
     * const
     *     dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
     *     pages = await dv.pages(dvjs.fromItemsOf(dv.current));
     * dvjs.rssPageTable(
     *     pages.where(it => it.pinned === true),
     *     dvjs.getOptions("rss_pinned_feed_items"));
     * ~~~
     * ```
     */
    async rssTable(pages: TPageRecords, options: TRSStableOptions): Promise<void> {
        if (pages.length === 0) {
            this.dv.paragraph("⛔");
            return;
        }

        const
            layout = options.layout,
            columns = Object.keys(options.layout),
            columnLabels = columns.map(name => layout[name]),
            sortedPages =  pages
                .where((p: TPageRecord) => p.role === options.type)
                .sort((p: TPageRecord) => this.getFileRecordProperty(p, options.sortBy), options.sortOrder);

        if (options.groupBy) {
            const
                groupBy = options.groupBy,
                groups = pages.groupBy((p:TPageRecord) => this.getFileRecordProperty(p,groupBy));

            groups.forEach( (group : TPropertyBag) => {
                this.dv.header(2, group.key + " (" + group.rows.length + ")");
                this.dv.table(
                    columnLabels,
                    group.rows.map((p: TPageRecord) => this.getFileRecordProperties(p, columns)));

            })
        }
        else {
            this.dv.table(
                columnLabels,
                sortedPages.map((p: TPageRecord) => this.getFileRecordProperties(p, columns)));
        }
    }
}