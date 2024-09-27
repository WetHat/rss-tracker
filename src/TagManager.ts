import { EventRef, TFile, CachedMetadata, App, MetadataCache, Vault, Notice } from "obsidian";
import RSSTrackerPlugin from "./main";
import { TPropertyBag } from "./FeedAssembler";
import { RSSTrackerSettings } from "./settings";

type MetadataCacheEx = MetadataCache & {
    getTags(): TPropertyBag; // undocumented non-API method
}

/**
 * Utility class to orchestrate the mapping of rss tags to tags into the domain
 * of the local knowledge graph.
 */
export class RSSTagManager {
    private _app: App;
    private _vault: Vault;
    private _plugin: RSSTrackerPlugin;
    private _metadataCache: MetadataCacheEx;

    /**
     * A snapshot of the tags cached by Obsidian.
     * Used by {@link mapHashtag} to hoist tags from RSS items directly
     * into the domain of the users's knowledge graph.
     */
    private _knownTagsCache: TPropertyBag = {};
    private _postProcessingRegistry = new Set();
    private _tagmap: TPropertyBag = {};
    private _pendingMappings: string[] = [];

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this._app = app;
        this._plugin = plugin;
        this._metadataCache = app.metadataCache as MetadataCacheEx;
        this._vault = app.vault;
    }

    /**
     * Register a file for post processing hashtags in the note body.
     *
     * Post processing is performed by the event handler returnd from
     * {@link rssTagPostProcessor}.
     *
     * @param path Vault relative path to file
     * @returns the registered path
     */
    registerFileForPostProcessing(path: string): string {
        this._postProcessingRegistry.add(path);
        return path;
    }

    /**
     * Get or create the tag map file handle.
     * @returns a valid file handle to the tag map file located at {@link RSSTrackerSettings.rssTagmapPath}.
     */
    private async getTagmapFile(): Promise<TFile | null> {
        let tagmap = this._vault.getFileByPath(this._plugin.settings.rssTagmapPath);
        if (!tagmap) {
            // install it
            await this._plugin.settings.install();
        }
        return this._vault.getFileByPath(this._plugin.settings.rssTagmapPath);
    }

    /**
     * Update the in-memory tag map.
     *
     * The map is update fron:
     * - The persisted mapping table at {@link RSSTrackerSettings.rssTagmapPath}
     * - Hashtags in the rss domain from the Obsidian metadata cache.
     */
    async updateTagMap(): Promise<void> {
        // reload the file to catch external edits
        await this.loadTagmap();
        // load and register known tags
        this._knownTagsCache = this._metadataCache.getTags();
        for (const tag in this._knownTagsCache) {
            this.mapHashtag(tag);
        }
        // just in case new tags appeared when we weren't looking.
        await this.commit();
    }

    /**
     * Commit any pending changes to the tag map file.
     */
    private async commit(): Promise<void> {
        if (this._pendingMappings.length > 0) {
            const
                file = await this.getTagmapFile(),
                taglist = this._pendingMappings.map(row => `- ${row.split("|")[1]}`).join("\n");
            new Notice(this._pendingMappings.length + " new tags\n" + taglist,30000);
            if (file) {
                const mappings = "\n" + this._pendingMappings.join("\n");
                console.log(`Tag map updated with: "${mappings}"`);
                this._pendingMappings = [];
                await this._vault.append(file, mappings);
            }
        } else {
            console.log("Noting added to tag map.")
        }
    }

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
    mapHashtag(rssHashtag: string): string {
        if (!rssHashtag.startsWith("#rss/")) {
            if (this._knownTagsCache[rssHashtag]) {
                return rssHashtag;
            }
            rssHashtag = "#rss/" + rssHashtag.slice(1); // add to rss domain
        }

        let mapped = this._tagmap[rssHashtag];
        if (!mapped) {
            // update the map
            mapped = rssHashtag; // map to the domain tag
            this._tagmap[rssHashtag] = mapped;
            this._pendingMappings.push(`| ${rssHashtag.slice(1)} | ${mapped} |`)
        }
        return mapped;
    }

    /**
     * Load tg mapping data into memors.
     *
     * Mappings are read from:
     * - the tag map file located at: {@link RSSTrackerSettings.rssTagmapPath}
     * - the tags cached by Obsidian.
     *
     */
    async loadTagmap() {
        const mapfile = await this.getTagmapFile();
        if (!mapfile) {
            return
        }
        console.log(`loading tag map from ${mapfile.path}`);
        const
            metadata = this._metadataCache.getFileCache(mapfile),
            sections = metadata?.sections;
        if (!sections) {
            return
        }

        // read and parse the mapfile
        const content = await this._vault.read(mapfile);
        for (const section of sections) {
            if (section.type === "table") {
                // everyting after the table start is supposed to belong to
                // table
                let errorCount = 0;
                const
                    rows = content.slice(section.position.start.offset).split("\n"),
                    rowCount = rows.length;
                for (let i = 2; i < rowCount; i++) { // omit the table header
                    const
                        row = rows[i],
                        [_, rssTagname, mappedTag] = row.split("|");
                    if (rssTagname && mappedTag) {
                        const
                            trimmedTagname = rssTagname.trim(),
                            trimmedMappedTag = mappedTag.trim();
                        if (trimmedTagname && trimmedMappedTag) {
                            this._tagmap["#" + trimmedTagname] = trimmedMappedTag;
                        } else {
                            console.log(`ERROR rssTagname: "${rssTagname}"; mappedTag: "${mappedTag}"`);
                            errorCount++;
                        }
                    }
                    else {
                        console.log(`ERROR rssTagname: "${rssTagname}"; mappedTag: "${mappedTag}"`);
                        errorCount++;
                    }
                }
                if (errorCount > 0) {
                    console.log(`${errorCount} detected whilc pasing the tag map.`);
                }

                break;
            }
        }
    }

    /**
     * Get the event handler to post-process RSS items.
     *
     * In order fo a RSS item file to be postprocessed it has to be registered with
     * {@link registerFileForPostProcessing} first.
     *
     * @returns Event handler reference object
     */
    get rssTagPostProcessor(): EventRef {

        return this._app.metadataCache.on("changed", async (item: TFile, content: string, metaData: CachedMetadata): Promise<void> => {
            if (!this._postProcessingRegistry.delete(item.path)) {
                // this file is not registered for posprocessing
                return
            }
            console.log(`Post Processing "${item.path}"`);
            const tags = metaData.tags;
            if (tags) {
                const
                    tagCount = tags.length,
                    parts = new Array<string>(tagCount * 2 + 1);
                let j = 0,
                    lastOffset = 0,
                    modified = false;
                for (let i = 0; i < tagCount; i++) {
                    const
                        tag = tags[i],
                        pos = tag.position,
                        s = pos.start.offset,
                        e = pos.end.offset;
                    parts[j++] = content.slice(lastOffset, s); // content between tags
                    const
                        hashtag = content.slice(s, e),
                        mappedTag = this.mapHashtag(hashtag);
                    modified ||= hashtag !== mappedTag;
                    parts[j++] = mappedTag;
                    lastOffset = e;
                }
                // trailing text
                parts[j++] = content.slice(lastOffset).trimEnd();
                if (modified) {
                    await item.vault.modify(item, parts.join("")); // save the updatedd RSS item
                }
                await this.commit(); // update the tag map
            }
        })
    };
}