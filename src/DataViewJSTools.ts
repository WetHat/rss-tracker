import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';

/**
 * A lambda function type to build a dataview table row for an RSS
 * feed related page.
 */
type TRowBuilder = (rec: TPageRecord) => object[];

/** Type describing a page object returned from dataviewl */
type TPageRecord = {
    [key: string]: any;
    file: any
}

type TPageRecordList = {
    /** Map indexes to values. */
    [index: number]: any;
    /** Automatic flattening of fields. Equivalent to implicitly calling `array.to("field")` */
    [field: string]: any;

    [Symbol.iterator](): Iterator<TPageRecord>;
    file: any
}

/** A lambda function type to filter a pagge list */
type TItemPredicate = (fileRecord: TPageRecord) => boolean;

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

        const collections = await dvjs.rssCollections();
        for (const collection of collections) {
            const feeds = await dvjs.rssFeedsOfCollection(collection);
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
     * Get the list of hashtags from a page
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

    rssItemPublishDate(fileRecord: TPageRecord): object {
        return this.dv.date(fileRecord.published)
    }
    rssFeedUpdateDate(fileRecord: TPageRecord): object {
        return this.dv.date(fileRecord.updated)
    }

    ////////////////////////

    /**
     * Generate a dataview FROM expressing using 3 tag lists defined in the frontmatter of a page.
     *
     * The required frontmatter tag list property names are:
     * - `tags`: pages with any of these tags are included
     * - `allof`: pages must have all of these tags to be included
     * - `noneof` - paged with any of these tags are excluded
     * @param pageRecord - A page defining 3 tag lists
     * @returns A FROM expression suitable for `dv.pages`.
     */
    fromTags(pageRecord: TPageRecord): string {
        const
            anyTags: string[] = pageRecord.file.etags?.map((t: string) => DataViewJSTools.hashtag(t)) ?? [],
            allTags: string[] = pageRecord?.allof?.map((t: string) => DataViewJSTools.hashtag(t)) ?? [],
            noneTags: string[] = pageRecord?.noneof?.map((t: string) => DataViewJSTools.hashtag(t)) ?? [];

        let from = [
            '"' + this.settings.rssFeedFolderPath + '"',
            anyTags.length > 0 ? "( " + anyTags.join(" OR ") + " )" : null,
            allTags.length > 0 ? allTags.join(" AND ") : null,
            noneTags.length > 0 ? "-( " + noneTags.join(" OR ") + " )" : null
        ].filter(expr => expr);
        return from.join(" AND ");
    }

    fromItemsOfFeed(feed: TPageRecord): string {
        return "[[" + feed.file.path + "]]";
    }

    fromFeedsFolder(): string {
        return '"' + this.settings.rssFeedFolderPath + '"';
    }

    // obtaining lists of rss related markdown files

    async rssFeeds(): Promise<TPageRecordList> {
        const feeds = await this.dv.pages(this.fromFeedsFolder());
        return feeds
            .where((f: TPageRecord) => f.role === "rssfeed")
            .sort((rec: TPageRecord) => rec.file.name, "asc");
    }

    async rssFeedsOfCollection(collection: TPageRecord): Promise<TPageRecordList> {
        const pages = await this.dv.pages(this.fromTags(collection));
        return pages
            .where((rec: TPageRecord) => rec.role === "rssfeed")
            .sort((rec: TPageRecord) => rec.file.name, "asc");
    }

    async rssCollections(): Promise<TPageRecordList> {
        const
            from = '"' + this.settings.rssHome + '" AND -"' + this.settings.rssFeedFolderPath + '" AND -"' + this.settings.rssTemplateFolderPath + '"',
            collections = await this.dv.pages(from);
        return collections
            .where((itm: TPageRecord) => itm.role === "rsscollection")
            .sort((rec: TPageRecord) => rec.file.name, "asc");
    }

    async mapFeedsToCollections() : Promise<FeedToCollectionMap> {
        return FeedToCollectionMap.initialize(this);
    }

    async rssItemsOfFeed(feed: TPageRecord): Promise<TPageRecordList> {
        const pages = await this.dv.pages(this.fromItemsOfFeed(feed));
        return pages
            .where((rec: TPageRecord) => rec.role === "rssitem")
            .distinct((rec: TPageRecord) => rec.link)
            .sort((rec: TPageRecord) => rec.file.name, "asc");
    }

    async rssItems(): Promise<TPageRecordList> {
        const pages = await this.dv.pages(this.fromFeedsFolder());
        return pages
            .where((rec: TPageRecord) => rec.role === "rssitem")
            .distinct((rec: TPageRecord) => rec.link)
            .sort((rec: TPageRecord) => rec.file.name, "asc");
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
            tasks = items.file.tasks.where((t: TPropertyBag) => t.completed === read),
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
            totalTaskCount += await this.readingList(items, read, this.fileLink(feed));
        }
        return totalTaskCount;
    }

    rssItemTable(items: TPageRecordList, columnLabels: string[], rowBuilder: TRowBuilder, header?: string): number {
        const itemCount = items.length;
        if (itemCount > 0) {
            if (header) {
                this.dv.header(2, header + " (" + itemCount + ")");
            }
            this.dv.table(
                columnLabels,
                items.map((itemRec: TPageRecord) => rowBuilder(itemRec)));
        }

        return itemCount
    }

    async groupedRssItemTable(feeds: TPageRecordList, predicate: TItemPredicate, columnLabels: string[], rowBuilder: TRowBuilder): Promise<number> {
        let totalItemCount = 0;
        for (const feed of feeds) {
            const items = (await this.rssItemsOfFeed(feed)).where((item: TPageRecord) => predicate(item));
            totalItemCount += this.rssItemTable(items, columnLabels, rowBuilder, this.fileLink(feed));
        }
        return totalItemCount;
    }

    rssFeedTable(feeds: TPageRecordList, columnLabels: string[], rowBuilder: TRowBuilder): number {
        const feedCount = feeds.length;

        if (feedCount > 0) {
            this.dv.table(columnLabels, feeds.map((f: TPageRecord) => rowBuilder(f)));
        }

        return feedCount;
    }
}