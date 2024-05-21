import { Notice, Plugin, PluginManifest, App } from 'obsidian';
import { DEFAULT_SETTINGS, RSSTrackerSettingTab, RSSTrackerSettings } from './settings';
import { NewRSSFeedModalCommand, UpdateRSSfeedCommand } from './commands';
import { FeedManager } from './FeedManager';
import { UpdateRSSfeedMenuItem ,MarkAllItemsReadMenuItem} from './menus';

export default class RSSTrackerPlugin extends Plugin {
    settings: RSSTrackerSettings = DEFAULT_SETTINGS;
    feedmgr: FeedManager;

    constructor (app: App, manifest: PluginManifest) {
        super(app, manifest);
        this.feedmgr = new FeedManager(app, this);
    }

    async onload () {
        await this.loadSettings();

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('rss', 'Update All RSS Feeds', (evt: MouseEvent) => {
            // Called when the user clicks the icon.
            new Notice('All RSS feeds are being updated');
        });

        // Perform additional things with the ribbon
        ribbonIconEl.addClass('rss-tracker-plugin-ribbon-class');

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        //const statusBarItemEl = this.addStatusBarItem();
        //statusBarItemEl.setText('Status Bar Text');

        // This adds a complex command that can check whether the current state of the app allows execution of the command
        this.addCommand(new UpdateRSSfeedCommand(this.app, this));
        // This adds a simple command that can be triggered anywhere
        this.addCommand(new NewRSSFeedModalCommand(this.app, this));
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new RSSTrackerSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        //this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
        //    console.log('click', evt);
        //});

		// context menu configuration
		const updateFeedItem = new UpdateRSSfeedMenuItem(this.app,this);
        this.registerEvent(updateFeedItem.editorMenuHandler);
		this.registerEvent(updateFeedItem.fileMenuHandler);

        const markAsRead = new MarkAllItemsReadMenuItem(this.app,this);
        this.registerEvent(markAsRead.editorMenuHandler);
		this.registerEvent(markAsRead.fileMenuHandler);

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload () {
        console.log('Unloading rss-tracker.');
    }

    async loadSettings () {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings () {
        await this.saveData(this.settings);
    }
}
