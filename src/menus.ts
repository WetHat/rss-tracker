import RSSTrackerPlugin from './main';
import { App, Notice, Menu, TFile, EventRef} from 'obsidian';
import { RSScollectionAdapter, RSSfeedAdapter } from './RSSAdapter';
import { RenameRSSFeedModal } from './dialogs';

/**
 * Abstract base class to Obsidian menus.
 *
 * Currently event menu event hadlers can be generated for the file menu
 * {@link fileMenuHandler} and the editor menu {@link editorMenuHandler}.
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

        const adapter = this.plugin.filemgr.createAdapter(dashboard,"rssfeed","rsscollection");
        if (adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter) {
            menu.addItem(item => {
                item.setTitle('Mark all RSS items as read')
                    .setIcon('list-checks')
                    .onClick(async () => {
                        await this.plugin.feedmgr.completeReadingTasks(adapter);
                        this.plugin.refreshActiveFile();
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
        menu.addSeparator();
        const adapter = this.plugin.filemgr.createAdapter(file,"rssfeed","rsscollection");
        let title: string;
        if (adapter instanceof RSSfeedAdapter && !adapter.suspended) {
            title = "Update RSS feed";
        } else if (adapter instanceof RSScollectionAdapter) {
            title = "Update RSS collection";
        } else {
            title = "";
        }

        if (title) {
            menu.addItem(item => {
                item.setTitle(title)
                    .setIcon('rss')
                    .onClick(async () => {
                        if (adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter ) {
                            await this.plugin.feedmgr.update(true,adapter);
                            this.plugin.refreshActiveFile();
                        }
                    });
            });
        }
    }
}

export class RenameRSSfeedMenuItem extends RSSTrackerMenuItem {
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
        const adapter = this.plugin.filemgr.createAdapter(file,"rssfeed");
        let title: string;
        if (adapter instanceof RSSfeedAdapter) {
            menu.addItem(item => {
                item.setTitle("Rename RSS feed")
                    .setIcon('pen-line')
                    .onClick(async () => {
                        new RenameRSSFeedModal(this.plugin,adapter).open();
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
        const adapter = this.plugin.filemgr.createAdapter(file,"rssfeed");
        if (!(adapter instanceof RSSfeedAdapter)) {
            return;
        }

        if (adapter.suspended) {
            menu.addItem(item => {
                item.setTitle('Resume RSS feed updates')
                    .setIcon('power')
                    .onClick(async () => {
                        adapter.suspended = false;
                        await adapter.commitFrontmatterChanges();
                        new Notice(`${file?.name ?? '???'} updates resumed`);
                    });
            });
        } else {
            menu.addItem(item => {
                item.setTitle('Suspend RSS feed updates')
                    .setIcon('power-off')
                    .onClick(async () => {
                        adapter.suspended = true;
                        await adapter.commitFrontmatterChanges();
                        new Notice(`${file?.name ?? '???'} updates suspended`);
                    });
            });
        }
    }
}
