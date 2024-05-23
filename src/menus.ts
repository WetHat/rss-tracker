import RSSTrackerPlugin from './main';
import { App, Notice, Menu, TFile, EventRef } from 'obsidian';
import { FeedConfig } from './FeedManager';

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

export class MarkAllItemsReadMenuItem extends  RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin) {
        super(app,plugin);
     }

     protected addItem(menu: Menu, file: TFile | null) {
        if (file) {
            const feedconfig = FeedConfig.fromFile(this.app, file);
            if (feedconfig) {
                menu.addItem(item => {
                    item.setTitle('Mark all RSS items read')
                        .setIcon('checkmark')
                        .onClick(async () => {
                            this.plugin.feedmgr.markFeedItemsRead(file);
                            new Notice(`All items of "${file?.name ?? 'unavailable'}" marked read.`);
                        });
                });
            }
        }
    }
}

/**
 * Utility class to add a menu item to Obsidian one of the supported Obsidian context menus
 * if the current file is a RSS feed dashboard.
 *
 * The menu action updates the RSS feed described by the current file.
 */
export class UpdateRSSfeedMenuItem extends  RSSTrackerMenuItem{
    constructor(app: App, plugin: RSSTrackerPlugin) {
       super(app,plugin);
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
        if (file) {
            const feedconfig = FeedConfig.fromFile(this.app, file);
            if (feedconfig) {
                menu.addItem(item => {
                    item.setTitle('Update RSS feed')
                        .setIcon('rss')
                        .onClick(async () => {
                            this.plugin.feedmgr.updateFeed(feedconfig);
                            new Notice(`${file?.name ?? 'unavailable'} updated`);
                        });
                });
            }
        }
    }
}