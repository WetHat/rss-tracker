import { TPropertyBag } from './FeedAssembler';
import RSSTrackerPlugin from './main';
import { App } from 'obsidian';
import { RSSfileManager } from './RSSFileManager';

export interface IRSSTrackerSettings {
	[key: string]: any;
	autoUpdateFeeds: boolean;
	rssHome: string;
	rssFeedFolder: string;
	rssCollectionsFolder: string;
	rssTopicsFolder: string;
	rssTemplateFolder: string;
	rssDashboardName: string;
}

export const DEFAULT_SETTINGS: IRSSTrackerSettings = {
	autoUpdateFeeds: false,
	rssHome: "RSS",
	rssFeedFolder: "Feeds",
	rssCollectionsFolder: "Collections",
	rssTopicsFolder: "Topics",
	rssTemplateFolder: "Templates",
	rssDashboardName: "RSS Dashboard"
}

/**
 * The basenames of templates used for RSS content.
 */
export type TTemplateName = "RSS Feed" | "RSS Item" | "RSS Topic" | "RSS Collection" | "RSS Dashboard";

/**
 * List of basenames of templates to be installed into the `Templates` folder.
 */
const TEMPLATES: TTemplateName[] = ["RSS Feed", "RSS Item", "RSS Topic", "RSS Collection"];

export class RSSTrackerSettings implements IRSSTrackerSettings {
	plugin: RSSTrackerPlugin;
	app: App;

	private get _filemgr() : RSSfileManager {
		return this.plugin.filemgr;
	};

	static getTemplateFilename(templateName: TTemplateName): string {
		return templateName + ".md";
	}

	private _data: IRSSTrackerSettings = { ...DEFAULT_SETTINGS };

	get autoUpdateFeeds(): boolean {
		return this._data.autoUpdateFeeds;
	}

	set autoUpdateFeeds(value: boolean) {
		this._data.autoUpdateFeeds = value;
	}

	private _rssHome: string | null;
	private _rssFeedFolder: string | null;
	private _rssCollectionsFolder: string | null;
	private _rssTopicsFolder: string | null;
	private _rssTemplateFolder: string | null;
	private _rssDashboardName: string | null;

	get rssHome(): string {
		return this._data.rssHome ?? DEFAULT_SETTINGS.rssHome;
	}

	set rssHome(value: string) {
		this._rssHome = value;
	}

	get rssFeedFolder(): string {
		return this._data.rssFeedFolder ?? DEFAULT_SETTINGS.rssFeedFolder;
	}

	set rssFeedFolder(value: string) {
		this._rssFeedFolder = value;
	}

	get rssCollectionsFolder(): string {
		return this._data.rssCollectionsFolder ?? DEFAULT_SETTINGS.rssCollectionsFolder;
	}

	set rssCollectionsFolder(value: string) {
		this._rssCollectionsFolder = value;
	}

	get rssTopicsFolder(): string {
		return this._data.rssTopicsFolder ?? DEFAULT_SETTINGS.rssTopicsFolder;
	}

	set rssTopicsFolder(value: string) {
		this._rssCollectionsFolder = value;
	}

	get rssTemplateFolder(): string {
		return this._data.rssTemplateFolder ?? DEFAULT_SETTINGS.rssTemplateFolder;
	}

	set rssTemplateFolder(value: string) {
		this._rssTemplateFolder = value;
	}

	get rssDashboardName(): string {
		return this._data.rssDashboardName || DEFAULT_SETTINGS.rssDashboardName;
	}

	set rssDashboardName(value: string) {
		this._rssDashboardName = value;
	}

	async commit() {
		console.log("Commiting changes in settings");
		if (this._rssHome && this._rssHome !== this.rssHome) {
			if (await this._filemgr.renameFolder(this.rssHome, this._rssHome)) {
				this._data.rssHome = this._rssHome;
			}
			this._rssHome = null;
		}

		if (this._rssFeedFolder && this._rssFeedFolder !== this.rssFeedFolder) {
			if (await this._filemgr.renameFolder(this.rssFeedFolderPath, this.rssHome + "/" + this._rssFeedFolder)) {
				this._data.rssFeedFolder = this._rssFeedFolder;
			}
			this._rssFeedFolder = null;
		}

		if (this._rssCollectionsFolder && this._rssCollectionsFolder !== this.rssCollectionsFolder) {
			if (await this._filemgr.renameFolder(this.rssCollectionsFolderPath, this.rssHome + "/" + this._rssCollectionsFolder)) {
				this._data.rssCollectionsFolder = this._rssCollectionsFolder;
			}
			this._rssCollectionsFolder = null;
		}

		if (this._rssTopicsFolder && this._rssTopicsFolder !== this.rssTopicsFolder) {
			if (await this._filemgr.renameFolder(this.rssTopicsFolderPath, this.rssHome + "/" + this._rssTopicsFolder)) {
				this._data.rssTopicsFolder = this._rssTopicsFolder;
			}
			this._rssTopicsFolder = null;
		}

		if (this._rssTemplateFolder && this._rssTemplateFolder !== this.rssTemplateFolder) {
			if (await this._filemgr.renameFolder(this.rssTemplateFolderPath, this.rssHome + "/" + this._rssTemplateFolder)) {
				this._data.rssTemplateFolder = this._rssTemplateFolder;
			}

			this._rssTemplateFolder = null;
		}

		if (this._rssDashboardName && this._rssDashboardName !== this.rssDashboardName) {
			if (await this._filemgr.renameFile(this.rssTemplateFolderPath, this.rssHome + "/" + this._rssTemplateFolder)) {
				this._data.rssDashboardName = this._rssDashboardName;
			}

			this._rssDashboardName = null;
		}

		await this.saveData();

		this.install(); // always assure integrity after commit
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this.app = app;
		this.plugin = plugin;

		this._rssHome
			= this._rssFeedFolder
			= this._rssCollectionsFolder
			= this._rssTopicsFolder
			= this._rssTemplateFolder
			= this._rssDashboardName
			= null;
	}

	async loadData(): Promise<void> {
		const data: TPropertyBag = await this.plugin.loadData();
		if (data) {
			for (const propertyName in this._data) {
				if (propertyName in data) {
					this._data[propertyName] = data[propertyName];
				}
			}
		} else {
			console.log("rss-tracker first time load");
			await this.install(); // first time install
		}
	}

	async saveData(): Promise<void> {
		return this.plugin.saveData(this._data);
	}

	async install() {
		const
			vault = this.app.vault,
			fs = vault.adapter;

		// create folders
		for (const folderPath of [
			this.rssHome,
			this.rssTemplateFolderPath,
			this.rssFeedFolderPath,
			this.rssCollectionsFolderPath,
			this.rssTopicsFolderPath,
		]) {
			if (!await fs.exists(folderPath)) {
				await vault.createFolder(folderPath);
			}
		}

		// install factory templates if necessary
		for (const tpl of TEMPLATES) {
			const tplPath = this.getTemplatePath(tpl);
			if (!await fs.exists(tplPath)) {
				const factoryPath = this.plugin.manifest.dir + "/Templates/" + RSSTrackerSettings.getTemplateFilename(tpl);
				fs.copy(factoryPath, tplPath);
			}
		}

		// the RSS dashboard is a special case
		const dashboardPath = this.rssDashboardPath;
		if (!await fs.exists(dashboardPath)) {
			const factoryPath = this.plugin.manifest.dir + "/Templates/" + RSSTrackerSettings.getTemplateFilename("RSS Dashboard");
			fs.copy(factoryPath, dashboardPath);
		}

		console.log(`RSS directory structure created/updated at '${this.rssHome}'.`);
	}

	get rssFeedFolderPath(): string {
		return this.rssHome + "/" + this.rssFeedFolder;
	}

	get rssCollectionsFolderPath(): string {
		return this.rssHome + "/" + this.rssCollectionsFolder;
	}

	get rssTopicsFolderPath(): string {
		return this.rssHome + "/" + this.rssTopicsFolder;
	}

	get rssTemplateFolderPath(): string {
		return this.rssHome + "/" + this.rssTemplateFolder;
	}

	get rssDashboardPath(): string {
		return this.rssHome + "/" + this.rssDashboardName + ".md";
	}

	getTemplatePath(templateName: TTemplateName): string {
		return this.rssTemplateFolderPath + "/" + RSSTrackerSettings.getTemplateFilename(templateName);
	}
}
