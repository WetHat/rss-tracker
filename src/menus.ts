import RSSTrackerPlugin from './main';
import { App, Notice, Menu, TFile, EventRef } from 'obsidian';

/**
 * Utility class to conditionally add an item to Obsidian menus.
 *
 * The condition is that the current file is a RSS dashboard which
 * contains frontmatter defiing the feed configuration.
 *
 * Currently event menu event hadlers can be generated for the file menu
 * @see {link fileMenuHandler} and the ditor menu
 * @see {link editorMenuHandler}.
 *
 */
export class UpdateRSSfeedMenuItem {
    protected app: App;
    protected plugin: RSSTrackerPlugin;

    constructor (app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    /**
     * Condidionally add an item to a menu which calls an action to update an RSS feed.
     *
     * The condition under which the item is added is that the given file is an
     * RSS dashboard containing frontmatter defining the properties `itemlimit` and
     * `feedurl`.
     *
     * @param menu - The menu to add the item to
     * @param file - An Obsidian file which may contain frontmatter describing an RSS feed configuration.
     */
    private addItem (menu: Menu, file: TFile | null) {
        if (file) {
            const feedconfig = this.plugin.feedmgr.getFeedConfig(file);
            if (feedconfig) {
                menu.addItem(item => {
                    item.setTitle('Update RSS feed')
                        .setIcon('rss')
                        .onClick(async () => {
                            new Notice(`${file?.name ?? 'unavailable'} updated`);
                        });
                });
            }
        }
    }

    /**
     * Event handler for the the _editor_ context menu to
     * conditionally add a menu item.
     */
    get editorMenuHandler (): EventRef {
        return this.app.workspace.on('editor-menu', (menu, editor, view) => {
            this.addItem(menu, view?.file);
        });
    }
    /**
     * Event handler for the the _file_ context menu to
     * conditionally add a menu item.
     */
    get fileMenuHandler (): EventRef {
        return this.app.workspace.on('file-menu', (menu, file) => {
            this.addItem(menu, file instanceof TFile ? file : null);
        });
    }
}
