import RSSTrackerPlugin from './main';
import { App, Menu, TFile, EventRef } from 'obsidian';
/**
 * Abstract base class to Obsidian menus.
 *
 * Currently event menu event hadlers can be generated for the file menu
 * {@link fileMenuHandler} and the editor menu {@link editorMenuHandler}.
 *
 */
declare abstract class RSSTrackerMenuItem {
    protected app: App;
    protected plugin: RSSTrackerPlugin;
    constructor(app: App, plugin: RSSTrackerPlugin);
    protected abstract addItem(menu: Menu, file: TFile | null): void;
    /**
     * Event handler for the the _editor_ context menu to add a menu item.
     */
    get editorMenuHandler(): EventRef;
    /**
     * Event handler for the the _file_ context menu to add a menu item.
     */
    get fileMenuHandler(): EventRef;
}
/**
 * Utility class to add a menu item to Obsidian one of the supported Obsidian context menus
 * if the current file is a RSS feed dashboard.
 *
 * The menu action marks all items of the RSS feed, described by the current file, as read.
 */
export declare class MarkAllItemsReadMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin);
    protected addItem(menu: Menu, dashboard: TFile | null): void;
}
export declare class DownloadArticleContentMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin);
    protected addItem(menu: Menu, rssitem: TFile | null): void;
}
/**
 * Utility class to add a menu item to Obsidian one of the supported Obsidian context menus
 * if the current file is a RSS feed dashboard.
 *
 * The menu action updates the RSS feed described by the current file.
 */
export declare class UpdateRSSfeedMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin);
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
    protected addItem(menu: Menu, file: TFile | null): void;
}
export declare class RenameRSSfeedMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin);
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
    protected addItem(menu: Menu, file: TFile | null): void;
}
export declare class ToggleRSSfeedActiveStatusMenuItem extends RSSTrackerMenuItem {
    constructor(app: App, plugin: RSSTrackerPlugin);
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
    protected addItem(menu: Menu, file: TFile | null): void;
}
export {};
