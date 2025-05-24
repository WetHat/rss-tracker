import { TFile, TFolder } from 'obsidian';
import { TPropertyBag, TrackedRSSfeed, TrackedRSSitem } from "./FeedAssembler";
import { RSSfileManager } from "./RSSFileManager";
import RSSTrackerPlugin from "./main";
import { TDashboardPlacement } from './settings';
export declare type TFrontmatter = TPropertyBag;
/**
 * A constructable dashboard adapter signature.
 */
export interface IConstructableDashboard<T extends RSSdashboardAdapter> {
    new (plugin: RSSTrackerPlugin, folder: TFolder, file: TFile, frontmatter?: TFrontmatter): T;
}
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
export declare abstract class RSSAdapter {
    /**
     * The frontmatter of the underlying file. Either provided by the user or lazily evaluated from the file.
     */
    protected _frontmatter?: TFrontmatter;
    /**
     * The plugin instance this adapter is for.
     */
    plugin: RSSTrackerPlugin;
    /**
     * Get the (lazily evaluated) frontmatter of the underlying file.
     */
    get frontmatter(): TFrontmatter;
    /**
     * Remove the hash (`#`) from hashtags.
     * @param hashtags List of hashtags to convert to plain tags.
     * @returns Listof plain tags without the leading hash.
     */
    protected static toPlaintags(hashtags?: string[]): string[];
    /**
     * The Obsidian file this adapter is for.
     */
    file: TFile;
    /**
     * The frontmatter tags (without the `#`).
     */
    get tags(): string[];
    /**
     * Get the filemanager object used by the adapter.
     */
    get filemgr(): RSSfileManager;
    /**
     * Create a new adapter instance.
     * @param plugin the plugin instance.
     * @param file the file to create the adapter for.
     * @param frontmatter Frontmatter to use. If not provided, the frontmatter is read from the file.
     */
    protected constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter);
    /**
     * Commit all pending frontmatter changes.
     */
    commitFrontmatterChanges(): Promise<void>;
}
/**
 * Adapter base class for RSS folder dashboard files (Folder Note style).
 */
export declare abstract class RSSdashboardAdapter extends RSSAdapter {
    /**
     * Get the path to a RSS dashboard file for a given folder.
     *
     * @param folder The folder to get the dashboard for.
     * @param placement The placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
     * @returns Path to the RSS dashboard file. The dashboard may or may not exist.
     */
    static dashboardPath(folder: TFolder, placement: TDashboardPlacement): string;
    /**
     * Get the RSS dashboard file for a given folder.
     *
     * @param folder The folder to get the dashboard for.
     * @param placement The placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
     * @returns The RSS dashboard file or null if it does not exist.
     */
    static dashboard(folder: TFolder, placement: TDashboardPlacement): TFile | null;
    /**
     * Get the folder associated with a dashboard file.
     *
     * @param dashboard The dashboard file to get the folder for.
     * @returns The folder associated with the dashboard (if any).
     */
    static dashboardFolder(dashboard: TFile): TFolder | null;
    /**
     * Get name of a dashboard file for a given folder.
     *
     * ❗Uses the `folder Note` name template to generate the dashboard file name.
     *
     * @param folder The folder to get the dashboard name for.
     * @returns The name of the dashboard file (without the `.md` extension).
     */
    static dashboardName(folder: TFolder): string;
    /**
     * Factory method to create a new instance of an RSS dashboard adapter for a folder.
     *
     * @param cTor the constructor of the adapter to create.
     * @param plugin The plugin instance.
     * @param folder The folder to create the dashboard adapterfor.
     * @param placement The placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
     * @returns A new instance of an adapter of type `T` or `null` if the dashboard does not exist.
     */
    static createFromFolder<T extends RSSdashboardAdapter>(cTor: IConstructableDashboard<T>, plugin: RSSTrackerPlugin, folder: TFolder, placement: TDashboardPlacement): T | null;
    static createFromFile<T extends RSSdashboardAdapter>(cTor: IConstructableDashboard<T>, plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter): T | null;
    /**
     * The folder this dashboard is for.
     */
    folder: TFolder;
    constructor(plugin: RSSTrackerPlugin, folder: TFolder, file: TFile, frontmatter?: TFrontmatter);
}
/**
 * The adapter to an RSS item file.
 */
export declare class RSSitemAdapter extends RSSAdapter {
    static readonly EMBEDDING_MATCHER: RegExp;
    /**
     * **Note**. This property can only be changed by the user.
     * @returns `true` if the item is pinned and will not be deleted; `false` otherwise.
     */
    get pinned(): boolean;
    set feed(value: string);
    /**
     * Get the date the article described by this item was published.
     * @returns the date published in millisecondes since Jan 1st, 1970,
     */
    get published(): number;
    /**
     * The article web-link.
     *
     * @returns the hyperlink to the original article.
     */
    get link(): string;
    /**
     * THe unique id of this item
     * @returns A unique item identifier,
     */
    get id(): string;
    set tags(value: string[]);
    completeReadingTask(): Promise<boolean>;
    /**
     * Factory method to create a new instance of an RSS item
     * @param item - the parse item of an RSS feed.
     * @param feed - The feed this item is a part of
     * @returns A new instance of a RSS item file adapter.
     */
    static create(item: TrackedRSSitem, feed: RSSfeedAdapter): Promise<RSSitemAdapter>;
    constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter);
    remove(): Promise<void>;
}
export declare class RSSfeedAdapter extends RSSdashboardAdapter {
    static readonly SUSPENDED_STATUS_ICON = "\u23F9\uFE0F";
    static readonly RESUMED_STATUS_ICON = "\u25B6\uFE0F";
    static readonly ERROR_STATUS_ICON = "\u274C";
    static readonly OK_STATUS_ICON = "\u2705";
    static create(plugin: RSSTrackerPlugin, feed: TrackedRSSfeed, placement: TDashboardPlacement): Promise<RSSfeedAdapter>;
    get feeds(): RSSfeedAdapter[];
    constructor(plugin: RSSTrackerPlugin, folder: TFolder, feed: TFile, frontmatter?: TFrontmatter);
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
    get status(): string;
    private set status(value);
    /**
     * Get the feed update interval.
     * @returns the feed update interval in hours.
     */
    get interval(): number;
    /**
     * Set the feed update interval
     * @param value - the update interval in hours,
     */
    set interval(value: number);
    /**
     * The timestamp when the feed was last updated.
     * @returns the time in milliseconds since Jan 1st 1970.
     */
    get updated(): number;
    set updated(value: number);
    /**
     * Get the link to the rss feed
     * @returns hyperlink to the RSS feed.
     */
    get feedurl(): string;
    get itemlimit(): number;
    set itemlimit(value: number);
    /**
     * Get the feed suspension state.
     * @returns `true` if feed updates are suspended, `false` otherwise.
     */
    get suspended(): boolean;
    set suspended(value: boolean);
    set error(message: string);
    itemFolder(): TFolder;
    /**
     * Get all items in this RSS feed currently downloaded in Obsidian.
     * @returns adapter for all RSS items in an RSS feed.
     */
    get items(): RSSitemAdapter[];
    rename(newBasename: string): Promise<boolean>;
    /**
     * Update the RSS feed.
     *
     * @param feed - the adapter of the feed to update.
     * @returns the number of new items
     */
    update(feed: TrackedRSSfeed): Promise<number>;
    completeReadingTasks(): Promise<number>;
}
export declare class RSScollectionAdapter extends RSSAdapter {
    static create(plugin: RSSTrackerPlugin): Promise<RSScollectionAdapter>;
    constructor(plugin: RSSTrackerPlugin, collection: TFile, frontmatter?: TFrontmatter);
    get feeds(): RSSfeedAdapter[];
    completeReadingTasks(): Promise<number>;
}
