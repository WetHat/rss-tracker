import { __awaiter } from "tslib";
import { request, TFile, Notice } from 'obsidian';
import { TrackedRSSfeed } from './FeedAssembler';
import { HTMLxlate } from './HTMLxlate';
import { RSSfeedAdapter, RSScollectionAdapter } from './RSSAdapter';
/**
 * Manage RSS feeds in Obsidian.
 *
 * Currently available functionality:
 * - Building a Markdown representation of RSS feeds including feed dashboards.
 *   @see {@link createFeedFromFile} and  @see {@link createFeedFromUrl}
 * - Updating feeds (individual or all). @see {@link updateFeed} and @see {@link}
 * - Setting all items on a feed as _read_. see {@link markFeedItemsRead}
 */
export class FeedManager {
    constructor(app, plugin) {
        this._app = app;
        this._plugin = plugin;
        this._html = HTMLxlate.instance;
    }
    get _filemgr() {
        return this._plugin.filemgr;
    }
    /**
     * Create an RSS feed Markdown representaiton from a local XML file.
     *
     * The Markdown representation consists of
     * - a feed dashboard
     * - a directory whic has the same name as the dashboard (without the .md extension)
     *   containing the RSS items of the feed,
     *
     * The file system layout of an Obsidian RSS feed looks like this:
     * ~~~
     * 📂
     *  ├─ <feedname>.md ← dashboard
     *  ╰─ 📂<feedname>
     *        ├─ <item-1>.md
     *        ├─ …
     *        ╰─ <item-n>.md
     * ~~~
     *
     * ⚠ the base url to make relative urls absolute is synthesized as `https://localhost`.
     * @param xml - XML file containing an RSS feed.
     * @returns the feed adapter
     */
    createFeedFromFile(xml) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._plugin.tagmgr.updateTagMap();
            const feedXML = yield this._app.vault.read(xml);
            return RSSfeedAdapter.create(this._plugin, new TrackedRSSfeed(feedXML, "https://localhost/" + xml.path));
        });
    }
    /**
    * Create an RSS feed Markdown representaiton from a hyperlink.
    *
    * The Markdown representation consists of
    * - a feed dashboard
    * - a directory whic has the same name as the dashboard (without the .md extension)
    *   containingthe RSS items of the feed,
    *
    * The file system layout of an Obsidian RSS feed looks like this:
    * ~~~
    * 📂
    *  ├─ <feedname>.md ← dashboard
    *  ╰─ 📂<feedname>
    *        ├─ <item-1>.md
    *        ├─ …
    *        ╰─ <item-n>.md
    * ~~~
    *
    * @param url - A hyperlink pointing to an RSS feed on the web.
    * @param location - The obsidian folder where to create the Markdown files
    *                   representing the feed.
    * @returns The feed adapter.
    */
    createFeedFromUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedXML = yield request({
                url: url,
                method: "GET"
            });
            yield this._plugin.tagmgr.updateTagMap();
            return RSSfeedAdapter.create(this._plugin, new TrackedRSSfeed(feedXML, url));
        });
    }
    /**
     * Update an RSS feed according to the configured frequency.
     * @param feed The adapter of the RSS feed to update.
     * @param force `true` to update even if it is not due.
     * @returns the number of new items
     */
    updateFeed(feed, force) {
        return __awaiter(this, void 0, void 0, function* () {
            if (feed.suspended) {
                return 0;
            }
            if (!force) {
                const now = new Date().valueOf(), lastUpdate = feed.updated, span = feed.interval * 60 * 60 * 1000; // millis
                if ((lastUpdate + span) > now) {
                    return 0; // time has not come
                }
            }
            let itemCount = 0;
            try {
                const feedXML = yield request({
                    url: feed.feedurl,
                    contentType: "text/xml",
                    method: "GET"
                }), rssfeed = new TrackedRSSfeed(feedXML, feed.feedurl);
                itemCount = yield feed.update(rssfeed);
            }
            catch (err) {
                console.log(`feed '${feed.file.basename}' update failed: ${err.message}`);
                feed.error = err.message;
                yield feed.commitFrontmatterChanges();
            }
            return itemCount;
        });
    }
    get feeds() {
        const feedFolder = this._app.vault.getFolderByPath(this._plugin.settings.rssFeedFolderPath);
        if (feedFolder) {
            return feedFolder.children
                .map(f => f instanceof TFile ? this._filemgr.getAdapter(f) : null)
                .filter(p => p instanceof RSSfeedAdapter);
        }
        return [];
    }
    updateFeeds(feeds, force) {
        return __awaiter(this, void 0, void 0, function* () {
            let feedCount = 0, newItemCount = 0;
            const notice = new Notice(`0/${feeds.length} feeds updated`, 0);
            for (const feed of feeds) {
                try {
                    newItemCount += yield this.updateFeed(feed, force);
                    feedCount++;
                    notice.setMessage(`${feedCount}/${feeds.length} RSS feeds updated`);
                }
                catch (ex) {
                    console.error(`Update failed: ${ex.message}`);
                }
            }
            notice.hide();
            console.log(`${feedCount}/${feeds.length} feeds updated.`);
            new Notice(`${feedCount}/${feeds.length} RSS feeds successfully updated`, 30000);
            return newItemCount;
        });
    }
    update(force, adapter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._plugin.tagmgr.updateTagMap();
            if (adapter instanceof RSSfeedAdapter) {
                const itemCount = yield this.updateFeed(adapter, force);
                new Notice(`Feed '${adapter.file.basename}' has '${itemCount}' new items`, 20000);
            }
            else if (adapter instanceof RSScollectionAdapter) {
                const itemCount = yield this.updateFeeds(adapter.feeds, force);
                new Notice(`Collection '${adapter.file.basename}' has '${itemCount}' new items`, 20000);
            }
            else {
                const feeds = this.feeds, itemCount = yield this.updateFeeds(feeds, force);
                new Notice(`'${itemCount}' new items in ${feeds.length} feeds.`, 20000);
            }
        });
    }
    completeReadingTasks(adapter) {
        return __awaiter(this, void 0, void 0, function* () {
            let completed = 0;
            if (adapter instanceof RSSfeedAdapter) {
                completed = yield adapter.completeReadingTasks();
            }
            else if (adapter instanceof RSScollectionAdapter) {
                completed = yield adapter.completeReadingTasks();
            }
            new Notice(`${completed} items taken off the '${adapter.file.basename}' reading list`, 30000);
        });
    }
    /**
     * A predicate to determine if a file has a link to a downloadable article.
     *
     * @param item An Obsidian Markdown file.
     * @returns `true` if the file is a RSS item with a link to a downloadable article.
     */
    canDownloadArticle(item) {
        var _a;
        const fm = (_a = this._app.metadataCache.getFileCache(item)) === null || _a === void 0 ? void 0 : _a.frontmatter;
        return fm !== undefined && fm["role"] === "rssitem";
    }
    downloadArticle(item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const fm = (_a = this._app.metadataCache.getFileCache(item)) === null || _a === void 0 ? void 0 : _a.frontmatter, link = fm === null || fm === void 0 ? void 0 : fm["link"];
            if (link) {
                // download the article
                const itemHTML = yield request({
                    url: link,
                    method: "GET"
                }), article = yield this._html.articleAsMarkdown(itemHTML, link);
                if (article) {
                    if (article.length > 0) {
                        this._plugin.tagmgr.registerFileForPostProcessing(item.path);
                        return this._app.vault.append(item, article);
                    }
                }
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmVlZE1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvRmVlZE1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBTyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBb0IsTUFBTSxVQUFVLENBQUM7QUFFekUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWpELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUdwRTs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBU3BCLFlBQVksR0FBUSxFQUFFLE1BQXdCO1FBQzFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUNwQyxDQUFDO0lBUkQsSUFBWSxRQUFRO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7SUFDaEMsQ0FBQztJQVFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FxQkc7SUFDRyxrQkFBa0IsQ0FBQyxHQUFVOztZQUMvQixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3pDLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RyxDQUFDO0tBQUE7SUFF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SSxFQUFFLEdBQWlDLE1BQUEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQywwQ0FBRSxXQUFXLEVBQzFGLElBQUksR0FBdUIsRUFBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQzVDLElBQUksSUFBSSxFQUFFO2dCQUNOLHVCQUF1QjtnQkFDdkIsTUFDSSxRQUFRLEdBQUcsTUFBTSxPQUFPLENBQUM7b0JBQ3JCLEdBQUcsRUFBRSxJQUFJO29CQUNULE1BQU0sRUFBRSxLQUFLO2lCQUNoQixDQUFDLEVBQ0YsT0FBTyxHQUFrQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNoRixJQUFJLE9BQU8sRUFBRTtvQkFDVCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzdELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztxQkFDaEQ7aUJBQ0o7YUFDSjs7S0FDSjtDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCByZXF1ZXN0LCBURmlsZSwgTm90aWNlLCBGcm9udE1hdHRlckNhY2hlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgUlNTVHJhY2tlclBsdWdpbiBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBUcmFja2VkUlNTZmVlZCB9IGZyb20gJy4vRmVlZEFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFJTU2ZpbGVNYW5hZ2VyIH0gZnJvbSAnLi9SU1NGaWxlTWFuYWdlcic7XHJcbmltcG9ydCB7IEhUTUx4bGF0ZSB9IGZyb20gJy4vSFRNTHhsYXRlJztcclxuaW1wb3J0IHsgUlNTZmVlZEFkYXB0ZXIsIFJTU2NvbGxlY3Rpb25BZGFwdGVyIH0gZnJvbSAnLi9SU1NBZGFwdGVyJztcclxuXHJcblxyXG4vKipcclxuICogTWFuYWdlIFJTUyBmZWVkcyBpbiBPYnNpZGlhbi5cclxuICpcclxuICogQ3VycmVudGx5IGF2YWlsYWJsZSBmdW5jdGlvbmFsaXR5OlxyXG4gKiAtIEJ1aWxkaW5nIGEgTWFya2Rvd24gcmVwcmVzZW50YXRpb24gb2YgUlNTIGZlZWRzIGluY2x1ZGluZyBmZWVkIGRhc2hib2FyZHMuXHJcbiAqICAgQHNlZSB7QGxpbmsgY3JlYXRlRmVlZEZyb21GaWxlfSBhbmQgIEBzZWUge0BsaW5rIGNyZWF0ZUZlZWRGcm9tVXJsfVxyXG4gKiAtIFVwZGF0aW5nIGZlZWRzIChpbmRpdmlkdWFsIG9yIGFsbCkuIEBzZWUge0BsaW5rIHVwZGF0ZUZlZWR9IGFuZCBAc2VlIHtAbGlua31cclxuICogLSBTZXR0aW5nIGFsbCBpdGVtcyBvbiBhIGZlZWQgYXMgX3JlYWRfLiBzZWUge0BsaW5rIG1hcmtGZWVkSXRlbXNSZWFkfVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEZlZWRNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgX2FwcDogQXBwO1xyXG4gICAgcHJpdmF0ZSBfcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luO1xyXG4gICAgcHJpdmF0ZSBfaHRtbDogSFRNTHhsYXRlO1xyXG5cclxuICAgIHByaXZhdGUgZ2V0IF9maWxlbWdyKCk6IFJTU2ZpbGVNYW5hZ2VyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGx1Z2luLmZpbGVtZ3I7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHRoaXMuX2FwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLl9wbHVnaW4gPSBwbHVnaW47XHJcbiAgICAgICAgdGhpcy5faHRtbCA9IEhUTUx4bGF0ZS5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhbiBSU1MgZmVlZCBNYXJrZG93biByZXByZXNlbnRhaXRvbiBmcm9tIGEgbG9jYWwgWE1MIGZpbGUuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIE1hcmtkb3duIHJlcHJlc2VudGF0aW9uIGNvbnNpc3RzIG9mXHJcbiAgICAgKiAtIGEgZmVlZCBkYXNoYm9hcmRcclxuICAgICAqIC0gYSBkaXJlY3Rvcnkgd2hpYyBoYXMgdGhlIHNhbWUgbmFtZSBhcyB0aGUgZGFzaGJvYXJkICh3aXRob3V0IHRoZSAubWQgZXh0ZW5zaW9uKVxyXG4gICAgICogICBjb250YWluaW5nIHRoZSBSU1MgaXRlbXMgb2YgdGhlIGZlZWQsXHJcbiAgICAgKlxyXG4gICAgICogVGhlIGZpbGUgc3lzdGVtIGxheW91dCBvZiBhbiBPYnNpZGlhbiBSU1MgZmVlZCBsb29rcyBsaWtlIHRoaXM6XHJcbiAgICAgKiB+fn5cclxuICAgICAqIPCfk4JcclxuICAgICAqICDilJzilIAgPGZlZWRuYW1lPi5tZCDihpAgZGFzaGJvYXJkXHJcbiAgICAgKiAg4pWw4pSAIPCfk4I8ZmVlZG5hbWU+XHJcbiAgICAgKiAgICAgICAg4pSc4pSAIDxpdGVtLTE+Lm1kXHJcbiAgICAgKiAgICAgICAg4pSc4pSAIOKAplxyXG4gICAgICogICAgICAgIOKVsOKUgCA8aXRlbS1uPi5tZFxyXG4gICAgICogfn5+XHJcbiAgICAgKlxyXG4gICAgICog4pqgIHRoZSBiYXNlIHVybCB0byBtYWtlIHJlbGF0aXZlIHVybHMgYWJzb2x1dGUgaXMgc3ludGhlc2l6ZWQgYXMgYGh0dHBzOi8vbG9jYWxob3N0YC5cclxuICAgICAqIEBwYXJhbSB4bWwgLSBYTUwgZmlsZSBjb250YWluaW5nIGFuIFJTUyBmZWVkLlxyXG4gICAgICogQHJldHVybnMgdGhlIGZlZWQgYWRhcHRlclxyXG4gICAgICovXHJcbiAgICBhc3luYyBjcmVhdGVGZWVkRnJvbUZpbGUoeG1sOiBURmlsZSk6IFByb21pc2U8UlNTZmVlZEFkYXB0ZXI+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLl9wbHVnaW4udGFnbWdyLnVwZGF0ZVRhZ01hcCgpO1xyXG4gICAgICAgIGNvbnN0IGZlZWRYTUwgPSBhd2FpdCB0aGlzLl9hcHAudmF1bHQucmVhZCh4bWwpO1xyXG4gICAgICAgIHJldHVybiBSU1NmZWVkQWRhcHRlci5jcmVhdGUodGhpcy5fcGx1Z2luLCBuZXcgVHJhY2tlZFJTU2ZlZWQoZmVlZFhNTCwgXCJodHRwczovL2xvY2FsaG9zdC9cIiArIHhtbC5wYXRoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIENyZWF0ZSBhbiBSU1MgZmVlZCBNYXJrZG93biByZXByZXNlbnRhaXRvbiBmcm9tIGEgaHlwZXJsaW5rLlxyXG4gICAgKlxyXG4gICAgKiBUaGUgTWFya2Rvd24gcmVwcmVzZW50YXRpb24gY29uc2lzdHMgb2ZcclxuICAgICogLSBhIGZlZWQgZGFzaGJvYXJkXHJcbiAgICAqIC0gYSBkaXJlY3Rvcnkgd2hpYyBoYXMgdGhlIHNhbWUgbmFtZSBhcyB0aGUgZGFzaGJvYXJkICh3aXRob3V0IHRoZSAubWQgZXh0ZW5zaW9uKVxyXG4gICAgKiAgIGNvbnRhaW5pbmd0aGUgUlNTIGl0ZW1zIG9mIHRoZSBmZWVkLFxyXG4gICAgKlxyXG4gICAgKiBUaGUgZmlsZSBzeXN0ZW0gbGF5b3V0IG9mIGFuIE9ic2lkaWFuIFJTUyBmZWVkIGxvb2tzIGxpa2UgdGhpczpcclxuICAgICogfn5+XHJcbiAgICAqIPCfk4JcclxuICAgICogIOKUnOKUgCA8ZmVlZG5hbWU+Lm1kIOKGkCBkYXNoYm9hcmRcclxuICAgICogIOKVsOKUgCDwn5OCPGZlZWRuYW1lPlxyXG4gICAgKiAgICAgICAg4pSc4pSAIDxpdGVtLTE+Lm1kXHJcbiAgICAqICAgICAgICDilJzilIAg4oCmXHJcbiAgICAqICAgICAgICDilbDilIAgPGl0ZW0tbj4ubWRcclxuICAgICogfn5+XHJcbiAgICAqXHJcbiAgICAqIEBwYXJhbSB1cmwgLSBBIGh5cGVybGluayBwb2ludGluZyB0byBhbiBSU1MgZmVlZCBvbiB0aGUgd2ViLlxyXG4gICAgKiBAcGFyYW0gbG9jYXRpb24gLSBUaGUgb2JzaWRpYW4gZm9sZGVyIHdoZXJlIHRvIGNyZWF0ZSB0aGUgTWFya2Rvd24gZmlsZXNcclxuICAgICogICAgICAgICAgICAgICAgICAgcmVwcmVzZW50aW5nIHRoZSBmZWVkLlxyXG4gICAgKiBAcmV0dXJucyBUaGUgZmVlZCBhZGFwdGVyLlxyXG4gICAgKi9cclxuICAgIGFzeW5jIGNyZWF0ZUZlZWRGcm9tVXJsKHVybDogc3RyaW5nKTogUHJvbWlzZTxSU1NmZWVkQWRhcHRlcj4ge1xyXG4gICAgICAgIGNvbnN0IGZlZWRYTUwgPSBhd2FpdCByZXF1ZXN0KHtcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuX3BsdWdpbi50YWdtZ3IudXBkYXRlVGFnTWFwKCk7XHJcbiAgICAgICAgcmV0dXJuIFJTU2ZlZWRBZGFwdGVyLmNyZWF0ZSh0aGlzLl9wbHVnaW4sIG5ldyBUcmFja2VkUlNTZmVlZChmZWVkWE1MLCB1cmwpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSBhbiBSU1MgZmVlZCBhY2NvcmRpbmcgdG8gdGhlIGNvbmZpZ3VyZWQgZnJlcXVlbmN5LlxyXG4gICAgICogQHBhcmFtIGZlZWQgVGhlIGFkYXB0ZXIgb2YgdGhlIFJTUyBmZWVkIHRvIHVwZGF0ZS5cclxuICAgICAqIEBwYXJhbSBmb3JjZSBgdHJ1ZWAgdG8gdXBkYXRlIGV2ZW4gaWYgaXQgaXMgbm90IGR1ZS5cclxuICAgICAqIEByZXR1cm5zIHRoZSBudW1iZXIgb2YgbmV3IGl0ZW1zXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYXN5bmMgdXBkYXRlRmVlZChmZWVkOiBSU1NmZWVkQWRhcHRlciwgZm9yY2U6IGJvb2xlYW4pOiBQcm9taXNlPG51bWJlcj4ge1xyXG4gICAgICAgIGlmIChmZWVkLnN1c3BlbmRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZm9yY2UpIHtcclxuICAgICAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlKCkudmFsdWVPZigpLFxyXG4gICAgICAgICAgICAgICAgbGFzdFVwZGF0ZSA9IGZlZWQudXBkYXRlZCxcclxuICAgICAgICAgICAgICAgIHNwYW4gPSBmZWVkLmludGVydmFsICogNjAgKiA2MCAqIDEwMDA7IC8vIG1pbGxpc1xyXG4gICAgICAgICAgICBpZiAoKGxhc3RVcGRhdGUgKyBzcGFuKSA+IG5vdykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7IC8vIHRpbWUgaGFzIG5vdCBjb21lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBpdGVtQ291bnQgPSAwO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICBmZWVkWE1MID0gYXdhaXQgcmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBmZWVkLmZlZWR1cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6IFwidGV4dC94bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCJcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgcnNzZmVlZCA9IG5ldyBUcmFja2VkUlNTZmVlZChmZWVkWE1MLCBmZWVkLmZlZWR1cmwpO1xyXG4gICAgICAgICAgICBpdGVtQ291bnQgPSBhd2FpdCBmZWVkLnVwZGF0ZShyc3NmZWVkKTtcclxuICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgZmVlZCAnJHtmZWVkLmZpbGUuYmFzZW5hbWV9JyB1cGRhdGUgZmFpbGVkOiAke2Vyci5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICBmZWVkLmVycm9yID0gZXJyLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgIGF3YWl0IGZlZWQuY29tbWl0RnJvbnRtYXR0ZXJDaGFuZ2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpdGVtQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZlZWRzKCk6IFJTU2ZlZWRBZGFwdGVyW10ge1xyXG4gICAgICAgIGNvbnN0IGZlZWRGb2xkZXIgPSB0aGlzLl9hcHAudmF1bHQuZ2V0Rm9sZGVyQnlQYXRoKHRoaXMuX3BsdWdpbi5zZXR0aW5ncy5yc3NGZWVkRm9sZGVyUGF0aCk7XHJcbiAgICAgICAgaWYgKGZlZWRGb2xkZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZlZWRGb2xkZXIuY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIC5tYXAoZiA9PiBmIGluc3RhbmNlb2YgVEZpbGUgPyB0aGlzLl9maWxlbWdyLmdldEFkYXB0ZXIoZikgOiBudWxsKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihwID0+IHAgaW5zdGFuY2VvZiBSU1NmZWVkQWRhcHRlcikgYXMgUlNTZmVlZEFkYXB0ZXJbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXN5bmMgdXBkYXRlRmVlZHMoZmVlZHM6IFJTU2ZlZWRBZGFwdGVyW10sIGZvcmNlOiBib29sZWFuKTogUHJvbWlzZTxudW1iZXI+IHtcclxuICAgICAgICBsZXRcclxuICAgICAgICAgICAgZmVlZENvdW50OiBudW1iZXIgPSAwLFxyXG4gICAgICAgICAgICBuZXdJdGVtQ291bnQgPSAwO1xyXG4gICAgICAgIGNvbnN0IG5vdGljZSA9IG5ldyBOb3RpY2UoYDAvJHtmZWVkcy5sZW5ndGh9IGZlZWRzIHVwZGF0ZWRgLCAwKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBmZWVkIG9mIGZlZWRzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBuZXdJdGVtQ291bnQgKz0gYXdhaXQgdGhpcy51cGRhdGVGZWVkKGZlZWQsIGZvcmNlKTtcclxuICAgICAgICAgICAgICAgIGZlZWRDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgbm90aWNlLnNldE1lc3NhZ2UoYCR7ZmVlZENvdW50fS8ke2ZlZWRzLmxlbmd0aH0gUlNTIGZlZWRzIHVwZGF0ZWRgKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXg6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgVXBkYXRlIGZhaWxlZDogJHtleC5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vdGljZS5oaWRlKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYCR7ZmVlZENvdW50fS8ke2ZlZWRzLmxlbmd0aH0gZmVlZHMgdXBkYXRlZC5gKVxyXG4gICAgICAgIG5ldyBOb3RpY2UoYCR7ZmVlZENvdW50fS8ke2ZlZWRzLmxlbmd0aH0gUlNTIGZlZWRzIHN1Y2Nlc3NmdWxseSB1cGRhdGVkYCwgMzAwMDApO1xyXG4gICAgICAgIHJldHVybiBuZXdJdGVtQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgdXBkYXRlKGZvcmNlOiBib29sZWFuLCBhZGFwdGVyPzogUlNTZmVlZEFkYXB0ZXIgfCBSU1Njb2xsZWN0aW9uQWRhcHRlcikgOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBhd2FpdCB0aGlzLl9wbHVnaW4udGFnbWdyLnVwZGF0ZVRhZ01hcCgpO1xyXG4gICAgICAgIGlmIChhZGFwdGVyIGluc3RhbmNlb2YgUlNTZmVlZEFkYXB0ZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaXRlbUNvdW50ID0gYXdhaXQgdGhpcy51cGRhdGVGZWVkKGFkYXB0ZXIsZm9yY2UpO1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGBGZWVkICcke2FkYXB0ZXIuZmlsZS5iYXNlbmFtZX0nIGhhcyAnJHtpdGVtQ291bnR9JyBuZXcgaXRlbXNgLDIwMDAwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFkYXB0ZXIgaW5zdGFuY2VvZiBSU1Njb2xsZWN0aW9uQWRhcHRlcikge1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtQ291bnQgPSBhd2FpdCB0aGlzLnVwZGF0ZUZlZWRzKGFkYXB0ZXIuZmVlZHMsZm9yY2UpO1xyXG4gICAgICAgICAgICBuZXcgTm90aWNlKGBDb2xsZWN0aW9uICcke2FkYXB0ZXIuZmlsZS5iYXNlbmFtZX0nIGhhcyAnJHtpdGVtQ291bnR9JyBuZXcgaXRlbXNgLDIwMDAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgZmVlZHMgPSB0aGlzLmZlZWRzLFxyXG4gICAgICAgICAgICAgICAgaXRlbUNvdW50ID0gYXdhaXQgdGhpcy51cGRhdGVGZWVkcyhmZWVkcyxmb3JjZSk7XHJcbiAgICAgICAgICAgIG5ldyBOb3RpY2UoYCcke2l0ZW1Db3VudH0nIG5ldyBpdGVtcyBpbiAke2ZlZWRzLmxlbmd0aH0gZmVlZHMuYCwyMDAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGNvbXBsZXRlUmVhZGluZ1Rhc2tzKGFkYXB0ZXI6IFJTU2ZlZWRBZGFwdGVyIHwgUlNTY29sbGVjdGlvbkFkYXB0ZXIpIHtcclxuICAgICAgICBsZXQgY29tcGxldGVkID0gMDtcclxuICAgICAgICBpZiAoYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyKSB7XHJcbiAgICAgICAgICAgIGNvbXBsZXRlZCA9IGF3YWl0IGFkYXB0ZXIuY29tcGxldGVSZWFkaW5nVGFza3MoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFkYXB0ZXIgaW5zdGFuY2VvZiBSU1Njb2xsZWN0aW9uQWRhcHRlcikge1xyXG4gICAgICAgICAgICBjb21wbGV0ZWQgPSBhd2FpdCBhZGFwdGVyLmNvbXBsZXRlUmVhZGluZ1Rhc2tzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBuZXcgTm90aWNlKGAke2NvbXBsZXRlZH0gaXRlbXMgdGFrZW4gb2ZmIHRoZSAnJHthZGFwdGVyLmZpbGUuYmFzZW5hbWV9JyByZWFkaW5nIGxpc3RgLCAzMDAwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBIHByZWRpY2F0ZSB0byBkZXRlcm1pbmUgaWYgYSBmaWxlIGhhcyBhIGxpbmsgdG8gYSBkb3dubG9hZGFibGUgYXJ0aWNsZS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaXRlbSBBbiBPYnNpZGlhbiBNYXJrZG93biBmaWxlLlxyXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBmaWxlIGlzIGEgUlNTIGl0ZW0gd2l0aCBhIGxpbmsgdG8gYSBkb3dubG9hZGFibGUgYXJ0aWNsZS5cclxuICAgICAqL1xyXG4gICAgY2FuRG93bmxvYWRBcnRpY2xlKGl0ZW06IFRGaWxlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgZm06IEZyb250TWF0dGVyQ2FjaGUgfCB1bmRlZmluZWQgPSB0aGlzLl9hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoaXRlbSk/LmZyb250bWF0dGVyO1xyXG4gICAgICAgIHJldHVybiBmbSAhPT0gdW5kZWZpbmVkICYmIGZtW1wicm9sZVwiXSA9PT0gXCJyc3NpdGVtXCI7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZG93bmxvYWRBcnRpY2xlKGl0ZW06IFRGaWxlKSB7XHJcbiAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgZm06IEZyb250TWF0dGVyQ2FjaGUgfCB1bmRlZmluZWQgPSB0aGlzLl9hcHAubWV0YWRhdGFDYWNoZS5nZXRGaWxlQ2FjaGUoaXRlbSk/LmZyb250bWF0dGVyLFxyXG4gICAgICAgICAgICBsaW5rOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBmbT8uW1wibGlua1wiXTtcclxuICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICAvLyBkb3dubG9hZCB0aGUgYXJ0aWNsZVxyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgaXRlbUhUTUwgPSBhd2FpdCByZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGxpbmssXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGFydGljbGU6IHN0cmluZyB8IG51bGwgPSBhd2FpdCB0aGlzLl9odG1sLmFydGljbGVBc01hcmtkb3duKGl0ZW1IVE1MLCBsaW5rKTtcclxuICAgICAgICAgICAgaWYgKGFydGljbGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhcnRpY2xlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wbHVnaW4udGFnbWdyLnJlZ2lzdGVyRmlsZUZvclBvc3RQcm9jZXNzaW5nKGl0ZW0ucGF0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FwcC52YXVsdC5hcHBlbmQoaXRlbSwgYXJ0aWNsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=