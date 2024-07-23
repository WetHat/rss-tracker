import { TPropertyBag } from './FeedAssembler';
import RSSTrackerPlugin from './main';
import { PluginSettingTab, Setting, App, TFolder } from 'obsidian';

export interface IRSSTrackerSettings {
	[key: string]: any;
	autoUpdateFeeds: boolean;
	rssHome: string;
	rssFeedFolder: string;
	rssTemplateFolder: string;
	rssDashboardName: string;
}

export const DEFAULT_SETTINGS: IRSSTrackerSettings = {
	autoUpdateFeeds: false,
	rssHome: "RSS",
	rssFeedFolder: "Feeds",
	rssTemplateFolder: "Templates",
	rssDashboardName: "§ RSS Feed Dashboard"
}

export type TTemplateName = "RSS Feed" | "RSS Item" | "RSS Topic" | "RSS Feed Collection" | "§ RSS Feed Dashboard";

const TEMPLATES: TTemplateName[] = ["RSS Feed", "RSS Item", "RSS Topic", "RSS Feed Collection"];

export class RSSTrackerSettings implements IRSSTrackerSettings {
	plugin: RSSTrackerPlugin;
	app: App;

	static getTemplateFilename(templateName: TTemplateName): string {
		return templateName + ".md";
	}

	private data: IRSSTrackerSettings = { ...DEFAULT_SETTINGS };

	get autoUpdateFeeds(): boolean {
		return this.data.autoUpdateFeeds;
	}

	set autoUpdateFeeds(value: boolean) {
		this.data.autoUpdateFeeds = value;
	}

	private _rssHome: string | null;
	private _rssFeedFolder: string | null;
	private _rssTemplateFolder: string | null;
	private _rssDashboardName: string | null;

	get rssHome(): string {
		return this.data.rssHome ?? DEFAULT_SETTINGS.rssHome;
	}

	set rssHome(value: string) {
		this._rssHome = value;
	}

	get rssFeedFolder(): string {
		return this.data.rssFeedFolder ?? DEFAULT_SETTINGS.rssFeedFolder;
	}

	set rssFeedFolder(value: string) {
		this._rssFeedFolder = value;
	}

	get rssTemplateFolder(): string {
		return this.data.rssTemplateFolder ?? DEFAULT_SETTINGS.rssTemplateFolder;
	}

	set rssTemplateFolder(value: string) {
		this._rssTemplateFolder = value;
	}

	get rssDashboardName() : string {
		return this.data.rssDashboardName || DEFAULT_SETTINGS.rssDashboardName;
	}

	set rssDashboardName(value: string) {
		this._rssDashboardName = value;
	}

	private async renameFolder(oldFolderPath: string, newFolderPath: string): Promise<boolean> {
		if (oldFolderPath === newFolderPath) {
			return false;
		}

		const
			vault = this.app.vault,
			oldFolder = vault.getFolderByPath(oldFolderPath);

		if (oldFolder) {
			await vault.rename(oldFolder, newFolderPath);
			return true;
		}
		return false;
	}

	private async renameFile(oldFilePath: string, newFilePath: string): Promise<boolean> {
		if (oldFilePath === newFilePath) {
			return false;
		}

		const
			vault = this.app.vault,
			oldFile = vault.getFileByPath(oldFilePath);

		if (oldFile) {
			await vault.rename(oldFile, newFilePath);
			return true;
		}
		return false;
	}

	async commit() {
		console.log("Commiting changes in settings");
		if (this._rssHome && this._rssHome !== this.rssHome) {
			if (await this.renameFolder(this.rssHome, this._rssHome)) {
				this.data.rssHome = this._rssHome;
			}
			this._rssHome = null;
		}

		if (this._rssFeedFolder && this._rssFeedFolder !== this.rssFeedFolder) {
			if (await this.renameFolder(this.rssFeedFolderPath, this.rssHome + "/" + this._rssFeedFolder)) {
				this.data.rssFeedFolder = this._rssFeedFolder;
			}
			this._rssFeedFolder = null;
		}

		if (this._rssTemplateFolder && this._rssTemplateFolder !== this.rssTemplateFolder) {
			if (await this.renameFolder(this.rssTemplateFolderPath, this.rssHome + "/" + this._rssTemplateFolder)) {
				this.data.rssTemplateFolder = this._rssTemplateFolder;
			}

			this._rssTemplateFolder = null;
		}

		if (this._rssDashboardName && this._rssDashboardName !== this.rssDashboardName) {
			if (await this.renameFile(this.rssTemplateFolderPath, this.rssHome + "/" + this._rssTemplateFolder)) {
				this.data.rssDashboardName = this._rssDashboardName;
			}

			this._rssDashboardName = null;
		}

		await this.saveData();

		this.install(); // always assure integrity after commit
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this.app = app;
		this.plugin = plugin;

		this._rssHome = this._rssFeedFolder = this._rssTemplateFolder = this._rssDashboardName = null;
	}

	async loadData(): Promise<void> {
		const data: TPropertyBag = await this.plugin.loadData();
		if (data) {
			for (const propertyName in this.data) {
				if (propertyName in data) {
					this.data[propertyName] = data[propertyName];
				}
			}
		} else {
			console.log("rss-tracker first time load");
			await this.install(); // first time install
		}
	}

	async saveData(): Promise<void> {
		return this.plugin.saveData(this.data);
	}

	async install() {
		const
			vault = this.app.vault,
			fs = vault.adapter;

		if (!await fs.exists(this.rssHome)) {
			await vault.createFolder(this.rssHome);
		}

		if (!await fs.exists(this.rssFeedFolderPath)) {
			await vault.createFolder(this.rssFeedFolderPath);
		}

		const templatePath = this.rssTemplateFolderPath;
		if (!await fs.exists(templatePath)) {
			await vault.createFolder(templatePath);
		}
		// install factory templates if necessary
		for (const tpl of TEMPLATES) {
			const tplPath = this.getTemplatePath(tpl);
			if (!await fs.exists(tplPath)) {
				const factoryPath = this.plugin.manifest.dir + "/Templates/" + RSSTrackerSettings.getTemplateFilename(tpl);
				fs.copy(factoryPath, tplPath);
			}
		}

		// dashboard is a special case
		const dashboardPath = this.rssDashboardPath;
		if (!await fs.exists(dashboardPath)) {
			const factoryPath = this.plugin.manifest.dir + "/Templates/" + RSSTrackerSettings.getTemplateFilename("§ RSS Feed Dashboard");
			fs.copy(factoryPath, dashboardPath);
		}

		console.log(`RSS directory structure created/updated at '${this.rssHome}'.`);
	}

	get rssFeedFolderPath(): string {
		return this.rssHome + "/" + this.rssFeedFolder;
	}

	get rssTemplateFolderPath(): string {
		return this.rssHome + "/" + this.rssTemplateFolder;
	}

	get rssDashboardPath() : string {
		return this.rssHome + "/" + this.rssDashboardName + ".md";
	}

	private getTemplatePath(templateName: TTemplateName): string {
		return this.rssTemplateFolderPath + "/" + RSSTrackerSettings.getTemplateFilename(templateName);
	}

	async readTemplate(templateName: TTemplateName): Promise<string> {
		const
			vault = this.app.vault,
			fs = vault.adapter,
			templatePath = this.getTemplatePath(templateName);

		if (!fs.exists(this.rssTemplateFolderPath) || !fs.exists(templatePath)) {
			await this.install(); // recovering from missing template
		}

		const tplFile = vault.getFileByPath(templatePath);
		if (!tplFile) {
			throw new Error(`Template ${templatePath} unavailable!`);
		}
		return vault.cachedRead(tplFile);
	}
}
