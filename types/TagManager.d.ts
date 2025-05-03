import { EventRef, App } from "obsidian";
import RSSTrackerPlugin from "./main";
/**
 * Utility class to orchestrate the mapping of rss tags to tags into the domain
 * of the local knowledge graph.
 */
export declare class RSSTagManager {
    private _app;
    private _vault;
    private _plugin;
    private _metadataCache;
    private _tagmapMutex;
    /**
     * A snapshot of the tags cached by Obsidian.
     * Used by {@link mapHashtag} to hoist tags from RSS items directly
     * into the domain of the users's knowledge graph.
     */
    private _knownTagsCache;
    private _postProcessingRegistry;
    private _tagmap;
    private _pendingMappings;
    constructor(app: App, plugin: RSSTrackerPlugin);
    /**
     * Register a file for post processing hashtags in the note body.
     *
     * Post processing is performed by the event handler returnd from
     * {@link rssTagPostProcessor}.
     *
     * @param path Vault relative path to file
     * @returns the registered path
     */
    registerFileForPostProcessing(path: string): string;
    /**
     * Get or create the tag map file handle.
     * @returns a valid file handle to the tag map file located at {@link RSSTrackerSettings.rssTagmapPath}.
     */
    private getTagmapFile;
    /**
     * Update the in-memory tag map.
     *
     * The map is updated from:
     * - The persisted mapping table at {@link RSSTrackerSettings.rssTagmapPath}
     * - Hashtags in the rss domain from the Obsidian metadata cache.
     *
     * All unused mappings are removed
     */
    updateTagMap(): Promise<void>;
    /**
     * Commit any pending changes to the tag map file.
     */
    private commit;
    /**
     * Map a tag found in an rss item into the domain of the local knowledge graph.
     *
     * Following rules are applied:
     * - if the tag has already been cached by Obsidian, the hashtag is passed through unchanged
     * - if the tag is new, it is put into the rss domain and a default mapping is aaded to the tag map
     *   file located at {@link RSSTrackerSettings.rssTagmapPath}.
     * - if there is a mapping defined in the map file {@link RSSTrackerSettings.rssTagmapPath},
     *   the tag is mapped and changed in the text.
     *
     * @param rssHashtag A hashtag found in RSS item contents.
     * @returns mapped tag
     */
    mapHashtag(rssHashtag: string): string;
    /**
     * Load the mapping data into memory.
     *
     * Mappings are read from:
     * - the tag map file located at: {@link RSSTrackerSettings.rssTagmapPath}
     * - the tags cached by Obsidian.
     *
     */
    private loadTagmap;
    /**
     * Get the event handler to post-process RSS items.
     *
     * In order fo a RSS item file to be postprocessed it has to be registered with
     * {@link registerFileForPostProcessing} first.
     *
     * @returns Event handler reference object
     */
    get rssTagPostProcessor(): EventRef;
}
