import { PluginSettingTab } from "obsidian";
import { RSSTrackerSettings } from "./settings";
export declare class RSSTrackerSettingTab extends PluginSettingTab {
    settings: RSSTrackerSettings;
    constructor(settings: RSSTrackerSettings);
    display(): void;
    hide(): void;
}
