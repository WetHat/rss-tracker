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

class RSSTagmapNameSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName('RSS Tag MapName')
			.setDesc('THe name of the tag map Markdown file in the RSS Home folder which contains a table whic defines the mapping of RSS tags to tags in the local knowledge graph.')
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.rssTagmapName)
					.onChange(value => {
						this.settings.rssTagmapName = value;
					});
				if (this.settings.rssTagmapName !== DEFAULT_SETTINGS.rssTagmapName) {
					ta.setValue(this.settings.rssTagmapName)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS Tag Map name to default")
					.onClick(evt => {
						this.settings.rssTagmapName = DEFAULT_SETTINGS.rssTagmapName;
					})
			});
	}
}

class RSSDashboardNameSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName('RSS Dashboard Name')
			.setDesc('THe name of the dashboard Markdown file in the RSS Home folder which contains a content map of the subscribed RSS feeds.')
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.rssDashboardName)
					.onChange(value => {
						this.settings.rssDashboardName = value;
					});
				if (this.settings.rssDashboardName !== DEFAULT_SETTINGS.rssDashboardName) {
					ta.setValue(this.settings.rssDashboardName)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS dashboard name to default")
					.onClick(evt => {
						this.settings.rssDashboardName = DEFAULT_SETTINGS.rssDashboardName;
					})
			});
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
			.setDesc("The base folder containing RSS feeds, dashboards and assets.")
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
					.setPlaceholder(DEFAULT_SETTINGS.rssFeedFolderName)
					.onChange(value => {
						this.settings.rssFeedFolderName = value;
					});
				if (this.settings.rssFeedFolderName !== DEFAULT_SETTINGS.rssFeedFolderName) {
					ta.setValue(this.settings.rssFeedFolderName)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS feed location to default")
					.onClick(evt => {
						this.settings.rssFeedFolderName = DEFAULT_SETTINGS.rssFeedFolderName;
					})
			});
	}
}

class RSSCollectionsFolderSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName("RSS feed collections location")
			.setDesc("The folder containing all RSS feed collections.")
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.rssCollectionsFolderName)
					.onChange(value => {
						this.settings.rssCollectionsFolderName = value;
					});
				if (this.settings.rssCollectionsFolderName !== DEFAULT_SETTINGS.rssCollectionsFolderName) {
					ta.setValue(this.settings.rssCollectionsFolderName)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS feed collections location to default")
					.onClick(evt => {
						this.settings.rssCollectionsFolderName = DEFAULT_SETTINGS.rssCollectionsFolderName;
					})
			});
	}
}

class RSSTopicsFolderSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName("RSS topics location")
			.setDesc("The folder containing all RSS topics.")
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.rssTopicsFolderName)
					.onChange(value => {
						this.settings.rssTopicsFolderName = value;
					});
				if (this.settings.rssTopicsFolderName !== DEFAULT_SETTINGS.rssTopicsFolderName) {
					ta.setValue(this.settings.rssTopicsFolderName)
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS topics location to default")
					.onClick(evt => {
						this.settings.rssTopicsFolderName = DEFAULT_SETTINGS.rssTopicsFolderName;
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
		new RSSCollectionsFolderSetting(this);
		new RSSTopicsFolderSetting(this);
        new RSSautoUpdateSetting(this);
		new RSSDashboardNameSetting(this);
		new RSSTagmapNameSetting(this);
	}
	hide() {
		this.settings.commit();
	}
}