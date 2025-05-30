import { EventRef, TFile, CachedMetadata, App, Notice } from 'obsidian';
import RSSTrackerPlugin from "./main";
import { TPropertyBag } from "./FeedAssembler";
import { RSSTrackerSettings } from "./settings";
import { MetadataCacheEx } from "./RSSFileManager";
import { RSSTrackerService } from './PluginServices';

/**
 * A critical section implementation to protect non-thread-save resources.
 */
class Mutex {
    private queue: (() => void)[] = [];
    private locked: boolean = false;

    async lock(): Promise<void> {
        if (this.locked) {
            await new Promise<void>(resolve => this.queue.push(resolve));
        } else {
            this.locked = true;
        }
    }

    unlock(): void {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next && next();
        } else {
            this.locked = false;
        }
    }
}

/**
 * Utility class to orchestrate the mapping of rss tags to tags into the domain
 * of the local knowledge graph.
 */
export class RSSTagManager extends RSSTrackerService {
    private _metadataCache: MetadataCacheEx;
    private _tagmapMutex = new Mutex();

    /**
     * A snapshot of the tags cached by Obsidian.
     * Used by {@link mapHashtag} to hoist tags from RSS items directly
     * into the domain of the users's knowledge graph.
     */
    private _knownTagsCache: TPropertyBag = {};
    private _postProcessingRegistry = new Set<string>();
    private _tagmap = new Map<string, string>(); // pagetag -> mapped hashtag.
    private _pendingMappings: string[] = [];

    constructor(app: App, plugin: RSSTrackerPlugin) {
        super(app, plugin);
        this._metadataCache = app.metadataCache as MetadataCacheEx;
    }

    /**
     * Get the tag mapping file (tagmap).
     *
     * If the map file does not exist it is created from a template.
     *
     * @returns A promise to a Tagmap file handle.
     */
    async ensureTagmapExists(): Promise<TFile> {
        const
            filemgr = this.plugin.filemgr,
            settings = this.plugin.settings,
            tagmapName = settings.rssTagmapName,
            tagmapPath = settings.rssHome + "/" + tagmapName + ".md";

        console.log(`Ensuring Tagmap: ${tagmapPath}`);
        let tagmap = this.vault.getFileByPath(tagmapPath);

        if (!tagmap) {
            // make a tagmap from a template
            tagmap = await filemgr.upsertFile(await filemgr.ensureRSShomeFolderExists(), tagmapName, "RSS Tagmap", {}, false);
            console.log("rss-tracker: tagmap created");
        }
        return tagmap;
    }

    /**
     * Register a file for post processing hashtags in the note body.
     *
     * Post processing is performed by the event handler returnd from
     * {@link rssTagPostProcessor}.
     *
     * @param path - Vault relative path to file
     * @returns the registered path
     */
    registerFileForPostProcessing(path: string): string {
        this._postProcessingRegistry.add(path);
        return path;
    }

    /**
     * Update the in-memory tag map.
     *
     * The map is updated from:
     * - The persisted mapping table at {@link RSSTrackerSettings.rssTagmapPath}
     * - Hashtags in the rss domain from the Obsidian metadata cache.
     *
     * All unused mappings are removed
     */
    async updateTagMap(): Promise<void> {
        await this._tagmapMutex.lock();
        // reload the file to catch external edits
        const prefix = await this.loadTagmap();

        let removed = 0;
        // load and register known tags
        this._knownTagsCache = this._metadataCache.getTags();
        for (const hashtag in this._knownTagsCache) {
            const
                usecount = this._knownTagsCache[hashtag],
                mapped = this._tagmap.get(hashtag);
            if (usecount === 1 && mapped === hashtag) {
                // this tag is unused
                removed++;
                this._tagmap.delete(hashtag);
            } else {
                this.mapHashtag(hashtag);
            }
        }
        if (removed > 0 && prefix) {
            // write an updated file
            const mapfile = await this.ensureTagmapExists();
            await this.vault.modify(mapfile, prefix[0] + "\n");
            this._pendingMappings = prefix.slice(1);
            for (let [hashtag, mappedTag] of this._tagmap) {
                this._pendingMappings.push(`| ${hashtag.slice(1)} | ${mappedTag} |`);
            }
            new Notice(`${removed} unused tags removed`, 30000);
        }
        // find idendity mappings in the
        // just in case new tags appeared when we weren't looking.
        this._tagmapMutex.unlock();
        await this.commit();
    }

    /**
     * Commit any pending changes to the tag map file.
     */
    private async commit(context?: string): Promise<void> {
        if (this._pendingMappings.length > 0) {
            await this._tagmapMutex.lock();
            const
                file = await this.ensureTagmapExists(),
                taglist = this._pendingMappings.map(row => `- ${row.split("|")[1]}`).join("\n");
            if (context) {
                new Notice(`${this._pendingMappings.length} new tags in ${context}\n` + taglist, 30000);
            }

            if (file) {
                const mappings = "\n" + this._pendingMappings.join("\n");
                console.log(`Tag map updated with: "${mappings}"`);
                this._pendingMappings = [];
                await this.vault.append(file, mappings);
            }
            this._tagmapMutex.unlock();
        } else {
            console.log("Nothing added to tag map.")
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
     * @param rssHashtag - A hashtag found in RSS item contents.
     * @returns mapped tag
     */
    mapHashtag(rssHashtag: string): string {
        if (!rssHashtag.startsWith("#rss/")) {
            if (this._knownTagsCache[rssHashtag]) {
                return rssHashtag;
            }
            rssHashtag = "#rss/" + rssHashtag.slice(1); // add to rss domain
        }

        let mapped = this._tagmap.get(rssHashtag);
        if (!mapped) {
            // update the map
            mapped = rssHashtag; // map to the domain tag
            this._tagmap.set(rssHashtag, mapped);
            this._pendingMappings.push(`| ${rssHashtag.slice(1)} | ${mapped} |`)
        }
        return mapped;
    }

    /**
     * Load the mapping data into memory.
     *
     * Mappings are read from:
     * - the tag map file located at: {@link RSSTrackerSettings.rssTagmapPath}
     * - the tags cached by Obsidian.
     *
     */
    private async loadTagmap(): Promise<string[] | null> {
        const mapfile = await this.ensureTagmapExists();
        console.log(`loading tag map from ${mapfile.path}`);
        const
            metadata = this._metadataCache.getFileCache(mapfile),
            sections = metadata?.sections;
        if (!sections) {
            return null;
        }

        // read and parse the mapfile
        const content = await this.vault.read(mapfile);
        for (const section of sections) {
            if (section.type === "table") {
                // everyting after the table start is supposed to belong to
                // table
                let errorCount = 0;
                const
                    tableOffset = section.position.start.offset,
                    rows = content.slice(tableOffset).split("\n"),
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
                            this._tagmap.set("#" + trimmedTagname, trimmedMappedTag);
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
                    console.log(`${errorCount} detected while parsing the tag map.`);
                }
                return [
                    content.slice(0, tableOffset).trim(),
                    rows[0],
                    rows[1]
                ];
            }
        }
        return null;
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
        return this.app.metadataCache.on("changed", async (item: TFile, content: string, metaData: CachedMetadata): Promise<void> => {
            if (!this._postProcessingRegistry.delete(item.path)) {
                // this file is not registered for postprocessing
                return
            }
            if (!metaData.frontmatter?.role) {
                // incomplete item - regeister for post processing
                this._postProcessingRegistry.add(item.path);
                return;
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
            }
            await this.commit(metaData.frontmatter?.feed); // update the tag map
        })
    };
}