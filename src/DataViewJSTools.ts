import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';
import { TFile, ObsidianProtocolData } from 'obsidian';
import * as path from 'path';

/**
 * Sort order specification for page records.
 * @see {@link TPageRecord}
 */
type TSortOrder = "asc" | "desc";

type TRSSoptions = TPropertyBag;

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

//#endregion

/**
 * Proxy handler to flatten nested properties of a Dataview page object.
 */
class PageProxyHandler implements ProxyHandler<TPageRecord> {

    /**
     * Convert a tag to a hashtag.
     *
     * @param tag a tag
     * @return a hashtag
     */
    static toHashtag(tag: string): string {
        return tag.startsWith("#") ? tag : "#" + tag;
    }

    /**
     * A map of feeds to the collections the feeds are in.
     *
     * **Note**: Needs to be initialized with {@link initializeCollectionMap} before
     * the `collections` property can be accessed.
     */
    private feedsToCollections?: Map<string, TPageRecord[]>;

    get(target: TPageRecord, p: string | symbol): any {
        const name = p.toString();
        switch (name) {
            case "ID":
                return target.file.link;
            case "tags":
                return target.file.etags.map((t: string) => PageProxyHandler.toHashtag(t));
            case "allof":
                const allof = target.allof;
                return Array.isArray(allof)
                    ? allof.map(t => PageProxyHandler.toHashtag(t))
                    : (allof ? [PageProxyHandler.toHashtag(allof)] : []);
            case "noneof":
                const noneof = target.noneof;
                return Array.isArray(noneof)
                    ? noneof.map(t => PageProxyHandler.toHashtag(t))
                    : (noneof ? [PageProxyHandler.toHashtag(noneof)] : []);
            case "collections":
                return this.feedsToCollections?.get(target.file.path)?.map((f: TPageRecord) => f.file.link)
        }
        return target[name] ?? target.file[name];
    }

    async initializeCollectionMap(dvjs: DataViewJSTools) {
        if (!this.feedsToCollections) {
            this.feedsToCollections = new Map<string, TPageRecord[]>();
            const
                dv = dvjs.dv,
                collections = await dvjs.rssCollections();
            for (const collection of collections) {
                const feeds: TPageRecords = await dvjs.rssFeedsOfContext(collection);
                for (const feed of feeds) {
                    let cList = this.feedsToCollections.get(feed.file.path);
                    if (!cList) {
                        cList = [];
                        this.feedsToCollections.set(feed.file.path, cList);
                    }
                    cList.push(collection);
                }
            }
        }
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
     * Handler for the `Proxy<TPageRecord>` proxy.
     */

    private proxyHandler = new PageProxyHandler();

    constructor(dv: TPropertyBag, settings: RSSTrackerSettings) {
        this.dv = dv;
        this.settings = settings;
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
            proxy = new Proxy<TPageRecord>(page, this.proxyHandler),
            anyTags: string[] = proxy.tags,
            allTags: string[] = proxy.allof,
            noneTags: string[] = proxy.noneof;

        let from = [
            anyTags.length > 0 ? "( " + anyTags.join(" OR ") + " )" : null,
            allTags.length > 0 ? allTags.join(" AND ") : null,
            noneTags.length > 0 ? "-( " + noneTags.join(" OR ") + " )" : null
        ].filter(expr => expr);
        return from.length > 0 ? from.join(" AND ") : "#nil";
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
            feeds: TPageRecords = await this.rssFeedsOfContext(collection),
            feedFolderPath = this.settings.rssFeedFolderPath;
        return feeds.file.map((f: TPropertyBag) => `"${feedFolderPath}/${f.name}"`).join(" OR ");
    }

    get fromFeeds(): string {
        const
            settings = this.settings,
            feedsFolder = settings.app.vault.getFolderByPath(settings.rssFeedFolderPath);
        if (feedsFolder) {
            const feeds = this.rssFeeds().map((f: TPageRecord) => '"' + f.file.path + '"');
            return feeds.length > 1
                ? "(" + feeds.join(" OR ") + ")"
                : feeds.join(" OR ");
        }
        return '"undefined"';
    }

    private fromFeedsOfCollection(collection: TPageRecord): string {
        return this.fromFeeds + " AND " + this.fromTags(collection);
    }

    get fromCollections(): string {
        return `"${this.settings.rssCollectionsFolderPath}"`;
    }

    get fromTopics(): string {
        return `"${this.settings.rssTopicsFolderPath}"`;
    }
    //#endregion Dataview queries

    //#region Item lists
    /**
     * Get a list of all RSS items.
     *
     * @returns RSS item list
     */
    async rssItems(): Promise<TPageRecords> {
        return this.dv.pages(this.fromItems).where((p: TPageRecord) => p.role === "rssitem");
    }

    async rssItemsOfContext(context?: TPageRecord): Promise<TPageRecords> {
        const ctx = context ?? this.dv.current();
        let from: string | null = null;
        switch (ctx.role) {
            case "rssfeed":
                from = this.fromItemsOfFeed(ctx);
                break;
            case "rsscollection":
                from = await this.fromItemsOfCollection(ctx);
                break;
            case "rsstopic":
                from = this.fromItemsOfTopic(ctx);
                break;
        }
        return from
            ? this.dv.pages(from).where((p: TPageRecord) => p.role === "rssitem")
            : this.dv.array([]);
    }
    //#endregion Item lists

    //#region Feed lists
    private getPagesOfFolder(path: string, type: string): TPageRecords {
        const folder = this.settings.app.vault.getFolderByPath(path);
        if (folder) {
            const pages = folder.children
                .filter(fof => fof instanceof TFile)
                .map(f => this.dv.page(f.path))
                .filter(f => f.role === type);
            return this.dv.array(pages);
        }
        return this.dv.array([]);
    }

    /**
     * Get a list of all RSS feeds.
     *
     * @returns RSS feed list
     */
    rssFeeds(): TPageRecords {
        return this.getPagesOfFolder(this.settings.rssFeedFolderPath, "rssfeed");
    }

    async rssFeedsOfContext(context?: TPageRecord): Promise<TPageRecords> {
        const ctx = context ?? this.dv.current();
        let from: string | null = null;
        switch (ctx.role) {
            case "rsscollection":
                from = this.fromFeedsOfCollection(ctx);
                break;
        }
        return from
            ? this.dv.pages(from).where((p: TPageRecord) => p.role === "rssfeed")
            : this.dv.array([]);

    }
    //#endregion Feed lists

    async rssCollections(): Promise<TPageRecords> {
        return this.dv.pages(this.fromCollections).where((p: TPageRecord) => p.role === "rsscollection");
    }

    async rssTopics(): Promise<TPageRecords> {
        return this.dv.pages(this.fromTopics).where((p: TPageRecord) => p.role === "rsstopic");
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
    rssReadingTasks(items: TPageRecords, read?: boolean): TTaskRecords {
        return items
            .sort((i: TPageRecord) => i.published, "desc")
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
            pages = await this.rssItems();
        return pages.where((rec: TPageRecord) => rec.role === "rssitem" && rec.link === link && rec.file.path !== path);
    }

    /**
     * get a task list for items which refer to the same article.
     * @param item RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    private async rssDuplicateItemsTasks(item: TPageRecord): Promise<TTaskRecords> {
        const
            proxy = new Proxy<TPageRecord>(item, this.proxyHandler),
            duplicates = await this.rssDuplicateItems(item);
        return duplicates
            .map((rec: TPageRecord): TTaskRecord | null => {
                const
                    feed = rec.feed,
                    pinned = rec.pinned ? " 📍 " : " 📌 ",
                    task = this.itemReadingTask(rec);
                if (task) {
                    task.visual = proxy.file.link
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

    /**
     * Create a dataview task list consisting of rss items already read or still to read.
     *
     * @param items - List of rss item page records
     * @param read - `true` to create a list or items read, `false` to create a list of items to read.
     * @param header - Optional header text for the list
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
            const
                proxy = new Proxy<TPageRecord>(feed, this.proxyHandler),
                items = await this.rssItemsOfContext(feed);
            totalTaskCount += this.readingList(items, read, proxy.link);
        }
        if (totalTaskCount === 0) {
            this.dv.paragraph("⛔");
        }
        return totalTaskCount;
    }

    //////////////////////////////////////// Next GEN API

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
                    layout: {
                        ID: "Item",
                        status: "Status",
                        tags: "Tags",
                        updated: "Updated"
                    },
                    sortBy: "updated",
                    sortOrder: "desc"
                };
            case "rss_dashboard_feeds":
                return {
                    layout: {
                        ID: "Item",
                        status: "Status",
                        tags: "Tags",
                        collections: "Collections",
                        updated: "Updated",
                    },
                    sortBy: "name",
                    sortOrder: "asc"
                };
            case "rss_topics":
                return {
                    layout: {
                        ID: "Topic",
                        headline: "Headline"
                    },
                    sortBy: "name",
                    sortOrder: "asc"
                };
            case "rss_collections":
                return {
                    layout: {
                        ID: "Collection",
                        headline: "Headline"
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
            const proxy = new Proxy<TPageRecord>(item, this.proxyHandler);
            const tags = proxy.tags.join(" ");
            if (tags) {
                this.dv.span(tags);
            }
        }
    }

    private row(page: TPageRecord, propertyNames: string[]): any[] {
        const proxy = new Proxy<TPageRecord>(page, this.proxyHandler);
        return propertyNames.map(n => {
            const value = proxy[n];
            return Array.isArray(value)
                ? value.map(v => v.toString()).join(" ")
                : value;
        });
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
            columnLabels = columns.map(name => layout[name]);

        if (columns.includes("collections")) {
            await this.proxyHandler.initializeCollectionMap(this);
        }

        const sortedPages = pages
            .sort((p: TPageRecord) => {
                const proxy = new Proxy<TPageRecord>(p, this.proxyHandler);
                return proxy[options.sortBy];
            }, options.sortOrder);

        if (options.groupBy) {
            const
                groupBy = options.groupBy,
                groups = pages.groupBy((p: TPageRecord) => {
                    const proxy = new Proxy<TPageRecord>(p, this.proxyHandler);
                    return proxy[groupBy];
                });
            groups.forEach((group: TPropertyBag) => {
                this.dv.header(2, group.key + " (" + group.rows.length + ")");
                this.dv.table(
                    columnLabels,
                    group.rows.map((p: TPageRecord) => this.row(p, columns)));

            })
        }
        else {
            this.dv.table(
                columnLabels,
                sortedPages.map((p: TPageRecord) => this.row(p, columns)));
        }
    }
}