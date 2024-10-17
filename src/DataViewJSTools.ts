import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';
import { TFile } from "obsidian";

//#region Type definitions
type TDashboardRole = "rsscollection" | "rsstopic" | "rssdashboard";
/**
 * A lambda function type to build a dataview table row for an RSS
 * feed related page.
 */
type TRowBuilder = (rec: TPageRecord) => object[];

type TSortOrder = "asc" | "desc";

type TRSSoptions = {};

type TTableLayout =  { [key: string]: string };

type TRSStableOptions = TRSSoptions & {
   layout: TTableLayout;
   sortBy: string;
   sortOrder: TSortOrder;
}

type TRSSitemHeaderOptions = TRSSoptions & {
    showDuplicates: boolean,
    showTags: boolean
}

/** Type describing an object returned from dataview */
type TRecord = {
    [key: string]: any;
}

type TPageRecord = TRecord & {
    file: TPropertyBag
};

type TTaskRecord = TRecord & {
    completed: boolean
};

type TRecordList = {
    /** Map indexes to values. */
    [index: number]: any;
    /** Automatic flattening of fields. Equivalent to implicitly calling `array.to("field")` */
    [field: string]: any;

    [Symbol.iterator](): Iterator<TPageRecord>;
    file: any
}
type TPageRecordList = TRecordList;
type TTaskRecordList = TRecordList;

/** Function type to filter a pagg list */
type TItemPredicate = (fileRecord: TPageRecord) => boolean;
//#endregion

/**
 * Utility class to map RSS feeds to RSS collections where they are a member of.
 */
export class FeedToCollectionMap {
    private map: Map<string, TPageRecord[]>;

    /**
     * Get all collections the given feed is a member of.
     * @returns a list of collections.
     */
    rssFeedToCollections(feed: TPageRecord): TPageRecord[] {
        // now lookup the collections
        return this.map.get(feed.file.path) ?? [];
    }

    private constructor(map: Map<string, TPageRecord[]>) {
        this.map = map;
    }

    /**
     *
     * @param dvjs Factory method to build a map of RSS feeds to RSS Collections
     * where they are a member of.
     * @returns a fully initialized instance of this class.
     */
    static async initialize(dvjs: DataViewJSTools): Promise<FeedToCollectionMap> {
        // create a map
        const map = new Map<string, TPageRecord[]>();

        const collections = await dvjs.rssDashboards("rsscollection");
        for (const collection of collections) {
            const feeds = await dvjs.rssFeeds(collection);
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
        return new FeedToCollectionMap(map);
    }
}

/**
 * Utility class providing methods to worg with rss related Markdown pages.
 */
export class DataViewJSTools {
    /**
     * The dataview object.
     */
    private dv: TPropertyBag;
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
     * Generate a dataview FROM expressing to get all items of an RSS feed.
     * @param feed Ths RSS feed to get the items from.
     * @returns A FROM expression suitable for `dv.pages`.
     */
    fromItemsOfFeed(feed: TPageRecord): string {
        return '[[' + feed.file.path + ']]';
    }

    async fromItemsOfCollection(collection: TPageRecord): Promise<string> {
        const
            feeds: TPageRecordList = await this.rssFeeds(collection),
            feedFolderPath = this.settings.rssFeedFolderPath;
        return feeds.file.map((f: TPropertyBag) => `"${feedFolderPath}/${f.name}"`).join(" OR ");
    }


    get fromFeedsFolderFiles(): string {
        const
            settings = this.settings,
            feedsFolder = settings.app.vault.getFolderByPath(settings.rssFeedFolderPath);
        if (feedsFolder) {
            return feedsFolder.children
                .filter(fof => fof instanceof TFile)
                .map(f => '"' + f.path + '"')
                .join(" OR ");
        } else {
            return '"' + this.settings.rssFeedFolderPath + '"';
        }
    }

    get fromFeedsFolder(): string {
        return '"' + this.settings.rssFeedFolderPath + '"';
    }
    //#endregion Dataview queries

    // obtaining lists of rss related markdown files
    /**
     * Get RSS feeds matching an optional selection criterion.
     * @param dashboard A dashboard file specifying 'tags', 'allof', and `noneof` tag list properties in its frontmatter.
     *                  If omitted all feeds are returnd.
     * @returns List of all RSS feeds matching the optional selector.
     */
    async rssFeeds(dashboard?: TPageRecord): Promise<TPageRecordList> {
        const
            from: string = dashboard ? ("(" + this.fromFeedsFolderFiles + ") AND " + this.fromTags(dashboard)) : this.fromFeedsFolderFiles,
            feeds = await this.dv.pages(from);
        return feeds
            .where((f: TPageRecord) => f.role === "rssfeed")
            .sort((rec: TPageRecord) => rec.file.name, "asc");
    }

    /**
     * Get RSS items matching an optional selection criterion.
     * @param page A page specifying 'tags', 'allof', and `noneof` tag list properties in its frontmatter.
     *                  If omitted all items across all feeds are returnd.
     * @returns List of all RSS items across all RSS feeds matching the optional dashboard selector.
     */
    async rssItems(page?: TPageRecord): Promise<TPageRecordList> {
        const
            from: string = this.fromFeedsFolder + (page ? (" AND " + this.fromTags(page)) : ""),
            pages = await this.dv.pages(from);
        return pages
            .where((rec: TPageRecord) => rec.role === "rssitem")
            .sort((rec: TPageRecord) => rec.published, "desc"); // newest first
    }

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
    rssReadingTasks(items: TPageRecordList, read?: boolean): TTaskRecordList {
        return items
            .map((item: TPageRecord) => this.itemReadingTask(item))
            .where((t: TTaskRecord | null) => t && (read === undefined || t.completed === read));
    }

    /**
     * Get duplicate items which link to the same article
     * @param item The RSS item to get publicates for
     * @returns List of duplicates, if any.
     */
    async rssDuplicateItems(item: TPageRecord): Promise<TPageRecordList> {
        const
            link = item.link,
            path = item.file.path,
            pages = await this.rssItems();
        return pages.where((rec: TPageRecord) => rec.link === link && rec.file.path !== path);
    }

    /**
     * get a task list for items which refer to the same article.
     * @param item RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    async rssDuplicateItemsTasks(item: TPageRecord): Promise<TTaskRecordList> {
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

    async rssDashboards(role: TDashboardRole): Promise<TPageRecordList> {
        let dashboardFolderPath = this.settings.rssHome;
        switch (role) {
            case "rsscollection":
                dashboardFolderPath = this.settings.rssCollectionsFolderPath;
                break;
            case "rsstopic":
                dashboardFolderPath = this.settings.rssTopicsFolderPath;
        }
        const
            from = '"' + dashboardFolderPath + '"',
            collections = await this.dv.pages(from);
        return collections
            .where((itm: TPageRecord) => itm.role === role)
            .sort((rec: TPageRecord) => rec.file.name, "asc");
    }

    async mapFeedsToCollections(): Promise<FeedToCollectionMap> {
        return FeedToCollectionMap.initialize(this);
    }

    async rssItemsOfFeed(feed: TPageRecord): Promise<TPageRecordList> {
        const pages = await this.dv.pages(this.fromItemsOfFeed(feed));
        return pages
            .where((rec: TPageRecord) => rec.role === "rssitem")
            .sort((rec: TPageRecord) => rec.published, "desc");
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
    readingList(items: TPageRecordList, read: boolean, header?: string): number {
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

    async groupedReadingList(feeds: TPageRecordList, read: boolean = false): Promise<number> {
        let totalTaskCount = 0;

        for (const feed of feeds) {
            const items = await this.rssItemsOfFeed(feed);
            totalTaskCount += this.readingList(items, read, this.fileLink(feed));
        }
        return totalTaskCount;
    }

    rssTable(pages: TPageRecordList, columnLabels: string[], rowBuilder: TRowBuilder, header?: string): number {
        const pageCount = pages.length;
        if (pageCount > 0) {
            if (header) {
                this.dv.header(2, header + " (" + pageCount + ")");
            }
            this.dv.table(
                columnLabels,
                pages.map((rec: TPageRecord) => rowBuilder(rec)));
        }

        return pageCount
    }

    async groupedRssItemTable(feeds: TPageRecordList, predicate: TItemPredicate, columnLabels: string[], rowBuilder: TRowBuilder): Promise<number> {
        let totalItemCount = 0;
        for (const feed of feeds) {
            const items = (await this.rssItemsOfFeed(feed)).where((item: TPageRecord) => predicate(item));
            totalItemCount += this.rssTable(items, columnLabels, rowBuilder, this.fileLink(feed));
        }
        return totalItemCount;
    }
    //////////////////////////////////////// Next GEN API

    private formatProperty(page: TPageRecord, name: string): any {
        switch(name) {
            case "ID":
                return page.file.link;
            case "tags":
                return this.hashtagLine(page);
        }
        return page[name] ?? page.file.name;
    }

    private formatProperties(page: TPageRecord, names: string[]): any[] {
        return names.map(name => this.formatProperty(page, name));
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
            case "rss_pinned_feed_items":
                return {
                    layout: {
                        ID: "Item",
                        tags: "Tags",
                        updated: "Updated"
                    },
                    sortBy: "name",
                    sortOrder: "asc"
                };
            case "rss_pinned_collection_items":
                return {
                    layout: {
                        ID: "Item",
                        tags: "Tags",
                        feed: "Feed",
                        updated: "Updated",
                    },
                    sortBy: "name",
                    sortOrder: "asc"
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

    async itemsOf(context?: TPageRecord): Promise<TPageRecordList> {
        let from: string = "";
        if (context) {
            switch (context.role) {
                case "rssfeed":
                    from = this.fromItemsOfFeed(context);
                    break;
                case "rsscollection":
                    from = await this.fromItemsOfCollection(context);
                    break;
            }
        }
        return this.dv.pages(from).where((p: TPageRecord) => p.role === "rssitem");
    }

    async rssPageTable(pages: TPageRecordList, options: TRSStableOptions) {
        const
            layout = options.layout,
            properties = Object.keys(options.layout),
            tableHeader = properties.map( name => layout[name]);

        return this.dv.table(
            tableHeader,
            pages
                .sort((p: TPageRecord)  => this.formatProperty(p,options.sortBy),options.sortOrder)
                .map((p: TPageRecord) => this.formatProperties(p, properties)));
    }
}