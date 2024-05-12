import RSSTrackerPlugin from './main';
import {PluginSettingTab, Setting, App} from 'obsidian';

export interface RSSTrackerSettings {
	mySetting: string;
}

export const DEFAULT_SETTINGS: RSSTrackerSettings = {
	mySetting: 'default'
}

export class RSSTrackerSettingTab extends PluginSettingTab {
	plugin: RSSTrackerPlugin;

	constructor(app: App, plugin: RSSTrackerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
