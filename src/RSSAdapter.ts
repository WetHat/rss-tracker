import { TFile, normalizePath, TFolder, htmlToMarkdown, TAbstractFile, ListItemCache } from 'obsidian';
import * as path from "path";
import { IRssMedium, MediumType, TPropertyBag, TrackedRSSfeed, TrackedRSSitem } from "./FeedAssembler";
import { HTMLxlate, formatImage } from "./HTMLxlate";
import { RSSfileManager } from "./RSSFileManager";
import RSSTrackerPlugin from "./main";

export type TFrontmatter = TPropertyBag;

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
abstract class RSSAdapter {
    protected frontmatter: TFrontmatter;
    plugin: RSSTrackerPlugin;

    protected static toPlaintags(hashtags?: string[]) {
        return hashtags ? hashtags.map(h => h.replace(/^#*/, "")) : [];
    }

    /**
     * The Obsidian file an instance of a derived classes is an adapter to.
     */
    file: TFile;

    get tags(): string[] {
        return RSSAdapter.toPlaintags(this.frontmatter.tags);
    }

    get filemgr(): RSSfileManager {
        return this.plugin.filemgr;
    }

    protected constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter) {
        this.plugin = plugin;
        this.frontmatter = frontmatter ?? (plugin.app.metadataCache.getFileCache(file)?.frontmatter ?? {});
        this.file = file;
    }

    /**
     * Commit all pending frontmatter changes.
     */
    commitFrontmatterChanges(): Promise<void> {
        return this.plugin.app.fileManager.processFrontMatter(this.file, fm => {
            for (const name in this.frontmatter) {
                const thisValue = this.frontmatter[name];
                if (fm[name] !== thisValue) {
                    fm[name] = thisValue;
                }
            }
        });
    }
}

/**
 * The adapter to an RSS item.
 */
export class RSSitemAdapter extends RSSAdapter {
    static readonly EMBEDDING_MATCHER = /!\[[^\]]*\]\(([^\)]+)\)\s*/;
    /**
     * **Note**. This property can only be changed by the user.
     * @returns `true` if the item is pinned and will not be deleted; `false` otherwise.
     */
    get pinned(): boolean {
        return this.frontmatter.pinned === true;
    }

    set feed(value: string) {
        this.frontmatter.feed = `[[${value}]]`;
    }

    /**
     * Get the date the article described by this item was published.
     * @returns the date published in millisecondes since Jan 1st, 1970,
     */
    get published(): number {
        return new Date(this.frontmatter.published).valueOf() ?? new Date().valueOf();
    }

    /**
     * The article link.
     *
     * @returns the hyperlink to the original article.
     */
    get link(): string {
        return this.frontmatter.link;
    }

    /**
     * THe unique id of this item
     * @returns A unique item identifier,
     */
    get id(): string {
        return this.frontmatter.id ?? this.link;
    }

    set tags(value: string[]) {
        const tagmgr = this.plugin.tagmgr;
        this.frontmatter.tags = value.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1));
    }

    async completeReadingTask(): Promise<boolean> {
        const
            app = this.plugin.app,
            vault = app.vault,
            tasks = app.metadataCache.getFileCache(this.file)
                ?.listItems
                ?.filter((li: ListItemCache) => li.task === " "),
            first = tasks?.first();
        if (first) {
            const
                data = await vault.read(this.file),
                s = first.position.start.offset,
                e = first.position.end.offset,
                newdata = data.substring(0, s) + "- [x]" + data.substring(s + 5);
            await vault.modify(this.file, newdata);
            return true;
        }
        return false;
    }

    /**
     * Factory methos to create a new instance of an RSS item
     * @param item - the parse item of an RSS feed.
     * @param feed - The feed this item is a part of
     * @returns A new instance of a RSS item file adapter.
     */
    static async create(item: TrackedRSSitem, feed: RSSfeedAdapter): Promise<RSSitemAdapter> {
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
                    }
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
                    }
                }
            }
        }

        const abstractMaxLength = 800;
        if (!content && description && description.length > abstractMaxLength) {
            content = description
        }

        const defaultImage = await feed.plugin.settings.getRssDefaultImagePath();

        if (description) {
            // truncate description
            const teaser = (description.length > abstractMaxLength ? (description.substring(0, abstractMaxLength) + "⋯") : description);
            description = teaser.replaceAll("\n", "\n> ");
        }

        // fill in the template
        const
            itemfolder = await feed.itemFolder(),
            tagmgr = feed.plugin.tagmgr,
            frontmatter: TFrontmatter = {
                role: "rssitem",
                aliases: [],
                id: id ?? link,
                author: author ?? "unknown",
                link: link ?? "unknown",
                published: published ?? new Date().valueOf(),
                feed: `[[${itemfolder.name}]]`,
                tags: tags.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1)),
                pinned: false,
            },
            dataMap = {
                "{{author}}": frontmatter.author,
                "{{link}}": frontmatter.link,
                "{{publishDate}}": frontmatter.published,
                "{{title}}": title ?? "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|float:right|100x100]]`,
                "{{description}}": description ?? "",
                "{{content}}": content ?? "",
                "{{feedFileName}}": itemfolder.name,
            };
        const file = await feed.filemgr.createFile(itemfolder.path, item.fileName, "RSS Item", dataMap, true);
        // create an alias if the filename was doctored.
        if (title && file.basename !== title) {
            frontmatter.aliases = [title];
        }
        const adapter = new RSSitemAdapter(feed.plugin, file, frontmatter);
        await adapter.commitFrontmatterChanges();
        return adapter;
    }

    constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter: TFrontmatter) {
        super(plugin, file, frontmatter);
    }

    async remove() {
        await this.plugin.app.vault.delete(this.file);
    }
}

export class RSSfeedAdapter extends RSSAdapter {
    static readonly SUSPENDED_STATUS_ICON = "⏹️";
    static readonly RESUMED_STATUS_ICON = "▶️";
    static readonly ERROR_STATUS_ICON = "❌";
    static readonly OK_STATUS_ICON = "✅";

    private _folder?: TFolder; // lazily evaluated

    static async create(plugin: RSSTrackerPlugin, feed: TrackedRSSfeed): Promise<RSSfeedAdapter> {
        const
            { title, site, description } = feed,
            defaultImage: string = await plugin.settings.getRssDefaultImagePath(),
            image: IRssMedium | string | undefined = feed.image,
            frontmatter: TFrontmatter = {
                role: "rssfeed",
                site: site ?? "Unknown",
                feedurl: feed.source,
                itemlimit: plugin.settings.defaultItemLimit,
                status: this.RESUMED_STATUS_ICON,
                updated: 0,
                interval: 1,
                tags: [],
            },
            dataMap = {
                "{{feedUrl}}": frontmatter.feedurl,
                "{{siteUrl}}": frontmatter.site,
                "{{title}}": htmlToMarkdown(title ?? ""),
                "{{description}}": description ? htmlToMarkdown(description) : "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|float:right|100x100]]`
            };

        // create the feed dashboard file
        const
            filemgr = plugin.filemgr,
            dashboard = await filemgr.createFile(plugin.settings.rssFeedFolderPath, feed.fileName, "RSS Feed", dataMap, true),
            adapter = new RSSfeedAdapter(plugin, dashboard, frontmatter);

        try {
            await adapter.update(feed);
        } catch (err: any) {
            console.error(err);
            adapter.error = err.message;
        }

        await adapter.commitFrontmatterChanges();
        return adapter;
    }

    constructor(plugin: RSSTrackerPlugin, feed: TFile, frontmatter?: TFrontmatter) {
        super(plugin, feed, frontmatter);
        this._folder = feed.vault.getFolderByPath(this.itemFolderPath) ?? undefined;
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
    get status(): string {
        return this.frontmatter.status ?? '"?"';
    }

    private set status(value: string) {
        this.frontmatter.status = value;
    }

    /**
     * Get the feed update interval.
     * @returns the feed update interval in hours.
     */
    get interval(): number {
        return parseInt(this.frontmatter.interval ?? 1);
    }

    /**
     * Set the feed update interval
     * @param value - the update interval in hours,
     */
    set interval(value: number) {
        this.frontmatter.interval = value;
    }

    /**
     * The timestamp when the feed was last updated.
     * @returns the time in milliseconds since Jan 1st 1970.
     */
    get updated(): number {
        return new Date(this.frontmatter.updated).valueOf();
    }

    set updated(value: number) {
        this.frontmatter.updated = new Date(value);
    }

    /**
     * Get the link to the rss feed
     * @returns hyperlink to the RSS feed.
     */
    get feedurl(): string {
        return this.frontmatter.feedurl;
    }

    get itemlimit(): number {
        return parseInt(this.frontmatter.itemlimit ?? 100);
    }

    set itemlimit(value: number) {
        this.frontmatter.itemlimit = value;
    }

    /**
     * Get the fedd suspension state.
     * @returns `true` if feed updates are suspended, `false` otherwise.
     */
    get suspended(): boolean {
        return this.frontmatter.status?.startsWith(RSSfeedAdapter.SUSPENDED_STATUS_ICON) ?? false;
    }

    set suspended(value: boolean) {
        if (value) {
            this.status = RSSfeedAdapter.SUSPENDED_STATUS_ICON + "suspended";
        } else {
            this.status = RSSfeedAdapter.RESUMED_STATUS_ICON + "resumed updates";
        }
    }

    set error(message: string) {
        this.status = RSSfeedAdapter.ERROR_STATUS_ICON + message;
    }

    private get itemFolderPath(): string {
        return normalizePath(path.join(this.file.parent?.path ?? "", this.file.basename));
    }

    async itemFolder(): Promise<TFolder> {
        return this.filemgr.ensureFolderExists(this.itemFolderPath);
    }

    /**
     * Get all items in this RSS feed currently in Obsidian.
     * @returns proxies for all RSS items in an RSS feed.
     */
    get items(): RSSitemAdapter[] {
        return this._folder ? this._folder.children
            .map((c: TAbstractFile) => (c instanceof TFile && c.extension === "md") ? this.filemgr.getAdapter(c) : undefined)
            .filter(p => p instanceof RSSitemAdapter) as RSSitemAdapter[] : [];
    }

    async rename(newBasename: string): Promise<boolean> {
        if (!newBasename) {
            return false;
        }

        const
            vault = this.plugin.app.vault,
            itemFolder = await this.itemFolder(),
            items = this.items,
            newPath = this.plugin.settings.rssFeedFolderPath + "/" + newBasename;
        console.log(`${this.file.basename} -> ${newBasename}`);
        // relink to new feed in all items
        items.forEach(async item => {
            item.feed = newBasename;
            item.commitFrontmatterChanges();
        });

        await vault.rename(this.file, newPath + ".md");
        await vault.rename(itemFolder, newPath);
        return true;
    }

    /**
     * Update the RSS feed.
     *
     * @param feed - the adapter of the feed to update.
     * @returns the number of new items
     */
    async update(feed: TrackedRSSfeed): Promise<number> {
        // build a map of RSS items already existing in the feed folder

        const oldItemsMap = new Map<string, RSSitemAdapter>(); // mapping item ID -> item adapter
        for (const item of this.items) {
            oldItemsMap.set(item.id, item);
        }

        // Inspect the downloaded feed and determine which of its items are not yet present in Obsidian
        // and need to be saved to disk.
        const newRSSitems: TrackedRSSitem[] = feed.items
            .slice(0, this.itemlimit) // do not use anything beyond the item limit
            .filter(itm => !oldItemsMap.has(itm.id));

        if (newRSSitems.length > 0) {
            // obtain an oldest-first list of remainong RSS item files
            const oldItems: RSSitemAdapter[] = Array.from(oldItemsMap.values())
                .filter(it => !it.pinned) // do not consider pinned items for deletion
                .sort((a, b) => a.published - b.published); // oldest first

            // remove item files which are too much with respect to the folder limit
            const deleteCount = oldItems.length + newRSSitems.length - this.itemlimit;
            if (deleteCount > 0) {
                // we have to delete these many of the old items from the feed folder
                for (let i = 0; i < deleteCount; i++) {
                    const itm = oldItems[i];
                    try {
                        await itm.remove();
                    } catch (err: any) {
                        console.error(`Failed to delete '${itm.file.basename}': ${err.message}`);
                    }
                }
            }

            // create new files for each new item
            for (const newItem of newRSSitems) {
                try {
                    await RSSitemAdapter.create(newItem, this);
                } catch (err: any) {
                    throw new Error(`Saving '${newItem.fileName}' of feed '${this.file.basename} failed': ${err.message}`);
                }
            }
        }
        // update the feeds meta daty
        this.status = RSSfeedAdapter.OK_STATUS_ICON;
        this.updated = new Date().valueOf();
        this.interval = feed.avgPostInterval;
        await this.commitFrontmatterChanges();

        return newRSSitems.length;
    }

    async completeReadingTasks(): Promise<number> {
        let completed = 0;
        for (const item of this.items) {
            if (await item.completeReadingTask()) {
                completed++;
            }
        }
        return completed;
    }
}

export class RSScollectionAdapter extends RSSAdapter {
    static async create(plugin: RSSTrackerPlugin): Promise<RSScollectionAdapter> {
        const
            file = await plugin.filemgr.createFile(plugin.settings.rssCollectionsFolderPath, "New Feed Collection", "RSS Collection"),
            frontmatter: TFrontmatter = {
                role: "rsscollection",
                tags: [ "nil"],
                allof: [],
                noneof: []
            },
            adapter = new RSScollectionAdapter(plugin, file, frontmatter);

        await adapter.commitFrontmatterChanges();
        return adapter;
    }

    constructor(plugin: RSSTrackerPlugin, collection: TFile, frontmatter?: TFrontmatter) {
        super(plugin, collection, frontmatter);
    }

    get feeds(): RSSfeedAdapter[] {
        const
            anyofSet = new Set<string>(this.tags),
            allof = RSSAdapter.toPlaintags(this.frontmatter.allof),
            noneofSet = new Set<string>(RSSAdapter.toPlaintags(this.frontmatter.noneof));
        return this.plugin.feedmgr.feeds
            .filter(f => {
                const
                    tags: string[] = f.tags,
                    tagSet = new Set<string>(tags);
                return !tags.some(t => noneofSet.has(t)) && !allof.some(t => !tagSet.has(t)) && tags.some(t => anyofSet.has(t));
            });
    }

    async completeReadingTasks(): Promise<number> {
        let completed = 0;
        for (const feed of this.feeds) {
            completed += await feed.completeReadingTasks();
        }
        return completed;
    }
}