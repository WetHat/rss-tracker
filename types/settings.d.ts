import RSSTrackerPlugin from './main';
import { App } from 'obsidian';
export interface IRSSTrackerSettings {
    [key: string]: any;
    autoUpdateFeeds: boolean;
    rssHome: string;
    rssFeedFolderName: string;
    rssCollectionsFolderName: string;
    rssTopicsFolderName: string;
    rssTemplateFolder: string;
    rssDashboardName: string;
    rssTagmapName: string;
    rssDefaultImage: string;
    defaultItemLimit: number;
    rssTagDomain: string;
    rssDashboardPlacement: TDashboardPlacement;
}
export declare const DEFAULT_SETTINGS: IRSSTrackerSettings;
/**
 * The basenames of templates used for RSS content.
 */
export declare type TTemplateName = "RSS Feed" | "RSS Item" | "RSS Topic" | "RSS Collection" | "RSS Dashboard" | "RSS Tagmap";
/**
 * The placement of RSS dashboard files relative to their data folders.
 * The values are taken from the Folder Notes plugin.
 */
export declare type TDashboardPlacement = "insideFolder" | "parentFolder";
export declare class RSSTrackerSettings implements IRSSTrackerSettings {
    private static RSS_DEFAULT_IMAGE;
    plugin: RSSTrackerPlugin;
    app: App;
    private get _filemgr();
    static getTemplateFilename(templateName: TTemplateName): string;
    /**
     * The persisted settings.
     */
    private _data;
    get autoUpdateFeeds(): boolean;
    set autoUpdateFeeds(value: boolean);
    private _rssHome?;
    private _rssFeedFolder?;
    private _rssCollectionsFolder?;
    private _rssTopicsFolder?;
    private _rssTemplateFolder?;
    private _rssDashboardName?;
    private _rssTagmapName?;
    private _defaultItemLimit?;
    private _rssTagDomain?;
    private _rssDashboardPlacement?;
    get rssHome(): string;
    set rssHome(value: string);
    get rssFeedFolderName(): string;
    set rssFeedFolderName(value: string);
    get rssCollectionsFolderName(): string;
    set rssCollectionsFolderName(value: string);
    get rssTopicsFolderName(): string;
    set rssTopicsFolderName(value: string);
    get rssTemplateFolder(): string;
    set rssTemplateFolder(value: string);
    get rssDashboardName(): string;
    set rssDashboardName(value: string);
    get rssTagmapName(): string;
    set rssTagmapName(value: string);
    get defaultItemLimit(): number;
    set defaultItemLimit(value: number);
    get rssTagDomain(): string;
    set rssTagDomain(value: string);
    /**
     * Get the placement of an RSS dashboard.
     *
     * By default this setting is `insideFolder`, unless the 'Folder Notes' plugin is enabled, then it is taken
     * from the Folder Notes plugin settings.
     * The placement can only be changed by the 'Folder Notes' plugin.
     */
    get rssDashboardPlacement(): TDashboardPlacement;
    /**
     * Get the path to the RSS default image
     */
    get rssDefaultImage(): string;
    getRssDefaultImagePath(): Promise<string>;
    /**
     * Commit the changes to the settings.
     * This method is called when the user closes the settings UI.
     */
    commit(): Promise<void>;
    constructor(app: App, plugin: RSSTrackerPlugin);
    loadData(): Promise<void>;
    saveData(): Promise<void>;
    install(): Promise<void>;
    get rssFeedFolderPath(): string;
    get rssCollectionsFolderPath(): string;
    get rssTopicsFolderPath(): string;
    get rssTemplateFolderPath(): string;
    get rssDashboardPath(): string;
    get rssTagmapPath(): string;
    getTemplatePath(templateName: TTemplateName): string;
}
