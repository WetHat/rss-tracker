import { TFile, normalizePath, TFolder, Notice, Plugin, htmlToMarkdown, TAbstractFile, ListItemCache } from 'obsidian';
import * as path from "path";
import { IRssMedium, TPropertyBag, TrackedRSSfeed, TrackedRSSitem } from "./FeedAssembler";
import { HTMLxlate, formatImage } from "./HTMLxlate";
import { RSSfileManager } from "./RSSFileManager";
import RSSTrackerPlugin from "./main";

export type TFrontmatter = TPropertyBag;

/**
 * THe base of all proxies for RSS related files.
 *
 * Provides support for transactional frontmatter property changes via
 * {@link commitFrontmatterChanges}.
 *
 * Derived classes implement specific get/set methods to access relevant frontmatter
 * properties.
 */
abstract class RSSProxy {
    protected frontmatter: TFrontmatter;
    plugin: RSSTrackerPlugin;

    /**
     * The Obsidian file an instanc of a derived classes is a proxy for.
     */
    file: TFile;

    get tags(): string[] {
        return this.frontmatter.tags && [];
    }

    get filemgr(): RSSfileManager {
        return this.plugin.filemgr;
    }

    protected constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter?: TFrontmatter) {
        this.plugin = plugin;
        this.frontmatter = frontmatter ?? (plugin.app.metadataCache.getFileCache(file) ?? {});
        this.file = file;
    }

    /**
     * Commit all pending frontmatter changes.
     */
    async commitFrontmatterChanges(): Promise<void> {
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
 * The proxy of an RSS item.
 */
export class RSSitemProxy extends RSSProxy {
    /**
     * **Note**. This property can only be changed by the user.
     * @returns `true` if the item is pinned and will not be deleted; `false` otherwise.
     */
    get pinned(): boolean {
        return this.frontmatter.pinned === true;
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
     * @return the hyperlink to the original article.
     */
    get link(): string {
        return this.frontmatter.link;
    }

    /**
     * THe unique id of this item
     * @return A unique item identifier,
     */
    get id(): string {
        return this.frontmatter.id ?? this.link;
    }

    set tags(value: string[]) {
        const tagmgr = this.plugin.tagmgr;
        this.frontmatter.tags = value.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1));
    }

    async completeReadingTask(): Promise<void> {
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
        }
    }

    /**
     * Factory methos to create a new instance of an RSS item
     * @param item the parse item of an RSS feed.
     * @param feed The feed this item is a part of
     * @returns A new instance of a RSS item file proxy.
     */
    static async create(item: TrackedRSSitem, feed: RSSfeedProxy): Promise<RSSitemProxy> {
        let { id, tags, title, link, description, published, author, image, content } = item;

        const html = HTMLxlate.instance;

        if (description) {
            description = html.fragmentAsMarkdown(description);
        }
        if (content) {
            content = html.fragmentAsMarkdown(content);
        }

        const byline = author ? ` by ${author}` : "";
        title = `${title}${byline} - ${published}`;

        if (!content && description && description.length > 500) {
            content = description
        }

        const defaultImage = await feed.plugin.settings.getRssDefaultImagePath();

        if (description) {
            const teaser = (description.length > 500 ? (description.substring(0, 500) + "⋯") : description);
            description = teaser.replaceAll("\n", "\n> ");
        }

        // fill in the template
        const
            itemfolder = await feed.itemFolder(),
            tagmgr = feed.plugin.tagmgr,
            frontmatter: TFrontmatter = {
                role: "rssitem",
                id: id ?? link,
                author: author ?? "Unknown",
                link: link ?? "",
                published: published ?? new Date().valueOf(),
                feed: `[[${itemfolder.name}]]`,
                pinned: false,
                tags: tags.map(t => tagmgr.mapHashtag(t.startsWith("#") ? t : "#" + t).slice(1)),
            },
            dataMap = {
                "{{id}}": frontmatter.id,
                "{{author}}": frontmatter.author,
                "{{link}}": frontmatter.link,
                "{{publishDate}}": frontmatter.published,
                "{{tags}}": frontmatter.tags,
                "{{title}}": title ?? "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|200x200]]{.rss-image}`,
                "{{description}}": description ?? "",
                "{{content}}": content ?? "",
                "{{feedFileName}}": itemfolder.name,
            };
        const
            file = await feed.filemgr.createFile(itemfolder.path, item.fileName, "RSS Item", dataMap, true),
            proxy = new RSSitemProxy(feed.plugin, file, frontmatter);
        return proxy;
    }

    constructor(plugin: RSSTrackerPlugin, file: TFile, frontmatter: TFrontmatter) {
        super(plugin, file, frontmatter);
    }

    async remove() {
        await this.plugin.app.vault.adapter.remove(this.file.path);
    }
}

export class RSSfeedProxy extends RSSProxy {
    static readonly SUSPENDED_STATUS_ICON = "⏹️";
    static readonly RESUMED_STATUS_ICON = "▶️";
    static readonly ERROR_STATUS_ICON = "❌";
    static readonly OK_STATUS_ICON = "✅";

    private _folder?: TFolder; // lazily evaluated

    static async create(plugin: RSSTrackerPlugin, feed: TrackedRSSfeed): Promise<RSSfeedProxy> {
        const
            { title, site, description } = feed,
            defaultImage: string = await plugin.settings.getRssDefaultImagePath(),
            image: IRssMedium | string | undefined = feed.image,
            frontmatter: TFrontmatter = {
                role: "rssfeed",
                feedurl: feed.source,
                site: site ?? "Unknown",
                itemlimit: plugin.settings.defaultItemLimit,
                tags: [],
            },
            dataMap = {
                "{{feedUrl}}": frontmatter.feedurl,
                "{{siteUrl}}": frontmatter.site,
                "{{title}}": htmlToMarkdown(title ?? ""),
                "{{description}}": description ? htmlToMarkdown(description) : "",
                "{{image}}": image ? formatImage(image) : `![[${defaultImage}|200x200]]{.rss-image}`
            };

        // create the feed dashboard file
        const
            filemgr = plugin.filemgr,
            dashboard = await filemgr.createFile(plugin.settings.rssFeedFolderPath, feed.fileName, "RSS Feed", dataMap),
            proxy = new RSSfeedProxy(plugin, dashboard, frontmatter);

        try {
            await proxy.update(feed);
        } catch (err: any) {
            console.error(err);
            proxy.error = err.message;
        }

        await proxy.commitFrontmatterChanges();
        return proxy;
    }

    constructor(plugin: RSSTrackerPlugin, feed: TFile, frontmatter?: TFrontmatter) {
        super(plugin, feed, frontmatter);
        this._folder = feed.vault.getFolderByPath(this.itemFolderPath) ?? undefined;
    }

    /**
     * Get the fedd suspension state.
     * @returns `true` if feed updates are suspended, `false` otherwise.
     */
    get suspended(): boolean {
        return this.frontmatter.status?.startsWith(RSSfeedProxy.SUSPENDED_STATUS_ICON) ?? false;
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
     * @param value the update interval in hours,
     */
    set interval(value: number) {
        this.frontmatter.interval = value;
    }

    /**
     * The timestamp when the feed was last updated.
     * @return the time in milliseconds since Jan 1st 1970.
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

    suspendUpdates() {
        this.status = RSSfeedProxy.SUSPENDED_STATUS_ICON + "suspended";
    }

    resumeUpdates() {
        this.status = RSSfeedProxy.RESUMED_STATUS_ICON + "resumed updates";
    }

    set error(message: string) {
        this.status = RSSfeedProxy.ERROR_STATUS_ICON + message;
    }

    private get itemFolderPath(): string {
        return normalizePath(path.join(this.file.parent?.path ?? "", this.file.basename));
    }

    async itemFolder(): Promise<TFolder> {
        if (!this._folder) {
            this._folder = await this.plugin.app.vault.createFolder(this.itemFolderPath);
        }
        return this._folder;
    }

    /**
     * Get all items in this RSS feed currently in Obsidian.
     * @return proxies for all RSS items in an RSS feed.
     */
    get items(): RSSitemProxy[] {
        return this._folder ? this._folder.children
            .map((c: TAbstractFile) => (c instanceof TFile && c.extension === "md") ? this.filemgr.getProxy(c) : undefined)
            .filter(p => p instanceof RSSitemProxy) as RSSitemProxy[] : [];
    }

    /**
     *
     * @param feed Update the RSS feed.
     * @returns
     */
    async update(feed: TrackedRSSfeed): Promise<number> {
        // build a map of RSS items already existing in the feed folder

        const oldItemsMap = new Map<string, RSSitemProxy>(); // mapping item ID -> item proxy
        for (const item of this.items) {
            oldItemsMap.set(item.id, item);
        }

        // Inspect the downloaded feed and determine which of its items are not already present
        // and need to be saved to disk.
        const newRSSitems: TrackedRSSitem[] = feed.items
            .slice(0, this.itemlimit) // do not use anything beyond the item limit
            .filter(itm => !oldItemsMap.has(itm.id));

        if (newRSSitems.length > 0) {

            // obtain an oldest-first list of remainong RSS item files
            const oldItems: RSSitemProxy[] = Array.from(oldItemsMap.values())
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
                    await RSSitemProxy.create(newItem, this);
                } catch (err: any) {
                    console.error(`Failed to save RSS item '${newItem.title}' in feed '${this.file.name}'; error: ${err.message}`);
                    new Notice(`Could not save '${newItem.fileName}' in feed '${this.file.name}': ${err.message}`);
                }
            }
        }
        this.status = RSSfeedProxy.OK_STATUS_ICON;
        this.updated = new Date().valueOf();
        this.interval = feed.avgPostInterval;
        await this.commitFrontmatterChanges();
        return newRSSitems.length;
    }
}
