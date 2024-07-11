import { TPropertyBag } from './FeedAssembler';
import RSSTrackerPlugin from './main';
import { PluginSettingTab, Setting, App, TFolder } from 'obsidian';

export interface IRSSTrackerSettings {
	[key: string]: any;
	autoUpdateFeeds: boolean;
	rssHome: string;
	rssFeedFolder: string;
	rssTemplateFolder: string;
}

export const DEFAULT_SETTINGS: IRSSTrackerSettings = {
	autoUpdateFeeds: false,
	rssHome: "RSS",
	rssFeedFolder: "Feeds",
	rssTemplateFolder: "Templates",
}

export type TTemplateName = "RSS Feed" | "RSS Item";

const TEMPLATES: TTemplateName[] = ["RSS Feed", "RSS Item"];

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

	private async rename(oldFolderPath: string, newFolderPath: string): Promise<boolean> {
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

	async commit() {
		let success = true;

		if (this._rssHome && this._rssHome !== this.rssHome) {
			if (await this.rename(this.rssHome, this._rssHome)) {
				this.data.rssHome = this._rssHome;
			} else {
				success = false;
			}
			this._rssHome = null;
		}

		if (this._rssFeedFolder && this._rssFeedFolder !== this.rssFeedFolder) {
			if (await this.rename(this.rssFeedFolderPath, this.rssHome + "/" + this._rssFeedFolder)) {
				this.data.rssFeedFolder = this._rssFeedFolder;
			} else {
				success = false;
			}
			this._rssFeedFolder = null;
		}

		if (this._rssTemplateFolder && this._rssTemplateFolder !== this.rssTemplateFolder) {
			if (await this.rename(this.rssTemplateFolderPath, this.rssHome + "/" + this._rssTemplateFolder)) {
				this.data.rssTemplateFolder = this._rssTemplateFolder;
			} else {
				success = false;
			}

			this._rssTemplateFolder = null;
		}

		await this.saveData();

		if (!success) {
			this.install();
		}

	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this.app = app;
		this.plugin = plugin;

		this._rssHome = this._rssFeedFolder = this._rssTemplateFolder = null;
	}

	async loadData(): Promise<void> {
		const data: TPropertyBag = await this.plugin.loadData();
		for (const propertyName in this.data) {
			if (propertyName in data) {
				this.data[propertyName] = data[propertyName];
			}
		}
		return this.saveData();
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

		console.log(`RSS directory structure created/updated at '${this.rssHome}'.`);
	}

	get rssFeedFolderPath(): string {
		return this.rssHome + "/" + this.rssFeedFolder;
	}

	get rssTemplateFolderPath(): string {
		return this.rssHome + "/" + this.rssTemplateFolder;
	}

	getTemplatePath(templateName: TTemplateName): string {
		return this.rssTemplateFolderPath + "/" + RSSTrackerSettings.getTemplateFilename(templateName);
	}

	async readTemplate(templateName: TTemplateName): Promise<string> {
		const
			vault = this.app.vault,
			fs = vault.adapter,
			templatePath = this.getTemplatePath(templateName);

		if (!fs.exists(this.rssTemplateFolderPath) || !fs.exists(templatePath)) {
			await this.install();
		}

		const tplFile = vault.getFileByPath(templatePath);
		if (!tplFile) {
			throw new Error(`Template ${templatePath} unavailable!`);
		}
		return vault.cachedRead(tplFile);
	}
}
