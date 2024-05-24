import { DefaultDeserializer } from 'v8';
import RSSTrackerPlugin from './main';
import { PluginSettingTab, Setting, App } from 'obsidian';

export interface RSSTrackerSettings {
	feedTemplate: string;
	itemTemplate: string;
	autoUpdateFeeds: boolean;
}

export const DEFAULT_SETTINGS: RSSTrackerSettings = {
	feedTemplate: `---
feedurl: {{feedUrl}}
site: "{{siteUrl}}"
itemlimit: 100
updated: never
status: unknown
tags: [rss]
---

> [!abstract] {{title}}
> {{description}}
>
> {{image}}
# Unread Feed Items
~~~dataview
TASK
FROM "{{folderPath}}"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "{{folderPath}}"
WHERE completed
SORT published DESC
~~~
`,
	itemTemplate: `---
author: "{{author}}"
published: {{publishDate}}
link: {{link}}
id: {{id}}
feed: "{{feedName}}"
tags: {{tags}}
---
{{abstract}}

🔗Read article [online]({{link}}). For other items in this feed see [[{{feedName}}]].

- [ ] [[{{fileName}}]] - {{publishDate}}
- - -
{{content}}
`,
	autoUpdateFeeds: false
}

export class RSSTrackerSettingTab extends PluginSettingTab {
	plugin: RSSTrackerPlugin;

	constructor(app: App, plugin: RSSTrackerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// feed template setting
		new Setting(containerEl)
			.setName('Default RSS Feed Template')
			.setDesc('Template for new RSS feed description markdown files.')
			.addTextArea(ta => {
				ta
					.setValue(this.plugin.settings.feedTemplate)
				.onChange(async (value) => {
					this.plugin.settings.feedTemplate = value;
					await this.plugin.saveSettings();
				});
				ta.inputEl.style.width = "100%";
				ta.inputEl.rows = 10;
			})
			.addButton(btn => {
				btn
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
			.addTextArea(ta => {
				ta
					.setValue(this.plugin.settings.itemTemplate)
					.onChange(async (value) => {
						this.plugin.settings.itemTemplate = value;
						await this.plugin.saveSettings();
					});
				ta.inputEl.style.width = "100%";
				ta.inputEl.rows = 10;
			})
			.addButton(btn => {
				btn
					.setIcon("reset")
					.setTooltip("Reset item template to default")
					.onClick(async evt => {
						this.plugin.settings.itemTemplate = DEFAULT_SETTINGS.itemTemplate;
						await this.plugin.saveSettings();
						this.display();
					})
			});

		new Setting(containerEl)
			.setName('Automatic RSS Updates')
			.setDesc('Turn on to update RSS feeds periodically in the background.')
			.addToggle(tg => {
				tg.setValue(this.plugin.settings.autoUpdateFeeds);
				tg.onChange(async evt => {
					this.plugin.settings.autoUpdateFeeds = tg.getValue();
					await this.plugin.saveSettings();
				})
			});
	}
}
