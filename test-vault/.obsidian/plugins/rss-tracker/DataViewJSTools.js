import { __awaiter } from "tslib";
import { TFile } from 'obsidian';
//#endregion
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
export class DataViewJSTools {
    constructor(dv, settings) {
        this.dv = dv;
        this.settings = settings;
    }
    static toHashtag(tag) {
        return tag.startsWith("#") ? tag : "#" + tag;
    }
    static getHashtagsAsString(page) {
        return page.file.etags.map((t) => DataViewJSTools.toHashtag(t)).join(" ");
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
    fromTags(page) {
        var _a, _b, _c, _d, _e, _f;
        const anyTags = (_b = (_a = page.file.etags) === null || _a === void 0 ? void 0 : _a.map((t) => DataViewJSTools.toHashtag(t))) !== null && _b !== void 0 ? _b : [], allTags = (_d = (_c = page.allof) === null || _c === void 0 ? void 0 : _c.map((t) => DataViewJSTools.toHashtag(t))) !== null && _d !== void 0 ? _d : [], noneTags = (_f = (_e = page.noneof) === null || _e === void 0 ? void 0 : _e.map((t) => DataViewJSTools.toHashtag(t))) !== null && _f !== void 0 ? _f : [];
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
    get fromFeedsFolder() {
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
    fromItemsOfTopic(topic) {
        return this.fromFeedsFolder + " AND " + this.fromTags(topic);
    }
    fromItemsOfCollection(collection) {
        const feeds = this.rssFeedsOfCollection(collection);
        return feeds.map((f) => `"${f.file.folder}/${f.file.name}"`).join(" OR ");
    }
    /**
     * @retun A **FROM** expression to get all items from all feed folders.
     */
    get fromFeeds() {
        const settings = this.settings, feedsFolder = settings.app.vault.getFolderByPath(settings.rssFeedFolderPath);
        if (feedsFolder) {
            const feeds = feedsFolder.children
                .filter(c => c instanceof TFile && c.extension === "md")
                .map(f => '"' + f.path + '"');
            return feeds.length > 0 ? "(" + feeds.join(" OR ") + ")" : "/";
        }
        return "/";
    }
    fromFeedsOfCollection(collection) {
        return this.fromFeeds + " AND " + this.fromTags(collection);
    }
    //#endregion Dataview queries
    //#region Item lists
    /**
     * Get a list of all RSS items.
     *
     * @returns RSS item list
     */
    get rssItems() {
        return this.dv.pages(this.fromFeedsFolder).where((p) => p.role === "rssitem");
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
    getPagesOfFolder(path, type) {
        const folder = this.settings.app.vault.getFolderByPath(path);
        if (folder) {
            const pages = folder.children
                .filter(fof => fof instanceof TFile)
                .map(f => this.dv.page(f.path))
                .filter(f => (f === null || f === void 0 ? void 0 : f.role) === type);
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
    rssItemsOfFeed(feed) {
        return this.getPagesOfFolder(feed.file.folder + "/" + feed.file.name, "rssitem");
    }
    /**
     * Get a list of all RSS feeds.
     *
     * @returns a dataview array of all RSS feeds.
     */
    get rssFeeds() {
        return this.getPagesOfFolder(this.settings.rssFeedFolderPath, "rssfeed");
    }
    rssFeedsOfCollection(collection) {
        let from = this.fromFeedsOfCollection(collection);
        return this.dv.pages(from).where((p) => p.role === "rssfeed");
    }
    rssItemsOfCollection(collection) {
        return this.dv.pages(this.fromItemsOfCollection(collection)).where((p) => p.role === "rssitem");
    }
    rssItemsOfTopic(topic) {
        return this.dv.pages(this.fromItemsOfTopic(topic)).where((p) => p.role === "rssitem");
    }
    // #endregion Feed lists
    /**
     * @returns a dataview array of all RSS feed collections.
     */
    get rssCollections() {
        return this.getPagesOfFolder(this.settings.rssCollectionsFolderPath, "rsscollection");
    }
    /**
     * @returns a dataview array of all RSS topics.
     */
    get rssTopics() {
        return this.getPagesOfFolder(this.settings.rssTopicsFolderPath, "rsstopic");
    }
    itemReadingTask(item) {
        const tasks = item.file.tasks.where((t) => t.text.startsWith("[["));
        return tasks.length > 0 ? tasks[0] : null;
    }
    /**
     * Get a list of reading tasks for the given RSS items.
     * @param items list of RSS items to get the reading tasks for
     * @param read `false` to return unread items; `true` to return read items. If `undefined`
     *             all reading tasks are returned
     * @returns reading tasks matching the given reading status
     */
    rssReadingTasks(items, read) {
        return items
            .sort((i) => i.published, "desc")
            .map((item) => this.itemReadingTask(item))
            .where((t) => t && (read === undefined || t.completed === read));
    }
    /**
     * Get duplicate items which link to the same article
     * @param item The RSS item to get publicates for
     * @returns List of duplicates, if any.
     */
    rssDuplicateItems(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = item.link, path = item.file.path, pages = yield this.rssItems;
            return pages.where((rec) => rec.role === "rssitem" && rec.link === link && rec.file.path !== path);
        });
    }
    /**
     * get a task list for items which refer to the same article.
     * @param item RSS item to get the duplicates of
     * @returns List of reading tasks of the duplicate items
     */
    rssDuplicateItemsTasks(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const duplicates = yield this.rssDuplicateItems(item);
            return duplicates
                .map((rec) => {
                const feed = rec.feed, pinned = rec.pinned ? " 📍 " : " 📌 ", task = this.itemReadingTask(rec);
                if (task) {
                    task.visual = item.file.link
                        + pinned
                        + "**∈** "
                        + feed;
                }
                else {
                    return null;
                }
                return task;
            })
                .where((t) => t);
        });
    }
    rssItemHeader(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const opts = {
                showDuplicates: true,
                showTags: true
            };
            if (opts.showDuplicates) {
                const tasks = yield this.rssDuplicateItemsTasks(item);
                if (tasks.length > 0) {
                    this.dv.header(1, "⚠ Other RSS items are also referring to the same article");
                    this.dv.taskList(tasks, false);
                }
            }
            if (opts.showTags) {
                const tags = DataViewJSTools.getHashtagsAsString(item);
                if (tags) {
                    this.dv.span(tags);
                }
            }
        });
    }
    // #region the generic RSS collapsible table
    /**
    * Event handler render a dataview table on demand.
    * @param {object} dv The dataview object
    * @param {HTMLDetailsElement} details the expandable block containing a dataview table.
    */
    renderTable(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tableHeader, tableData, tableRendered } = details;
            if (details.open && !tableRendered && tableData) {
                details.tableRendered = true;
                // the api functions are indeed async, so we need to await them
                yield this.dv.api.table(tableHeader, tableData, details, this.dv.component);
                const last = details.lastElementChild;
                last.style.paddingLeft = "1em";
                last.style.borderLeftStyle = "solid";
            }
        });
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
    expandableTable(header, rows, label = "Files", expand = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (expand === undefined) {
                this.dv.table(header, rows); // render the table directly with dataview
            }
            else { // render the table in a collapsible `<details>` block
                const summary = this.dv.el("summary", `${label} (${rows.length})`), details = this.dv.el("details", summary);
                summary.style.cursor = "default";
                details.open = expand;
                details.tableData = rows;
                details.tableHeader = header;
                if (details.open) {
                    yield this.renderTable(details); // render once now
                }
                else {
                    // configure the on-demand rendering of the table
                    details.addEventListener("toggle", (evt) => __awaiter(this, void 0, void 0, function* () { return yield this.renderTable(evt.target); }));
                }
            }
        });
    }
    /**
     * Render a table of RSS collections.
     *
     * @param collections List of RSS collection pages.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssCollectionTable(collections, expand = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = collections
                .sort((c) => c.file.name, "asc")
                .map((c) => [c.file.link, c.headline]);
            yield this.expandableTable(DataViewJSTools.TABLE_HEADER.rssCollection, rows, "Collections", expand);
        });
    }
    /**
     * Render a table of RSS topics.
     *
     * @param topics List of RSS topic pages.
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssTopicTable(topics, expand = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = topics
                .sort((t) => t.file.name, "asc")
                .map((t) => [t.file.link, t.headline]);
            yield this.expandableTable(DataViewJSTools.TABLE_HEADER.rssTopic, rows, "Topics", expand);
        });
    }
    /**
     * Render a table of RSS feeds.
     *
     * @param feeds collecion of RSS feeds
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssFeedTable(feeds, expand = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = feeds
                .sort((t) => t.file.name, "asc")
                .map((f) => [
                f.file.link,
                f.status,
                DataViewJSTools.getHashtagsAsString(f),
                f.updated
            ]);
            yield this.expandableTable(DataViewJSTools.TABLE_HEADER.rssFeed, rows, "Feeds", expand);
        });
    }
    /**
     * Render a dashboard table of RSS feeds .
     *
     * @param feeds List of RSS feeds
     * @param [expand=false] `undefined` render immediately using a generic dataview table;
     *                       `true` render table immediately and expand the table by default;
     *                       `false` to collapse the table by default and render the table on-demand.
     */
    rssFeedDashboard(feeds, expand = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedsToCollections = new Map();
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
                .sort((f) => f.file.name, "asc")
                .map((f) => {
                var _a;
                return [
                    f.file.link,
                    f.status,
                    DataViewJSTools.getHashtagsAsString(f),
                    (_a = feedsToCollections.get(f.file.path)) === null || _a === void 0 ? void 0 : _a.map((c) => c.file.link).join(" "),
                    f.updated
                ];
            });
            yield this.expandableTable(DataViewJSTools.TABLE_HEADER.rssFeedDashboard, rows, "Feeds", expand);
        });
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
    rssItemTable(items, expand = undefined, label = "Items") {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = items
                .sort((i) => i.file.name, "asc")
                .map((i) => [i.file.link, DataViewJSTools.getHashtagsAsString(i), i.published]);
            yield this.expandableTable(DataViewJSTools.TABLE_HEADER.rssItem, rows, label, expand);
        });
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
    rssItemTableByFeed(items, expand = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (items.length === 0) {
                this.dv.paragraph("⛔");
                return;
            }
            const groups = items
                .groupBy((i) => i.feed)
                .sort((g) => g.key, "asc");
            for (const group of groups) {
                yield this.rssItemTable(group.rows, expand, group.key);
            }
        });
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
    renderTaskList(details) {
        return __awaiter(this, void 0, void 0, function* () {
            const { readingList, readingListRendered } = details;
            if (details.open && !readingListRendered && readingList) {
                details.readingListRendered = true;
                yield this.dv.api.taskList(readingList, false, details, this.dv.component);
                const last = details.lastElementChild;
                last.style.paddingLeft = "1em";
                last.style.borderLeftStyle = "solid";
            }
        });
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
    rssTaskList(tasks, expand, header = "Items") {
        return __awaiter(this, void 0, void 0, function* () {
            if (tasks.length > 0) {
                const summary = this.dv.el("summary", `${header} (${tasks.length})`), details = this.dv.el("details", summary);
                summary.style.cursor = "default";
                details.open = expand;
                details.readingList = tasks;
                if (expand) {
                    yield this.renderTaskList(details); // render once now
                }
                else {
                    // configure the delayed rendering of the reading tasks
                    details.addEventListener("toggle", (evt) => __awaiter(this, void 0, void 0, function* () { return this.renderTaskList(evt.target); }));
                }
            }
            else {
                this.dv.paragraph("⛔");
            }
        });
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
    rssReadingList(items, read, expand, header = "Items") {
        return __awaiter(this, void 0, void 0, function* () {
            const tasks = this.rssReadingTasks(items, read);
            if (tasks.length === 0) {
                this.dv.paragraph("⛔");
                return;
            }
            yield this.rssTaskList(tasks, expand, header);
        });
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
    rssReadingListByFeed(items, read = false, expand = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = items
                .groupBy((i) => i.feed)
                .sort((g) => g.key, "asc");
            let totalTasks = 0;
            for (const group of groups) {
                const tasks = this.rssReadingTasks(group.rows, read);
                if (tasks.length > 0) {
                    totalTasks += tasks.length;
                    yield this.rssTaskList(tasks, expand, group.key);
                }
            }
            if (totalTasks === 0) {
                this.dv.paragraph("⛔");
            }
        });
    }
}
// #endregion the generic RSS collapsible table
// #region specific RSS collapsible tables
/**
 * Headers for RSS related tables.
 */
DataViewJSTools.TABLE_HEADER = {
    rssCollection: ["Collection", "Headline"],
    rssTopic: ["Topic", "Headline"],
    rssFeed: ["Feed", "Status", "Tags", "Updated"],
    rssFeedDashboard: ["Feed", "Status", "Tags", "Collections", "Updated"],
    rssItem: ["Item", "Tags", "Published"]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YVZpZXdKU1Rvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0RhdGFWaWV3SlNUb29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFVBQVUsQ0FBQztBQXFGakMsWUFBWTtBQUdaOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQW1CeEIsWUFBWSxFQUFnQixFQUFFLFFBQTRCO1FBQ3RELElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQXBCTyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQVc7UUFDaEMsT0FBTyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDakQsQ0FBQztJQUVPLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFpQjtRQUNoRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBZ0JELDJCQUEyQjtJQUUzQjs7Ozs7Ozs7O09BU0c7SUFDSCxRQUFRLENBQUMsSUFBaUI7O1FBQ3RCLE1BQ0ksT0FBTyxHQUFhLE1BQUEsTUFBQSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssMENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUUsRUFDM0YsT0FBTyxHQUFhLE1BQUEsTUFBQSxJQUFJLENBQUMsS0FBSywwQ0FB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SUFDekMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztJQUMvQixPQUFPLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7SUFDOUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsU0FBUyxDQUFDO0lBQ3RFLE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDO0NBQ3pDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUUHJvcGVydHlCYWcgfSBmcm9tICcuL0ZlZWRBc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBSU1NUcmFja2VyU2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcclxuaW1wb3J0IHsgVEZpbGUgfSBmcm9tICdvYnNpZGlhbic7XHJcblxyXG4vKipcclxuICogQSBleHRlbnNpb24gb2YgSFRNTERldGFpbHNFbGVtZW50IHRvIHByb3ZpZGUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGZvciBhIGNvbGxhcHNpYmxlIHRhYmxlcy5cclxuICovXHJcbnR5cGUgVENvbGxhcHNpYmxlVGFibGVDb250YWluZXIgPSBIVE1MRGV0YWlsc0VsZW1lbnQgJiB7IHRhYmxlSGVhZGVyOiBzdHJpbmdbXSwgdGFibGVEYXRhOiBhbnlbXVtdLCB0YWJsZVJlbmRlcmVkOiBib29sZWFuIH07XHJcblxyXG4vKipcclxuICogQSBleHRlbnNpb24gb2YgSFRNTERldGFpbHNFbGVtZW50IHRvIHByb3ZpZGUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGZvciBhIGNvbGxhcHNpYmxlIHRhc2sgbGlzdHMuXHJcbiAqL1xyXG50eXBlIFRDb2xsYXBzaWJsZVRhc2tMaXN0ID0gSFRNTERldGFpbHNFbGVtZW50ICYgeyByZWFkaW5nTGlzdDogVFRhc2tSZWNvcmRzLCByZWFkaW5nTGlzdFJlbmRlcmVkOiBib29sZWFuIH07XHJcblxyXG4vKipcclxuICogQSB1dGlsaXR5IHR5cGUgdG8gcmVwcmVzZW50UlNTIHBhZ2UgdHlwZXMuXHJcbiAqL1xyXG50eXBlIFRSU1NQYWdlVHlwZSA9IFwicnNzY29sbGVjdGlvblwiIHwgXCJyc3NmZWVkXCIgfCBcInJzc3RvcGljXCIgfCBcInJzc2l0ZW1cIjtcclxuXHJcbi8qKlxyXG4gKiBBIHV0aWxpdHkgdHB5ZSB0byBzcGVjaWZ5IHRoZSBpbnRpYWwgc3RhdGUgb2YgYW4gZXhwYW5kYWJsZSB0YWJsZS5cclxuICpcclxuICogU3VwcG9ydGVkIHN0YXRlczpcclxuICogLSAndW5kZWZpbmVkJyB0byByZW5kZXIgdGhlIHRhYmxlIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICogLSAndHJ1ZScgdG8gcmVuZGVyIHRoZSB0YWJsZSBpbW1lZGlhdGVseSBhbmQgZXhwYW5kIHRoZSB0YWJsZSBieSBkZWZhdWx0O1xyXG4gKiAtICdmYWxzZScgdG8gY29sbGFwc2UgdGhlIHRhYmxlIGJ5IGRlZmF1bHQgYW5kIHJlbmRlciB0aGUgdGFibGUgb24tZGVtYW5kLlxyXG4gKi9cclxudHlwZSBURXhwYW5kU3RhdGUgPSBib29sZWFuIHwgdW5kZWZpbmVkO1xyXG5cclxuLyoqIEFuIGFubm90YXRlZCBwYWdlIG9iamVjdCByZXR1cm5lZCBmcm9tIERhdGF2aWV3ICovXHJcbnR5cGUgVFJlY29yZCA9IFRQcm9wZXJ0eUJhZztcclxuXHJcbi8qKlxyXG4gKiBEYXRhdmlldyByZWNvcmQgb2JqZWN0IGRlc2NyaWJpbmcgYW4gT2JzaWRpYW4gcGFnZS5cclxuICpcclxuICogQ29udGFpbnMgYWxsIGZyb250bWF0dGVyIHByb3BlcnRpZXNcclxuICovXHJcbnR5cGUgVFBhZ2VSZWNvcmQgPSBUUmVjb3JkICYge1xyXG4gICAgLyoqXHJcbiAgICAgKiBBbm5vdGF0ZWQgRmlsZSBvYmVjdCBhcyBkb2N1bWVudGVzIGluXHJcbiAgICAgKiB7QGxpbmsgaHR0cHM6Ly9ibGFja3NtaXRoZ3UuZ2l0aHViLmlvL29ic2lkaWFuLWRhdGF2aWV3L2Fubm90YXRpb24vbWV0YWRhdGEtcGFnZXMvfVxyXG4gICAgICovXHJcbiAgICBmaWxlOiBUUHJvcGVydHlCYWdcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEYXRhdmlldyByZWNvcmQgb2JqZWN0IGRlc2NyaWJpbmcgYSB0YXNrLlxyXG4gKlxyXG4gKiBBIGZ1bGwgbGlzdCBvZiBwcm9wZXJ0aXdzIGluIGRlc2NyaWJlZCBpbiB7QGxpbmsgaHR0cHM6Ly9ibGFja3NtaXRoZ3UuZ2l0aHViLmlvL29ic2lkaWFuLWRhdGF2aWV3L2Fubm90YXRpb24vbWV0YWRhdGEtdGFza3MvfS5cclxuICovXHJcbnR5cGUgVFRhc2tSZWNvcmQgPSBUUmVjb3JkICYge1xyXG4gICAgLyoqXHJcbiAgICAgKiBGbGFnIHRvIGluZGljYXRlIGEgdGFzayBoYXMgYmVlbiBjb21wbGV0ZWQ7XHJcbiAgICAgKi9cclxuICAgIGNvbXBsZXRlZDogYm9vbGVhblxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEEgY29sbGVjdGlvbiBvZiByZWNvcmRzIHJldHVybmVkIGZyb20gRGF0YXZpZXcuXHJcbiAqL1xyXG50eXBlIFRSZWNvcmRzID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiAgTWFwIGluZGV4ZXMgdG8gZGF0YXZpZXcgb2JqZWN0IHByb3BlcnRpZXMuXHJcbiAgICAgKi9cclxuICAgIFtpbmRleDogbnVtYmVyXTogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3dpenpsaW5nIG9mIGZpZWxkcy4gRXF1aXZhbGVudCB0byBpbXBsaWNpdGx5IGNhbGxpbmcgYGFycmF5LnRvKFwiZmllbGRcIilgXHJcbiAgICAgKi9cclxuICAgIFtmaWVsZDogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVjb3JkIGxpc3QgaXRlcmF0b3JcclxuICAgICAqL1xyXG4gICAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8VFBhZ2VSZWNvcmQ+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBTd2l6emxlZCBmaWVsZC5cclxuICAgICAqIEBzZWUge0BsaW5rIFRQYWdlUmVjb3JkfVxyXG4gICAgICovXHJcbiAgICBmaWxlOiBhbnlcclxuXHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxufVxyXG50eXBlIFRQYWdlUmVjb3JkcyA9IFRSZWNvcmRzO1xyXG50eXBlIFRUYXNrUmVjb3JkcyA9IFRSZWNvcmRzO1xyXG5cclxuLy8jZW5kcmVnaW9uXHJcblxyXG5cclxuLyoqXHJcbiAqIERlY29yYXRvciBjbGFzcyB0byBwcm92aWRlIGFkZGl0aW9uYWwgZnVuY3Rpb25hbGl0eSByZWxhdGVkIHRvIFJTUyB0byBkYXRhdmlld2pzIHF1ZXJpZXMuXHJcbiAqXHJcbiAqIGBgYHN2Z2JvYlxyXG4gKiDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgICAgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJBcclxuICog4pSCIH5+fmRhdGF2aWV3anMg4pSCICAgICAg4pSCICAgICAgICAgICAgICAgICDilIJcclxuICog4pSCIGR2anMuLi4uICAgICAg4pSC4pSA4pSA4pSA4pSA4pSA4pa24pSCIERhdGFWaWV3SlNUb29scyDilIJcclxuICog4pSCIH5+fiAgICAgICAgICAg4pSCICAgICAg4pSCICAgICAgICAgICAgICAgICDilIJcclxuICog4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYICAgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYXHJcbiAqICAgICAgICAg4pSCICAgICAgICAgICAgICAgICAgICAgICDilIJcclxuICogICAgICAgICDilIIgICAgICAgICAgICAgICAgICAgICAgIOKUglxyXG4gKiAgICAgICAgIOKUgiAgICAgICAgICAgICAgICAgICAgICAg4pa8XHJcbiAqICAgICAgICAg4pSCICAgICAgICAgICAgICAg4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQXHJcbiAqICAgICAgICAg4pSCICAgICAgICAgICAgICAg4pSCICAgICAgICAgICAgICAg4pSCXHJcbiAqICAgICAgICAg4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pa24pSCIERhdGF2aWV3IEFQSSAg4pSCXHJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgIOKUgiAgICAgKGR2KSAgICAgIOKUglxyXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICDilJTilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJhcclxuICogYGBgXHJcbiAqXHJcbiAqIFRoZSBhcnJvd3MgaW5kaWNhdGUgdGhlIGRpcmVjdGlvbiBvZiBpbnRlcmFjdGlvbiwgc2hvd2luZyB0aGF0IGEgYGRhdGF2aWV3anNgIGludGVyYWN0cyB3aXRoIHRoZSBgZGF0YXZpZXdgXHJcbiAqIEFQSSB0aHJvdWdoIHRoZSB7QGxpbmsgRGF0YVZpZXdKU1Rvb2xzfS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBEYXRhVmlld0pTVG9vbHMge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIHRvSGFzaHRhZyh0YWc6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRhZy5zdGFydHNXaXRoKFwiI1wiKSA/IHRhZyA6IFwiI1wiICsgdGFnO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGdldEhhc2h0YWdzQXNTdHJpbmcocGFnZTogVFBhZ2VSZWNvcmQpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBwYWdlLmZpbGUuZXRhZ3MubWFwKCh0OiBzdHJpbmcpID0+IERhdGFWaWV3SlNUb29scy50b0hhc2h0YWcodCkpLmpvaW4oXCIgXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRhdGF2aWV3IEFQSSBvYmplY3QuXHJcbiAgICAgKi9cclxuICAgIGR2OiBUUHJvcGVydHlCYWc7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBzZXR0aW5ncyBvYmplY3QgZGVzY3JpYmluZyB0aGUgUlNTIHJlbGF0ZWQgZm9sZGVyIHN0cnVjdHVyZSBhbmQgc2V0dGluZ3MuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc2V0dGluZ3M6IFJTU1RyYWNrZXJTZXR0aW5ncztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihkdjogVFByb3BlcnR5QmFnLCBzZXR0aW5nczogUlNTVHJhY2tlclNldHRpbmdzKSB7XHJcbiAgICAgICAgdGhpcy5kdiA9IGR2O1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcclxuICAgIH1cclxuXHJcbiAgICAvLyAjcmVnaW9uIERhdGF2aWV3IHF1ZXJpZXNcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlIGEgZGF0YXZpZXcgRlJPTSBleHByZXNzaW9uIHRvIGdldCBwYWdlcyBtYXRjaGluZyBhIHRhZyBmaWx0ZXIuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIHJlcXVpcmVkIGZyb250bWF0dGVyIHByb3BlcnRpZXMgdG8gYnVpbGQgdGhlIGV4cHJlc3Npb24gYXJlOlxyXG4gICAgICogLSBgdGFnc2A6IHBhZ2VzIHdpdGggYW55IG9mIHRoZXNlIHRhZ3MgYXJlIGluY2x1ZGVkXHJcbiAgICAgKiAtIGBhbGxvZmA6IHBhZ2VzIG11c3QgaGF2ZSBhbGwgb2YgdGhlc2UgdGFncyB0byBiZSBpbmNsdWRlZFxyXG4gICAgICogLSBgbm9uZW9mYCAtIHBhZ2VkIHdpdGggYW55IG9mIHRoZXNlIHRhZ3MgYXJlIGV4Y2x1ZGVkXHJcbiAgICAgKiBAcGFyYW0gcGFnZSAtIEEgcGFnZSBkZWZpbmluZyAzIHRhZyBsaXN0c1xyXG4gICAgICogQHJldHVybnMgQSBGUk9NIGV4cHJlc3Npb24gc3VpdGFibGUgZm9yIGBkdi5wYWdlc2AuXHJcbiAgICAgKi9cclxuICAgIGZyb21UYWdzKHBhZ2U6IFRQYWdlUmVjb3JkKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBhbnlUYWdzOiBzdHJpbmdbXSA9IHBhZ2UuZmlsZS5ldGFncz8ubWFwKCh0OiBzdHJpbmcpID0+IERhdGFWaWV3SlNUb29scy50b0hhc2h0YWcodCkpID8/IFtdLFxyXG4gICAgICAgICAgICBhbGxUYWdzOiBzdHJpbmdbXSA9IHBhZ2UuYWxsb2Y/Lm1hcCgodDogc3RyaW5nKSA9PiBEYXRhVmlld0pTVG9vbHMudG9IYXNodGFnKHQpKSA/PyBbXSxcclxuICAgICAgICAgICAgbm9uZVRhZ3M6IHN0cmluZ1tdID0gcGFnZS5ub25lb2Y/Lm1hcCgodDogc3RyaW5nKSA9PiBEYXRhVmlld0pTVG9vbHMudG9IYXNodGFnKHQpKSA/PyBbXTtcclxuXHJcbiAgICAgICAgbGV0IGZyb20gPSBbXHJcbiAgICAgICAgICAgIGFueVRhZ3MubGVuZ3RoID4gMCA/IFwiKCBcIiArIGFueVRhZ3Muam9pbihcIiBPUiBcIikgKyBcIiApXCIgOiBudWxsLFxyXG4gICAgICAgICAgICBhbGxUYWdzLmxlbmd0aCA+IDAgPyBhbGxUYWdzLmpvaW4oXCIgQU5EIFwiKSA6IG51bGwsXHJcbiAgICAgICAgICAgIG5vbmVUYWdzLmxlbmd0aCA+IDAgPyBcIi0oIFwiICsgbm9uZVRhZ3Muam9pbihcIiBPUiBcIikgKyBcIiApXCIgOiBudWxsXHJcbiAgICAgICAgXS5maWx0ZXIoZXhwciA9PiBleHByKTtcclxuICAgICAgICByZXR1cm4gZnJvbS5sZW5ndGggPiAwID8gZnJvbS5qb2luKFwiIEFORCBcIikgOiBcIiNuaWxcIjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlIGEgZGF0YXZpZXcgRlJPTSBleHByZXNzaW5nIHRvIGNhcHR1cmUgYWxsIE1hcmtkb3duIGZpbGUgaW4gdGhlIGBGZWVkc2AgZm9sZGVyLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGdldCBmcm9tRmVlZHNGb2xkZXIoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gYFwiJHt0aGlzLnNldHRpbmdzLnJzc0ZlZWRGb2xkZXJQYXRofVwiYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdlbmVyYXRlIGEgZGF0YXZpZXcgRlJPTSBleHByZXNzaW5nIHRvIGdldCBhbGwgaXRlbXMgb2YgYW4gUlNTIHRvcGljLlxyXG4gICAgICpcclxuICAgICAqIFRoZSAqKkZST00qKiBleHByZXNzaW9uIGNvbnNpc3RzIG9mIHR3byBwYXJ0czpcclxuICAgICAqIDEuIFNwZWNpZmljYXRpb24gb2YgdGhlIFJTUyBgRmVlZHNgIGZvbGRlciB0byBuYXJyb3cgZG93biB0aGUgc2VhcmNoIHNjb3BlIHRvIFJTUyBmZWVkIHJlbGF0ZWQgZmlsZXMuXHJcbiAgICAgKiAyLiBUaGUgdGFnIGZpbHRlciBleHByZXNzaW9uIGFzIGRlZmluZWQgYnkgdGhlIGZyb250bWF0dGVyIHByb3BlcnRpZXMgb2YgdGhlIHRvcGljLlxyXG4gICAgICpcclxuICAgICAqICoqTm90ZSoqOiBUaGUgKipGUk9NKiogZXhwcmVzc2lvbiB3aWxsIGNhcHR1cmUgTWFya2Rvd24gZmlsZXMgd2hpY2ggYXJlIG5vdCBvZiB0eXBlIGByc3NpdGVtYCxcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdG9waWMgVGhlIHRvcGljIGZpbGUgY29udGFpbmluZyB0aGUgdGFnIGZpbHRlciBkZWZpbml0aW9uIGluIGl0cyBmcm9udG1hdHRlci5cclxuICAgICAqIEByZXR1cm5zIEEgRlJPTSBleHByZXNzaW9uIHN1aXRhYmxlIGZvciB1c2Ugd2l0aCBgZHYucGFnZXNgLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGZyb21JdGVtc09mVG9waWModG9waWM6IFRQYWdlUmVjb3JkKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9tRmVlZHNGb2xkZXIgKyBcIiBBTkQgXCIgKyB0aGlzLmZyb21UYWdzKHRvcGljKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZyb21JdGVtc09mQ29sbGVjdGlvbihjb2xsZWN0aW9uOiBUUGFnZVJlY29yZCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgY29uc3QgZmVlZHM6IFRQYWdlUmVjb3JkcyA9IHRoaXMucnNzRmVlZHNPZkNvbGxlY3Rpb24oY29sbGVjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIGZlZWRzLm1hcCgoZjogVFByb3BlcnR5QmFnKSA9PiBgXCIke2YuZmlsZS5mb2xkZXJ9LyR7Zi5maWxlLm5hbWV9XCJgKS5qb2luKFwiIE9SIFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1biBBICoqRlJPTSoqIGV4cHJlc3Npb24gdG8gZ2V0IGFsbCBpdGVtcyBmcm9tIGFsbCBmZWVkIGZvbGRlcnMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgZ2V0IGZyb21GZWVkcygpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgIHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncyxcclxuICAgICAgICAgICAgZmVlZHNGb2xkZXIgPSBzZXR0aW5ncy5hcHAudmF1bHQuZ2V0Rm9sZGVyQnlQYXRoKHNldHRpbmdzLnJzc0ZlZWRGb2xkZXJQYXRoKTtcclxuICAgICAgICBpZiAoZmVlZHNGb2xkZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZmVlZHM6IHN0cmluZ1tdID0gZmVlZHNGb2xkZXIuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5maWx0ZXIoYyA9PiBjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIilcclxuICAgICAgICAgICAgICAgIC5tYXAoZiA9PiAnXCInICsgZi5wYXRoICsgJ1wiJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBmZWVkcy5sZW5ndGggPiAwID8gXCIoXCIgKyBmZWVkcy5qb2luKFwiIE9SIFwiKSArIFwiKVwiIDogXCIvXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBcIi9cIjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGZyb21GZWVkc09mQ29sbGVjdGlvbihjb2xsZWN0aW9uOiBUUGFnZVJlY29yZCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbUZlZWRzICsgXCIgQU5EIFwiICsgdGhpcy5mcm9tVGFncyhjb2xsZWN0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb24gRGF0YXZpZXcgcXVlcmllc1xyXG5cclxuICAgIC8vI3JlZ2lvbiBJdGVtIGxpc3RzXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGxpc3Qgb2YgYWxsIFJTUyBpdGVtcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBSU1MgaXRlbSBsaXN0XHJcbiAgICAgKi9cclxuICAgIGdldCByc3NJdGVtcygpOiBUUGFnZVJlY29yZHMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmR2LnBhZ2VzKHRoaXMuZnJvbUZlZWRzRm9sZGVyKS53aGVyZSgocDogVFBhZ2VSZWNvcmQpID0+IHAucm9sZSA9PT0gXCJyc3NpdGVtXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvbiBJdGVtIGxpc3RzXHJcblxyXG4gICAgLy8gI3JlZ2lvbiBwYWdlIGxpc3RzXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgcGFnZXMgb2YgYSBmb2xkZXIgb2YgYSBzcGVjaWZpYyB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwYXRoIE9ic2lkaWFuIHBhdGggdG8gYSBmb2xkZXJcclxuICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgdGhlIHBhZ2VzIHRvIGdldC5cclxuICAgICAqIEByZXR1cm5zIFRoZSBkYXRhdmlldyBhcnJheSBvZiBmaWxlcyBpbiBhIGdpdmVuIGZvbGRlciB3aXRoIGEgZ2l2ZW4gdHlwZS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnZXRQYWdlc09mRm9sZGVyKHBhdGg6IHN0cmluZywgdHlwZTogVFJTU1BhZ2VUeXBlKTogVFBhZ2VSZWNvcmRzIHtcclxuICAgICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLnNldHRpbmdzLmFwcC52YXVsdC5nZXRGb2xkZXJCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgaWYgKGZvbGRlcikge1xyXG4gICAgICAgICAgICBjb25zdCBwYWdlcyA9IGZvbGRlci5jaGlsZHJlblxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihmb2YgPT4gZm9mIGluc3RhbmNlb2YgVEZpbGUpXHJcbiAgICAgICAgICAgICAgICAubWFwKGYgPT4gdGhpcy5kdi5wYWdlKGYucGF0aCkpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGYgPT4gZj8ucm9sZSA9PT0gdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmR2LmFycmF5KHBhZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHYuYXJyYXkoW10pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiBhbGwgUlNTIGl0ZW1zIG9mIGEgZmVlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZmVlZCBUaGUgUlNTIGZlZWQgdG8gZ2V0IHRoZSBpdGVtcyBmcm9tLlxyXG4gICAgICogQHJldHVybnMgZGF0YXZpZXcgYXJyYXkgb2YgUlNTIGl0ZW1zLlxyXG4gICAgICovXHJcbiAgICByc3NJdGVtc09mRmVlZChmZWVkOiBUUGFnZVJlY29yZCk6IFRQYWdlUmVjb3JkcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZXNPZkZvbGRlcihmZWVkLmZpbGUuZm9sZGVyICsgXCIvXCIgKyBmZWVkLmZpbGUubmFtZSwgXCJyc3NpdGVtXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgbGlzdCBvZiBhbGwgUlNTIGZlZWRzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIGEgZGF0YXZpZXcgYXJyYXkgb2YgYWxsIFJTUyBmZWVkcy5cclxuICAgICAqL1xyXG4gICAgZ2V0IHJzc0ZlZWRzKCk6IFRQYWdlUmVjb3JkcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZXNPZkZvbGRlcih0aGlzLnNldHRpbmdzLnJzc0ZlZWRGb2xkZXJQYXRoLCBcInJzc2ZlZWRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcnNzRmVlZHNPZkNvbGxlY3Rpb24oY29sbGVjdGlvbjogVFBhZ2VSZWNvcmQpOiBUUGFnZVJlY29yZHMge1xyXG4gICAgICAgIGxldCBmcm9tID0gdGhpcy5mcm9tRmVlZHNPZkNvbGxlY3Rpb24oY29sbGVjdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHYucGFnZXMoZnJvbSkud2hlcmUoKHA6IFRQYWdlUmVjb3JkKSA9PiBwLnJvbGUgPT09IFwicnNzZmVlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICByc3NJdGVtc09mQ29sbGVjdGlvbihjb2xsZWN0aW9uOiBUUGFnZVJlY29yZCk6IFRQYWdlUmVjb3JkcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHYucGFnZXModGhpcy5mcm9tSXRlbXNPZkNvbGxlY3Rpb24oY29sbGVjdGlvbikpLndoZXJlKChwOiBUUGFnZVJlY29yZCkgPT4gcC5yb2xlID09PSBcInJzc2l0ZW1cIik7XHJcbiAgICB9XHJcblxyXG4gICAgcnNzSXRlbXNPZlRvcGljKHRvcGljOiBUUGFnZVJlY29yZCk6IFRQYWdlUmVjb3JkcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZHYucGFnZXModGhpcy5mcm9tSXRlbXNPZlRvcGljKHRvcGljKSkud2hlcmUoKHA6IFRQYWdlUmVjb3JkKSA9PiBwLnJvbGUgPT09IFwicnNzaXRlbVwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyAjZW5kcmVnaW9uIEZlZWQgbGlzdHNcclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIGEgZGF0YXZpZXcgYXJyYXkgb2YgYWxsIFJTUyBmZWVkIGNvbGxlY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBnZXQgcnNzQ29sbGVjdGlvbnMoKTogVFBhZ2VSZWNvcmRzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRQYWdlc09mRm9sZGVyKHRoaXMuc2V0dGluZ3MucnNzQ29sbGVjdGlvbnNGb2xkZXJQYXRoLCBcInJzc2NvbGxlY3Rpb25cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyBhIGRhdGF2aWV3IGFycmF5IG9mIGFsbCBSU1MgdG9waWNzLlxyXG4gICAgICovXHJcbiAgICBnZXQgcnNzVG9waWNzKCk6IFRQYWdlUmVjb3JkcyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZXNPZkZvbGRlcih0aGlzLnNldHRpbmdzLnJzc1RvcGljc0ZvbGRlclBhdGgsIFwicnNzdG9waWNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpdGVtUmVhZGluZ1Rhc2soaXRlbTogVFBhZ2VSZWNvcmQpOiBUVGFza1JlY29yZCB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHRhc2tzID0gaXRlbS5maWxlLnRhc2tzLndoZXJlKCh0OiBUVGFza1JlY29yZCkgPT4gdC50ZXh0LnN0YXJ0c1dpdGgoXCJbW1wiKSk7XHJcbiAgICAgICAgcmV0dXJuIHRhc2tzLmxlbmd0aCA+IDAgPyB0YXNrc1swXSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYSBsaXN0IG9mIHJlYWRpbmcgdGFza3MgZm9yIHRoZSBnaXZlbiBSU1MgaXRlbXMuXHJcbiAgICAgKiBAcGFyYW0gaXRlbXMgbGlzdCBvZiBSU1MgaXRlbXMgdG8gZ2V0IHRoZSByZWFkaW5nIHRhc2tzIGZvclxyXG4gICAgICogQHBhcmFtIHJlYWQgYGZhbHNlYCB0byByZXR1cm4gdW5yZWFkIGl0ZW1zOyBgdHJ1ZWAgdG8gcmV0dXJuIHJlYWQgaXRlbXMuIElmIGB1bmRlZmluZWRgXHJcbiAgICAgKiAgICAgICAgICAgICBhbGwgcmVhZGluZyB0YXNrcyBhcmUgcmV0dXJuZWRcclxuICAgICAqIEByZXR1cm5zIHJlYWRpbmcgdGFza3MgbWF0Y2hpbmcgdGhlIGdpdmVuIHJlYWRpbmcgc3RhdHVzXHJcbiAgICAgKi9cclxuICAgIHJzc1JlYWRpbmdUYXNrcyhpdGVtczogVFBhZ2VSZWNvcmRzLCByZWFkPzogYm9vbGVhbik6IFRUYXNrUmVjb3JkcyB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW1zXHJcbiAgICAgICAgICAgIC5zb3J0KChpOiBUUGFnZVJlY29yZCkgPT4gaS5wdWJsaXNoZWQsIFwiZGVzY1wiKVxyXG4gICAgICAgICAgICAubWFwKChpdGVtOiBUUGFnZVJlY29yZCkgPT4gdGhpcy5pdGVtUmVhZGluZ1Rhc2soaXRlbSkpXHJcbiAgICAgICAgICAgIC53aGVyZSgodDogVFRhc2tSZWNvcmQgfCBudWxsKSA9PiB0ICYmIChyZWFkID09PSB1bmRlZmluZWQgfHwgdC5jb21wbGV0ZWQgPT09IHJlYWQpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBkdXBsaWNhdGUgaXRlbXMgd2hpY2ggbGluayB0byB0aGUgc2FtZSBhcnRpY2xlXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBUaGUgUlNTIGl0ZW0gdG8gZ2V0IHB1YmxpY2F0ZXMgZm9yXHJcbiAgICAgKiBAcmV0dXJucyBMaXN0IG9mIGR1cGxpY2F0ZXMsIGlmIGFueS5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgcnNzRHVwbGljYXRlSXRlbXMoaXRlbTogVFBhZ2VSZWNvcmQpOiBQcm9taXNlPFRQYWdlUmVjb3Jkcz4ge1xyXG4gICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgIGxpbmsgPSBpdGVtLmxpbmssXHJcbiAgICAgICAgICAgIHBhdGggPSBpdGVtLmZpbGUucGF0aCxcclxuICAgICAgICAgICAgcGFnZXMgPSBhd2FpdCB0aGlzLnJzc0l0ZW1zO1xyXG4gICAgICAgIHJldHVybiBwYWdlcy53aGVyZSgocmVjOiBUUGFnZVJlY29yZCkgPT4gcmVjLnJvbGUgPT09IFwicnNzaXRlbVwiICYmIHJlYy5saW5rID09PSBsaW5rICYmIHJlYy5maWxlLnBhdGggIT09IHBhdGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2V0IGEgdGFzayBsaXN0IGZvciBpdGVtcyB3aGljaCByZWZlciB0byB0aGUgc2FtZSBhcnRpY2xlLlxyXG4gICAgICogQHBhcmFtIGl0ZW0gUlNTIGl0ZW0gdG8gZ2V0IHRoZSBkdXBsaWNhdGVzIG9mXHJcbiAgICAgKiBAcmV0dXJucyBMaXN0IG9mIHJlYWRpbmcgdGFza3Mgb2YgdGhlIGR1cGxpY2F0ZSBpdGVtc1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIHJzc0R1cGxpY2F0ZUl0ZW1zVGFza3MoaXRlbTogVFBhZ2VSZWNvcmQpOiBQcm9taXNlPFRUYXNrUmVjb3Jkcz4ge1xyXG4gICAgICAgIGNvbnN0IGR1cGxpY2F0ZXMgPSBhd2FpdCB0aGlzLnJzc0R1cGxpY2F0ZUl0ZW1zKGl0ZW0pO1xyXG4gICAgICAgIHJldHVybiBkdXBsaWNhdGVzXHJcbiAgICAgICAgICAgIC5tYXAoKHJlYzogVFBhZ2VSZWNvcmQpOiBUVGFza1JlY29yZCB8IG51bGwgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgICAgICAgICBmZWVkID0gcmVjLmZlZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgcGlubmVkID0gcmVjLnBpbm5lZCA/IFwiIPCfk40gXCIgOiBcIiDwn5OMIFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhc2sgPSB0aGlzLml0ZW1SZWFkaW5nVGFzayhyZWMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhc2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXNrLnZpc3VhbCA9IGl0ZW0uZmlsZS5saW5rXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgcGlubmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgXCIqKuKIiCoqIFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICsgZmVlZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFzaztcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZXJlKCh0OiBUVGFza1JlY29yZCkgPT4gdCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcnNzSXRlbUhlYWRlcihpdGVtOiBUUGFnZVJlY29yZCkge1xyXG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XHJcbiAgICAgICAgICAgIHNob3dEdXBsaWNhdGVzOiB0cnVlLFxyXG4gICAgICAgICAgICBzaG93VGFnczogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKG9wdHMuc2hvd0R1cGxpY2F0ZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFza3MgPSBhd2FpdCB0aGlzLnJzc0R1cGxpY2F0ZUl0ZW1zVGFza3MoaXRlbSk7XHJcbiAgICAgICAgICAgIGlmICh0YXNrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR2LmhlYWRlcigxLCBcIuKaoCBPdGhlciBSU1MgaXRlbXMgYXJlIGFsc28gcmVmZXJyaW5nIHRvIHRoZSBzYW1lIGFydGljbGVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR2LnRhc2tMaXN0KHRhc2tzLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9wdHMuc2hvd1RhZ3MpIHtcclxuICAgICAgICAgICAgY29uc3QgdGFncyA9IERhdGFWaWV3SlNUb29scy5nZXRIYXNodGFnc0FzU3RyaW5nKGl0ZW0pXHJcbiAgICAgICAgICAgIGlmICh0YWdzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR2LnNwYW4odGFncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gI3JlZ2lvbiB0aGUgZ2VuZXJpYyBSU1MgY29sbGFwc2libGUgdGFibGVcclxuXHJcbiAgICAvKipcclxuICAgICogRXZlbnQgaGFuZGxlciByZW5kZXIgYSBkYXRhdmlldyB0YWJsZSBvbiBkZW1hbmQuXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBkdiBUaGUgZGF0YXZpZXcgb2JqZWN0XHJcbiAgICAqIEBwYXJhbSB7SFRNTERldGFpbHNFbGVtZW50fSBkZXRhaWxzIHRoZSBleHBhbmRhYmxlIGJsb2NrIGNvbnRhaW5pbmcgYSBkYXRhdmlldyB0YWJsZS5cclxuICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlbmRlclRhYmxlKGRldGFpbHM6IFRDb2xsYXBzaWJsZVRhYmxlQ29udGFpbmVyKSB7XHJcbiAgICAgICAgY29uc3QgeyB0YWJsZUhlYWRlciwgdGFibGVEYXRhLCB0YWJsZVJlbmRlcmVkIH0gPSBkZXRhaWxzO1xyXG4gICAgICAgIGlmIChkZXRhaWxzLm9wZW4gJiYgIXRhYmxlUmVuZGVyZWQgJiYgdGFibGVEYXRhKSB7XHJcbiAgICAgICAgICAgIGRldGFpbHMudGFibGVSZW5kZXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vIHRoZSBhcGkgZnVuY3Rpb25zIGFyZSBpbmRlZWQgYXN5bmMsIHNvIHdlIG5lZWQgdG8gYXdhaXQgdGhlbVxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmR2LmFwaS50YWJsZSh0YWJsZUhlYWRlciwgdGFibGVEYXRhLCBkZXRhaWxzLCB0aGlzLmR2LmNvbXBvbmVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBkZXRhaWxzLmxhc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxhc3Quc3R5bGUucGFkZGluZ0xlZnQgPSBcIjFlbVwiO1xyXG4gICAgICAgICAgICBsYXN0LnN0eWxlLmJvcmRlckxlZnRTdHlsZSA9IFwic29saWRcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYW4gZXhwYW5kYWJsZSBkYXRhdmlldyB0YWJsZSBvZiBwYWdlcy5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgdGFibGUgaXMgcmVuZGVyZWQgaW4gYSBjb2xsYXBzaWJsZSBgPGRldGFpbHM+YCBibG9jayBvbi1kZW1hbmQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGhlYWRlciBUaGUgdGFibGUgaGVhZGVyLlxyXG4gICAgICogQHBhcmFtIHJvd3MgVGhlIHRhYmxlIHJvd3MuXHJcbiAgICAgKiBAcGFyYW0gW2xhYmVsPVwiRmlsZXNcIl0gVGhlIGV4cGFuZGVyIGxhYmVsXHJcbiAgICAgKiBAcGFyYW0gW2V4cGFuZD1mYWxzZV0gYHVuZGVmaW5lZGAgcmVuZGVyIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBgdHJ1ZWAgcmVuZGVyIHRhYmxlIGltbWVkaWF0ZWx5IGFuZCBleHBhbmQgdGhlIHRhYmxlIGJ5IGRlZmF1bHQ7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYGZhbHNlYCB0byBjb2xsYXBzZSB0aGUgdGFibGUgYnkgZGVmYXVsdCBhbmQgcmVuZGVyIHRoZSB0YWJsZSBvbi1kZW1hbmQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgZXhwYW5kYWJsZVRhYmxlKGhlYWRlcjogc3RyaW5nW10sIHJvd3M6IGFueVtdW10sIGxhYmVsOiBzdHJpbmcgPSBcIkZpbGVzXCIsIGV4cGFuZDogVEV4cGFuZFN0YXRlID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYgKGV4cGFuZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHYudGFibGUoaGVhZGVyLCByb3dzKTsgLy8gcmVuZGVyIHRoZSB0YWJsZSBkaXJlY3RseSB3aXRoIGRhdGF2aWV3XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gcmVuZGVyIHRoZSB0YWJsZSBpbiBhIGNvbGxhcHNpYmxlIGA8ZGV0YWlscz5gIGJsb2NrXHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICBzdW1tYXJ5ID0gdGhpcy5kdi5lbChcInN1bW1hcnlcIiwgYCR7bGFiZWx9ICgke3Jvd3MubGVuZ3RofSlgKSxcclxuICAgICAgICAgICAgICAgIGRldGFpbHMgPSB0aGlzLmR2LmVsKFwiZGV0YWlsc1wiLCBzdW1tYXJ5KTtcclxuICAgICAgICAgICAgc3VtbWFyeS5zdHlsZS5jdXJzb3IgPSBcImRlZmF1bHRcIjtcclxuICAgICAgICAgICAgZGV0YWlscy5vcGVuID0gZXhwYW5kO1xyXG4gICAgICAgICAgICBkZXRhaWxzLnRhYmxlRGF0YSA9IHJvd3M7XHJcbiAgICAgICAgICAgIGRldGFpbHMudGFibGVIZWFkZXIgPSBoZWFkZXI7XHJcbiAgICAgICAgICAgIGlmIChkZXRhaWxzLm9wZW4pIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGFibGUoZGV0YWlscyk7IC8vIHJlbmRlciBvbmNlIG5vd1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29uZmlndXJlIHRoZSBvbi1kZW1hbmQgcmVuZGVyaW5nIG9mIHRoZSB0YWJsZVxyXG4gICAgICAgICAgICAgICAgZGV0YWlscy5hZGRFdmVudExpc3RlbmVyKFwidG9nZ2xlXCIsIGFzeW5jIChldnQ6IEV2ZW50KSA9PiBhd2FpdCB0aGlzLnJlbmRlclRhYmxlKGV2dC50YXJnZXQgYXMgVENvbGxhcHNpYmxlVGFibGVDb250YWluZXIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vICNlbmRyZWdpb24gdGhlIGdlbmVyaWMgUlNTIGNvbGxhcHNpYmxlIHRhYmxlXHJcblxyXG4gICAgLy8gI3JlZ2lvbiBzcGVjaWZpYyBSU1MgY29sbGFwc2libGUgdGFibGVzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWFkZXJzIGZvciBSU1MgcmVsYXRlZCB0YWJsZXMuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIFRBQkxFX0hFQURFUiA9IHtcclxuICAgICAgICByc3NDb2xsZWN0aW9uOiBbXCJDb2xsZWN0aW9uXCIsIFwiSGVhZGxpbmVcIl0sXHJcbiAgICAgICAgcnNzVG9waWM6IFtcIlRvcGljXCIsIFwiSGVhZGxpbmVcIl0sXHJcbiAgICAgICAgcnNzRmVlZDogW1wiRmVlZFwiLCBcIlN0YXR1c1wiLCBcIlRhZ3NcIiwgXCJVcGRhdGVkXCJdLFxyXG4gICAgICAgIHJzc0ZlZWREYXNoYm9hcmQ6IFtcIkZlZWRcIiwgXCJTdGF0dXNcIiwgXCJUYWdzXCIsIFwiQ29sbGVjdGlvbnNcIiwgXCJVcGRhdGVkXCJdLFxyXG4gICAgICAgIHJzc0l0ZW06IFtcIkl0ZW1cIiwgXCJUYWdzXCIsIFwiUHVibGlzaGVkXCJdXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSB0YWJsZSBvZiBSU1MgY29sbGVjdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb25zIExpc3Qgb2YgUlNTIGNvbGxlY3Rpb24gcGFnZXMuXHJcbiAgICAgKiBAcGFyYW0gW2V4cGFuZD1mYWxzZV0gYHVuZGVmaW5lZGAgcmVuZGVyIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBgdHJ1ZWAgcmVuZGVyIHRhYmxlIGltbWVkaWF0ZWx5IGFuZCBleHBhbmQgdGhlIHRhYmxlIGJ5IGRlZmF1bHQ7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYGZhbHNlYCB0byBjb2xsYXBzZSB0aGUgdGFibGUgYnkgZGVmYXVsdCBhbmQgcmVuZGVyIHRoZSB0YWJsZSBvbi1kZW1hbmQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJzc0NvbGxlY3Rpb25UYWJsZShjb2xsZWN0aW9uczogVFBhZ2VSZWNvcmRzLCBleHBhbmQ6IFRFeHBhbmRTdGF0ZSA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGNvbnN0IHJvd3MgPSBjb2xsZWN0aW9uc1xyXG4gICAgICAgICAgICAuc29ydCgoYzogVFBhZ2VSZWNvcmQpID0+IGMuZmlsZS5uYW1lLCBcImFzY1wiKVxyXG4gICAgICAgICAgICAubWFwKChjOiBUUGFnZVJlY29yZCkgPT4gW2MuZmlsZS5saW5rLCBjLmhlYWRsaW5lXSk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5leHBhbmRhYmxlVGFibGUoRGF0YVZpZXdKU1Rvb2xzLlRBQkxFX0hFQURFUi5yc3NDb2xsZWN0aW9uLCByb3dzLCBcIkNvbGxlY3Rpb25zXCIsIGV4cGFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSB0YWJsZSBvZiBSU1MgdG9waWNzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0b3BpY3MgTGlzdCBvZiBSU1MgdG9waWMgcGFnZXMuXHJcbiAgICAgKiBAcGFyYW0gW2V4cGFuZD1mYWxzZV0gYHVuZGVmaW5lZGAgcmVuZGVyIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBgdHJ1ZWAgcmVuZGVyIHRhYmxlIGltbWVkaWF0ZWx5IGFuZCBleHBhbmQgdGhlIHRhYmxlIGJ5IGRlZmF1bHQ7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYGZhbHNlYCB0byBjb2xsYXBzZSB0aGUgdGFibGUgYnkgZGVmYXVsdCBhbmQgcmVuZGVyIHRoZSB0YWJsZSBvbi1kZW1hbmQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJzc1RvcGljVGFibGUodG9waWNzOiBUUGFnZVJlY29yZHMsIGV4cGFuZDogVEV4cGFuZFN0YXRlID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3Qgcm93cyA9IHRvcGljc1xyXG4gICAgICAgICAgICAuc29ydCgodDogVFBhZ2VSZWNvcmQpID0+IHQuZmlsZS5uYW1lLCBcImFzY1wiKVxyXG4gICAgICAgICAgICAubWFwKCh0OiBUUGFnZVJlY29yZCkgPT4gW3QuZmlsZS5saW5rLCB0LmhlYWRsaW5lXSk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5leHBhbmRhYmxlVGFibGUoRGF0YVZpZXdKU1Rvb2xzLlRBQkxFX0hFQURFUi5yc3NUb3BpYywgcm93cywgXCJUb3BpY3NcIiwgZXhwYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIHRhYmxlIG9mIFJTUyBmZWVkcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZmVlZHMgY29sbGVjaW9uIG9mIFJTUyBmZWVkc1xyXG4gICAgICogQHBhcmFtIFtleHBhbmQ9ZmFsc2VdIGB1bmRlZmluZWRgIHJlbmRlciBpbW1lZGlhdGVseSB1c2luZyBhIGdlbmVyaWMgZGF0YXZpZXcgdGFibGU7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYHRydWVgIHJlbmRlciB0YWJsZSBpbW1lZGlhdGVseSBhbmQgZXhwYW5kIHRoZSB0YWJsZSBieSBkZWZhdWx0O1xyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgIGBmYWxzZWAgdG8gY29sbGFwc2UgdGhlIHRhYmxlIGJ5IGRlZmF1bHQgYW5kIHJlbmRlciB0aGUgdGFibGUgb24tZGVtYW5kLlxyXG4gICAgICovXHJcbiAgICBhc3luYyByc3NGZWVkVGFibGUoZmVlZHM6IFRQYWdlUmVjb3JkcywgZXhwYW5kOiBURXhwYW5kU3RhdGUgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCByb3dzID0gZmVlZHNcclxuICAgICAgICAgICAgLnNvcnQoKHQ6IFRQYWdlUmVjb3JkKSA9PiB0LmZpbGUubmFtZSwgXCJhc2NcIilcclxuICAgICAgICAgICAgLm1hcCgoZjogVFBhZ2VSZWNvcmQpID0+IFtcclxuICAgICAgICAgICAgICAgIGYuZmlsZS5saW5rLFxyXG4gICAgICAgICAgICAgICAgZi5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICBEYXRhVmlld0pTVG9vbHMuZ2V0SGFzaHRhZ3NBc1N0cmluZyhmKSxcclxuICAgICAgICAgICAgICAgIGYudXBkYXRlZFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICBhd2FpdCB0aGlzLmV4cGFuZGFibGVUYWJsZShEYXRhVmlld0pTVG9vbHMuVEFCTEVfSEVBREVSLnJzc0ZlZWQsIHJvd3MsIFwiRmVlZHNcIiwgZXhwYW5kKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIGRhc2hib2FyZCB0YWJsZSBvZiBSU1MgZmVlZHMgLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBmZWVkcyBMaXN0IG9mIFJTUyBmZWVkc1xyXG4gICAgICogQHBhcmFtIFtleHBhbmQ9ZmFsc2VdIGB1bmRlZmluZWRgIHJlbmRlciBpbW1lZGlhdGVseSB1c2luZyBhIGdlbmVyaWMgZGF0YXZpZXcgdGFibGU7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYHRydWVgIHJlbmRlciB0YWJsZSBpbW1lZGlhdGVseSBhbmQgZXhwYW5kIHRoZSB0YWJsZSBieSBkZWZhdWx0O1xyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgIGBmYWxzZWAgdG8gY29sbGFwc2UgdGhlIHRhYmxlIGJ5IGRlZmF1bHQgYW5kIHJlbmRlciB0aGUgdGFibGUgb24tZGVtYW5kLlxyXG4gICAgICovXHJcbiAgICBhc3luYyByc3NGZWVkRGFzaGJvYXJkKGZlZWRzOiBUUGFnZVJlY29yZHMsIGV4cGFuZDogVEV4cGFuZFN0YXRlID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgZmVlZHNUb0NvbGxlY3Rpb25zID0gbmV3IE1hcDxzdHJpbmcsIFRQYWdlUmVjb3JkW10+KCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb2xsZWN0aW9uIG9mIHRoaXMucnNzQ29sbGVjdGlvbnMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBmZWVkIG9mIHRoaXMucnNzRmVlZHNPZkNvbGxlY3Rpb24oY29sbGVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjTGlzdCA9IGZlZWRzVG9Db2xsZWN0aW9ucy5nZXQoZmVlZC5maWxlLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNMaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZmVlZHNUb0NvbGxlY3Rpb25zLnNldChmZWVkLmZpbGUucGF0aCwgY0xpc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY0xpc3QucHVzaChjb2xsZWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByb3dzID0gZmVlZHNcclxuICAgICAgICAgICAgLnNvcnQoKGY6IFRQYWdlUmVjb3JkKSA9PiBmLmZpbGUubmFtZSwgXCJhc2NcIilcclxuICAgICAgICAgICAgLm1hcCgoZjogVFBhZ2VSZWNvcmQpID0+IFtcclxuICAgICAgICAgICAgICAgIGYuZmlsZS5saW5rLFxyXG4gICAgICAgICAgICAgICAgZi5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICBEYXRhVmlld0pTVG9vbHMuZ2V0SGFzaHRhZ3NBc1N0cmluZyhmKSxcclxuICAgICAgICAgICAgICAgIGZlZWRzVG9Db2xsZWN0aW9ucy5nZXQoZi5maWxlLnBhdGgpPy5tYXAoKGM6IFRQYWdlUmVjb3JkKSA9PiBjLmZpbGUubGluaykuam9pbihcIiBcIiksXHJcbiAgICAgICAgICAgICAgICBmLnVwZGF0ZWRcclxuICAgICAgICAgICAgXSk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5leHBhbmRhYmxlVGFibGUoRGF0YVZpZXdKU1Rvb2xzLlRBQkxFX0hFQURFUi5yc3NGZWVkRGFzaGJvYXJkLCByb3dzLCBcIkZlZWRzXCIsIGV4cGFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSB0YWJsZSBvZiBSU1MgaXRlbXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIEEgY29sbGVjdGlvbiBvZiBSU1MgaXRlbXMuXHJcbiAgICAgKiBAcGFyYW0gW2V4cGFuZD1mYWxzZV0gYHVuZGVmaW5lZGAgcmVuZGVyIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBgdHJ1ZWAgcmVuZGVyIHRhYmxlIGltbWVkaWF0ZWx5IGFuZCBleHBhbmQgdGhlIHRhYmxlIGJ5IGRlZmF1bHQ7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYGZhbHNlYCB0byBjb2xsYXBzZSB0aGUgdGFibGUgYnkgZGVmYXVsdCBhbmQgcmVuZGVyIHRoZSB0YWJsZSBvbi1kZW1hbmQuXHJcbiAgICAgKiBAcGFyYW0gW2xhYmVsPVwiSXRlbXNcIl0gVGhlIGxhYmVsIGZvciB0aGUgZXhwYW5kZXIgY29udHJvbC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgcnNzSXRlbVRhYmxlKGl0ZW1zOiBUUGFnZVJlY29yZHMsIGV4cGFuZDogVEV4cGFuZFN0YXRlID0gdW5kZWZpbmVkLCBsYWJlbDogc3RyaW5nID0gXCJJdGVtc1wiKSB7XHJcbiAgICAgICAgY29uc3Qgcm93cyA9IGl0ZW1zXHJcbiAgICAgICAgICAgIC5zb3J0KChpOiBUUGFnZVJlY29yZCkgPT4gaS5maWxlLm5hbWUsIFwiYXNjXCIpXHJcbiAgICAgICAgICAgIC5tYXAoKGk6IFRQYWdlUmVjb3JkKSA9PiBbaS5maWxlLmxpbmssIERhdGFWaWV3SlNUb29scy5nZXRIYXNodGFnc0FzU3RyaW5nKGkpLCBpLnB1Ymxpc2hlZF0pO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZXhwYW5kYWJsZVRhYmxlKERhdGFWaWV3SlNUb29scy5UQUJMRV9IRUFERVIucnNzSXRlbSwgcm93cywgbGFiZWwsIGV4cGFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW5kZXIgYSB0YWJsZSBvZiBSU1MgaXRlbXMgZ3JvdXBlZCBieSBmZWVkLlxyXG4gICAgICpcclxuICAgICAqICoqTm90ZSoqVGhlIGV4cGFuZGVyIGNvbnRyb2wgaXMgbGFiZWxlZCB3aXRoIHRoZSBmZWVkIG5hbWUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIEEgY29sbGVjdGlvbiBvZiBSU1MgaXRlbXMuXHJcbiAgICAgKiBAcGFyYW0gW2V4cGFuZD1mYWxzZV0gYHVuZGVmaW5lZGAgcmVuZGVyIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICBgdHJ1ZWAgcmVuZGVyIHRhYmxlIGltbWVkaWF0ZWx5IGFuZCBleHBhbmQgdGhlIHRhYmxlIGJ5IGRlZmF1bHQ7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYGZhbHNlYCB0byBjb2xsYXBzZSB0aGUgdGFibGUgYnkgZGVmYXVsdCBhbmQgcmVuZGVyIHRoZSB0YWJsZSBvbi1kZW1hbmQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJzc0l0ZW1UYWJsZUJ5RmVlZChpdGVtczogVFBhZ2VSZWNvcmRzLCBleHBhbmQ6IFRFeHBhbmRTdGF0ZSA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGlmIChpdGVtcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5kdi5wYXJhZ3JhcGgoXCLim5RcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGdyb3VwcyA9IGl0ZW1zXHJcbiAgICAgICAgICAgIC5ncm91cEJ5KChpOiBUUGFnZVJlY29yZCkgPT4gaS5mZWVkKVxyXG4gICAgICAgICAgICAuc29ydCgoZzogYW55KSA9PiBnLmtleSwgXCJhc2NcIik7XHJcbiAgICAgICAgZm9yIChjb25zdCBncm91cCBvZiBncm91cHMpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5yc3NJdGVtVGFibGUoZ3JvdXAucm93cywgZXhwYW5kLCBncm91cC5rZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vICNlbmRyZWdpb24gc3BlY2lmaWMgUlNTIGNvbGxhcHNpYmxlIHRhYmxlc1xyXG5cclxuICAgIC8vICNyZWdpb24gcmVhZGluZyBsaXN0c1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogT24tZGVtYW5kIHJlbmRlcmluZyBvZiBhIHRhc2sgbGlzdCBvbiBleHBhbnNpb24gb2YgYSAnZGV0YWlscycgZWxlbWVudC5cclxuICAgICAqXHJcbiAgICAgKiBVc2VkIGJ5IHtAbGluayByc3NUYXNrTGlzdH0gdG8gcmVuZGVyIGEgdGFzayBsaXN0IG9uLWRlbWFuZCxcclxuICAgICAqIHRoZSBmaXJzdCB0aW1lIHRoZSBgPGRldGFpbHM+YCBibG9jayBpcyBleHBhbmRlZC5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgYDxkZXRhaWxzPmAgZWxlbWVudCBpcyBleHBlY3RlZCB0byBiZSBkZWNvcmF0ZWQgd2l0aCBhIGByZWFkaW5nTGlzdGAgcHJvcGVydHkgd2hpY2ggaG9sZHNcclxuICAgICAqIGEge0BsaW5rIFRUYXNrUmVjb3Jkc30gb2JqZWN0IHRoYXQgcHJvdmlkZXMgdGhlIGRhdGEgZm9yIGEgZGF0YXZpZXcgYHRhc2tMaXN0YC5cclxuICAgICAqIFRoZSB0YXNrIGxpc3QgaXMgcmVuZGVyZWQgdGhlIGZpcnN0IHRpbWUgdGhlIGA8ZGV0YWlscz5gIGJsb2NrIGlzIGV4cGFuZGVkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZXRhaWxzIFRoZSBgPGRldGFpbHM+YCBIVE1MIGJsb2NrIGVsZW1lbnQgY29udGFpbmluZyBhIGNvbGxhcHNpYmxlIHRhc2sgbGlzdC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyByZW5kZXJUYXNrTGlzdChkZXRhaWxzOiBUQ29sbGFwc2libGVUYXNrTGlzdCkge1xyXG4gICAgICAgIGNvbnN0IHsgcmVhZGluZ0xpc3QsIHJlYWRpbmdMaXN0UmVuZGVyZWQgfSA9IGRldGFpbHM7XHJcbiAgICAgICAgaWYgKGRldGFpbHMub3BlbiAmJiAhcmVhZGluZ0xpc3RSZW5kZXJlZCAmJiByZWFkaW5nTGlzdCkge1xyXG4gICAgICAgICAgICBkZXRhaWxzLnJlYWRpbmdMaXN0UmVuZGVyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmR2LmFwaS50YXNrTGlzdChyZWFkaW5nTGlzdCwgZmFsc2UsIGRldGFpbHMsIHRoaXMuZHYuY29tcG9uZW50KTtcclxuICAgICAgICAgICAgY29uc3QgbGFzdCA9IGRldGFpbHMubGFzdEVsZW1lbnRDaGlsZCBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgbGFzdC5zdHlsZS5wYWRkaW5nTGVmdCA9IFwiMWVtXCI7XHJcbiAgICAgICAgICAgIGxhc3Quc3R5bGUuYm9yZGVyTGVmdFN0eWxlID0gXCJzb2xpZFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBhIGxpc3Qgb2YgcmVhZGluZyB0YXNrcyBvbi1kZW1hbmQgaW4gYSBjb2xsYXBzaWJsZSBibG9jay5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdGFza3MgVGhlIGxpc3Qgb2YgcmVhZGluZyB0YXNrcyB0byByZW5kZXIuXHJcbiAgICAgKiBAcGFyYW0gZXhwYW5kIGB1bmRlZmluZWRgIHJlbmRlciBpbW1lZGlhdGVseSB1c2luZyBhIGdlbmVyaWMgZGF0YXZpZXcgdGFibGU7XHJcbiAgICAgKiAgICAgICAgICAgICAgIGB0cnVlYCByZW5kZXIgdGFibGUgaW1tZWRpYXRlbHkgYW5kIGV4cGFuZCB0aGUgdGFibGUgYnkgZGVmYXVsdDtcclxuICAgICAqICAgICAgICAgICAgICAgYGZhbHNlYCB0byBjb2xsYXBzZSB0aGUgdGFibGUgYnkgZGVmYXVsdCBhbmQgcmVuZGVyIHRoZSB0YWJsZSBvbi1kZW1hbmQuXHJcbiAgICAgKiBAcGFyYW0gW2hlYWRlcj1cIkl0ZW1zXCJdIFRoZSBoZWFkZXIgdGV4dCBmb3IgdGhlIGV4cGFuZGVyIGNvbnRyb2wuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgcnNzVGFza0xpc3QodGFza3M6IFRUYXNrUmVjb3JkcywgZXhwYW5kOiBib29sZWFuLCBoZWFkZXI6IHN0cmluZyA9IFwiSXRlbXNcIikge1xyXG4gICAgICAgIGlmICh0YXNrcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICBzdW1tYXJ5ID0gdGhpcy5kdi5lbChcInN1bW1hcnlcIiwgYCR7aGVhZGVyfSAoJHt0YXNrcy5sZW5ndGh9KWApLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlscyA9IHRoaXMuZHYuZWwoXCJkZXRhaWxzXCIsIHN1bW1hcnkpIGFzIFRDb2xsYXBzaWJsZVRhc2tMaXN0O1xyXG4gICAgICAgICAgICAoc3VtbWFyeSBhcyBIVE1MRWxlbWVudCkuc3R5bGUuY3Vyc29yID0gXCJkZWZhdWx0XCI7XHJcbiAgICAgICAgICAgIGRldGFpbHMub3BlbiA9IGV4cGFuZDtcclxuICAgICAgICAgICAgZGV0YWlscy5yZWFkaW5nTGlzdCA9IHRhc2tzO1xyXG4gICAgICAgICAgICBpZiAoZXhwYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlbmRlclRhc2tMaXN0KGRldGFpbHMpOyAvLyByZW5kZXIgb25jZSBub3dcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbmZpZ3VyZSB0aGUgZGVsYXllZCByZW5kZXJpbmcgb2YgdGhlIHJlYWRpbmcgdGFza3NcclxuICAgICAgICAgICAgICAgIGRldGFpbHMuYWRkRXZlbnRMaXN0ZW5lcihcInRvZ2dsZVwiLCBhc3luYyAoZXZ0OiBFdmVudCkgPT4gdGhpcy5yZW5kZXJUYXNrTGlzdChldnQudGFyZ2V0IGFzIFRDb2xsYXBzaWJsZVRhc2tMaXN0KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmR2LnBhcmFncmFwaChcIuKblFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBjb2xsYXBzaWJsZSBsaXN0IG9mIHJlYWRpbmcgdGFza3Mgd2l0aCBvbi1kZW1hbmQgcmVuZGVyaW5nLlxyXG4gICAgICpcclxuICAgICAqIElmIHRoZSBnaXZlbiBmZWVkIGhhcyBubyByZWFkaW5nIHRhc2tzIHdoaWNoIGhhdmUgdGhlIHN0YXRlIG1hdGNoaW5nIHRoZVxyXG4gICAgICogYHJlYWRgIHBhcmFtZXRlciwgbm8gVUkgaXMgZ2VuZXJhdGVkLlxyXG4gICAgICogQHBhcmFtIGl0ZW1zIFRoZSBSU1MgaXRlbXMgdG8gZ2V0IHRoZSByZWFkaW5nIHRhc2tzIGZyb21cclxuICAgICAqIEBwYXJhbSByZWFkIGBmYWxzZWAgdG8gY29sbGVjdCB1bmNoZWNrZWQgKHVucmVhZCkgcmVhZGluZyB0YXNrczsgYHRydWVgIG90aGVyd2lzZS5cclxuICAgICAqIEBwYXJhbSBleHBhbmQgYHVuZGVmaW5lZGAgcmVuZGVyIGltbWVkaWF0ZWx5IHVzaW5nIGEgZ2VuZXJpYyBkYXRhdmlldyB0YWJsZTtcclxuICAgICAqICAgICAgICAgICAgICAgYHRydWVgIHJlbmRlciB0YWJsZSBpbW1lZGlhdGVseSBhbmQgZXhwYW5kIHRoZSB0YWJsZSBieSBkZWZhdWx0O1xyXG4gICAgICogICAgICAgICAgICAgICBgZmFsc2VgIHRvIGNvbGxhcHNlIHRoZSB0YWJsZSBieSBkZWZhdWx0IGFuZCByZW5kZXIgdGhlIHRhYmxlIG9uLWRlbWFuZC5cclxuICAgICAqIEBwYXJhbSBbaGVhZGVyPVwiSXRlbXNcIl0gT3B0aW9uYWwgaGVhZGVyIHRleHQgdG8gZGlzcGxheSBmb3IgdGhlIGV4cGFuZGVyIGNvbnRyb2wuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJzc1JlYWRpbmdMaXN0KGl0ZW1zOiBUUGFnZVJlY29yZHMsIHJlYWQ6IGJvb2xlYW4sIGV4cGFuZDogYm9vbGVhbiwgaGVhZGVyOiBzdHJpbmcgPSBcIkl0ZW1zXCIpIHtcclxuICAgICAgICBjb25zdCB0YXNrczogVFRhc2tSZWNvcmRzID0gdGhpcy5yc3NSZWFkaW5nVGFza3MoaXRlbXMsIHJlYWQpO1xyXG4gICAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5kdi5wYXJhZ3JhcGgoXCLim5RcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMucnNzVGFza0xpc3QodGFza3MsIGV4cGFuZCwgaGVhZGVyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheSBjb2xsYXBzaWJsZSByZWFkaW5nIHRhc2tzIGdyb3VwZWQgYnkgZmVlZC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZmVlZHMgQ29sbGVjdGlvbiBvZiBmZWVkc1xyXG4gICAgICogQHBhcmFtIHJlYWQgYGZhbHNlYCB0byBjb2xsZWN0IGFuZCBkaXNwbGF5IHVuY2hlY2tlZCAodW5yZWFkKSByZWFkaW5nIHRhc2tzOiBgdHJ1ZWAgb3RoZXJ3aXNlLlxyXG4gICAgICogQHBhcmFtIFtleHBhbmQ9ZmFsc2VdIGB1bmRlZmluZWRgIHJlbmRlciBpbW1lZGlhdGVseSB1c2luZyBhIGdlbmVyaWMgZGF0YXZpZXcgdGFibGU7XHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgYHRydWVgIHJlbmRlciB0YWJsZSBpbW1lZGlhdGVseSBhbmQgZXhwYW5kIHRoZSB0YWJsZSBieSBkZWZhdWx0O1xyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgIGBmYWxzZWAgdG8gY29sbGFwc2UgdGhlIHRhYmxlIGJ5IGRlZmF1bHQgYW5kIHJlbmRlciB0aGUgdGFibGUgb24tZGVtYW5kLlxyXG4gICAgICovXHJcbiAgICBhc3luYyByc3NSZWFkaW5nTGlzdEJ5RmVlZChpdGVtczogVFBhZ2VSZWNvcmRzLCByZWFkOiBib29sZWFuID0gZmFsc2UsIGV4cGFuZCA9IGZhbHNlKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBzID0gaXRlbXNcclxuICAgICAgICAgICAgLmdyb3VwQnkoKGk6IFRQYWdlUmVjb3JkKSA9PiBpLmZlZWQpXHJcbiAgICAgICAgICAgIC5zb3J0KChnOiBhbnkpID0+IGcua2V5LCBcImFzY1wiKTtcclxuICAgICAgICBsZXQgdG90YWxUYXNrcyA9IDA7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgZ3JvdXBzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhc2tzOiBUVGFza1JlY29yZHMgPSB0aGlzLnJzc1JlYWRpbmdUYXNrcyhncm91cC5yb3dzLCByZWFkKTtcclxuICAgICAgICAgICAgaWYgKHRhc2tzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsVGFza3MgKz0gdGFza3MubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yc3NUYXNrTGlzdCh0YXNrcywgZXhwYW5kLCBncm91cC5rZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0b3RhbFRhc2tzID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHYucGFyYWdyYXBoKFwi4puUXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vICNlbmRyZWdpb24gcmVhZGluZyBsaXN0c1xyXG59Il19