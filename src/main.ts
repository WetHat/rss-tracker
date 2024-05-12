import { MarkdownView, Modal, Notice, Plugin} from 'obsidian';
import { DEFAULT_SETTINGS, RSSTrackerSettingTab, RSSTrackerSettings } from "./settings";
import {EditorCommand, EditorModalCommand, EditorComplexModalCommand} from "./commands";

export default class RSSTrackerPlugin extends Plugin {
	settings: RSSTrackerSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'RSS Tracker', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand(new EditorModalCommand(this.app));
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand(new EditorCommand(this.app));
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand(new EditorComplexModalCommand(this.app));
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RSSTrackerSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("Unloading rss-tracker.")
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}