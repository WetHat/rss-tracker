import { Setting, PluginSettingTab, Notice } from "obsidian";
import RSSTrackerPlugin from "./main";
import { DEFAULT_SETTINGS, RSSTrackerSettings } from "./settings";
import { RSSCollectionDashboardAdapter, RSSFeedsDashboardAdapter } from './RSSAdapter';

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

class RSSTagDomain extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName('RSS Tag Domain')
			.setDesc("The domain for hashtags coming from in RSS feeds. This domain isolates RSS tags from the user's knowledge graph until explicitely mapped.")
			.addText(tg => {
				tg.setPlaceholder(DEFAULT_SETTINGS.rssTagDomain.toString());
				if (this.settings.rssTagDomain !== DEFAULT_SETTINGS.rssTagDomain) {
					tg.setValue(this.settings.rssTagDomain)
				}
				tg.onChange(evt => {
					this.settings.rssTagDomain = tg.getValue();
				})
			});
	}
}

class RSSTagmapNameSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName('RSS tag map name')
			.setDesc('The name of the tag map Markdown file in the RSS Home folder which contains a table mapping tags found in feeds to tags in the local knowledge graph.')
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
			.setName("RSS feed home folder name")
			.setDesc("The name of the RSS folder containing all RSS related folders, feeds, dashboards and assets.")
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
			.setName("RSS feed folder name")
			.setDesc("The name of the sub-folder in RSS Home containing all subscribed RSS feeds.")
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
			})
			.addButton(btn => {
				btn
					.setIcon("archive-restore")
					.setTooltip("Reset the RSS feed dashboard to default")
					//.setButtonText("Reset Dashboard")
					.onClick(async evt => {
						await RSSFeedsDashboardAdapter.create(this.plugin)
						new Notice("Feed dashboard reset complete — you're back to the default setting.");
					});
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
			})
			.addButton(btn => {
				btn
					.setIcon("archive-restore")
					.setTooltip("Reset the RSS collection dashboard to default")
					//.setButtonText("Reset Dashboard")
					.onClick(async evt => {
						await RSSCollectionDashboardAdapter.create(this.plugin);
						new Notice("Collection dashboard reset complete — you're back to the default setting.");
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

class RSSDefaultItemLimitSetting extends RSSTrackerSettingBase {
	constructor(settingsTab: RSSTrackerSettingTab) {
		super(settingsTab);
		this
			.setName("Default RSS item limit")
			.setDesc("The maximum items per feed.")
			.addText(ta => {
				ta
					.setPlaceholder(DEFAULT_SETTINGS.defaultItemLimit.toString())
					.onChange(value => {
						this.settings.defaultItemLimit = parseInt(value);
					});
				if (this.settings.defaultItemLimit !== DEFAULT_SETTINGS.defaultItemLimit) {
					ta.setValue(this.settings.defaultItemLimit.toString())
				}
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset the RSS item limit default")
					.onClick(evt => {
						this.settings.defaultItemLimit = DEFAULT_SETTINGS.defaultItemLimit;
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

		containerEl.createEl("h1",{text: "RSS Folders"});
		new RSSHomeSetting(this);
		new RSSFeedFolderSetting(this);
		new RSSCollectionsFolderSetting(this);
		new RSSTopicsFolderSetting(this);

		containerEl.createEl("h1",{text: "RSS Feed Settings", attr: {style: "border-top: 0.3em solid gray; padding-top: 1em"}});
        new RSSautoUpdateSetting(this);
		new RSSDefaultItemLimitSetting(this);

		containerEl.createEl("h1",{text: "RSS Tag Mapping", attr: {style: "border-top: 0.3em solid gray; padding-top: 1em"}});
		new RSSTagDomain(this);
		new RSSTagmapNameSetting(this);
	}
	hide() {
		this.settings.commit();
	}
}