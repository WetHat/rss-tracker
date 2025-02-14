import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';
import { TFile } from 'obsidian';

type TCollapsibleTableContainer = HTMLDetailsElement & { tableHeader: string[], tableData: string[][], tableRendered: boolean };
/**,
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
 * Utility class to provide additional tools for dataviewjs queries related to RSS.
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
export class DataViewJSTools {

    private static toHashtag(tag: string): string {
        return tag.startsWith("#") ? tag : "#" + tag;
    }

    private static getHashtagsAsString(page: TPageRecord): string {
        return page.file.etags.map((t: string) => DataViewJSTools.toHashtag(t)).join(" ");
    }

    /**
     * The dataview API object.
     */
    dv: TPropertyBag;
    /**
     * The settings object describing the RSS related folder structure and settings.
     */
    private settings: RSSTrackerSettings;

    constructor(dv: TPropertyBag, settings: RSSTrackerSettings) {
        this.dv = dv;
        this.settings = settings;
    }

    // #region Dataview queries

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
    fromTags(page: TPageRecord): string {
        const
            anyTags: string[] = page.file.etags?.map((t:string) => DataViewJSTools.toHashtag(t)) ?? [],
            allTags: string[] = page.allof?.map((t: string) => DataViewJSTools.toHashtag(t)) ?? [],
            noneTags: string[] = page.noneof?.map((t: string) => DataViewJSTools.toHashtag(t)) ?? [];

        let from = [
            anyTags.length > 0 ? "( " + anyTags.join(" OR ") + " )" : null,
            allTags.length > 0 ? allTags.join(" AND ") : null,
            noneTags.length > 0 ? "-( " + noneTags.join(" OR ") + " )" : null
        ].filter(expr => expr);
        return from.length > 0 ? from.join(" AND ") : "#nil";
    }

    /**
     * Generate a dataview FROM expressing to capture all Markdown file in the `Feeds` folder.
     */
    private get fromFeedsFolder(): string {
        return `"${this.settings.rssFeedFolderPath}"`;
    }

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
    private fromItemsOfTopic(topic: TPageRecord): string {
        return this.fromFeedsFolder + " AND " + this.fromTags(topic);
    }

    private fromItemsOfCollection(collection: TPageRecord): Promise<string> {
        const feeds: TPageRecords = this.rssFeedsOfCollection(collection);
        return feeds.map((f: TPropertyBag) => `"${f.file.folder}/${f.file.name}"`).join(" OR ");
    }

    /**
     * @retun A **FROM** expression to get all items from all feed folders.
     */
    private get fromFeeds(): string {
        const
            settings = this.settings,
            feedsFolder = settings.app.vault.getFolderByPath(settings.rssFeedFolderPath);
        if (feedsFolder) {
            const feeds: string[] = feedsFolder.children
                .filter(c => c instanceof TFile && c.extension === "md")
                .map(f => '"' + f.path + '"');
            return feeds.length > 0 ? "(" + feeds.join(" OR ") + ")" : "/";
        }
        return "/";
    }

    private fromFeedsOfCollection(collection: TPageRecord): string {
        return this.fromFeeds + " AND " + this.fromTags(collection);
    }

    //#endregion Dataview queries

    //#region Item lists
    /**
     * Get a list of all RSS items.
     *
     * @returns RSS item list
     */
    get rssItems(): TPageRecords {
        return this.dv.pages(this.fromFeedsFolder).where((p: TPageRecord) => p.role === "rssitem");
    }

    //#endregion Item lists

    // #region page lists
    /**
     * Get all pages of a folder of a specific type.
     *
     * @param path Obsidian path to a folder
     * @param type Type of the pages to get.
     * @returns The dataview array of files in a given folder with a given type.
     */
    private getPagesOfFolder(path: string, type: string): TPageRecords {
        const folder = this.settings.app.vault.getFolderByPath(path);
        if (folder) {
            const pages = folder.children
                .filter(fof => fof instanceof TFile)
                .map(f => this.dv.page(f.path))
                .filter(f => f?.role === type);
            return this.dv.array(pages);
        }
        return this.dv.array([]);
    }

    /**
     * Get a list of all RSS items of a feed.
     *
     * @param feed The RSS feed to get the items from.
     * @returns dataview array of RSS items.
     */
    rssItemsOfFeed(feed: TPageRecord): TPageRecords {
        return this.getPagesOfFolder(feed.file.folder + "/" + feed.file.name, "rssitem");
    }

    /**
     * Get a list of all RSS feeds.
     *
     * @returns a dataview array of all RSS feeds.
     */
    get rssFeeds(): TPageRecords {
        return this.getPagesOfFolder(this.settings.rssFeedFolderPath, "rssfeed");
    }

    rssFeedsOfCollection(collection: TPageRecord): TPageRecords {
        let from = this.fromFeedsOfCollection(collection);
        return this.dv.pages(from).where((p: TPageRecord) => p.role === "rssfeed");
    }

    rssItemsOfCollection(collection: TPageRecord): TPageRecords {
        return this.dv.pages(this.fromItemsOfCollection(collection)).where((p: TPageRecord) => p.role === "rssitem");
    }

    rssItemsOfTopic(topic: TPageRecord): TPageRecords {
        return this.dv.pages(this.fromItemsOfTopic(topic)).where((p: TPageRecord) => p.role === "rssitem");
    }

    // #endregion Feed lists

    /**
     * @returns a dataview array of all RSS feed collections.
     */
    get rssCollections(): TPageRecords {
        return this.getPagesOfFolder(this.settings.rssCollectionsFolderPath, "rsscollection");
    }

    /**
     * @returns a dataview array of all RSS topics.
     */
    get rssTopics(): TPageRecords {
        return this.getPagesOfFolder(this.settings.rssTopicsFolderPath, "rsstopic");
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
            pages = await this.rssItems;
        return pages.where((rec: TPageRecord) => rec.role === "rssitem" && rec.link === link && rec.file.path !== path);
    }

    /**
     * get a task list for items which refer to the same article.
     * @param item RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    private async rssDuplicateItemsTasks(item: TPageRecord): Promise<TTaskRecords> {
        const duplicates = await this.rssDuplicateItems(item);
        return duplicates
            .map((rec: TPageRecord): TTaskRecord | null => {
                const
                    feed = rec.feed,
                    pinned = rec.pinned ? " 📍 " : " 📌 ",
                    task = this.itemReadingTask(rec);
                if (task) {
                    task.visual = item.file.link
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

    async rssItemHeader(item: TPageRecord, options?: TRSSitemHeaderOptions) {
        const opts = options = {
            showDuplicates: true,
            showTags: true
        };
        if (opts.showDuplicates) {
            const tasks = await this.rssDuplicateItemsTasks(item);
            if (tasks.length > 0) {
                this.dv.header(1, "⚠ Other RSS items are also referring to the same article");
                this.dv.taskList(tasks, false);
            }
        }
        if (opts.showTags) {
            const tags = DataViewJSTools.getHashtagsAsString(item)
            if (tags) {
                this.dv.span(tags);
            }
        }
    }

    // #region the generic RSS collapsible table

    /**
    * Event handler render a dataview table on demand.
    * @param {object} dv The dataview object
    * @param {HTMLDetailsElement} details the expandable block containing a dataview table.
    */
    private async renderTable(details: TCollapsibleTableContainer) {
        const { tableHeader, tableData, tableRendered } = details;
        if (details.open && !tableRendered && tableData) {
            details.tableRendered = true;
            // the api functions are indeed async, so we need to await them
            await this.dv.api.table(tableHeader, tableData, details, this.dv.component);
            const last = details.lastElementChild as HTMLElement;
            last.style.paddingLeft = "1em";
            last.style.borderLeftStyle = "solid";
        }
    }

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
    private async expandableTable(header: string[], rows: any[][], label: string = "Files", expand: boolean | undefined = undefined) {
        if (expand === undefined) {
            this.dv.table(header, rows); // render the table directly with dataview
        } else { // render the table in a collapsible `<details>` block
            const
                summary = this.dv.el("summary", `${label} (${rows.length})`),
                details = this.dv.el("details", summary);
            summary.style.cursor = "default";
            details.open = expand;
            details.tableData = rows;
            details.tableHeader = header;
            if (details.open) {
                await this.renderTable(details); // render once now
            } else {
                // configure the on-demand rendering of the table
                details.addEventListener("toggle", async (evt: Event) => await this.renderTable(evt.target as TCollapsibleTableContainer));
            }
        }
    }
    // #endregion the generic RSS collapsible table

    // #region specific RSS collapsible tables

    /**
     * Headers for RSS related tables.
     */
    private static TABLE_HEADER = {
        rssCollection: ["Collection", "Headline"],
        rssTopic: ["Topic", "Headline"],
        rssFeed: ["Feed", "Status", "Tags", "Updated"],
        rssFeedDashboard: ["Feed", "Status", "Tags", "Collections", "Updated"],
        rssItem: ["Item", "Tags", "Published"]
    }

    /**
     * Render a table of RSS collections.
     *
     * @param collections List of RSS collection pages.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    async rssCollectionTable(collections: TPageRecords, expand: boolean | undefined = undefined) {
        const rows = collections
            .sort((c: TPageRecord) => c.file.name, "asc")
            .map((c: TPageRecord) => [c.file.link, c.headline]);
        await this.expandableTable(DataViewJSTools.TABLE_HEADER.rssCollection, rows, "Collections", expand);
    }

    /**
     * Render a table of RSS topics.
     *
     * @param topics List of RSS topic pages.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    async rssTopicTable(topics: TPageRecords, expand: boolean | undefined = undefined) {
        const rows = topics
            .sort((t: TPageRecord) => t.file.name, "asc")
            .map((t: TPageRecord) => [t.file.link, t.headline]);
        await this.expandableTable(DataViewJSTools.TABLE_HEADER.rssTopic, rows, "Topics", expand);
    }

    /**
     * Render a table of RSS feeds.
     *
     * @param feeds collecion of RSS feeds
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    async rssFeedTable(feeds: TPageRecords, expand: boolean | undefined = undefined) {
        const rows = feeds
            .sort((t: TPageRecord) => t.file.name, "asc")
            .map((f: TPageRecord) => [
                f.file.link,
                f.status,
                DataViewJSTools.getHashtagsAsString(f),
                f.updated
            ]);
        await this.expandableTable(DataViewJSTools.TABLE_HEADER.rssFeed, rows, "Feeds", expand);
    }

    /**
     * Render a dashboard table of RSS feeds .
     *
     * @param feeds List of RSS feeds
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    async rssFeedDashboard(feeds: TPageRecords, expand: boolean | undefined = undefined) {
        const
            feedsToCollections = new Map<string, TPageRecord[]>();
        for (const collection of this.rssCollections) {
            for (const feed of this.rssFeedsOfCollection(collection)) {
                let cList = feedsToCollections.get(feed.file.path);
                if (!cList) {
                    cList = [];
                    feedsToCollections.set(feed.file.path, cList);
                }
                cList.push(collection);
            }
        }
        const rows = feeds
            .sort((f: TPageRecord) => f.file.name, "asc")
            .map((f: TPageRecord) => [
                f.file.link,
                f.status,
                DataViewJSTools.getHashtagsAsString(f),
                feedsToCollections.get(f.file.path)?.map((c: TPageRecord) => c.file.link).join(" "),
                f.updated
            ]);
        await this.expandableTable(DataViewJSTools.TABLE_HEADER.rssFeedDashboard, rows, "Feeds", expand);
    }

    /**
     * Render a table of RSS items.
     *
     * @param items A collection of RSS items.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     * @param [label="Items"] The label for the expander control.
     */
    async rssItemTable(items: TPageRecords, expand: boolean | undefined = undefined, label: string = "Items") {
        const rows = items
            .sort((i: TPageRecord) => i.file.name, "asc")
            .map((i: TPageRecord) => [i.file.link, DataViewJSTools.getHashtagsAsString(i), i.published]);
        await this.expandableTable(DataViewJSTools.TABLE_HEADER.rssItem, rows, label, expand);
    }

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
    async rssItemTableByFeed(items: TPageRecords, expand: boolean | undefined = undefined) {
        if (items.length === 0) {
            this.dv.paragraph("⛔");
            return;
        }

        const groups = items
            .groupBy((i: TPageRecord) => i.feed)
            .sort((g: any) => g.key, "asc");
        for (const group of groups) {
            await this.rssItemTable(group.rows, expand, group.key);
        }
    }
    // #endregion specific RSS collapsible tables

    // #region reading lists

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
    private async renderTaskList(details: HTMLDetailsElement) {
        const { readingList, readingListRendered } = (details as any);
        if (details.open && !readingListRendered && readingList) {
            (details as any).readingListRendered = true;
            await this.dv.api.taskList(readingList, false, details, this.dv.component);
            const last = details.lastElementChild as HTMLElement;
            last.style.paddingLeft = "1em";
            last.style.borderLeftStyle = "solid";
        }
    }

    /**
     * Render a list of reading tasks on-demand in a collapsible block.
     *
     * @param tasks The list of reading tasks to render.
     * @param expand `undefined` render immediately using a generic dataview table;
     *               `true` render table immediately and expand the table by default;
     *               `false` to collapse the table by default and render the table on-demand.
     * @param [header="Items"] The header text for the expander control.
     */
    private async rssTaskList(tasks: TTaskRecords, expand: boolean, header: string = "Items") {
        if (tasks.length > 0) {
            const
                summary = this.dv.el("summary", `${header} (${tasks.length})`),
                details = this.dv.el("details", summary);
            (summary as HTMLElement).style.cursor = "default";
            details.open = expand;
            details.readingList = tasks;
            if (expand) {
                await this.renderTaskList(details); // render once now
            } else {
                // configure the delayed rendering of the reading tasks
                details.addEventListener("toggle", async (evt: Event) => this.renderTaskList(evt.target as HTMLDetailsElement));
            }
        } else {
            this.dv.paragraph("⛔");
        }
    }

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
    async rssReadingList(items: TPageRecords, read: boolean, expand: boolean, header: string = "Items") {
        const tasks: TTaskRecords = this.rssReadingTasks(items, read);
        if (tasks.length === 0) {
            this.dv.paragraph("⛔");
            return;
        }

        await this.rssTaskList(tasks, expand, header);
    }
    /**
     * Display collapsible reading tasks grouped by feed.
     *
     * @param feeds Collection of feeds
     * @param read `false` to collect and display unchecked (unread) reading tasks: `true` otherwise.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    async rssReadingListByFeed(items: TPageRecords, read: boolean = false, expand = false) {
        const groups = items
            .groupBy((i: TPageRecord) => i.feed)
            .sort((g: any) => g.key, "asc");
        let totalTasks = 0;

        for (const group of groups) {
            const tasks: TTaskRecords = this.rssReadingTasks(group.rows, read);
            if (tasks.length > 0) {
                totalTasks += tasks.length;
                await this.rssTaskList(tasks, expand, group.key);
            }
        }
        if (totalTasks === 0) {
            this.dv.paragraph("⛔");
        }
    }
    // #endregion reading lists
}