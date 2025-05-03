import { __awaiter } from "tslib";
import { Notice } from "obsidian";
/**
 * A critical section implementation to protect non-thread-save resources.
 */
class Mutex {
    constructor() {
        this.queue = [];
        this.locked = false;
    }
    lock() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.locked) {
                yield new Promise(resolve => this.queue.push(resolve));
            }
            else {
                this.locked = true;
            }
        });
    }
    unlock() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next && next();
        }
        else {
            this.locked = false;
        }
    }
}
/**
 * Utility class to orchestrate the mapping of rss tags to tags into the domain
 * of the local knowledge graph.
 */
export class RSSTagManager {
    constructor(app, plugin) {
        this._tagmapMutex = new Mutex();
        /**
         * A snapshot of the tags cached by Obsidian.
         * Used by {@link mapHashtag} to hoist tags from RSS items directly
         * into the domain of the users's knowledge graph.
         */
        this._knownTagsCache = {};
        this._postProcessingRegistry = new Set();
        this._tagmap = new Map(); // pagetag -> mapped hashtag.
        this._pendingMappings = [];
        this._app = app;
        this._plugin = plugin;
        this._metadataCache = app.metadataCache;
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
    registerFileForPostProcessing(path) {
        this._postProcessingRegistry.add(path);
        return path;
    }
    /**
     * Get or create the tag map file handle.
     * @returns a valid file handle to the tag map file located at {@link RSSTrackerSettings.rssTagmapPath}.
     */
    getTagmapFile() {
        return __awaiter(this, void 0, void 0, function* () {
            let tagmap = this._vault.getFileByPath(this._plugin.settings.rssTagmapPath);
            if (!tagmap) {
                // install it
                yield this._plugin.settings.install();
            }
            return this._vault.getFileByPath(this._plugin.settings.rssTagmapPath);
        });
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
    updateTagMap() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._tagmapMutex.lock();
            // reload the file to catch external edits
            const prefix = yield this.loadTagmap();
            let removed = 0;
            // load and register known tags
            this._knownTagsCache = this._metadataCache.getTags();
            for (const hashtag in this._knownTagsCache) {
                const usecount = this._knownTagsCache[hashtag], mapped = this._tagmap.get(hashtag);
                if (usecount === 1 && mapped === hashtag) {
                    // this tag is unused
                    removed++;
                    this._tagmap.delete(hashtag);
                }
                else {
                    this.mapHashtag(hashtag);
                }
            }
            if (removed > 0 && prefix) {
                // write an updated file
                const mapfile = yield this.getTagmapFile();
                if (mapfile) {
                    yield this._vault.modify(mapfile, prefix[0] + "\n");
                    this._pendingMappings = prefix.slice(1);
                    for (let [hashtag, mappedTag] of this._tagmap) {
                        this._pendingMappings.push(`| ${hashtag.slice(1)} | ${mappedTag} |`);
                    }
                    new Notice(`${removed} unused tags removed`, 30000);
                }
            }
            // find idendity mappings in the
            // just in case new tags appeared when we weren't looking.
            this._tagmapMutex.unlock();
            yield this.commit();
        });
    }
    /**
     * Commit any pending changes to the tag map file.
     */
    commit(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._pendingMappings.length > 0) {
                yield this._tagmapMutex.lock();
                const file = yield this.getTagmapFile(), taglist = this._pendingMappings.map(row => `- ${row.split("|")[1]}`).join("\n");
                if (context) {
                    new Notice(`${this._pendingMappings.length} new tags in ${context}\n` + taglist, 30000);
                }
                if (file) {
                    const mappings = "\n" + this._pendingMappings.join("\n");
                    console.log(`Tag map updated with: "${mappings}"`);
                    this._pendingMappings = [];
                    yield this._vault.append(file, mappings);
                }
                this._tagmapMutex.unlock();
            }
            else {
                console.log("Nothing added to tag map.");
            }
        });
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
    mapHashtag(rssHashtag) {
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
            this._pendingMappings.push(`| ${rssHashtag.slice(1)} | ${mapped} |`);
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
    loadTagmap() {
        return __awaiter(this, void 0, void 0, function* () {
            const mapfile = yield this.getTagmapFile();
            if (!mapfile) {
                return null;
            }
            console.log(`loading tag map from ${mapfile.path}`);
            const metadata = this._metadataCache.getFileCache(mapfile), sections = metadata === null || metadata === void 0 ? void 0 : metadata.sections;
            if (!sections) {
                return null;
            }
            // read and parse the mapfile
            const content = yield this._vault.read(mapfile);
            for (const section of sections) {
                if (section.type === "table") {
                    // everyting after the table start is supposed to belong to
                    // table
                    let errorCount = 0;
                    const tableOffset = section.position.start.offset, rows = content.slice(tableOffset).split("\n"), rowCount = rows.length;
                    for (let i = 2; i < rowCount; i++) { // omit the table header
                        const row = rows[i], [_, rssTagname, mappedTag] = row.split("|");
                        if (rssTagname && mappedTag) {
                            const trimmedTagname = rssTagname.trim(), trimmedMappedTag = mappedTag.trim();
                            if (trimmedTagname && trimmedMappedTag) {
                                this._tagmap.set("#" + trimmedTagname, trimmedMappedTag);
                            }
                            else {
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
        });
    }
    /**
     * Get the event handler to post-process RSS items.
     *
     * In order fo a RSS item file to be postprocessed it has to be registered with
     * {@link registerFileForPostProcessing} first.
     *
     * @returns Event handler reference object
     */
    get rssTagPostProcessor() {
        return this._app.metadataCache.on("changed", (item, content, metaData) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this._postProcessingRegistry.delete(item.path)) {
                // this file is not registered for postprocessing
                return;
            }
            console.log(`Post Processing "${item.path}"`);
            const tags = metaData.tags;
            if (tags) {
                const tagCount = tags.length, parts = new Array(tagCount * 2 + 1);
                let j = 0, lastOffset = 0, modified = false;
                for (let i = 0; i < tagCount; i++) {
                    const tag = tags[i], pos = tag.position, s = pos.start.offset, e = pos.end.offset;
                    parts[j++] = content.slice(lastOffset, s); // content between tags
                    const hashtag = content.slice(s, e), mappedTag = this.mapHashtag(hashtag);
                    modified || (modified = hashtag !== mappedTag);
                    parts[j++] = mappedTag;
                    lastOffset = e;
                }
                // trailing text
                parts[j++] = content.slice(lastOffset).trimEnd();
                if (modified) {
                    yield item.vault.modify(item, parts.join("")); // save the updatedd RSS item
                }
            }
            yield this.commit((_a = metaData.frontmatter) === null || _a === void 0 ? void 0 : _a.feed); // update the tag map
        }));
    }
    ;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFnTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9UYWdNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQStDLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQU0vRTs7R0FFRztBQUNILE1BQU0sS0FBSztJQUFYO1FBQ1ksVUFBSyxHQUFtQixFQUFFLENBQUM7UUFDM0IsV0FBTSxHQUFZLEtBQUssQ0FBQztJQWtCcEMsQ0FBQztJQWhCUyxJQUFJOztZQUNOLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtnQkFDYixNQUFNLElBQUksT0FBTyxDQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNoRTtpQkFBTTtnQkFDSCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzthQUN0QjtRQUNMLENBQUM7S0FBQTtJQUVELE1BQU07UUFDRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hDLElBQUksSUFBSSxJQUFJLEVBQUUsQ0FBQztTQUNsQjthQUFNO1lBQ0gsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7U0FDdkI7SUFDTCxDQUFDO0NBQ0o7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sYUFBYTtJQWtCdEIsWUFBWSxHQUFRLEVBQUUsTUFBd0I7UUFadEMsaUJBQVksR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO1FBRW5DOzs7O1dBSUc7UUFDSyxvQkFBZSxHQUFpQixFQUFFLENBQUM7UUFDbkMsNEJBQXVCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNwQyxZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUMsQ0FBQyw2QkFBNkI7UUFDbEUs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Q0FBQyxDQUFDLENBQUMsNkJBQTZCO2lCQUMvRTthQUNKO1lBQ0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQUEsUUFBUSxDQUFDLFdBQVcsMENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7UUFDeEUsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFBQSxDQUFDO0NBQ0wiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudFJlZiwgVEZpbGUsIENhY2hlZE1ldGFkYXRhLCBBcHAsIFZhdWx0LCBOb3RpY2UgfSBmcm9tIFwib2JzaWRpYW5cIjtcclxuaW1wb3J0IFJTU1RyYWNrZXJQbHVnaW4gZnJvbSBcIi4vbWFpblwiO1xyXG5pbXBvcnQgeyBUUHJvcGVydHlCYWcgfSBmcm9tIFwiLi9GZWVkQXNzZW1ibGVyXCI7XHJcbmltcG9ydCB7IFJTU1RyYWNrZXJTZXR0aW5ncyB9IGZyb20gXCIuL3NldHRpbmdzXCI7XHJcbmltcG9ydCB7IE1ldGFkYXRhQ2FjaGVFeCB9IGZyb20gXCIuL1JTU0ZpbGVNYW5hZ2VyXCI7XHJcblxyXG4vKipcclxuICogQSBjcml0aWNhbCBzZWN0aW9uIGltcGxlbWVudGF0aW9uIHRvIHByb3RlY3Qgbm9uLXRocmVhZC1zYXZlIHJlc291cmNlcy5cclxuICovXHJcbmNsYXNzIE11dGV4IHtcclxuICAgIHByaXZhdGUgcXVldWU6ICgoKSA9PiB2b2lkKVtdID0gW107XHJcbiAgICBwcml2YXRlIGxvY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGFzeW5jIGxvY2soKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgaWYgKHRoaXMubG9ja2VkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4gdGhpcy5xdWV1ZS5wdXNoKHJlc29sdmUpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVubG9jaygpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5xdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLnF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIG5leHQgJiYgbmV4dCgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVXRpbGl0eSBjbGFzcyB0byBvcmNoZXN0cmF0ZSB0aGUgbWFwcGluZyBvZiByc3MgdGFncyB0byB0YWdzIGludG8gdGhlIGRvbWFpblxyXG4gKiBvZiB0aGUgbG9jYWwga25vd2xlZGdlIGdyYXBoLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJTU1RhZ01hbmFnZXIge1xyXG4gICAgcHJpdmF0ZSBfYXBwOiBBcHA7XHJcbiAgICBwcml2YXRlIF92YXVsdDogVmF1bHQ7XHJcbiAgICBwcml2YXRlIF9wbHVnaW46IFJTU1RyYWNrZXJQbHVnaW47XHJcbiAgICBwcml2YXRlIF9tZXRhZGF0YUNhY2hlOiBNZXRhZGF0YUNhY2hlRXg7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGFnbWFwTXV0ZXggPSBuZXcgTXV0ZXgoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEEgc25hcHNob3Qgb2YgdGhlIHRhZ3MgY2FjaGVkIGJ5IE9ic2lkaWFuLlxyXG4gICAgICogVXNlZCBieSB7QGxpbmsgbWFwSGFzaHRhZ30gdG8gaG9pc3QgdGFncyBmcm9tIFJTUyBpdGVtcyBkaXJlY3RseVxyXG4gICAgICogaW50byB0aGUgZG9tYWluIG9mIHRoZSB1c2VycydzIGtub3dsZWRnZSBncmFwaC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfa25vd25UYWdzQ2FjaGU6IFRQcm9wZXJ0eUJhZyA9IHt9O1xyXG4gICAgcHJpdmF0ZSBfcG9zdFByb2Nlc3NpbmdSZWdpc3RyeSA9IG5ldyBTZXQoKTtcclxuICAgIHByaXZhdGUgX3RhZ21hcCA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7IC8vIHBhZ2V0YWcgLT4gbWFwcGVkIGhhc2h0YWcuXHJcbiAgICBwcml2YXRlIF9wZW5kaW5nTWFwcGluZ3M6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLl9wbHVnaW4gPSBwbHVnaW47XHJcbiAgICAgICAgdGhpcy5fbWV0YWRhdGFDYWNoZSA9IGFwcC5tZXRhZGF0YUNhY2hlIGFzIE1ldGFkYXRhQ2FjaGVFeDtcclxuICAgICAgICB0aGlzLl92YXVsdCA9IGFwcC52YXVsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlZ2lzdGVyIGEgZmlsZSBmb3IgcG9zdCBwcm9jZXNzaW5nIGhhc2h0YWdzIGluIHRoZSBub3RlIGJvZHkuXHJcbiAgICAgKlxyXG4gICAgICogUG9zdCBwcm9jZXNzaW5nIGlzIHBlcmZvcm1lZCBieSB0aGUgZXZlbnQgaGFuZGxlciByZXR1cm5kIGZyb21cclxuICAgICAqIHtAbGluayByc3NUYWdQb3N0UHJvY2Vzc29yfS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBWYXVsdCByZWxhdGl2ZSBwYXRoIHRvIGZpbGVcclxuICAgICAqIEByZXR1cm5zIHRoZSByZWdpc3RlcmVkIHBhdGhcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJGaWxlRm9yUG9zdFByb2Nlc3NpbmcocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICB0aGlzLl9wb3N0UHJvY2Vzc2luZ1JlZ2lzdHJ5LmFkZChwYXRoKTtcclxuICAgICAgICByZXR1cm4gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBvciBjcmVhdGUgdGhlIHRhZyBtYXAgZmlsZSBoYW5kbGUuXHJcbiAgICAgKiBAcmV0dXJucyBhIHZhbGlkIGZpbGUgaGFuZGxlIHRvIHRoZSB0YWcgbWFwIGZpbGUgbG9jYXRlZCBhdCB7QGxpbmsgUlNTVHJhY2tlclNldHRpbmdzLnJzc1RhZ21hcFBhdGh9LlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFzeW5jIGdldFRhZ21hcEZpbGUoKTogUHJvbWlzZTxURmlsZSB8IG51bGw+IHtcclxuICAgICAgICBsZXQgdGFnbWFwID0gdGhpcy5fdmF1bHQuZ2V0RmlsZUJ5UGF0aCh0aGlzLl9wbHVnaW4uc2V0dGluZ3MucnNzVGFnbWFwUGF0aCk7XHJcbiAgICAgICAgaWYgKCF0YWdtYXApIHtcclxuICAgICAgICAgICAgLy8gaW5zdGFsbCBpdFxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9wbHVnaW4uc2V0dGluZ3MuaW5zdGFsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdmF1bHQuZ2V0RmlsZUJ5UGF0aCh0aGlzLl9wbHVnaW4uc2V0dGluZ3MucnNzVGFnbWFwUGF0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgdGhlIGluLW1lbW9yeSB0YWcgbWFwLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBtYXAgaXMgdXBkYXRlZCBmcm9tOlxyXG4gICAgICogLSBUaGUgcGVyc2lzdGVkIG1hcHBpbmcgdGFibGUgYXQge0BsaW5rIFJTU1RyYWNrZXJTZXR0aW5ncy5yc3NUYWdtYXBQYXRofVxyXG4gICAgICogLSBIYXNodGFncyBpbiB0aGUgcnNzIGRvbWFpbiBmcm9tIHRoZSBPYnNpZGlhbiBtZXRhZGF0YSBjYWNoZS5cclxuICAgICAqXHJcbiAgICAgKiBBbGwgdW51c2VkIG1hcHBpbmdzIGFyZSByZW1vdmVkXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHVwZGF0ZVRhZ01hcCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLl90YWdtYXBNdXRleC5sb2NrKCk7XHJcbiAgICAgICAgLy8gcmVsb2FkIHRoZSBmaWxlIHRvIGNhdGNoIGV4dGVybmFsIGVkaXRzXHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gYXdhaXQgdGhpcy5sb2FkVGFnbWFwKCk7XHJcblxyXG4gICAgICAgIGxldCByZW1vdmVkID0gMDtcclxuICAgICAgICAvLyBsb2FkIGFuZCByZWdpc3RlciBrbm93biB0YWdzXHJcbiAgICAgICAgdGhpcy5fa25vd25UYWdzQ2FjaGUgPSB0aGlzLl9tZXRhZGF0YUNhY2hlLmdldFRhZ3MoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGhhc2h0YWcgaW4gdGhpcy5fa25vd25UYWdzQ2FjaGUpIHtcclxuICAgICAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgICAgIHVzZWNvdW50ID0gdGhpcy5fa25vd25UYWdzQ2FjaGVbaGFzaHRhZ10sXHJcbiAgICAgICAgICAgICAgICBtYXBwZWQgPSB0aGlzLl90YWdtYXAuZ2V0KGhhc2h0YWcpO1xyXG4gICAgICAgICAgICBpZiAodXNlY291bnQgPT09IDEgJiYgbWFwcGVkID09PSBoYXNodGFnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHRhZyBpcyB1bnVzZWRcclxuICAgICAgICAgICAgICAgIHJlbW92ZWQrKztcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RhZ21hcC5kZWxldGUoaGFzaHRhZyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hcEhhc2h0YWcoaGFzaHRhZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlbW92ZWQgPiAwICYmIHByZWZpeCkge1xyXG4gICAgICAgICAgICAvLyB3cml0ZSBhbiB1cGRhdGVkIGZpbGVcclxuICAgICAgICAgICAgY29uc3QgbWFwZmlsZSA9IGF3YWl0IHRoaXMuZ2V0VGFnbWFwRmlsZSgpO1xyXG4gICAgICAgICAgICBpZiAobWFwZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fdmF1bHQubW9kaWZ5KG1hcGZpbGUsIHByZWZpeFswXSArIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGVuZGluZ01hcHBpbmdzID0gcHJlZml4LnNsaWNlKDEpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgW2hhc2h0YWcsIG1hcHBlZFRhZ10gb2YgdGhpcy5fdGFnbWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGVuZGluZ01hcHBpbmdzLnB1c2goYHwgJHtoYXNodGFnLnNsaWNlKDEpfSB8ICR7bWFwcGVkVGFnfSB8YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKGAke3JlbW92ZWR9IHVudXNlZCB0YWdzIHJlbW92ZWRgLCAzMDAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZmluZCBpZGVuZGl0eSBtYXBwaW5ncyBpbiB0aGVcclxuICAgICAgICAvLyBqdXN0IGluIGNhc2UgbmV3IHRhZ3MgYXBwZWFyZWQgd2hlbiB3ZSB3ZXJlbid0IGxvb2tpbmcuXHJcbiAgICAgICAgdGhpcy5fdGFnbWFwTXV0ZXgudW5sb2NrKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5jb21taXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbW1pdCBhbnkgcGVuZGluZyBjaGFuZ2VzIHRvIHRoZSB0YWcgbWFwIGZpbGUuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgY29tbWl0KGNvbnRleHQ/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBpZiAodGhpcy5fcGVuZGluZ01hcHBpbmdzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fdGFnbWFwTXV0ZXgubG9jaygpO1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgZmlsZSA9IGF3YWl0IHRoaXMuZ2V0VGFnbWFwRmlsZSgpLFxyXG4gICAgICAgICAgICAgICAgdGFnbGlzdCA9IHRoaXMuX3BlbmRpbmdNYXBwaW5ncy5tYXAocm93ID0+IGAtICR7cm93LnNwbGl0KFwifFwiKVsxXX1gKS5qb2luKFwiXFxuXCIpO1xyXG4gICAgICAgICAgICBpZiAoY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgbmV3IE5vdGljZShgJHt0aGlzLl9wZW5kaW5nTWFwcGluZ3MubGVuZ3RofSBuZXcgdGFncyBpbiAke2NvbnRleHR9XFxuYCArIHRhZ2xpc3QsIDMwMDAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBpbmdzID0gXCJcXG5cIiArIHRoaXMuX3BlbmRpbmdNYXBwaW5ncy5qb2luKFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRhZyBtYXAgdXBkYXRlZCB3aXRoOiBcIiR7bWFwcGluZ3N9XCJgKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdNYXBwaW5ncyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fdmF1bHQuYXBwZW5kKGZpbGUsIG1hcHBpbmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl90YWdtYXBNdXRleC51bmxvY2soKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdGhpbmcgYWRkZWQgdG8gdGFnIG1hcC5cIilcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXAgYSB0YWcgZm91bmQgaW4gYW4gcnNzIGl0ZW0gaW50byB0aGUgZG9tYWluIG9mIHRoZSBsb2NhbCBrbm93bGVkZ2UgZ3JhcGguXHJcbiAgICAgKlxyXG4gICAgICogRm9sbG93aW5nIHJ1bGVzIGFyZSBhcHBsaWVkOlxyXG4gICAgICogLSBpZiB0aGUgdGFnIGhhcyBhbHJlYWR5IGJlZW4gY2FjaGVkIGJ5IE9ic2lkaWFuLCB0aGUgaGFzaHRhZyBpcyBwYXNzZWQgdGhyb3VnaCB1bmNoYW5nZWRcclxuICAgICAqIC0gaWYgdGhlIHRhZyBpcyBuZXcsIGl0IGlzIHB1dCBpbnRvIHRoZSByc3MgZG9tYWluIGFuZCBhIGRlZmF1bHQgbWFwcGluZyBpcyBhYWRlZCB0byB0aGUgdGFnIG1hcFxyXG4gICAgICogICBmaWxlIGxvY2F0ZWQgYXQge0BsaW5rIFJTU1RyYWNrZXJTZXR0aW5ncy5yc3NUYWdtYXBQYXRofS5cclxuICAgICAqIC0gaWYgdGhlcmUgaXMgYSBtYXBwaW5nIGRlZmluZWQgaW4gdGhlIG1hcCBmaWxlIHtAbGluayBSU1NUcmFja2VyU2V0dGluZ3MucnNzVGFnbWFwUGF0aH0sXHJcbiAgICAgKiAgIHRoZSB0YWcgaXMgbWFwcGVkIGFuZCBjaGFuZ2VkIGluIHRoZSB0ZXh0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByc3NIYXNodGFnIEEgaGFzaHRhZyBmb3VuZCBpbiBSU1MgaXRlbSBjb250ZW50cy5cclxuICAgICAqIEByZXR1cm5zIG1hcHBlZCB0YWdcclxuICAgICAqL1xyXG4gICAgbWFwSGFzaHRhZyhyc3NIYXNodGFnOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghcnNzSGFzaHRhZy5zdGFydHNXaXRoKFwiI3Jzcy9cIikpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2tub3duVGFnc0NhY2hlW3Jzc0hhc2h0YWddKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcnNzSGFzaHRhZztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByc3NIYXNodGFnID0gXCIjcnNzL1wiICsgcnNzSGFzaHRhZy5zbGljZSgxKTsgLy8gYWRkIHRvIHJzcyBkb21haW5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBtYXBwZWQgPSB0aGlzLl90YWdtYXAuZ2V0KHJzc0hhc2h0YWcpO1xyXG4gICAgICAgIGlmICghbWFwcGVkKSB7XHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgbWFwXHJcbiAgICAgICAgICAgIG1hcHBlZCA9IHJzc0hhc2h0YWc7IC8vIG1hcCB0byB0aGUgZG9tYWluIHRhZ1xyXG4gICAgICAgICAgICB0aGlzLl90YWdtYXAuc2V0KHJzc0hhc2h0YWcsIG1hcHBlZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdNYXBwaW5ncy5wdXNoKGB8ICR7cnNzSGFzaHRhZy5zbGljZSgxKX0gfCAke21hcHBlZH0gfGApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtYXBwZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMb2FkIHRoZSBtYXBwaW5nIGRhdGEgaW50byBtZW1vcnkuXHJcbiAgICAgKlxyXG4gICAgICogTWFwcGluZ3MgYXJlIHJlYWQgZnJvbTpcclxuICAgICAqIC0gdGhlIHRhZyBtYXAgZmlsZSBsb2NhdGVkIGF0OiB7QGxpbmsgUlNTVHJhY2tlclNldHRpbmdzLnJzc1RhZ21hcFBhdGh9XHJcbiAgICAgKiAtIHRoZSB0YWdzIGNhY2hlZCBieSBPYnNpZGlhbi5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgbG9hZFRhZ21hcCgpOiBQcm9taXNlPHN0cmluZ1tdIHwgbnVsbD4ge1xyXG4gICAgICAgIGNvbnN0IG1hcGZpbGUgPSBhd2FpdCB0aGlzLmdldFRhZ21hcEZpbGUoKTtcclxuICAgICAgICBpZiAoIW1hcGZpbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBsb2FkaW5nIHRhZyBtYXAgZnJvbSAke21hcGZpbGUucGF0aH1gKTtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBtZXRhZGF0YSA9IHRoaXMuX21ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKG1hcGZpbGUpLFxyXG4gICAgICAgICAgICBzZWN0aW9ucyA9IG1ldGFkYXRhPy5zZWN0aW9ucztcclxuICAgICAgICBpZiAoIXNlY3Rpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVhZCBhbmQgcGFyc2UgdGhlIG1hcGZpbGVcclxuICAgICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5fdmF1bHQucmVhZChtYXBmaWxlKTtcclxuICAgICAgICBmb3IgKGNvbnN0IHNlY3Rpb24gb2Ygc2VjdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKHNlY3Rpb24udHlwZSA9PT0gXCJ0YWJsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBldmVyeXRpbmcgYWZ0ZXIgdGhlIHRhYmxlIHN0YXJ0IGlzIHN1cHBvc2VkIHRvIGJlbG9uZyB0b1xyXG4gICAgICAgICAgICAgICAgLy8gdGFibGVcclxuICAgICAgICAgICAgICAgIGxldCBlcnJvckNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICAgICAgdGFibGVPZmZzZXQgPSBzZWN0aW9uLnBvc2l0aW9uLnN0YXJ0Lm9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICByb3dzID0gY29udGVudC5zbGljZSh0YWJsZU9mZnNldCkuc3BsaXQoXCJcXG5cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgcm93Q291bnQgPSByb3dzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAyOyBpIDwgcm93Q291bnQ7IGkrKykgeyAvLyBvbWl0IHRoZSB0YWJsZSBoZWFkZXJcclxuICAgICAgICAgICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3cgPSByb3dzW2ldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbXywgcnNzVGFnbmFtZSwgbWFwcGVkVGFnXSA9IHJvdy5zcGxpdChcInxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzc1RhZ25hbWUgJiYgbWFwcGVkVGFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmltbWVkVGFnbmFtZSA9IHJzc1RhZ25hbWUudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpbW1lZE1hcHBlZFRhZyA9IG1hcHBlZFRhZy50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0cmltbWVkVGFnbmFtZSAmJiB0cmltbWVkTWFwcGVkVGFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90YWdtYXAuc2V0KFwiI1wiICsgdHJpbW1lZFRhZ25hbWUsIHRyaW1tZWRNYXBwZWRUYWcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVSUk9SIHJzc1RhZ25hbWU6IFwiJHtyc3NUYWduYW1lfVwiOyBtYXBwZWRUYWc6IFwiJHttYXBwZWRUYWd9XCJgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yQ291bnQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVSUk9SIHJzc1RhZ25hbWU6IFwiJHtyc3NUYWduYW1lfVwiOyBtYXBwZWRUYWc6IFwiJHttYXBwZWRUYWd9XCJgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChlcnJvckNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2Vycm9yQ291bnR9IGRldGVjdGVkIHdoaWxlIHBhcnNpbmcgdGhlIHRhZyBtYXAuYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuc2xpY2UoMCwgdGFibGVPZmZzZXQpLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICByb3dzWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvd3NbMV1cclxuICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGV2ZW50IGhhbmRsZXIgdG8gcG9zdC1wcm9jZXNzIFJTUyBpdGVtcy5cclxuICAgICAqXHJcbiAgICAgKiBJbiBvcmRlciBmbyBhIFJTUyBpdGVtIGZpbGUgdG8gYmUgcG9zdHByb2Nlc3NlZCBpdCBoYXMgdG8gYmUgcmVnaXN0ZXJlZCB3aXRoXHJcbiAgICAgKiB7QGxpbmsgcmVnaXN0ZXJGaWxlRm9yUG9zdFByb2Nlc3Npbmd9IGZpcnN0LlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIEV2ZW50IGhhbmRsZXIgcmVmZXJlbmNlIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBnZXQgcnNzVGFnUG9zdFByb2Nlc3NvcigpOiBFdmVudFJlZiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcC5tZXRhZGF0YUNhY2hlLm9uKFwiY2hhbmdlZFwiLCBhc3luYyAoaXRlbTogVEZpbGUsIGNvbnRlbnQ6IHN0cmluZywgbWV0YURhdGE6IENhY2hlZE1ldGFkYXRhKTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcG9zdFByb2Nlc3NpbmdSZWdpc3RyeS5kZWxldGUoaXRlbS5wYXRoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBmaWxlIGlzIG5vdCByZWdpc3RlcmVkIGZvciBwb3N0cHJvY2Vzc2luZ1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFBvc3QgUHJvY2Vzc2luZyBcIiR7aXRlbS5wYXRofVwiYCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhZ3MgPSBtZXRhRGF0YS50YWdzO1xyXG4gICAgICAgICAgICBpZiAodGFncykge1xyXG4gICAgICAgICAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgICAgICAgICB0YWdDb3VudCA9IHRhZ3MubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRzID0gbmV3IEFycmF5PHN0cmluZz4odGFnQ291bnQgKiAyICsgMSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaiA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdE9mZnNldCA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFnQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZyA9IHRhZ3NbaV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvcyA9IHRhZy5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcyA9IHBvcy5zdGFydC5vZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGUgPSBwb3MuZW5kLm9mZnNldDtcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0c1tqKytdID0gY29udGVudC5zbGljZShsYXN0T2Zmc2V0LCBzKTsgLy8gY29udGVudCBiZXR3ZWVuIHRhZ3NcclxuICAgICAgICAgICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNodGFnID0gY29udGVudC5zbGljZShzLCBlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwcGVkVGFnID0gdGhpcy5tYXBIYXNodGFnKGhhc2h0YWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1vZGlmaWVkIHx8PSBoYXNodGFnICE9PSBtYXBwZWRUYWc7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHNbaisrXSA9IG1hcHBlZFRhZztcclxuICAgICAgICAgICAgICAgICAgICBsYXN0T2Zmc2V0ID0gZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHRyYWlsaW5nIHRleHRcclxuICAgICAgICAgICAgICAgIHBhcnRzW2orK10gPSBjb250ZW50LnNsaWNlKGxhc3RPZmZzZXQpLnRyaW1FbmQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChtb2RpZmllZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGl0ZW0udmF1bHQubW9kaWZ5KGl0ZW0sIHBhcnRzLmpvaW4oXCJcIikpOyAvLyBzYXZlIHRoZSB1cGRhdGVkZCBSU1MgaXRlbVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY29tbWl0KG1ldGFEYXRhLmZyb250bWF0dGVyPy5mZWVkKTsgLy8gdXBkYXRlIHRoZSB0YWcgbWFwXHJcbiAgICAgICAgfSlcclxuICAgIH07XHJcbn0iXX0=