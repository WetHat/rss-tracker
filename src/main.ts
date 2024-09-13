import { Notice, Plugin, PluginManifest, App, ObsidianProtocolData } from 'obsidian';
import { RSSTrackerSettings } from './settings';
import { DownloadRSSitemArticleCommand, MarkAllRSSitemsReadCommand, NewRSSFeedCollectionCommand, NewRSSFeedModalCommand, NewRSSTopicCommand, UpdateRSSfeedCommand } from './commands';
import { FeedManager } from './FeedManager';
import { UpdateRSSfeedMenuItem, MarkAllItemsReadMenuItem, DownloadArticleContentMenuItem, ToggleRSSfeedActiveStatusMenuItem } from './menus';
import { DataViewJSTools } from './DataViewJSTools';
import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettingTab } from './settingsUI';
import { RSSfileManager } from './RSSFileManager';
import { RSSTagManager } from './TagManager';

export default class RSSTrackerPlugin extends Plugin {
    private _settings: RSSTrackerSettings;
    private _feedmgr: FeedManager;
    private _filemgr: RSSfileManager;
    private _tagmgr: RSSTagManager;

    get settings() : RSSTrackerSettings {
        return this._settings;
    }

    get feedmgr() : FeedManager{
        return this._feedmgr;
    }

    get filemgr() : RSSfileManager {
        return this._filemgr;
    }

    get tagmgr() : RSSTagManager {
        return this._tagmgr;
    }

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);
        this._settings = new RSSTrackerSettings(app,this);
        this._filemgr = new RSSfileManager(app,this);
        this._feedmgr = new FeedManager(app, this);
        this._tagmgr = new RSSTagManager(app,this);
    }

    getDVJSTools(dv: TPropertyBag) {
        return new DataViewJSTools(dv,this._settings);
    }

    async onload() {
        console.log('Loading rss-tracker.');

        await this._settings.loadData();

        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon('rss', 'Update all RSS Feeds', (evt: MouseEvent) => {
            // Called when the user clicks the icon.
            this._feedmgr.updateAllRSSfeeds(true);
        });

        // Perform additional things with the ribbon
        ribbonIconEl.addClass('rss-tracker-plugin-ribbon-class');

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
        //const statusBarItemEl = this.addStatusBarItem();
        //statusBarItemEl.setText('Status Bar Text');

        // This adds a complex command that can check whether the current state of the app allows execution of the command
        this.addCommand(new UpdateRSSfeedCommand(this));
        // This adds a simple command that can be triggered anywhere
        this.addCommand(new NewRSSFeedModalCommand(this));
        this.addCommand(new MarkAllRSSitemsReadCommand(this));
        this.addCommand(new NewRSSFeedCollectionCommand(this));
        this.addCommand(new DownloadRSSitemArticleCommand(this));
        this.addCommand(new NewRSSTopicCommand(this));
        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new RSSTrackerSettingTab(this._settings));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        //this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
        //    console.log('click', evt);
        //});

        // context menu configuration
        const updateFeedItem = new UpdateRSSfeedMenuItem(this.app, this);
        this.registerEvent(updateFeedItem.editorMenuHandler);
        this.registerEvent(updateFeedItem.fileMenuHandler);

        const toggleActive = new ToggleRSSfeedActiveStatusMenuItem(this.app,this);
        this.registerEvent(toggleActive.editorMenuHandler);
        this.registerEvent(toggleActive.fileMenuHandler);

        const markAsRead = new MarkAllItemsReadMenuItem(this.app, this);
        this.registerEvent(markAsRead.editorMenuHandler);
        this.registerEvent(markAsRead.fileMenuHandler);

        const downloadArticle = new DownloadArticleContentMenuItem(this.app,this);
        this.registerEvent(downloadArticle.editorMenuHandler);
        this.registerEvent(downloadArticle.fileMenuHandler);

        // post-processing of RSS related files files
        this.registerEvent(this._tagmgr.rssTagPostProcessor);

        // protocol handler
        this.registerObsidianProtocolHandler('newRssFeed', async (params: ObsidianProtocolData) => {
            const { xml, dir } = params;
            console.log("newRssFeed:xml=" + xml + "\n=>" + dir);
            const xmlFile = this.app.vault.getFileByPath(xml),
                feedDir = this.app.vault.getFolderByPath(dir);
            if (xmlFile && feedDir) {
                const dashboard = await this._feedmgr.createFeedFromFile(xmlFile, feedDir);
                new Notice(`New RSS Feed "${dashboard.basename}" created`);
            }
        });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => {
            if (this._settings.autoUpdateFeeds) {
                try {
                    this._feedmgr.updateAllRSSfeeds(false);
                    console.log("RSS Feed background update complete.")
                } catch (ex: any) {
                    console.log(`Background update failed: ${ex.message}`)
                }
            }
        }, 60 * 60 * 1000));
    }

    onunload() {
        console.log('Unloading rss-tracker.');
        this._settings.saveData();
    }
}
