import { __awaiter } from "tslib";
import { TFile, normalizePath, htmlToMarkdown } from 'obsidian';
import * as path from "path";
import { MediumType } from "./FeedAssembler";
import { HTMLxlate, formatImage } from "./HTMLxlate";
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
class RSSAdapter {
    constructor(plugin, file, frontmatter) {
        var _a;
        this.plugin = plugin;
        this.frontmatter = frontmatter !== null && frontmatter !== void 0 ? frontmatter : ((_a = plugin.app.metadataCache.getFileCache(file)) !== null && _a !== void 0 ? _a : {});
        this.file = file;
    }
    static toPlaintags(hashtags) {
        return hashtags ? hashtags.map(h => h.replace(/^#*/, "")) : [];
    }
    get tags() {
        return RSSAdapter.toPlaintags(this.frontmatter.tags);
    }
    get filemgr() {
        return this.plugin.filemgr;
    }
    /**
     * Commit all pending frontmatter changes.
     */
    commitFrontmatterChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.plugin.app.fileManager.processFrontMatter(this.file, fm => {
                for (const name in this.frontmatter) {
                    const thisValue = this.frontmatter[name];
                    if (fm[name] !== thisValue) {
                        fm[name] = thisValue;
                    }
                }
            });
        });
    }
}
/**
 * The adapter to an RSS item.
 */
export class RSSitemAdapter extends RSSAdapter {
    constructor(plugin, file, frontmatter) {
        super(plugin, file, frontmatter);
    }
    /**
     * **Note**. This property can only be changed by the user.
     * @returns `true` if the item is pinned and will not be deleted; `false` otherwise.
     */
    get pinned() {
        return this.frontmatter.pinned === true;
    }
    set feed(value) {
        this.frontmatter.feed = `[[${value}]]`;
    }
    /**
     * Get the date the article described by this item was published.
     * @returns the date published in millisecondes since Jan 1st, 1970,
     */
    get published() {
        var _a;
        return (_a = new Date(this.frontmatter.published).valueOf()) !== null && _a !== void 0 ? _a : new Date().valueOf();
    }
    /**
     * The article link.
     *
     * @return the hyperlink to the original article.
     */
    get link() {
        return this.frontmatter.link;
    }
    /**
     * THe unique id of this item
     * @return A unique item identifier,
     */
    get id() {
        var _a;
        return (_a = this.frontmatter.id) !== null && _a !== void 0 ? _a : this.link;
    }
    set tags(value) {
        const tagmgr = this.plugin.tagmgr;
        this.frontmatter.tags = value.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1));
    }
    completeReadingTask() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.plugin.app, vault = app.vault, tasks = (_b = (_a = app.metadataCache.getFileCache(this.file)) === null || _a === void 0 ? void 0 : _a.listItems) === null || _b === void 0 ? void 0 : _b.filter((li) => li.task === " "), first = tasks === null || tasks === void 0 ? void 0 : tasks.first();
            if (first) {
                const data = yield vault.read(this.file), s = first.position.start.offset, e = first.position.end.offset, newdata = data.substring(0, s) + "- [x]" + data.substring(s + 5);
                yield vault.modify(this.file, newdata);
                return true;
            }
            return false;
        });
    }
    /**
     * Factory methos to create a new instance of an RSS item
     * @param item the parse item of an RSS feed.
     * @param feed The feed this item is a part of
     * @returns A new instance of a RSS item file adapter.
     */
    static create(item, feed) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, tags, title, link, description, published, author, image, content } = item;
            const html = HTMLxlate.instance;
            if (description) {
                description = html.fragmentAsMarkdown(description);
                if (!image) {
                    // attempt to find an image in the item description
                    const match = description.match(RSSitemAdapter.EMBEDDING_MATCHER);
                    if (match && match.index !== undefined) {
                        image = {
                            src: match[1],
                            type: MediumType.Image
                        };
                        // remove the image from the description
                        description = description.slice(0, match.index) + description.slice(match.index + match[0].length);
                    }
                }
            }
            if (content) {
                content = html.fragmentAsMarkdown(content);
                if (!image) {
                    // attempt to find an image in the item content
                    const match = content.match(RSSitemAdapter.EMBEDDING_MATCHER);
                    if (match) {
                        image = {
                            src: match[1],
                            type: MediumType.Image
                        };
                    }
                }
            }
            const byline = author ? ` by ${author}` : "";
            title = `${title}${byline} - ${published}`;
            const abstractMaxLength = 800;
            if (!content && description && description.length > abstractMaxLength) {
                content = description;
            }
            const defaultImage = yield feed.plugin.settings.getRssDefaultImagePath();
            if (description) {
                // truncate description
                const teaser = (description.length > abstractMaxLength ? (description.substring(0, abstractMaxLength) + "⋯") : description);
                description = teaser.replaceAll("\n", "\n> ");
            }
            // fill in the template
            const itemfolder = yield feed.itemFolder(), tagmgr = feed.plugin.tagmgr, frontmatter = {
                role: "rssitem",
                id: '"' + (id !== null && id !== void 0 ? id : link) + '"',
                author: author ? ('"' + author + '"') : "Unknown",
                link: link !== null && link !== void 0 ? link : "",
                published: published !== null && published !== void 0 ? published : new Date().valueOf(),
                feed: `[[${itemfolder.name}]]`,
                pinned: false,
                tags: tags.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1)),
            }, dataMap = {
                "{{id}}": frontmatter.id,
                "{{author}}": frontmatter.author,
                "{{link}}": frontmatter.link,
                "{{publishDate}}": frontmatter.published,
                "{{tags}}": frontmatter.tags,
                "{{title}}": title !== null && title !== void 0 ? title : "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|float:right|100x100]]`,
                "{{description}}": description !== null && description !== void 0 ? description : "",
                "{{content}}": content !== null && content !== void 0 ? content : "",
                "{{feedFileName}}": itemfolder.name,
            };
            const file = yield feed.filemgr.createFile(itemfolder.path, item.fileName, "RSS Item", dataMap, true), adapter = new RSSitemAdapter(feed.plugin, file, frontmatter);
            return adapter;
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.plugin.app.vault.delete(this.file);
        });
    }
}
RSSitemAdapter.EMBEDDING_MATCHER = /!\[[^\]]*\]\(([^\)]+)\)\s*/;
export class RSSfeedAdapter extends RSSAdapter {
    constructor(plugin, feed, frontmatter) {
        var _a;
        super(plugin, feed, frontmatter);
        this._folder = (_a = feed.vault.getFolderByPath(this.itemFolderPath)) !== null && _a !== void 0 ? _a : undefined;
    }
    static create(plugin, feed) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, site, description } = feed, defaultImage = yield plugin.settings.getRssDefaultImagePath(), image = feed.image, frontmatter = {
                role: "rssfeed",
                feedurl: feed.source,
                site: site !== null && site !== void 0 ? site : "Unknown",
                itemlimit: plugin.settings.defaultItemLimit,
                tags: [],
            }, dataMap = {
                "{{feedUrl}}": frontmatter.feedurl,
                "{{siteUrl}}": frontmatter.site,
                "{{title}}": htmlToMarkdown(title !== null && title !== void 0 ? title : ""),
                "{{description}}": description ? htmlToMarkdown(description) : "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|float:right|100x100]]`
            };
            // create the feed dashboard file
            const filemgr = plugin.filemgr, dashboard = yield filemgr.createFile(plugin.settings.rssFeedFolderPath, feed.fileName, "RSS Feed", dataMap, true), adapter = new RSSfeedAdapter(plugin, dashboard, frontmatter);
            try {
                yield adapter.update(feed);
            }
            catch (err) {
                console.error(err);
                adapter.error = err.message;
            }
            yield adapter.commitFrontmatterChanges();
            return adapter;
        });
    }
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
    get status() {
        var _a;
        return (_a = this.frontmatter.status) !== null && _a !== void 0 ? _a : '"?"';
    }
    set status(value) {
        this.frontmatter.status = value;
    }
    /**
     * Get the feed update interval.
     * @returns the feed update interval in hours.
     */
    get interval() {
        var _a;
        return parseInt((_a = this.frontmatter.interval) !== null && _a !== void 0 ? _a : 1);
    }
    /**
     * Set the feed update interval
     * @param value the update interval in hours,
     */
    set interval(value) {
        this.frontmatter.interval = value;
    }
    /**
     * The timestamp when the feed was last updated.
     * @return the time in milliseconds since Jan 1st 1970.
     */
    get updated() {
        return new Date(this.frontmatter.updated).valueOf();
    }
    set updated(value) {
        this.frontmatter.updated = new Date(value);
    }
    /**
     * Get the link to the rss feed
     * @returns hyperlink to the RSS feed.
     */
    get feedurl() {
        return this.frontmatter.feedurl;
    }
    get itemlimit() {
        var _a;
        return parseInt((_a = this.frontmatter.itemlimit) !== null && _a !== void 0 ? _a : 100);
    }
    set itemlimit(value) {
        this.frontmatter.itemlimit = value;
    }
    /**
     * Get the fedd suspension state.
     * @returns `true` if feed updates are suspended, `false` otherwise.
     */
    get suspended() {
        var _a, _b;
        return (_b = (_a = this.frontmatter.status) === null || _a === void 0 ? void 0 : _a.startsWith(RSSfeedAdapter.SUSPENDED_STATUS_ICON)) !== null && _b !== void 0 ? _b : false;
    }
    set suspended(value) {
        if (value) {
            this.status = RSSfeedAdapter.SUSPENDED_STATUS_ICON + "suspended";
        }
        else {
            this.status = RSSfeedAdapter.RESUMED_STATUS_ICON + "resumed updates";
        }
    }
    set error(message) {
        this.status = RSSfeedAdapter.ERROR_STATUS_ICON + message;
    }
    get itemFolderPath() {
        var _a, _b;
        return normalizePath(path.join((_b = (_a = this.file.parent) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : "", this.file.basename));
    }
    itemFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.filemgr.ensureFolderExists(this.itemFolderPath);
        });
    }
    /**
     * Get all items in this RSS feed currently in Obsidian.
     * @return proxies for all RSS items in an RSS feed.
     */
    get items() {
        return this._folder ? this._folder.children
            .map((c) => (c instanceof TFile && c.extension === "md") ? this.filemgr.getAdapter(c) : undefined)
            .filter(p => p instanceof RSSitemAdapter) : [];
    }
    rename(newBasename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newBasename) {
                return false;
            }
            const vault = this.plugin.app.vault, itemFolder = yield this.itemFolder(), items = this.items, newPath = this.plugin.settings.rssFeedFolderPath + "/" + newBasename;
            console.log(`${this.file.basename} -> ${newBasename}`);
            // relink to new feed in all items
            items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                item.feed = newBasename;
                item.commitFrontmatterChanges();
            }));
            yield vault.rename(this.file, newPath + ".md");
            yield vault.rename(itemFolder, newPath);
            return true;
        });
    }
    /**
     * Update the RSS feed.
     *
     * @param feed the adapter of the feed to update.
     * @returns the number of new items
     */
    update(feed) {
        return __awaiter(this, void 0, void 0, function* () {
            // build a map of RSS items already existing in the feed folder
            const oldItemsMap = new Map(); // mapping item ID -> item adapter
            for (const item of this.items) {
                oldItemsMap.set(item.id, item);
            }
            // Inspect the downloaded feed and determine which of its items are not yet present in Obsidian
            // and need to be saved to disk.
            const newRSSitems = feed.items
                .slice(0, this.itemlimit) // do not use anything beyond the item limit
                .filter(itm => !oldItemsMap.has(itm.id));
            if (newRSSitems.length > 0) {
                // obtain an oldest-first list of remainong RSS item files
                const oldItems = Array.from(oldItemsMap.values())
                    .filter(it => !it.pinned) // do not consider pinned items for deletion
                    .sort((a, b) => a.published - b.published); // oldest first
                // remove item files which are too much with respect to the folder limit
                const deleteCount = oldItems.length + newRSSitems.length - this.itemlimit;
                if (deleteCount > 0) {
                    // we have to delete these many of the old items from the feed folder
                    for (let i = 0; i < deleteCount; i++) {
                        const itm = oldItems[i];
                        try {
                            yield itm.remove();
                        }
                        catch (err) {
                            console.error(`Failed to delete '${itm.file.basename}': ${err.message}`);
                        }
                    }
                }
                // create new files for each new item
                for (const newItem of newRSSitems) {
                    try {
                        yield RSSitemAdapter.create(newItem, this);
                    }
                    catch (err) {
                        throw new Error(`Saving '${newItem.fileName}' of feed '${this.file.basename} failed': ${err.message}`);
                    }
                }
            }
            // update the feeds meta daty
            this.status = RSSfeedAdapter.OK_STATUS_ICON;
            this.updated = new Date().valueOf();
            this.interval = feed.avgPostInterval;
            yield this.commitFrontmatterChanges();
            return newRSSitems.length;
        });
    }
    completeReadingTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            let completed = 0;
            for (const item of this.items) {
                if (yield item.completeReadingTask()) {
                    completed++;
                }
            }
            return completed;
        });
    }
}
RSSfeedAdapter.SUSPENDED_STATUS_ICON = "⏹️";
RSSfeedAdapter.RESUMED_STATUS_ICON = "▶️";
RSSfeedAdapter.ERROR_STATUS_ICON = "❌";
RSSfeedAdapter.OK_STATUS_ICON = "✅";
export class RSScollectionAdapter extends RSSAdapter {
    static create(plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield plugin.filemgr.createFile(plugin.settings.rssCollectionsFolderPath, "New Feed Collection", "RSS Collection");
            return new RSScollectionAdapter(plugin, file);
        });
    }
    constructor(plugin, collection, frontmatter) {
        super(plugin, collection, frontmatter);
    }
    get feeds() {
        const anyofSet = new Set(this.tags), allof = RSSAdapter.toPlaintags(this.frontmatter.allof), noneofSet = new Set(RSSAdapter.toPlaintags(this.frontmatter.noneof));
        return this.plugin.feedmgr.feeds
            .filter(f => {
            const tags = f.tags, tagSet = new Set(tags);
            return !tags.some(t => noneofSet.has(t)) && !allof.some(t => !tagSet.has(t)) && tags.some(t => anyofSet.has(t));
        });
    }
    completeReadingTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            let completed = 0;
            for (const feed of this.feeds) {
                completed += yield feed.completeReadingTasks();
            }
            return completed;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlNTQWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SU1NBZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBVyxjQUFjLEVBQWdDLE1BQU0sVUFBVSxDQUFDO0FBQ3ZHLE9BQU8sS0FBSyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBYyxVQUFVLEVBQWdELE1BQU0saUJBQWlCLENBQUM7QUFDdkcsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFNckQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSCxNQUFlLFVBQVU7SUFxQnJCLFlBQXNCLE1BQXdCLEVBQUUsSUFBVyxFQUFFLFdBQTBCOztRQUNuRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsYUFBWCxXQUFXLGNBQVgsV0FBVyxHQUFJLENBQUMsTUFBQSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLG1DQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFyQlMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFtQjtRQUM1QyxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNuRSxDQUFDO0lBT0QsSUFBSSxJQUFJO1FBQ0osT0FBTyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELElBQUksT0FBTztR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OlsiaW1wb3J0IHsgVEZpbGUsIG5vcm1hbGl6ZVBhdGgsIFRGb2xkZXIsIGh0bWxUb01hcmtkb3duLCBUQWJzdHJhY3RGaWxlLCBMaXN0SXRlbUNhY2hlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCB7IElSc3NNZWRpdW0sIE1lZGl1bVR5cGUsIFRQcm9wZXJ0eUJhZywgVHJhY2tlZFJTU2ZlZWQsIFRyYWNrZWRSU1NpdGVtIH0gZnJvbSBcIi4vRmVlZEFzc2VtYmxlclwiO1xyXG5pbXBvcnQgeyBIVE1MeGxhdGUsIGZvcm1hdEltYWdlIH0gZnJvbSBcIi4vSFRNTHhsYXRlXCI7XHJcbmltcG9ydCB7IFJTU2ZpbGVNYW5hZ2VyIH0gZnJvbSBcIi4vUlNTRmlsZU1hbmFnZXJcIjtcclxuaW1wb3J0IFJTU1RyYWNrZXJQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xyXG5cclxuZXhwb3J0IHR5cGUgVEZyb250bWF0dGVyID0gVFByb3BlcnR5QmFnO1xyXG5cclxuLyoqXHJcbiAqIFRIZSBiYXNlIG9mIGFsbCBzcGVjaWFsaXplZCBhZGFwdGVyIGltcGxlbWVudGF0aW9ucyBmb3IgUlNTIHJlbGF0ZWQgZmlsZXMgaW4gT2JzaWRpYW4uXHJcbiAqXHJcbiAqIGBgYHN2Z2JvYlxyXG4gKiDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgICAgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJBcclxuICog4pSCIFJTU01hbmFnZXIgICAg4pSCICAgICAg4pSCIE9ic2lkaWFuICAgICAg4pSCXHJcbiAqIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCAgICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmFxyXG4gKiAgICAgICAgIOKUgiAgICAgICAgICAgICAgICAgICAgIOKUglxyXG4gKiAgICAgICAgIOKWvCAgICAgICAgICAgICAgICAgICAgIOKWvFxyXG4gKiDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJAgICAgICDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJBcclxuICog4pSCIFJTU0FkYXB0ZXIgICAg4pSC4pSA4pSA4pSA4pSA4pSA4pa24pSCIFRGaWxlICAgICAgICAg4pSCXHJcbiAqIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmCAgICAgIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmFxyXG4gKiBgYGBcclxuICpcclxuICogU3VwcG9ydCBmb3IgdHJhbnNhY3Rpb25hbCBmcm9udG1hdHRlciBwcm9wZXJ0eSBjaGFuZ2VzIGlzIGF2YWlsYWJsZSB2aWFcclxuICoge0BsaW5rIGNvbW1pdEZyb250bWF0dGVyQ2hhbmdlc30uXHJcbiAqXHJcbiAqIERlcml2ZWQgY2xhc3NlcyBpbXBsZW1lbnQgc3BlY2lmaWMgZ2V0L3NldCBtZXRob2RzIHRvIGFjY2VzcyByZWxldmFudCBmcm9udG1hdHRlclxyXG4gKiBwcm9wZXJ0aWVzLlxyXG4gKi9cclxuYWJzdHJhY3QgY2xhc3MgUlNTQWRhcHRlciB7XHJcbiAgICBwcm90ZWN0ZWQgZnJvbnRtYXR0ZXI6IFRGcm9udG1hdHRlcjtcclxuICAgIHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbjtcclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIHRvUGxhaW50YWdzKGhhc2h0YWdzPzogc3RyaW5nW10pIHtcclxuICAgICAgICByZXR1cm4gaGFzaHRhZ3MgPyBoYXNodGFncy5tYXAoaCA9PiBoLnJlcGxhY2UoL14jKi8sIFwiXCIpKSA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIE9ic2lkaWFuIGZpbGUgYW4gaW5zdGFuY2Ugb2YgYSBkZXJpdmVkIGNsYXNzZXMgaXMgYW4gYWRhcHRlciB0by5cclxuICAgICAqL1xyXG4gICAgZmlsZTogVEZpbGU7XHJcblxyXG4gICAgZ2V0IHRhZ3MoKTogc3RyaW5nW10ge1xyXG4gICAgICAgIHJldHVybiBSU1NBZGFwdGVyLnRvUGxhaW50YWdzKHRoaXMuZnJvbnRtYXR0ZXIudGFncyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZpbGVtZ3IoKTogUlNTZmlsZU1hbmFnZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5maWxlbWdyO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwbHVnaW46IFJTU1RyYWNrZXJQbHVnaW4sIGZpbGU6IFRGaWxlLCBmcm9udG1hdHRlcj86IFRGcm9udG1hdHRlcikge1xyXG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG4gICAgICAgIHRoaXMuZnJvbnRtYXR0ZXIgPSBmcm9udG1hdHRlciA/PyAocGx1Z2luLmFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKSA/PyB7fSk7XHJcbiAgICAgICAgdGhpcy5maWxlID0gZmlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbW1pdCBhbGwgcGVuZGluZyBmcm9udG1hdHRlciBjaGFuZ2VzLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBjb21taXRGcm9udG1hdHRlckNoYW5nZXMoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGx1Z2luLmFwcC5maWxlTWFuYWdlci5wcm9jZXNzRnJvbnRNYXR0ZXIodGhpcy5maWxlLCBmbSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmZyb250bWF0dGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzVmFsdWUgPSB0aGlzLmZyb250bWF0dGVyW25hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZtW25hbWVdICE9PSB0aGlzVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmbVtuYW1lXSA9IHRoaXNWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVGhlIGFkYXB0ZXIgdG8gYW4gUlNTIGl0ZW0uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUlNTaXRlbUFkYXB0ZXIgZXh0ZW5kcyBSU1NBZGFwdGVyIHtcclxuICAgIHN0YXRpYyByZWFkb25seSBFTUJFRERJTkdfTUFUQ0hFUiA9IC8hXFxbW15cXF1dKlxcXVxcKChbXlxcKV0rKVxcKVxccyovO1xyXG4gICAgLyoqXHJcbiAgICAgKiAqKk5vdGUqKi4gVGhpcyBwcm9wZXJ0eSBjYW4gb25seSBiZSBjaGFuZ2VkIGJ5IHRoZSB1c2VyLlxyXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBpdGVtIGlzIHBpbm5lZCBhbmQgd2lsbCBub3QgYmUgZGVsZXRlZDsgYGZhbHNlYCBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIGdldCBwaW5uZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXIucGlubmVkID09PSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmZWVkKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmZyb250bWF0dGVyLmZlZWQgPSBgW1ske3ZhbHVlfV1dYDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZGF0ZSB0aGUgYXJ0aWNsZSBkZXNjcmliZWQgYnkgdGhpcyBpdGVtIHdhcyBwdWJsaXNoZWQuXHJcbiAgICAgKiBAcmV0dXJucyB0aGUgZGF0ZSBwdWJsaXNoZWQgaW4gbWlsbGlzZWNvbmRlcyBzaW5jZSBKYW4gMXN0LCAxOTcwLFxyXG4gICAgICovXHJcbiAgICBnZXQgcHVibGlzaGVkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuZnJvbnRtYXR0ZXIucHVibGlzaGVkKS52YWx1ZU9mKCkgPz8gbmV3IERhdGUoKS52YWx1ZU9mKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgYXJ0aWNsZSBsaW5rLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhlIGh5cGVybGluayB0byB0aGUgb3JpZ2luYWwgYXJ0aWNsZS5cclxuICAgICAqL1xyXG4gICAgZ2V0IGxpbmsoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlci5saW5rO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVEhlIHVuaXF1ZSBpZCBvZiB0aGlzIGl0ZW1cclxuICAgICAqIEByZXR1cm4gQSB1bmlxdWUgaXRlbSBpZGVudGlmaWVyLFxyXG4gICAgICovXHJcbiAgICBnZXQgaWQoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlci5pZCA/PyB0aGlzLmxpbms7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHRhZ3ModmFsdWU6IHN0cmluZ1tdKSB7XHJcbiAgICAgICAgY29uc3QgdGFnbWdyID0gdGhpcy5wbHVnaW4udGFnbWdyO1xyXG4gICAgICAgIHRoaXMuZnJvbnRtYXR0ZXIudGFncyA9IHZhbHVlLm1hcCh0ID0+IHRhZ21nci5tYXBIYXNodGFnKHQuc3RhcnRzV2l0aChcIiNcIikgPyB0IDogXCIjXCIgKyB0KS5zbGljZSgxKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgY29tcGxldGVSZWFkaW5nVGFzaygpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBhcHAgPSB0aGlzLnBsdWdpbi5hcHAsXHJcbiAgICAgICAgICAgIHZhdWx0ID0gYXBwLnZhdWx0LFxyXG4gICAgICAgICAgICB0YXNrcyA9IGFwcC5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZSh0aGlzLmZpbGUpXHJcbiAgICAgICAgICAgICAgICA/Lmxpc3RJdGVtc1xyXG4gICAgICAgICAgICAgICAgPy5maWx0ZXIoKGxpOiBMaXN0SXRlbUNhY2hlKSA9PiBsaS50YXNrID09PSBcIiBcIiksXHJcbiAgICAgICAgICAgIGZpcnN0ID0gdGFza3M/LmZpcnN0KCk7XHJcbiAgICAgICAgaWYgKGZpcnN0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgdmF1bHQucmVhZCh0aGlzLmZpbGUpLFxyXG4gICAgICAgICAgICAgICAgcyA9IGZpcnN0LnBvc2l0aW9uLnN0YXJ0Lm9mZnNldCxcclxuICAgICAgICAgICAgICAgIGUgPSBmaXJzdC5wb3NpdGlvbi5lbmQub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgbmV3ZGF0YSA9IGRhdGEuc3Vic3RyaW5nKDAsIHMpICsgXCItIFt4XVwiICsgZGF0YS5zdWJzdHJpbmcocyArIDUpO1xyXG4gICAgICAgICAgICBhd2FpdCB2YXVsdC5tb2RpZnkodGhpcy5maWxlLCBuZXdkYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhY3RvcnkgbWV0aG9zIHRvIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvZiBhbiBSU1MgaXRlbVxyXG4gICAgICogQHBhcmFtIGl0ZW0gdGhlIHBhcnNlIGl0ZW0gb2YgYW4gUlNTIGZlZWQuXHJcbiAgICAgKiBAcGFyYW0gZmVlZCBUaGUgZmVlZCB0aGlzIGl0ZW0gaXMgYSBwYXJ0IG9mXHJcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBpbnN0YW5jZSBvZiBhIFJTUyBpdGVtIGZpbGUgYWRhcHRlci5cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZShpdGVtOiBUcmFja2VkUlNTaXRlbSwgZmVlZDogUlNTZmVlZEFkYXB0ZXIpOiBQcm9taXNlPFJTU2l0ZW1BZGFwdGVyPiB7XHJcbiAgICAgICAgbGV0IHsgaWQsIHRhZ3MsIHRpdGxlLCBsaW5rLCBkZXNjcmlwdGlvbiwgcHVibGlzaGVkLCBhdXRob3IsIGltYWdlLCBjb250ZW50IH0gPSBpdGVtO1xyXG5cclxuICAgICAgICBjb25zdCBodG1sID0gSFRNTHhsYXRlLmluc3RhbmNlO1xyXG5cclxuICAgICAgICBpZiAoZGVzY3JpcHRpb24pIHtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBodG1sLmZyYWdtZW50QXNNYXJrZG93bihkZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgIGlmICghaW1hZ2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIGF0dGVtcHQgdG8gZmluZCBhbiBpbWFnZSBpbiB0aGUgaXRlbSBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBkZXNjcmlwdGlvbi5tYXRjaChSU1NpdGVtQWRhcHRlci5FTUJFRERJTkdfTUFUQ0hFUik7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggJiYgbWF0Y2guaW5kZXggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IG1hdGNoWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBNZWRpdW1UeXBlLkltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgaW1hZ2UgZnJvbSB0aGUgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnNsaWNlKDAsIG1hdGNoLmluZGV4KSArIGRlc2NyaXB0aW9uLnNsaWNlKG1hdGNoLmluZGV4ICsgbWF0Y2hbMF0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgY29udGVudCA9IGh0bWwuZnJhZ21lbnRBc01hcmtkb3duKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIWltYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhdHRlbXB0IHRvIGZpbmQgYW4gaW1hZ2UgaW4gdGhlIGl0ZW0gY29udGVudFxyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBjb250ZW50Lm1hdGNoKFJTU2l0ZW1BZGFwdGVyLkVNQkVERElOR19NQVRDSEVSKTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM6IG1hdGNoWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBNZWRpdW1UeXBlLkltYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBieWxpbmUgPSBhdXRob3IgPyBgIGJ5ICR7YXV0aG9yfWAgOiBcIlwiO1xyXG4gICAgICAgIHRpdGxlID0gYCR7dGl0bGV9JHtieWxpbmV9IC0gJHtwdWJsaXNoZWR9YDtcclxuXHJcbiAgICAgICAgY29uc3QgYWJzdHJhY3RNYXhMZW5ndGg9IDgwMDtcclxuICAgICAgICBpZiAoIWNvbnRlbnQgJiYgZGVzY3JpcHRpb24gJiYgZGVzY3JpcHRpb24ubGVuZ3RoID4gYWJzdHJhY3RNYXhMZW5ndGgpIHtcclxuICAgICAgICAgICAgY29udGVudCA9IGRlc2NyaXB0aW9uXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBkZWZhdWx0SW1hZ2UgPSBhd2FpdCBmZWVkLnBsdWdpbi5zZXR0aW5ncy5nZXRSc3NEZWZhdWx0SW1hZ2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGlmIChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICAvLyB0cnVuY2F0ZSBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICBjb25zdCB0ZWFzZXIgPSAoZGVzY3JpcHRpb24ubGVuZ3RoID4gYWJzdHJhY3RNYXhMZW5ndGggPyAoZGVzY3JpcHRpb24uc3Vic3RyaW5nKDAsIGFic3RyYWN0TWF4TGVuZ3RoKSArIFwi4ouvXCIpIDogZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA9IHRlYXNlci5yZXBsYWNlQWxsKFwiXFxuXCIsIFwiXFxuPiBcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaWxsIGluIHRoZSB0ZW1wbGF0ZVxyXG4gICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgIGl0ZW1mb2xkZXIgPSBhd2FpdCBmZWVkLml0ZW1Gb2xkZXIoKSxcclxuICAgICAgICAgICAgdGFnbWdyID0gZmVlZC5wbHVnaW4udGFnbWdyLFxyXG4gICAgICAgICAgICBmcm9udG1hdHRlcjogVEZyb250bWF0dGVyID0ge1xyXG4gICAgICAgICAgICAgICAgcm9sZTogXCJyc3NpdGVtXCIsXHJcbiAgICAgICAgICAgICAgICBpZDogJ1wiJyArIChpZCA/PyBsaW5rKSArICdcIicsXHJcbiAgICAgICAgICAgICAgICBhdXRob3I6IGF1dGhvciA/ICgnXCInICsgYXV0aG9yICsgJ1wiJykgOiBcIlVua25vd25cIixcclxuICAgICAgICAgICAgICAgIGxpbms6IGxpbmsgPz8gXCJcIixcclxuICAgICAgICAgICAgICAgIHB1Ymxpc2hlZDogcHVibGlzaGVkID8/IG5ldyBEYXRlKCkudmFsdWVPZigpLFxyXG4gICAgICAgICAgICAgICAgZmVlZDogYFtbJHtpdGVtZm9sZGVyLm5hbWV9XV1gLFxyXG4gICAgICAgICAgICAgICAgcGlubmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRhZ3M6IHRhZ3MubWFwKHQgPT4gdGFnbWdyLm1hcEhhc2h0YWcodC5zdGFydHNXaXRoKFwiI1wiKSA/IHQgOiBcIiNcIiArIHQpLnNsaWNlKDEpKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YU1hcCA9IHtcclxuICAgICAgICAgICAgICAgIFwie3tpZH19XCI6IGZyb250bWF0dGVyLmlkLFxyXG4gICAgICAgICAgICAgICAgXCJ7e2F1dGhvcn19XCI6IGZyb250bWF0dGVyLmF1dGhvcixcclxuICAgICAgICAgICAgICAgIFwie3tsaW5rfX1cIjogZnJvbnRtYXR0ZXIubGluayxcclxuICAgICAgICAgICAgICAgIFwie3twdWJsaXNoRGF0ZX19XCI6IGZyb250bWF0dGVyLnB1Ymxpc2hlZCxcclxuICAgICAgICAgICAgICAgIFwie3t0YWdzfX1cIjogZnJvbnRtYXR0ZXIudGFncyxcclxuICAgICAgICAgICAgICAgIFwie3t0aXRsZX19XCI6IHRpdGxlID8/IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInt7aW1hZ2V9fVwiOiBpbWFnZSA/IGZvcm1hdEltYWdlKGltYWdlKSA6IGAhW1ske2RlZmF1bHRJbWFnZX18ZmxvYXQ6cmlnaHR8MTAweDEwMF1dYCxcclxuICAgICAgICAgICAgICAgIFwie3tkZXNjcmlwdGlvbn19XCI6IGRlc2NyaXB0aW9uID8/IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBcInt7Y29udGVudH19XCI6IGNvbnRlbnQgPz8gXCJcIixcclxuICAgICAgICAgICAgICAgIFwie3tmZWVkRmlsZU5hbWV9fVwiOiBpdGVtZm9sZGVyLm5hbWUsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgZmlsZSA9IGF3YWl0IGZlZWQuZmlsZW1nci5jcmVhdGVGaWxlKGl0ZW1mb2xkZXIucGF0aCwgaXRlbS5maWxlTmFtZSwgXCJSU1MgSXRlbVwiLCBkYXRhTWFwLCB0cnVlKSxcclxuICAgICAgICAgICAgYWRhcHRlciA9IG5ldyBSU1NpdGVtQWRhcHRlcihmZWVkLnBsdWdpbiwgZmlsZSwgZnJvbnRtYXR0ZXIpO1xyXG4gICAgICAgIHJldHVybiBhZGFwdGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbiwgZmlsZTogVEZpbGUsIGZyb250bWF0dGVyOiBURnJvbnRtYXR0ZXIpIHtcclxuICAgICAgICBzdXBlcihwbHVnaW4sIGZpbGUsIGZyb250bWF0dGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZW1vdmUoKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5wbHVnaW4uYXBwLnZhdWx0LmRlbGV0ZSh0aGlzLmZpbGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUlNTZmVlZEFkYXB0ZXIgZXh0ZW5kcyBSU1NBZGFwdGVyIHtcclxuICAgIHN0YXRpYyByZWFkb25seSBTVVNQRU5ERURfU1RBVFVTX0lDT04gPSBcIuKPue+4j1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IFJFU1VNRURfU1RBVFVTX0lDT04gPSBcIuKWtu+4j1wiO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IEVSUk9SX1NUQVRVU19JQ09OID0gXCLinYxcIjtcclxuICAgIHN0YXRpYyByZWFkb25seSBPS19TVEFUVVNfSUNPTiA9IFwi4pyFXCI7XHJcblxyXG4gICAgcHJpdmF0ZSBfZm9sZGVyPzogVEZvbGRlcjsgLy8gbGF6aWx5IGV2YWx1YXRlZFxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGUocGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luLCBmZWVkOiBUcmFja2VkUlNTZmVlZCk6IFByb21pc2U8UlNTZmVlZEFkYXB0ZXI+IHtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICB7IHRpdGxlLCBzaXRlLCBkZXNjcmlwdGlvbiB9ID0gZmVlZCxcclxuICAgICAgICAgICAgZGVmYXVsdEltYWdlOiBzdHJpbmcgPSBhd2FpdCBwbHVnaW4uc2V0dGluZ3MuZ2V0UnNzRGVmYXVsdEltYWdlUGF0aCgpLFxyXG4gICAgICAgICAgICBpbWFnZTogSVJzc01lZGl1bSB8IHN0cmluZyB8IHVuZGVmaW5lZCA9IGZlZWQuaW1hZ2UsXHJcbiAgICAgICAgICAgIGZyb250bWF0dGVyOiBURnJvbnRtYXR0ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICByb2xlOiBcInJzc2ZlZWRcIixcclxuICAgICAgICAgICAgICAgIGZlZWR1cmw6IGZlZWQuc291cmNlLFxyXG4gICAgICAgICAgICAgICAgc2l0ZTogc2l0ZSA/PyBcIlVua25vd25cIixcclxuICAgICAgICAgICAgICAgIGl0ZW1saW1pdDogcGx1Z2luLnNldHRpbmdzLmRlZmF1bHRJdGVtTGltaXQsXHJcbiAgICAgICAgICAgICAgICB0YWdzOiBbXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGF0YU1hcCA9IHtcclxuICAgICAgICAgICAgICAgIFwie3tmZWVkVXJsfX1cIjogZnJvbnRtYXR0ZXIuZmVlZHVybCxcclxuICAgICAgICAgICAgICAgIFwie3tzaXRlVXJsfX1cIjogZnJvbnRtYXR0ZXIuc2l0ZSxcclxuICAgICAgICAgICAgICAgIFwie3t0aXRsZX19XCI6IGh0bWxUb01hcmtkb3duKHRpdGxlID8/IFwiXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJ7e2Rlc2NyaXB0aW9ufX1cIjogZGVzY3JpcHRpb24gPyBodG1sVG9NYXJrZG93bihkZXNjcmlwdGlvbikgOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgXCJ7e2ltYWdlfX1cIjogaW1hZ2UgPyBmb3JtYXRJbWFnZShpbWFnZSkgOiBgIVtbJHtkZWZhdWx0SW1hZ2V9fGZsb2F0OnJpZ2h0fDEwMHgxMDBdXWBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHRoZSBmZWVkIGRhc2hib2FyZCBmaWxlXHJcbiAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgZmlsZW1nciA9IHBsdWdpbi5maWxlbWdyLFxyXG4gICAgICAgICAgICBkYXNoYm9hcmQgPSBhd2FpdCBmaWxlbWdyLmNyZWF0ZUZpbGUocGx1Z2luLnNldHRpbmdzLnJzc0ZlZWRGb2xkZXJQYXRoLCBmZWVkLmZpbGVOYW1lLCBcIlJTUyBGZWVkXCIsIGRhdGFNYXAsIHRydWUpLFxyXG4gICAgICAgICAgICBhZGFwdGVyID0gbmV3IFJTU2ZlZWRBZGFwdGVyKHBsdWdpbiwgZGFzaGJvYXJkLCBmcm9udG1hdHRlcik7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGFkYXB0ZXIudXBkYXRlKGZlZWQpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgYWRhcHRlci5lcnJvciA9IGVyci5tZXNzYWdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYXdhaXQgYWRhcHRlci5jb21taXRGcm9udG1hdHRlckNoYW5nZXMoKTtcclxuICAgICAgICByZXR1cm4gYWRhcHRlcjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IFJTU1RyYWNrZXJQbHVnaW4sIGZlZWQ6IFRGaWxlLCBmcm9udG1hdHRlcj86IFRGcm9udG1hdHRlcikge1xyXG4gICAgICAgIHN1cGVyKHBsdWdpbiwgZmVlZCwgZnJvbnRtYXR0ZXIpO1xyXG4gICAgICAgIHRoaXMuX2ZvbGRlciA9IGZlZWQudmF1bHQuZ2V0Rm9sZGVyQnlQYXRoKHRoaXMuaXRlbUZvbGRlclBhdGgpID8/IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZmVlZCBzdGF0dXMuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyBvbmUgb2Y6XHJcbiAgICAgKiAtIOKchSBpZiB0aGUgZmVlZCB3YXMgdXBkYXRlZCB3aXRob3V0IGlzc3Vlc1xyXG4gICAgICogLSDij7nvuI8gaWYgdGhlIGZlZWQgaXMgc3VzcGVuZGVkXHJcbiAgICAgKiAtIOKWtu+4jyBpZiB1cGRhdGVzIGFyZSByZXN1bWVkIGJ1dCBoYXZlIG5vdCBoYXBwZW5lZCB5ZXRcclxuICAgICAqIC0g4p2MIGlmIGZlZWQgdXBkYXRlIGZhaWxlZCB3aXRoIGFuIGVycm9yXHJcbiAgICAgKiAtIGA/YCBpZiB0aGUgc3RhdHVzIGlzIHVua25vd25cclxuICAgICAqL1xyXG4gICAgZ2V0IHN0YXR1cygpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyLnN0YXR1cyA/PyAnXCI/XCInO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0IHN0YXR1cyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5mcm9udG1hdHRlci5zdGF0dXMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgZmVlZCB1cGRhdGUgaW50ZXJ2YWwuXHJcbiAgICAgKiBAcmV0dXJucyB0aGUgZmVlZCB1cGRhdGUgaW50ZXJ2YWwgaW4gaG91cnMuXHJcbiAgICAgKi9cclxuICAgIGdldCBpbnRlcnZhbCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmZyb250bWF0dGVyLmludGVydmFsID8/IDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSBmZWVkIHVwZGF0ZSBpbnRlcnZhbFxyXG4gICAgICogQHBhcmFtIHZhbHVlIHRoZSB1cGRhdGUgaW50ZXJ2YWwgaW4gaG91cnMsXHJcbiAgICAgKi9cclxuICAgIHNldCBpbnRlcnZhbCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5mcm9udG1hdHRlci5pbnRlcnZhbCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIHRpbWVzdGFtcCB3aGVuIHRoZSBmZWVkIHdhcyBsYXN0IHVwZGF0ZWQuXHJcbiAgICAgKiBAcmV0dXJuIHRoZSB0aW1lIGluIG1pbGxpc2Vjb25kcyBzaW5jZSBKYW4gMXN0IDE5NzAuXHJcbiAgICAgKi9cclxuICAgIGdldCB1cGRhdGVkKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuZnJvbnRtYXR0ZXIudXBkYXRlZCkudmFsdWVPZigpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB1cGRhdGVkKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmZyb250bWF0dGVyLnVwZGF0ZWQgPSBuZXcgRGF0ZSh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGxpbmsgdG8gdGhlIHJzcyBmZWVkXHJcbiAgICAgKiBAcmV0dXJucyBoeXBlcmxpbmsgdG8gdGhlIFJTUyBmZWVkLlxyXG4gICAgICovXHJcbiAgICBnZXQgZmVlZHVybCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyLmZlZWR1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGl0ZW1saW1pdCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmZyb250bWF0dGVyLml0ZW1saW1pdCA/PyAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpdGVtbGltaXQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuZnJvbnRtYXR0ZXIuaXRlbWxpbWl0ID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGZlZGQgc3VzcGVuc2lvbiBzdGF0ZS5cclxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiBmZWVkIHVwZGF0ZXMgYXJlIHN1c3BlbmRlZCwgYGZhbHNlYCBvdGhlcndpc2UuXHJcbiAgICAgKi9cclxuICAgIGdldCBzdXNwZW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXIuc3RhdHVzPy5zdGFydHNXaXRoKFJTU2ZlZWRBZGFwdGVyLlNVU1BFTkRFRF9TVEFUVVNfSUNPTikgPz8gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHN1c3BlbmRlZCh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9IFJTU2ZlZWRBZGFwdGVyLlNVU1BFTkRFRF9TVEFUVVNfSUNPTiArIFwic3VzcGVuZGVkXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBSU1NmZWVkQWRhcHRlci5SRVNVTUVEX1NUQVRVU19JQ09OICsgXCJyZXN1bWVkIHVwZGF0ZXNcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGVycm9yKG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc3RhdHVzID0gUlNTZmVlZEFkYXB0ZXIuRVJST1JfU1RBVFVTX0lDT04gKyBtZXNzYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IGl0ZW1Gb2xkZXJQYXRoKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZVBhdGgocGF0aC5qb2luKHRoaXMuZmlsZS5wYXJlbnQ/LnBhdGggPz8gXCJcIiwgdGhpcy5maWxlLmJhc2VuYW1lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgaXRlbUZvbGRlcigpOiBQcm9taXNlPFRGb2xkZXI+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5maWxlbWdyLmVuc3VyZUZvbGRlckV4aXN0cyh0aGlzLml0ZW1Gb2xkZXJQYXRoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgaXRlbXMgaW4gdGhpcyBSU1MgZmVlZCBjdXJyZW50bHkgaW4gT2JzaWRpYW4uXHJcbiAgICAgKiBAcmV0dXJuIHByb3hpZXMgZm9yIGFsbCBSU1MgaXRlbXMgaW4gYW4gUlNTIGZlZWQuXHJcbiAgICAgKi9cclxuICAgIGdldCBpdGVtcygpOiBSU1NpdGVtQWRhcHRlcltdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZm9sZGVyID8gdGhpcy5fZm9sZGVyLmNoaWxkcmVuXHJcbiAgICAgICAgICAgIC5tYXAoKGM6IFRBYnN0cmFjdEZpbGUpID0+IChjIGluc3RhbmNlb2YgVEZpbGUgJiYgYy5leHRlbnNpb24gPT09IFwibWRcIikgPyB0aGlzLmZpbGVtZ3IuZ2V0QWRhcHRlcihjKSA6IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgLmZpbHRlcihwID0+IHAgaW5zdGFuY2VvZiBSU1NpdGVtQWRhcHRlcikgYXMgUlNTaXRlbUFkYXB0ZXJbXSA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlbmFtZShuZXdCYXNlbmFtZSA6IHN0cmluZykgOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuICAgICAgICBpZiAoIW5ld0Jhc2VuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgIHZhdWx0ID0gdGhpcy5wbHVnaW4uYXBwLnZhdWx0LFxyXG4gICAgICAgICAgICBpdGVtRm9sZGVyID0gYXdhaXQgdGhpcy5pdGVtRm9sZGVyKCksXHJcbiAgICAgICAgICAgIGl0ZW1zID0gdGhpcy5pdGVtcyxcclxuICAgICAgICAgICAgbmV3UGF0aCA9IHRoaXMucGx1Z2luLnNldHRpbmdzLnJzc0ZlZWRGb2xkZXJQYXRoICsgXCIvXCIgKyBuZXdCYXNlbmFtZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmZpbGUuYmFzZW5hbWV9IC0+ICR7bmV3QmFzZW5hbWV9YCk7XHJcbiAgICAgICAgLy8gcmVsaW5rIHRvIG5ldyBmZWVkIGluIGFsbCBpdGVtc1xyXG4gICAgICAgIGl0ZW1zLmZvckVhY2goYXN5bmMgaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0uZmVlZCA9IG5ld0Jhc2VuYW1lO1xyXG4gICAgICAgICAgICBpdGVtLmNvbW1pdEZyb250bWF0dGVyQ2hhbmdlcygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhd2FpdCB2YXVsdC5yZW5hbWUodGhpcy5maWxlLG5ld1BhdGggKyBcIi5tZFwiKTtcclxuICAgICAgICBhd2FpdCB2YXVsdC5yZW5hbWUoaXRlbUZvbGRlcixuZXdQYXRoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgUlNTIGZlZWQuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGZlZWQgdGhlIGFkYXB0ZXIgb2YgdGhlIGZlZWQgdG8gdXBkYXRlLlxyXG4gICAgICogQHJldHVybnMgdGhlIG51bWJlciBvZiBuZXcgaXRlbXNcclxuICAgICAqL1xyXG4gICAgYXN5bmMgdXBkYXRlKGZlZWQ6IFRyYWNrZWRSU1NmZWVkKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICAvLyBidWlsZCBhIG1hcCBvZiBSU1MgaXRlbXMgYWxyZWFkeSBleGlzdGluZyBpbiB0aGUgZmVlZCBmb2xkZXJcclxuXHJcbiAgICAgICAgY29uc3Qgb2xkSXRlbXNNYXAgPSBuZXcgTWFwPHN0cmluZywgUlNTaXRlbUFkYXB0ZXI+KCk7IC8vIG1hcHBpbmcgaXRlbSBJRCAtPiBpdGVtIGFkYXB0ZXJcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xyXG4gICAgICAgICAgICBvbGRJdGVtc01hcC5zZXQoaXRlbS5pZCwgaXRlbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJbnNwZWN0IHRoZSBkb3dubG9hZGVkIGZlZWQgYW5kIGRldGVybWluZSB3aGljaCBvZiBpdHMgaXRlbXMgYXJlIG5vdCB5ZXQgcHJlc2VudCBpbiBPYnNpZGlhblxyXG4gICAgICAgIC8vIGFuZCBuZWVkIHRvIGJlIHNhdmVkIHRvIGRpc2suXHJcbiAgICAgICAgY29uc3QgbmV3UlNTaXRlbXM6IFRyYWNrZWRSU1NpdGVtW10gPSBmZWVkLml0ZW1zXHJcbiAgICAgICAgICAgIC5zbGljZSgwLCB0aGlzLml0ZW1saW1pdCkgLy8gZG8gbm90IHVzZSBhbnl0aGluZyBiZXlvbmQgdGhlIGl0ZW0gbGltaXRcclxuICAgICAgICAgICAgLmZpbHRlcihpdG0gPT4gIW9sZEl0ZW1zTWFwLmhhcyhpdG0uaWQpKTtcclxuXHJcbiAgICAgICAgaWYgKG5ld1JTU2l0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gb2J0YWluIGFuIG9sZGVzdC1maXJzdCBsaXN0IG9mIHJlbWFpbm9uZyBSU1MgaXRlbSBmaWxlc1xyXG4gICAgICAgICAgICBjb25zdCBvbGRJdGVtczogUlNTaXRlbUFkYXB0ZXJbXSA9IEFycmF5LmZyb20ob2xkSXRlbXNNYXAudmFsdWVzKCkpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGl0ID0+ICFpdC5waW5uZWQpIC8vIGRvIG5vdCBjb25zaWRlciBwaW5uZWQgaXRlbXMgZm9yIGRlbGV0aW9uXHJcbiAgICAgICAgICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5wdWJsaXNoZWQgLSBiLnB1Ymxpc2hlZCk7IC8vIG9sZGVzdCBmaXJzdFxyXG5cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIGl0ZW0gZmlsZXMgd2hpY2ggYXJlIHRvbyBtdWNoIHdpdGggcmVzcGVjdCB0byB0aGUgZm9sZGVyIGxpbWl0XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZUNvdW50ID0gb2xkSXRlbXMubGVuZ3RoICsgbmV3UlNTaXRlbXMubGVuZ3RoIC0gdGhpcy5pdGVtbGltaXQ7XHJcbiAgICAgICAgICAgIGlmIChkZWxldGVDb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gZGVsZXRlIHRoZXNlIG1hbnkgb2YgdGhlIG9sZCBpdGVtcyBmcm9tIHRoZSBmZWVkIGZvbGRlclxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxldGVDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRtID0gb2xkSXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgaXRtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEZhaWxlZCB0byBkZWxldGUgJyR7aXRtLmZpbGUuYmFzZW5hbWV9JzogJHtlcnIubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBuZXcgZmlsZXMgZm9yIGVhY2ggbmV3IGl0ZW1cclxuICAgICAgICAgICAgZm9yIChjb25zdCBuZXdJdGVtIG9mIG5ld1JTU2l0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IFJTU2l0ZW1BZGFwdGVyLmNyZWF0ZShuZXdJdGVtLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTYXZpbmcgJyR7bmV3SXRlbS5maWxlTmFtZX0nIG9mIGZlZWQgJyR7dGhpcy5maWxlLmJhc2VuYW1lfSBmYWlsZWQnOiAke2Vyci5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZmVlZHMgbWV0YSBkYXR5XHJcbiAgICAgICAgdGhpcy5zdGF0dXMgPSBSU1NmZWVkQWRhcHRlci5PS19TVEFUVVNfSUNPTjtcclxuICAgICAgICB0aGlzLnVwZGF0ZWQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcclxuICAgICAgICB0aGlzLmludGVydmFsID0gZmVlZC5hdmdQb3N0SW50ZXJ2YWw7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5jb21taXRGcm9udG1hdHRlckNoYW5nZXMoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1JTU2l0ZW1zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjb21wbGV0ZVJlYWRpbmdUYXNrcygpOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIGxldCBjb21wbGV0ZWQgPSAwO1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XHJcbiAgICAgICAgICAgIGlmIChhd2FpdCBpdGVtLmNvbXBsZXRlUmVhZGluZ1Rhc2soKSkge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGVkKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNvbXBsZXRlZDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJTU2NvbGxlY3Rpb25BZGFwdGVyIGV4dGVuZHMgUlNTQWRhcHRlciB7XHJcbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbik6IFByb21pc2U8UlNTY29sbGVjdGlvbkFkYXB0ZXI+IHtcclxuICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgcGx1Z2luLmZpbGVtZ3IuY3JlYXRlRmlsZShwbHVnaW4uc2V0dGluZ3MucnNzQ29sbGVjdGlvbnNGb2xkZXJQYXRoLCBcIk5ldyBGZWVkIENvbGxlY3Rpb25cIiwgXCJSU1MgQ29sbGVjdGlvblwiKTtcclxuICAgICAgICByZXR1cm4gbmV3IFJTU2NvbGxlY3Rpb25BZGFwdGVyKHBsdWdpbiwgZmlsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luLCBjb2xsZWN0aW9uOiBURmlsZSwgZnJvbnRtYXR0ZXI/OiBURnJvbnRtYXR0ZXIpIHtcclxuICAgICAgICBzdXBlcihwbHVnaW4sIGNvbGxlY3Rpb24sIGZyb250bWF0dGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZmVlZHMoKTogUlNTZmVlZEFkYXB0ZXJbXSB7XHJcbiAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgYW55b2ZTZXQgPSBuZXcgU2V0PHN0cmluZz4odGhpcy50YWdzKSxcclxuICAgICAgICAgICAgYWxsb2YgPSBSU1NBZGFwdGVyLnRvUGxhaW50YWdzKHRoaXMuZnJvbnRtYXR0ZXIuYWxsb2YpLFxyXG4gICAgICAgICAgICBub25lb2ZTZXQgPSBuZXcgU2V0PHN0cmluZz4oUlNTQWRhcHRlci50b1BsYWludGFncyh0aGlzLmZyb250bWF0dGVyLm5vbmVvZikpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsdWdpbi5mZWVkbWdyLmZlZWRzXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgICAgIHRhZ3M6IHN0cmluZ1tdID0gZi50YWdzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhZ1NldCA9IG5ldyBTZXQ8c3RyaW5nPih0YWdzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhdGFncy5zb21lKHQgPT4gbm9uZW9mU2V0Lmhhcyh0KSkgJiYgIWFsbG9mLnNvbWUodCA9PiAhdGFnU2V0Lmhhcyh0KSkgJiYgdGFncy5zb21lKHQgPT4gYW55b2ZTZXQuaGFzKHQpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgY29tcGxldGVSZWFkaW5nVGFza3MoKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICBsZXQgY29tcGxldGVkID0gMDtcclxuICAgICAgICBmb3IgKGNvbnN0IGZlZWQgb2YgdGhpcy5mZWVkcykge1xyXG4gICAgICAgICAgICBjb21wbGV0ZWQgKz0gYXdhaXQgZmVlZC5jb21wbGV0ZVJlYWRpbmdUYXNrcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY29tcGxldGVkO1xyXG4gICAgfVxyXG59Il19