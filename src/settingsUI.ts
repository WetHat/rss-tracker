import { Setting, PluginSettingTab } from "obsidian";
import RSSTrackerPlugin from "./main";
import { DEFAULT_SETTINGS, RSSTrackerSettings } from "./settings";

abstract class RSSTrackerSettingBase extends Setting {
	protected settingsTab: RSSTrackerSettingTab;

	protected get plugin(): RSSTrackerPlugin {
		return this.settingsTab.settings.plugin;
	}

	protected get settings() : RSSTrackerSettings {
		return this.settingsTab.settings;
	}

	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab.containerEl);
		this.settingsTab = settingsTab;
	}
}

class RSSautoUpdateSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName('Automatic RSS Updates')
			.setDesc('Turn on to update RSS feeds periodically in the background.')
			.addToggle(tg => {
				tg.setValue(this.settings.autoUpdateFeeds);
				tg.onChange(evt => {
					this.settings.autoUpdateFeeds = tg.getValue();
				})
			});
	}
}

class RSSHomeSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName("RSS feed base (home) location")
			.setDesc("The base folder containing RSS feeds and assets.")
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.rssHome)
					.onChange(value => {
						this.settings.rssHome = value;
					});
				if (this.settings.rssHome !== DEFAULT_SETTINGS.rssHome) {
					ta.setValue(this.settings.rssHome)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS home location to default")
					.onClick(evt => {
						this.settings.rssHome = DEFAULT_SETTINGS.rssHome;
					})
			});
	}
}

class RSSFeedFolderSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName("RSS feed location")
			.setDesc("The folder containing all RSS feeds.")
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.rssFeedFolder)
					.onChange(value => {
						this.settings.rssFeedFolder = value;
					});
				if (this.settings.rssFeedFolder !== DEFAULT_SETTINGS.rssFeedFolder) {
					ta.setValue(this.settings.rssFeedFolder)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS feed location to default")
					.onClick(evt => {
						this.settings.rssFeedFolder = DEFAULT_SETTINGS.rssFeedFolder;
					})
			});
	}
}

export class RSSTrackerSettingTab extends PluginSettingTab {
	settings: RSSTrackerSettings;

	constructor(settings: RSSTrackerSettings) {
		super(settings.app, settings.plugin);
		this.settings = settings;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		const frag = containerEl.doc.createDocumentFragment()

		new RSSHomeSetting(this);
		new RSSFeedFolderSetting(this);
        new RSSautoUpdateSetting(this);
	}
	hide() {
		this.settings.commit();
	}
}