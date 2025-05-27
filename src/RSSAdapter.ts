import { TFile, normalizePath, TFolder, htmlToMarkdown, ListItemCache, App, Vault } from 'obsidian';
import { IRssMedium, MediumType, TPropertyBag, TrackedRSSfeed, TrackedRSSitem } from "./FeedAssembler";
import { HTMLxlate, formatImage } from "./HTMLxlate";
import { RSSfileManager } from "./RSSFileManager";
import RSSTrackerPlugin from "./main";
import { TDashboardPlacement } from './settings';

export type TFrontmatter = TPropertyBag;

//#region RSS file adapters
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
 * │ RSSAdapter    │─────▶ TFile          │
 * └───────────────┘      └───────────────┘
 * ```
 *
 * Support for transactional frontmatter property changes is available via
 * {@link commitFrontmatterChanges}.
 *
 * Derived classes implement specific get/set methods to access relevant frontmatter
 * properties.
 */
export abstract class RSSAdapter {

    /**
     * The plugin instance this adapter is for.
     */
    plugin: RSSTrackerPlugin;

    /**
     * The frontmatter of the underlying file. Either provided by the user or lazily evaluated from the file.
     */
    private _frontmatter!: TFrontmatter;

    /**
     * Get the (lazily evaluated) frontmatter of the underlying file.
     */
    get frontmatter(): TFrontmatter {
        if (!this._frontmatter) {
            this._frontmatter = this.plugin.app.metadataCache.getFileCache(this.file)?.frontmatter ?? {};
        }
        return this._frontmatter;
    }

    /**
     * Remove the hash (`#`) from hashtags.
     * @param hashtags List of hashtags to convert to plain tags.
     * @returns Listof plain tags without the leading hash.
     */
    protected static toPlaintags(hashtags?: string[]) {
        return hashtags ? hashtags.map(h => h.replace(/^#*/, "")) : [];
    }

    /**
     * The Obsidian file this adapter is for.
     */
    file: TFile;

    /**
     * The frontmatter tags (without the `#`).
     */
    get tags(): string[] {
        return RSSAdapter.toPlaintags(this.frontmatter.tags);
    }

    /**
     * Get the role of the file this adapter is for.
     */
    get role(): string | undefined {
        return this.frontmatter.role;
    }

    /**
     * Get the filemanager object used by the adapter.
     */
    get filemgr(): RSSfileManager {
        return this.plugin.filemgr;
    }

    /**
     * Create a new adapter instance.
     *
     * @param plugin the plugin instance.
     * @param file the file to create the adapter for.
     * @param frontmatter Frontmatter to use.
     *                    If not provided, the frontmatter is read from the file.
     *                    If provided the caller must calls {@link commitFrontmatterChanges} to make sure
     *                    the underlying file is updated with the frontmatter.
     * @return a new instance of the adapter.
     */
    protected constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter) {
        this.plugin = plugin;
        if (frontmatter) {
            this._frontmatter = frontmatter;
        }
        this.file = file;
    }

    /**
     * Commit all pending frontmatter changes to the underlying file.
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
 * The adapter to an RSS item file.
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
     * The article web-link.
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
     * Factory method to create a new instance of an RSS item
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

        const defaultImage = await feed.plugin.settings.rssDefaultImagePath;

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
                feed: `[[${feed.file.path} | ${feed.file.basename}]]`,
                tags: tags.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1)),
                pinned: false,
            },
            dataMap = {
                "{{author}}": frontmatter.author,
                "{{link}}": frontmatter.link,
                "{{publishDate}}": frontmatter.published,
                "{{title}}": title ?? "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|float:right|100]]`,
                "{{description}}": description ?? "",
                "{{content}}": content ?? "",
                "{{feedLink}}": frontmatter.feed,
            };
        const file = await feed.filemgr.createUniqueFile(itemfolder, item.fileName, "RSS Item", dataMap, true);
        // create an alias if the filename was doctored.
        if (title && file.basename !== title) {
            frontmatter.aliases = [title];
        }
        const adapter = new RSSitemAdapter(feed.plugin, file, frontmatter);
        await adapter.commitFrontmatterChanges();
        return adapter;
    }

    constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter) {
        super(plugin, file, frontmatter);
    }

    async remove() {
        await this.plugin.app.vault.delete(this.file);
    }
}

export class RSScollectionAdapter extends RSSAdapter {
    static async create(plugin: RSSTrackerPlugin): Promise<RSScollectionAdapter> {
        const
            folder = await plugin.filemgr.ensureFolderExists(plugin.settings.rssCollectionsFolderPath),
            file = await plugin.filemgr.createUniqueFile(folder, "New Feed Collection", "RSS Collection"),
            frontmatter: TFrontmatter = {
                role: "rsscollection",
                tags: ["nil"],
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
//#endregion RSS file adapters

//#region Dashboard Adapters
/**
 * A constructable dashboard adapter signature.
 */
export interface IConstructableDashboard<T extends RSSdashboardAdapter> {
    new(plugin: RSSTrackerPlugin, folder: TFolder, file: TFile, frontmatter?: TFrontmatter): T;
}

/**
 * Adapter base class for RSS folder dashboard files (Folder Note style).
 */
export abstract class RSSdashboardAdapter extends RSSAdapter {

    static getDashboardName(folder: TFolder, template?: string): string {
        return folder.name; // TODO: use template to generate name
    }

    static getDashboardFolderName(dashboard: TFile, template?: string): string {
        return dashboard.name; // TODO: run the folder note temlate backwards to get the folder name
    }

    static getDashboardPlacementFolder(folder: TFolder, placement: TDashboardPlacement): TFolder {
        return placement === "insideFolder" ? folder : folder.parent ?? folder.vault.getRoot();
    }

    static getDashboardPath(folder: TFolder, placement: TDashboardPlacement): string {
        const
            dashboardName = RSSdashboardAdapter.getDashboardName(folder),
            dashboardPlacementFolder = RSSdashboardAdapter.getDashboardPlacementFolder(folder, placement);
        return dashboardPlacementFolder.path + "/" + dashboardName + ".md";
    }

    static getDashboard(folder: TFolder, placement: TDashboardPlacement): TFile | null {
        return folder.vault.getFileByPath(RSSdashboardAdapter.getDashboardPath(folder, placement));
    }

    /**
     * Factory method to create a new instance of an RSS dashboard adapter for a folder.
     *
     * @param cTor the constructor of the adapter to create.
     * @param plugin The plugin instance.
     * @param folder The folder to create the dashboard adapterfor.cls
     * @param placement The placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
     * @returns A new instance of an adapter of type `T` or `null` if the dashboard does not exist.
     */
    static createFromFolder<T extends RSSdashboardAdapter>(cTor: IConstructableDashboard<T>, plugin: RSSTrackerPlugin, folder: TFolder, placement: TDashboardPlacement): T | null {
        const dashboard = RSSdashboardAdapter.getDashboard(folder, placement);
        return dashboard ? new cTor(plugin, folder, dashboard) : null;
    }

    static createFromFile<T extends RSSdashboardAdapter>(cTor: IConstructableDashboard<T>, plugin: RSSTrackerPlugin, file: TFile, placement: TDashboardPlacement, frontmatter?: TFrontmatter): T | null {
        const folder = plugin.filemgr.getDashboardFolder(file, placement);
        return folder ? new cTor(plugin, folder, file, frontmatter) : null;
    }

    /**
     * The folder this dashboard is for.
     */
    folder: TFolder;

    constructor(plugin: RSSTrackerPlugin, folder: TFolder, file: TFile, frontmatter?: TFrontmatter) {
        super(plugin, file, frontmatter);
        this.folder = folder;
    }

    async rename(newFolderName: string): Promise<boolean> {
        const
            newDashboardName = RSSdashboardAdapter.getDashboardName(this.folder, newFolderName),
            newFolderPath = (this.folder.parent?.path ?? "") + "/" + newFolderName,
            newDashboardPath = (this.file.parent?.path ?? "") + "/" + newDashboardName + ".md";

        if (await this.file.vault.adapter.exists(newDashboardPath, true) || await this.plugin.app.vault.adapter.exists(newFolderPath, true)) {
            return false;
        }

        await this.file.vault.rename(this.file, newDashboardPath);
        await this.folder.vault.rename(this.folder, newFolderPath);
        return true;
    }
}

export class RSSfeedAdapter extends RSSdashboardAdapter {
    static readonly SUSPENDED_STATUS_ICON = "⏹️";
    static readonly RESUMED_STATUS_ICON = "▶️";
    static readonly ERROR_STATUS_ICON = "❌";
    static readonly OK_STATUS_ICON = "✅";

    static async create(plugin: RSSTrackerPlugin, feed: TrackedRSSfeed): Promise<RSSfeedAdapter> {
        const
            { title, site, description } = feed,
            defaultImage: string = await plugin.settings.rssDefaultImagePath,
            image: IRssMedium | string | undefined = feed.image,
            frontmatter: TFrontmatter = {
                role: "rssfeed",
                aliases: [],
                site: site ?? "Unknown",
                feedurl: feed.source,
                itemlimit: plugin.settings.defaultItemLimit,
                status: this.RESUMED_STATUS_ICON,
                updated: 0,
                interval: 1,
                tags: [],
            },
            mdTitle = htmlToMarkdown(title ?? ""),
            dataMap = {
                "{{feedUrl}}": frontmatter.feedurl,
                "{{siteUrl}}": frontmatter.site,
                "{{title}}": mdTitle,
                "{{description}}": description ? htmlToMarkdown(description) : "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|float:right|100]]`
            };

        // create the feed folder
        const
            filemgr = plugin.filemgr,
            settings = plugin.settings,
            feedsFolder = await RSSFeedsDashboardAdapter.ensureDashboardFolderExists(plugin),
            feedItemsFolder = await plugin.filemgr.createUniqueFolder(feedsFolder, feed.fileName),
            dashboardPlacementFolder = settings.rssDashboardPlacement === "insideFolder"
                ? feedItemsFolder
                : feedsFolder,
            dashboard = await filemgr.upsertFile(dashboardPlacementFolder, feed.fileName, "RSS Feed", dataMap, true);

        // create an alias if the filename was doctored.
        if (title && dashboard.basename !== title) {
            frontmatter.aliases = [title];
        }
        const adapter = new RSSfeedAdapter(plugin, feedItemsFolder, dashboard, frontmatter);

        try {
            await adapter.update(feed);
        } catch (err: any) {
            console.error(err);
            adapter.error = err.message;
        }

        await adapter.commitFrontmatterChanges();
        await settings.commit();
        return adapter;
    }

    get feeds(): RSSfeedAdapter[] {
        return [this];
    }

    constructor(plugin: RSSTrackerPlugin, folder: TFolder, feed: TFile, frontmatter?: TFrontmatter) {
        super(plugin, folder, feed, frontmatter);
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
     * Get the feed suspension state.
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

    itemFolder(): TFolder {
        return this.folder;
    }

    /**
     * Get all items in this RSS feed currently downloaded in Obsidian.
     * @returns adapter for all RSS items in an RSS feed.
     */
    get items(): RSSitemAdapter[] {
        const meta = this.plugin.app.metadataCache;
        return this.folder
            ? this.folder.children
                .filter(c => c instanceof TFile)
                .map(f => {
                    const frontmatter = meta.getFileCache(f as TFile)?.frontmatter;
                    return (frontmatter && frontmatter.role === "rssitem")
                        ? new RSSitemAdapter(this.plugin, f as TFile, frontmatter)
                        : null
                })
                .filter((f: RSSitemAdapter | null) => f !== null) as RSSitemAdapter[]
            : [];
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
            // obtain an oldest-first list of remainng RSS item files
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

export class RSSFeedsDashboardAdapter extends RSSdashboardAdapter {

    static async ensureDashboardFolderExists(plugin: RSSTrackerPlugin): Promise<TFolder> {
    	const folder = plugin.vault.getFolderByPath(plugin.settings.rssFeedsFolderPath);
		if (folder) {
			return folder;
		}
		const adapter = await RSSFeedsDashboardAdapter.create(plugin);
		return adapter.folder;
	}

    /**
     * Create a new RSS Feeds dashboard adapter.
     * @param plugin the plugin instance
     * @param folder the folder containing the dashboard
     * @param dashboard the dashboard file
     * @returns a new RSSFeedsDashboardAdapter instance.
     */
    static async create(plugin: RSSTrackerPlugin): Promise<RSSFeedsDashboardAdapter> {
        const
            filemgr = plugin.filemgr,
            settings = plugin.settings,
            folder = await filemgr.ensureFolderExists(settings.rssFeedFolderPath),
            placement = settings.rssDashboardPlacement,
            frontmatter: TFrontmatter = {
                role: "rssfeed-dashboard",
            },
            dashboardName = RSSdashboardAdapter.getDashboardName(folder),
            dashboardplacement = RSSdashboardAdapter.getDashboardPlacementFolder(folder, placement),
            dashboard = await filemgr.upsertFile(dashboardplacement, dashboardName, "RSS Feed Dashboard", {}, false);

        const adapter =  new RSSFeedsDashboardAdapter(plugin, folder, dashboard, frontmatter);
        await adapter.commitFrontmatterChanges();
        await settings.commit();
        return adapter;
    }

    constructor(plugin: RSSTrackerPlugin, folder: TFolder, dashboard: TFile, frontmatter?: TFrontmatter) {
        super(plugin, folder, dashboard, frontmatter);
    }
}

//#endregion Dashboard Adapters
