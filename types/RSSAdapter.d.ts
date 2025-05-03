import { TFile, TFolder } from 'obsidian';
import { TPropertyBag, TrackedRSSfeed, TrackedRSSitem } from "./FeedAssembler";
import { RSSfileManager } from "./RSSFileManager";
import RSSTrackerPlugin from "./main";
export declare type TFrontmatter = TPropertyBag;
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
declare abstract class RSSAdapter {
    protected frontmatter: TFrontmatter;
    plugin: RSSTrackerPlugin;
    protected static toPlaintags(hashtags?: string[]): string[];
    /**
     * The Obsidian file an instance of a derived classes is an adapter to.
     */
    file: TFile;
    get tags(): string[];
    get filemgr(): RSSfileManager;
    protected constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter);
    /**
     * Commit all pending frontmatter changes.
     */
    commitFrontmatterChanges(): Promise<void>;
}
/**
 * The adapter to an RSS item.
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
     * The article link.
     *
     * @return the hyperlink to the original article.
     */
    get link(): string;
    /**
     * THe unique id of this item
     * @return A unique item identifier,
     */
    get id(): string;
    set tags(value: string[]);
    completeReadingTask(): Promise<boolean>;
    /**
     * Factory methos to create a new instance of an RSS item
     * @param item the parse item of an RSS feed.
     * @param feed The feed this item is a part of
     * @returns A new instance of a RSS item file adapter.
     */
    static create(item: TrackedRSSitem, feed: RSSfeedAdapter): Promise<RSSitemAdapter>;
    constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter: TFrontmatter);
    remove(): Promise<void>;
}
export declare class RSSfeedAdapter extends RSSAdapter {
    static readonly SUSPENDED_STATUS_ICON = "\u23F9\uFE0F";
    static readonly RESUMED_STATUS_ICON = "\u25B6\uFE0F";
    static readonly ERROR_STATUS_ICON = "\u274C";
    static readonly OK_STATUS_ICON = "\u2705";
    private _folder?;
    static create(plugin: RSSTrackerPlugin, feed: TrackedRSSfeed): Promise<RSSfeedAdapter>;
    constructor(plugin: RSSTrackerPlugin, feed: TFile, frontmatter?: TFrontmatter);
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
     * @param value the update interval in hours,
     */
    set interval(value: number);
    /**
     * The timestamp when the feed was last updated.
     * @return the time in milliseconds since Jan 1st 1970.
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
     * Get the fedd suspension state.
     * @returns `true` if feed updates are suspended, `false` otherwise.
     */
    get suspended(): boolean;
    set suspended(value: boolean);
    set error(message: string);
    private get itemFolderPath();
    itemFolder(): Promise<TFolder>;
    /**
     * Get all items in this RSS feed currently in Obsidian.
     * @return proxies for all RSS items in an RSS feed.
     */
    get items(): RSSitemAdapter[];
    rename(newBasename: string): Promise<boolean>;
    /**
     * Update the RSS feed.
     *
     * @param feed the adapter of the feed to update.
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
export {};
