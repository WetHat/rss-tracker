import { __awaiter } from "tslib";
import { Notice, TFile } from 'obsidian';
import { RSScollectionAdapter, RSSfeedAdapter } from './RSSAdapter';
import { RenameRSSFeedModal } from './dialogs';
/**
 * Abstract base class to Obsidian menus.
 *
 * Currently event menu event hadlers can be generated for the file menu
 * @see {@link fileMenuHandler} and the editor menu
 * @see {@link editorMenuHandler}.
 *
 */
class RSSTrackerMenuItem {
    constructor(app, plugin) {
        this.app = app;
        this.plugin = plugin;
    }
    /**
     * Event handler for the the _editor_ context menu to add a menu item.
     */
    get editorMenuHandler() {
        return this.app.workspace.on('editor-menu', (menu, editor, view) => {
            this.addItem(menu, view === null || view === void 0 ? void 0 : view.file);
        });
    }
    /**
     * Event handler for the the _file_ context menu to add a menu item.
     */
    get fileMenuHandler() {
        return this.app.workspace.on('file-menu', (menu, file) => {
            this.addItem(menu, file instanceof TFile ? file : null);
        });
    }
}
/**
 * Utility class to add a menu item to Obsidian one of the supported Obsidian context menus
 * if the current file is a RSS feed dashboard.
 *
 * The menu action marks all items of the RSS feed, described by the current file, as read.
 */
export class MarkAllItemsReadMenuItem extends RSSTrackerMenuItem {
    constructor(app, plugin) {
        super(app, plugin);
    }
    addItem(menu, dashboard) {
        if (!dashboard) {
            return;
        }
        const adapter = this.plugin.filemgr.getAdapter(dashboard);
        if (adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter) {
            menu.addItem(item => {
                item.setTitle('Mark all RSS items as read')
                    .setIcon('list-checks')
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.plugin.feedmgr.completeReadingTasks(adapter);
                    this.plugin.refreshActiveFile();
                }));
            });
        }
    }
}
export class DownloadArticleContentMenuItem extends RSSTrackerMenuItem {
    constructor(app, plugin) {
        super(app, plugin);
    }
    addItem(menu, rssitem) {
        const feedmgr = this.plugin.feedmgr;
        if (rssitem && feedmgr.canDownloadArticle(rssitem)) {
            menu.addItem(item => {
                item.setTitle("Download RSS Item article")
                    .setIcon('download')
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    yield feedmgr.downloadArticle(rssitem);
                    new Notice(`Article content of "${rssitem.basename}" downloaded`);
                }));
            });
        }
    }
}
/**
 * Utility class to add a menu item to Obsidian one of the supported Obsidian context menus
 * if the current file is a RSS feed dashboard.
 *
 * The menu action updates the RSS feed described by the current file.
 */
export class UpdateRSSfeedMenuItem extends RSSTrackerMenuItem {
    constructor(app, plugin) {
        super(app, plugin);
    }
    /**
     * Add an item to a menu which calls an action to update an RSS feed.
     *
     * The condition under which the item is added is that the given file is an
     * RSS dashboard containing frontmatter defining the properties `itemlimit` and
     * `feedurl`.
     *
     * @param menu - The menu to add the item to
     * @param file - An Obsidian file which may contain frontmatter describing an RSS feed configuration.
     */
    addItem(menu, file) {
        if (!file) {
            return;
        }
        menu.addSeparator();
        const adapter = this.plugin.filemgr.getAdapter(file);
        let title;
        if (adapter instanceof RSSfeedAdapter && !adapter.suspended) {
            title = "Update RSS feed";
        }
        else if (adapter instanceof RSScollectionAdapter) {
            title = "Update RSS collection";
        }
        else {
            title = "";
        }
        if (title) {
            menu.addItem(item => {
                item.setTitle(title)
                    .setIcon('rss')
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    if (adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter) {
                        yield this.plugin.feedmgr.update(true, adapter);
                        this.plugin.refreshActiveFile();
                    }
                }));
            });
        }
    }
}
export class RenameRSSfeedMenuItem extends RSSTrackerMenuItem {
    constructor(app, plugin) {
        super(app, plugin);
    }
    /**
     * Add an item to a menu which calls an action to update an RSS feed.
     *
     * The condition under which the item is added is that the given file is an
     * RSS dashboard containing frontmatter defining the properties `itemlimit` and
     * `feedurl`.
     *
     * @param menu - The menu to add the item to
     * @param file - An Obsidian file which may contain frontmatter describing an RSS feed configuration.
     */
    addItem(menu, file) {
        if (!file) {
            return;
        }
        const adapter = this.plugin.filemgr.getAdapter(file);
        let title;
        if (adapter instanceof RSSfeedAdapter) {
            menu.addItem(item => {
                item.setTitle("Rename RSS feed")
                    .setIcon('pen-line')
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    new RenameRSSFeedModal(this.plugin, adapter).open();
                }));
            });
        }
    }
}
export class ToggleRSSfeedActiveStatusMenuItem extends RSSTrackerMenuItem {
    constructor(app, plugin) {
        super(app, plugin);
    }
    /**
     * Add an item to a menu which calls an action to update an RSS feed.
     *
     * The condition under which the item is added is that the given file is an
     * RSS dashboard containing frontmatter defining the properties `itemlimit` and
     * `feedurl`.
     *
     * @param menu - The menu to add the item to
     * @param file - An Obsidian file which may contain frontmatter describing an RSS feed configuration.
     */
    addItem(menu, file) {
        if (!file) {
            return;
        }
        const adapter = this.plugin.filemgr.getAdapter(file);
        if (!(adapter instanceof RSSfeedAdapter)) {
            return;
        }
        if (adapter.suspended) {
            menu.addItem(item => {
                item.setTitle('Resume RSS feed updates')
                    .setIcon('power')
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    adapter.suspended = false;
                    yield adapter.commitFrontmatterChanges();
                    new Notice(`${(_a = file === null || file === void 0 ? void 0 : file.name) !== null && _a !== void 0 ? _a : '???'} updates resumed`);
                }));
            });
        }
        else {
            menu.addItem(item => {
                item.setTitle('Suspend RSS feed updates')
                    .setIcon('power-off')
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    adapter.suspended = true;
                    yield adapter.commitFrontmatterChanges();
                    new Notice(`${(_a = file === null || file === void 0 ? void 0 : file.name) !== null && _a !== void 0 ? _a : '???'} updates suspended`);
                }));
            });
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWVudXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBTyxNQUFNLEVBQVEsS0FBSyxFQUFXLE1BQU0sVUFBVSxDQUFDO0FBQzdELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRS9DOzs7Ozs7O0dBT0c7QUFDSCxNQUFlLGtCQUFrQjtJQUk3QixZQUFZLEdBQVEsRUFBRSxNQUF3QjtRQUMxQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFJRDs7T0FFRztJQUNILElBQUksaUJBQWlCO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDL0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNEOztPQUVHO0lBQ0gsSUFBSSxlQUFlO1FBQ2YsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3JELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0o7QUFFRDs7Ozs7R0FLRztB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QU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUN6QixNQUFNLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO29CQUN6QyxJQUFJLE1BQU0sQ0FBQyxHQUFHLE1BQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLElBQUksbUNBQUksS0FBSyxvQkFBb0IsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSU1NUcmFja2VyUGx1Z2luIGZyb20gJy4vbWFpbic7XHJcbmltcG9ydCB7IEFwcCwgTm90aWNlLCBNZW51LCBURmlsZSwgRXZlbnRSZWZ9IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IHsgUlNTY29sbGVjdGlvbkFkYXB0ZXIsIFJTU2ZlZWRBZGFwdGVyIH0gZnJvbSAnLi9SU1NBZGFwdGVyJztcclxuaW1wb3J0IHsgUmVuYW1lUlNTRmVlZE1vZGFsIH0gZnJvbSAnLi9kaWFsb2dzJztcclxuXHJcbi8qKlxyXG4gKiBBYnN0cmFjdCBiYXNlIGNsYXNzIHRvIE9ic2lkaWFuIG1lbnVzLlxyXG4gKlxyXG4gKiBDdXJyZW50bHkgZXZlbnQgbWVudSBldmVudCBoYWRsZXJzIGNhbiBiZSBnZW5lcmF0ZWQgZm9yIHRoZSBmaWxlIG1lbnVcclxuICogQHNlZSB7QGxpbmsgZmlsZU1lbnVIYW5kbGVyfSBhbmQgdGhlIGVkaXRvciBtZW51XHJcbiAqIEBzZWUge0BsaW5rIGVkaXRvck1lbnVIYW5kbGVyfS5cclxuICpcclxuICovXHJcbmFic3RyYWN0IGNsYXNzIFJTU1RyYWNrZXJNZW51SXRlbSB7XHJcbiAgICBwcm90ZWN0ZWQgYXBwOiBBcHA7XHJcbiAgICBwcm90ZWN0ZWQgcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFJTU1RyYWNrZXJQbHVnaW4pIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgYWRkSXRlbShtZW51OiBNZW51LCBmaWxlOiBURmlsZSB8IG51bGwpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXZlbnQgaGFuZGxlciBmb3IgdGhlIHRoZSBfZWRpdG9yXyBjb250ZXh0IG1lbnUgdG8gYWRkIGEgbWVudSBpdGVtLlxyXG4gICAgICovXHJcbiAgICBnZXQgZWRpdG9yTWVudUhhbmRsZXIoKTogRXZlbnRSZWYge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2VkaXRvci1tZW51JywgKG1lbnUsIGVkaXRvciwgdmlldykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFkZEl0ZW0obWVudSwgdmlldz8uZmlsZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEV2ZW50IGhhbmRsZXIgZm9yIHRoZSB0aGUgX2ZpbGVfIGNvbnRleHQgbWVudSB0byBhZGQgYSBtZW51IGl0ZW0uXHJcbiAgICAgKi9cclxuICAgIGdldCBmaWxlTWVudUhhbmRsZXIoKTogRXZlbnRSZWYge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcC53b3Jrc3BhY2Uub24oJ2ZpbGUtbWVudScsIChtZW51LCBmaWxlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShtZW51LCBmaWxlIGluc3RhbmNlb2YgVEZpbGUgPyBmaWxlIDogbnVsbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVdGlsaXR5IGNsYXNzIHRvIGFkZCBhIG1lbnUgaXRlbSB0byBPYnNpZGlhbiBvbmUgb2YgdGhlIHN1cHBvcnRlZCBPYnNpZGlhbiBjb250ZXh0IG1lbnVzXHJcbiAqIGlmIHRoZSBjdXJyZW50IGZpbGUgaXMgYSBSU1MgZmVlZCBkYXNoYm9hcmQuXHJcbiAqXHJcbiAqIFRoZSBtZW51IGFjdGlvbiBtYXJrcyBhbGwgaXRlbXMgb2YgdGhlIFJTUyBmZWVkLCBkZXNjcmliZWQgYnkgdGhlIGN1cnJlbnQgZmlsZSwgYXMgcmVhZC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBNYXJrQWxsSXRlbXNSZWFkTWVudUl0ZW0gZXh0ZW5kcyBSU1NUcmFja2VyTWVudUl0ZW0ge1xyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWRkSXRlbShtZW51OiBNZW51LCBkYXNoYm9hcmQ6IFRGaWxlIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICghZGFzaGJvYXJkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLnBsdWdpbi5maWxlbWdyLmdldEFkYXB0ZXIoZGFzaGJvYXJkKTtcclxuICAgICAgICBpZiAoYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyIHx8IGFkYXB0ZXIgaW5zdGFuY2VvZiBSU1Njb2xsZWN0aW9uQWRhcHRlcikge1xyXG4gICAgICAgICAgICBtZW51LmFkZEl0ZW0oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKCdNYXJrIGFsbCBSU1MgaXRlbXMgYXMgcmVhZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oJ2xpc3QtY2hlY2tzJylcclxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLmZlZWRtZ3IuY29tcGxldGVSZWFkaW5nVGFza3MoYWRhcHRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGx1Z2luLnJlZnJlc2hBY3RpdmVGaWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERvd25sb2FkQXJ0aWNsZUNvbnRlbnRNZW51SXRlbSBleHRlbmRzIFJTU1RyYWNrZXJNZW51SXRlbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIGFkZEl0ZW0obWVudTogTWVudSwgcnNzaXRlbTogVEZpbGUgfCBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgZmVlZG1nciA9IHRoaXMucGx1Z2luLmZlZWRtZ3I7XHJcbiAgICAgICAgaWYgKHJzc2l0ZW0gJiYgZmVlZG1nci5jYW5Eb3dubG9hZEFydGljbGUocnNzaXRlbSkpIHtcclxuICAgICAgICAgICAgbWVudS5hZGRJdGVtKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXRUaXRsZShcIkRvd25sb2FkIFJTUyBJdGVtIGFydGljbGVcIilcclxuICAgICAgICAgICAgICAgICAgICAuc2V0SWNvbignZG93bmxvYWQnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgZmVlZG1nci5kb3dubG9hZEFydGljbGUocnNzaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYEFydGljbGUgY29udGVudCBvZiBcIiR7cnNzaXRlbS5iYXNlbmFtZX1cIiBkb3dubG9hZGVkYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFV0aWxpdHkgY2xhc3MgdG8gYWRkIGEgbWVudSBpdGVtIHRvIE9ic2lkaWFuIG9uZSBvZiB0aGUgc3VwcG9ydGVkIE9ic2lkaWFuIGNvbnRleHQgbWVudXNcclxuICogaWYgdGhlIGN1cnJlbnQgZmlsZSBpcyBhIFJTUyBmZWVkIGRhc2hib2FyZC5cclxuICpcclxuICogVGhlIG1lbnUgYWN0aW9uIHVwZGF0ZXMgdGhlIFJTUyBmZWVkIGRlc2NyaWJlZCBieSB0aGUgY3VycmVudCBmaWxlLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVwZGF0ZVJTU2ZlZWRNZW51SXRlbSBleHRlbmRzIFJTU1RyYWNrZXJNZW51SXRlbSB7XHJcbiAgICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luKSB7XHJcbiAgICAgICAgc3VwZXIoYXBwLCBwbHVnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGFuIGl0ZW0gdG8gYSBtZW51IHdoaWNoIGNhbGxzIGFuIGFjdGlvbiB0byB1cGRhdGUgYW4gUlNTIGZlZWQuXHJcbiAgICAgKlxyXG4gICAgICogVGhlIGNvbmRpdGlvbiB1bmRlciB3aGljaCB0aGUgaXRlbSBpcyBhZGRlZCBpcyB0aGF0IHRoZSBnaXZlbiBmaWxlIGlzIGFuXHJcbiAgICAgKiBSU1MgZGFzaGJvYXJkIGNvbnRhaW5pbmcgZnJvbnRtYXR0ZXIgZGVmaW5pbmcgdGhlIHByb3BlcnRpZXMgYGl0ZW1saW1pdGAgYW5kXHJcbiAgICAgKiBgZmVlZHVybGAuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG1lbnUgLSBUaGUgbWVudSB0byBhZGQgdGhlIGl0ZW0gdG9cclxuICAgICAqIEBwYXJhbSBmaWxlIC0gQW4gT2JzaWRpYW4gZmlsZSB3aGljaCBtYXkgY29udGFpbiBmcm9udG1hdHRlciBkZXNjcmliaW5nIGFuIFJTUyBmZWVkIGNvbmZpZ3VyYXRpb24uXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBhZGRJdGVtKG1lbnU6IE1lbnUsIGZpbGU6IFRGaWxlIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICghZmlsZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lbnUuYWRkU2VwYXJhdG9yKCk7XHJcbiAgICAgICAgY29uc3QgYWRhcHRlciA9IHRoaXMucGx1Z2luLmZpbGVtZ3IuZ2V0QWRhcHRlcihmaWxlKTtcclxuICAgICAgICBsZXQgdGl0bGU6IHN0cmluZztcclxuICAgICAgICBpZiAoYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyICYmICFhZGFwdGVyLnN1c3BlbmRlZCkge1xyXG4gICAgICAgICAgICB0aXRsZSA9IFwiVXBkYXRlIFJTUyBmZWVkXCI7XHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGFwdGVyIGluc3RhbmNlb2YgUlNTY29sbGVjdGlvbkFkYXB0ZXIpIHtcclxuICAgICAgICAgICAgdGl0bGUgPSBcIlVwZGF0ZSBSU1MgY29sbGVjdGlvblwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRpdGxlID0gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aXRsZSkge1xyXG4gICAgICAgICAgICBtZW51LmFkZEl0ZW0oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKHRpdGxlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKCdyc3MnKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbkNsaWNrKGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFkYXB0ZXIgaW5zdGFuY2VvZiBSU1NmZWVkQWRhcHRlciB8fCBhZGFwdGVyIGluc3RhbmNlb2YgUlNTY29sbGVjdGlvbkFkYXB0ZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnBsdWdpbi5mZWVkbWdyLnVwZGF0ZSh0cnVlLGFkYXB0ZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4ucmVmcmVzaEFjdGl2ZUZpbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSZW5hbWVSU1NmZWVkTWVudUl0ZW0gZXh0ZW5kcyBSU1NUcmFja2VyTWVudUl0ZW0ge1xyXG4gICAgY29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhbiBpdGVtIHRvIGEgbWVudSB3aGljaCBjYWxscyBhbiBhY3Rpb24gdG8gdXBkYXRlIGFuIFJTUyBmZWVkLlxyXG4gICAgICpcclxuICAgICAqIFRoZSBjb25kaXRpb24gdW5kZXIgd2hpY2ggdGhlIGl0ZW0gaXMgYWRkZWQgaXMgdGhhdCB0aGUgZ2l2ZW4gZmlsZSBpcyBhblxyXG4gICAgICogUlNTIGRhc2hib2FyZCBjb250YWluaW5nIGZyb250bWF0dGVyIGRlZmluaW5nIHRoZSBwcm9wZXJ0aWVzIGBpdGVtbGltaXRgIGFuZFxyXG4gICAgICogYGZlZWR1cmxgLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBtZW51IC0gVGhlIG1lbnUgdG8gYWRkIHRoZSBpdGVtIHRvXHJcbiAgICAgKiBAcGFyYW0gZmlsZSAtIEFuIE9ic2lkaWFuIGZpbGUgd2hpY2ggbWF5IGNvbnRhaW4gZnJvbnRtYXR0ZXIgZGVzY3JpYmluZyBhbiBSU1MgZmVlZCBjb25maWd1cmF0aW9uLlxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgYWRkSXRlbShtZW51OiBNZW51LCBmaWxlOiBURmlsZSB8IG51bGwpIHtcclxuICAgICAgICBpZiAoIWZpbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBhZGFwdGVyID0gdGhpcy5wbHVnaW4uZmlsZW1nci5nZXRBZGFwdGVyKGZpbGUpO1xyXG4gICAgICAgIGxldCB0aXRsZTogc3RyaW5nO1xyXG4gICAgICAgIGlmIChhZGFwdGVyIGluc3RhbmNlb2YgUlNTZmVlZEFkYXB0ZXIpIHtcclxuICAgICAgICAgICAgbWVudS5hZGRJdGVtKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5zZXRUaXRsZShcIlJlbmFtZSBSU1MgZmVlZFwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5zZXRJY29uKCdwZW4tbGluZScpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgUmVuYW1lUlNTRmVlZE1vZGFsKHRoaXMucGx1Z2luLGFkYXB0ZXIpLm9wZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9nZ2xlUlNTZmVlZEFjdGl2ZVN0YXR1c01lbnVJdGVtIGV4dGVuZHMgUlNTVHJhY2tlck1lbnVJdGVtIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IFJTU1RyYWNrZXJQbHVnaW4pIHtcclxuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYW4gaXRlbSB0byBhIG1lbnUgd2hpY2ggY2FsbHMgYW4gYWN0aW9uIHRvIHVwZGF0ZSBhbiBSU1MgZmVlZC5cclxuICAgICAqXHJcbiAgICAgKiBUaGUgY29uZGl0aW9uIHVuZGVyIHdoaWNoIHRoZSBpdGVtIGlzIGFkZGVkIGlzIHRoYXQgdGhlIGdpdmVuIGZpbGUgaXMgYW5cclxuICAgICAqIFJTUyBkYXNoYm9hcmQgY29udGFpbmluZyBmcm9udG1hdHRlciBkZWZpbmluZyB0aGUgcHJvcGVydGllcyBgaXRlbWxpbWl0YCBhbmRcclxuICAgICAqIGBmZWVkdXJsYC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbWVudSAtIFRoZSBtZW51IHRvIGFkZCB0aGUgaXRlbSB0b1xyXG4gICAgICogQHBhcmFtIGZpbGUgLSBBbiBPYnNpZGlhbiBmaWxlIHdoaWNoIG1heSBjb250YWluIGZyb250bWF0dGVyIGRlc2NyaWJpbmcgYW4gUlNTIGZlZWQgY29uZmlndXJhdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIGFkZEl0ZW0obWVudTogTWVudSwgZmlsZTogVEZpbGUgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKCFmaWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYWRhcHRlciA9IHRoaXMucGx1Z2luLmZpbGVtZ3IuZ2V0QWRhcHRlcihmaWxlKTtcclxuICAgICAgICBpZiAoIShhZGFwdGVyIGluc3RhbmNlb2YgUlNTZmVlZEFkYXB0ZXIpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhZGFwdGVyLnN1c3BlbmRlZCkge1xyXG4gICAgICAgICAgICBtZW51LmFkZEl0ZW0oaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNldFRpdGxlKCdSZXN1bWUgUlNTIGZlZWQgdXBkYXRlcycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oJ3Bvd2VyJylcclxuICAgICAgICAgICAgICAgICAgICAub25DbGljayhhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkYXB0ZXIuc3VzcGVuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGFkYXB0ZXIuY29tbWl0RnJvbnRtYXR0ZXJDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYCR7ZmlsZT8ubmFtZSA/PyAnPz8/J30gdXBkYXRlcyByZXN1bWVkYCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1lbnUuYWRkSXRlbShpdGVtID0+IHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc2V0VGl0bGUoJ1N1c3BlbmQgUlNTIGZlZWQgdXBkYXRlcycpXHJcbiAgICAgICAgICAgICAgICAgICAgLnNldEljb24oJ3Bvd2VyLW9mZicpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uQ2xpY2soYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGFwdGVyLnN1c3BlbmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IGFkYXB0ZXIuY29tbWl0RnJvbnRtYXR0ZXJDaGFuZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoYCR7ZmlsZT8ubmFtZSA/PyAnPz8/J30gdXBkYXRlcyBzdXNwZW5kZWRgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==