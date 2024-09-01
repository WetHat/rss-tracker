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
	rssDefaultImage: string;
}

export const DEFAULT_SETTINGS: IRSSTrackerSettings = {
	autoUpdateFeeds: false,
	rssHome: "RSS",
	rssFeedFolder: "Feeds",
	rssCollectionsFolder: "Collections",
	rssTopicsFolder: "Topics",
	rssTemplateFolder: "Templates",
	rssDashboardName: "RSS Dashboard",
	rssDefaultImage: ""
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
	private static RSS_DEFAULT_IMAGE = '<svg height="300px" width="300px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 398.668 398.668" xml:space="preserve"> <g> <g> <path style="fill:none;" d="M98.107,275.498c-13.789,0-25.006,11.264-25.006,25.107c0,13.777,11.217,24.986,25.006,24.986 c13.834,0,25.09-11.209,25.09-24.986C123.197,286.762,111.941,275.498,98.107,275.498z"/> <path style="fill:none;" d="M360.057,24H38.613C30.555,24,24,30.557,24,38.613v321.443c0,8.057,6.555,14.611,14.613,14.611 h321.443c8.057,0,14.611-6.555,14.611-14.611V38.613C374.668,30.557,368.113,24,360.057,24z M98.107,349.592 c-27.021,0-49.006-21.975-49.006-48.986c0-27.078,21.984-49.107,49.006-49.107c27.068,0,49.09,22.029,49.09,49.107 C147.197,327.617,125.176,349.592,98.107,349.592z M242.715,347.516c0,0-0.008,0.002-0.016,0h-48.729 c-6.541,0-11.877-5.238-11.998-11.777c-0.584-31.625-13.164-61.316-35.424-83.604c-22.275-22.338-51.846-34.953-83.27-35.527 c-6.541-0.119-11.781-5.457-11.781-11.998v-48.582c0-3.211,1.287-6.287,3.572-8.543c2.248-2.217,5.275-3.457,8.428-3.457 c0.055,0,0.107,0,0.162,0c50.654,0.686,98.338,20.883,134.271,56.873c35.758,35.814,55.896,83.281,56.756,133.732 c0.021,0.291,0.031,0.586,0.031,0.883C254.719,342.143,249.348,347.516,242.715,347.516z M337.582,347.516 c0,0-0.008,0.002-0.016,0h-48.648c-6.578,0-11.93-5.295-12-11.871c-1.254-116.738-97.008-212.74-213.451-214.002 c-6.576-0.072-11.871-5.424-11.871-12V61.078c0-3.201,1.279-6.269,3.553-8.521c2.273-2.254,5.367-3.512,8.555-3.477 c75.951,0.68,147.441,30.768,201.303,84.723c53.689,53.779,83.699,125.096,84.553,200.891c0.02,0.272,0.029,0.547,0.029,0.822 C349.588,342.143,344.215,347.516,337.582,347.516z"/> <path style="fill:#3D6889;" d="M98.107,251.498c-27.021,0-49.006,22.029-49.006,49.107c0,27.012,21.984,48.986,49.006,48.986 c27.068,0,49.09-21.975,49.09-48.986C147.197,273.527,125.176,251.498,98.107,251.498z M98.107,325.592 c-13.789,0-25.006-11.209-25.006-24.986c0-13.844,11.217-25.107,25.006-25.107c13.834,0,25.09,11.264,25.09,25.107 C123.197,314.383,111.941,325.592,98.107,325.592z"/> <path style="fill:#73D0F4;" d="M75.498,168.633v24.668c33.244,3.301,64.15,17.926,88.037,41.881 c23.879,23.906,38.459,54.922,41.746,88.334h24.816C223.066,241.893,156.986,175.689,75.498,168.633z"/> <path style="fill:#3D6889;" d="M197.932,200.9c-35.934-35.99-83.617-56.188-134.271-56.873c-0.055,0-0.107,0-0.162,0 c-3.152,0-6.18,1.24-8.428,3.457c-2.285,2.256-3.572,5.332-3.572,8.543v48.582c0,6.541,5.24,11.879,11.781,11.998 c31.424,0.574,60.994,13.189,83.27,35.527c22.26,22.287,34.84,51.979,35.424,83.604c0.121,6.539,5.457,11.777,11.998,11.777 h48.729c0.008,0.002,0.016,0,0.016,0c6.633,0,12.004-5.373,12.004-12c0-0.297-0.01-0.592-0.031-0.883 C253.828,284.182,233.689,236.715,197.932,200.9z M205.281,323.516c-3.287-33.412-17.867-64.428-41.746-88.334 c-23.887-23.955-54.793-38.58-88.037-41.881v-24.668c81.488,7.057,147.568,73.26,154.6,154.883H205.281z"/> <path style="fill:#73D0F4;" d="M75.596,73.465v24.598c58.516,3.502,113.188,28.121,155.029,70.064 c41.838,41.943,66.391,96.742,69.877,155.389h24.682C317.852,189.59,209.293,80.834,75.596,73.465z"/> <path style="fill:#3D6889;" d="M265.006,133.803C211.145,79.848,139.654,49.76,63.703,49.08c-3.188-0.035-6.281,1.223-8.555,3.477 c-2.273,2.252-3.553,5.32-3.553,8.521v48.565c0,6.576,5.295,11.928,11.871,12c116.443,1.262,212.197,97.264,213.451,214.002 c0.07,6.576,5.422,11.871,12,11.871h48.648c0.008,0.002,0.016,0,0.016,0c6.633,0,12.006-5.373,12.006-12 c0-0.275-0.01-0.551-0.029-0.822C348.705,258.898,318.695,187.582,265.006,133.803z M300.502,323.516 c-3.486-58.646-28.039-113.445-69.877-155.389c-41.842-41.943-96.514-66.563-155.029-70.064V73.465 c133.697,7.369,242.256,116.125,249.588,250.051H300.502z"/> <path style="fill:#3D6889;" d="M360.057,0H38.613C17.322,0,0,17.322,0,38.613v321.443c0,21.291,17.322,38.611,38.613,38.611 h321.443c21.291,0,38.611-17.32,38.611-38.611V38.613C398.668,17.322,381.348,0,360.057,0z M374.668,360.057 c0,8.057-6.555,14.611-14.611,14.611H38.613c-8.059,0-14.613-6.555-14.613-14.611V38.613C24,30.557,30.555,24,38.613,24h321.443 c8.057,0,14.611,6.557,14.611,14.613V360.057z"/> </g> </g> </svg>';
	plugin: RSSTrackerPlugin;
	app: App;

	private get _filemgr(): RSSfileManager {
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

	/**
	 * Get the path to the RSS default image
	 */
	get rssDefaultImage(): string {
		if (this._data.rssDefaultImage && this.app.vault.getFileByPath(this._data.rssDefaultImage)) {
			return this._data.rssDefaultImage;
		}
		return "";
	}

	async getRssDefaultImagePath(): Promise<string> {
		if (!this.rssDefaultImage) {
			const
				imagePath = await this.app.fileManager.getAvailablePathForAttachment("RSSdefaultImage.svg", this.rssDashboardPath),
				img = await this.app.vault.create(imagePath, RSSTrackerSettings.RSS_DEFAULT_IMAGE);
			this._data.rssDefaultImage = img.path;
			await this.saveData();
		}

		return this._data.rssDefaultImage;
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
