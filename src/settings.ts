import RSSTrackerPlugin from './main';
import {PluginSettingTab, Setting, App} from 'obsidian';

export interface RSSTrackerSettings {
	feedTemplate: string;
	itemTemplate: string;
}

export const DEFAULT_SETTINGS: RSSTrackerSettings = {
	feedTemplate: `---
feedurl: {{feedUrl}}
site: {{siteUrl}}
itemlimit: 100
updated: never
status: unknown
---

> [!abstract] {{title}}
> {{description}}

`,
	itemTemplate: `---
title: {{title}}
author: {{author}}
link: {{link}}
published: {{pubDate}}
guid: {{guid}}
read: false
tags: [{{tags}}]
---
{{content}}
- - -
{{media}}
`
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

		// feed template setting
		new Setting(containerEl)
			.setName('Default RSS Feed Template')
			.setDesc('Template for new RSS feed description markdown files.')
			.addTextArea( ta => { ta
					.setValue(this.plugin.settings.feedTemplate)
					.onChange(async (value) => {
						this.plugin.settings.feedTemplate = value;
						await this.plugin.saveSettings();
					});
				ta.inputEl.style.width="100%";
				ta.inputEl.rows = 10;
				})
			.addButton(btn => { btn
				.setIcon("reset")
				.setTooltip("Reset feed template to default")
				.onClick(async evt => {
					this.plugin.settings.feedTemplate = DEFAULT_SETTINGS.feedTemplate;
					await this.plugin.saveSettings();
					this.display();
				})
			});
		// item template setting
		new Setting(containerEl)
			.setName('Default RSS Item Template')
			.setDesc('Template for new RSS item description markdown files.')
			.addTextArea( ta => { ta
					.setValue(this.plugin.settings.itemTemplate)
					.onChange(async (value) => {
						this.plugin.settings.itemTemplate = value;
						await this.plugin.saveSettings();
					});
				ta.inputEl.style.width="100%";
				ta.inputEl.rows = 10;
				})
			.addButton(btn => { btn
				.setIcon("reset")
				.setTooltip("Reset item template to default")
				.onClick(async evt => {
					this.plugin.settings.itemTemplate = DEFAULT_SETTINGS.itemTemplate;
					await this.plugin.saveSettings();
					this.display();
				})
			});
	}
}
