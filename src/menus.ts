import RSSTrackerPlugin from './main';
import { App, Notice, Menu, TFile, EventRef, Command, Plugin } from 'obsidian';
import { RSScollectionProxy, RSSfeedProxy } from './RSSproxies';

/**
 * Abstract base class to Obsidian menus.
 *
 * Currently event menu event hadlers can be generated for the file menu
 * @see {@link fileMenuHandler} and the editor menu
 * @see {@link editorMenuHandler}.
 *
 */
abstract class RSSTrackerMenuItem {
    protected app: App;
    protected plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    protected abstract addItem(menu: Menu, file: TFile | null): void;

    /**
     * Event handler for the the _editor_ context menu to add a menu item.
     */
    get editorMenuHandler(): EventRef {
        return this.app.workspace.on('editor-menu', (menu, editor, view) => {
            this.addItem(menu, view?.file);
        });
    }
    /**
     * Event handler for the the _file_ context menu to add a menu item.
     */
    get fileMenuHandler(): EventRef {
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
    constructor(app: App, plugin: RSSTrackerPlugin) {
        super(app, plugin);
    }

    protected addItem(menu: Menu, dashboard: TFile | null) {
        if (!dashboard) {
            return;
        }

        const proxy = this.plugin.filemgr.getProxy(dashboard);
        if (proxy instanceof RSSfeedProxy) {
            menu.addItem(item => {
                { }
                item.setTitle('Mark all RSS items as read')
                    .setIcon('list-checks')
                    .onClick(async () => {
                        this.plugin.feedmgr.markFeedItemsRead(proxy);
                        new Notice(`All items of "${dashboard?.basename ?? 'unavailable'}" marked read.`);
                    });
            });
        }
    }
}

export class DownloadArticleContentMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin) {
        super(app, plugin);
    }
    protected addItem(menu: Menu, rssitem: TFile | null) {
        const feedmgr = this.plugin.feedmgr;
        if (rssitem && feedmgr.canDownloadArticle(rssitem)) {
            menu.addItem(item => {
                item.setTitle("Download RSS Item article")
                    .setIcon('download')
                    .onClick(async () => {
                        await feedmgr.downloadArticle(rssitem);
                        new Notice(`Article content of "${rssitem.basename}" downloaded`);
                    });
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
    constructor(app: App, plugin: RSSTrackerPlugin) {
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
    protected addItem(menu: Menu, file: TFile | null) {
        if (!file) {
            return;
        }
        const proxy = this.plugin.filemgr.getProxy(file);
        let title: string;
        if (proxy instanceof RSSfeedProxy && !proxy.suspended) {
            title = "Update RSS feed";
        } else if (proxy instanceof RSScollectionProxy) {
            title = "Update RSS collection";
        } else {
            title = "";
        }

        if (title) {
            menu.addItem(item => {
                item.setTitle(title)
                    .setIcon('rss')
                    .onClick(async () => {
                        if (proxy instanceof RSSfeedProxy) {
                            await this.plugin.tagmgr.updateTagMap()
                            await this.plugin.feedmgr.updateFeed(proxy, true);
                        } else if (proxy instanceof RSScollectionProxy) {
                            await this.plugin.feedmgr.updateFeeds(proxy.feeds,true);
                        }
                        new Notice(`${file?.basename ?? '???'} updated`);
                    });
            });
        }
    }
}

export class ToggleRSSfeedActiveStatusMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin) {
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
    protected addItem(menu: Menu, file: TFile | null) {
        if (!file) {
            return;
        }
        const proxy = this.plugin.filemgr.getProxy(file);
        if (!(proxy instanceof RSSfeedProxy)) {
            return;
        }

        if (proxy.suspended) {
            menu.addItem(item => {
                item.setTitle('Resume RSS feed updates')
                    .setIcon('power')
                    .onClick(async () => {
                        proxy.suspended = false;
                        await proxy.commitFrontmatterChanges();
                        new Notice(`${file?.name ?? '???'} updates resumed`);
                    });
            });
        } else {
            menu.addItem(item => {
                item.setTitle('Suspend RSS feed updates')
                    .setIcon('power-off')
                    .onClick(async () => {
                        proxy.suspended = true;
                        await proxy.commitFrontmatterChanges();
                        new Notice(`${file?.name ?? '???'} updates suspended`);
                    });
            });
        }
    }
}
