import { Plugin, PluginManifest, App } from 'obsidian';
import { RSSTrackerSettings } from './settings';
import { FeedManager } from './FeedManager';
import { DataViewJSTools } from './DataViewJSTools';
import { TPropertyBag } from './FeedAssembler';
import { RSSfileManager } from './RSSFileManager';
import { RSSTagManager } from './TagManager';
export default class RSSTrackerPlugin extends Plugin {
    private _settings;
    private _feedmgr;
    private _filemgr;
    private _tagmgr;
    get settings(): RSSTrackerSettings;
    get feedmgr(): FeedManager;
    get filemgr(): RSSfileManager;
    get tagmgr(): RSSTagManager;
    constructor(app: App, manifest: PluginManifest);
    getDVJSTools(dv: TPropertyBag): DataViewJSTools;
    /**
     * Refresh the dataview blocks on the currently active Obsidian note.
     *
     * Calls the _Dataview: Rebuild current view_ command via an undocumented API call.
     * Found at: https://forum.obsidian.md/t/triggering-an-obsidian-command-from-within-an-event-callback/37158
     */
    refreshActiveFile(): void;
    onload(): Promise<void>;
    onunload(): void;
}
