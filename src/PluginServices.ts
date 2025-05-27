import { App, Vault } from "obsidian";
import RSSTrackerPlugin from "./main";
import { RSSTrackerSettings } from "./settings";

/**
 * Base class for all RSS Tracker services.
 * Provides access to the plugin instance, the Obsidian app, the Obsidian vault, and the plugin settings.
 * See {@link RSSTrackerPlugin} for the services available.
 */
export abstract class RSSTrackerService {
    private _plugin: RSSTrackerPlugin;
    private _app: App;

    get plugin(): RSSTrackerPlugin {
        return this._plugin;
    }

    get app(): App {
        return this._plugin.app;
    }

    get vault(): Vault {
        return this._plugin.vault;
    }

    get settings(): RSSTrackerSettings {
        return this._plugin.settings;
    }

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this._app = app;
        this._plugin = plugin;
    }
}