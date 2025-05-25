
import { App, TFile, Vault, MetadataCache, TFolder } from 'obsidian';
import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings, TTemplateName, TDashboardPlacement } from './settings';
import RSSTrackerPlugin from "./main";
import { RSSAdapter, RSScollectionAdapter, RSSdashboardAdapter, RSSfeedAdapter, RSSitemAdapter, TFrontmatter } from './RSSAdapter';

export type MetadataCacheEx = MetadataCache & {
	getTags(): TPropertyBag; // undocumented non-API method
}

type TAdapterFactory = (f: TFile, fm: TFrontmatter) => RSSAdapter | null;

/**
 * A utility class to manage RSS related files.
 */
export class RSSfileManager {
	/**
	 * Regular expression to split a template string into and array
	 * where all mustache tokens of the form `{{mustache}}` have their
	 * own slot.
	 */
	private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;
	private _app: App;
	private _vault: Vault;
	private _plugin: RSSTrackerPlugin;

	private readonly _adapterFactories: { [role: string]: TAdapterFactory } = {
		"rssfeed": (f: TFile, fm: TFrontmatter) => RSSdashboardAdapter.createFromFile(RSSfeedAdapter, this._plugin, f, this.settings.rssDashboardPlacement, fm),
		"rssitem": (f: TFile, fm: TFrontmatter) => new RSSitemAdapter(this._plugin, f, fm),
		"rsscollection": (f: TFile, fm: TFrontmatter) => new RSScollectionAdapter(this._plugin, f, fm),
	}

	/**
	 * A map of template names to their property names in {@link RSSTrackerSettings}.
	 */
	private readonly _templateMap: { [name: string]: string } = {
		"RSS Item": "rssItemTemplate",
		"RSS Feed": "rssFeedTemplate",
		"RSS Collection": "rssCollectionTemplate",
		"RSS Topic": "rssTopicTemplate",
		"RSS Dashboard": "rssDashboardTemplate",
		"RSS Tagmap": "rssTagmapTemplate",
	};

	get settings(): RSSTrackerSettings {
		return this._plugin.settings;
	}

	get app(): App {
		return this._app;
	}

	get metadataCache(): MetadataCacheEx {
		return this._app.metadataCache as MetadataCacheEx;
	}

	/**
	 * Get the folder associated with a dashboard.
	 *
	 * @param dashboard The dashboard file to find the folder for.
	 * @param placement the placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
	 *                  If set to "outsideFolder", the dashboard is in the parent folder.
	 * @returns The dashboard folder. `null` if the folder does not exist
	 */
	getDashboardFolder(dashboard: TFile, placement: TDashboardPlacement): TFolder | null {
		const
			folderName = dashboard.name, // TODO: run the folder note temlate backwards to get the folder name
			dashboardParent = dashboard.parent;
		if (placement === "insideFolder") {
			return dashboardParent?.name === folderName
				? dashboardParent
				: dashboard.vault.getFolderByPath((dashboardParent?.path ?? "") + "/" + folderName);
		} else {
			const folder = dashboard.vault.getFolderByPath((dashboardParent?.path ?? "") + "/" + folderName);
			return folder
				? folder
				: dashboardParent;
		}
	}

	/**
	 * Get the name of the dashboard file associated with the given folder.
	 *
	 * @param folder The folder to get the dashboard name for
	 * @returns dashboard name (without extension).
	 */
	private getFolderDashboardName(folder: TFolder):string {
		return folder.name; // TODO: use folder note name template for name generation
	}
	/**
	 * Get the dashboard file for a given folder.
	 *
	 * @param folder the folder to get the dashboard for.
	 * @param placement the placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
	 *       If set to "outsideFolder", the dashboard is in the parent folder.
	 * @returns the dashboard file or null if it does not exist.
	 */
	getFolderDashboard(folder: TFolder, placement: TDashboardPlacement): TFile | null {
		const
			dashboardName = this.getFolderDashboardName(folder),
			insideFolderPath = folder.path,
			parentFolderPath = folder.parent?.path ?? "";

		for (const path of (placement === "insideFolder" ? [insideFolderPath, parentFolderPath] : [parentFolderPath, insideFolderPath])) {
			const dashboard = folder.vault.getFileByPath(path + "/" + dashboardName + ".md");
			if (dashboard) {
				return dashboard;
			}
		}
		return null; // no dashboard found
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this._app = app;
		this._vault = app.vault;
		this._plugin = plugin;
	}

	/**
	 * Create a `Folder Notes` style dashboard for a folder from given contents.
	 * @param folder The folder to creat tehe
	 * @param contents
	 */
	createDashboard(folder: TFolder, contents: string) : Promise<TFile> {
		const
			placement = this.settings.rssDashboardPlacement,
			dashboardName = this.getFolderDashboardName(folder),
			location = placement === "insideFolder" ? folder.path : folder.parent?.path ?? "";
		return folder.vault.create(location + "/" + dashboardName + ".md" ,contents);
	}

	/**
	 * Get the RSS adapter for a given file.
	 * @param file the file to get the adapter for.
	 * @param types the types of adapters to create. The adapter is created if the file has a frontmatter property `role`
	 *              that matches one of the given types.
	 * @returns the adapter or null if it does not exist.
	 */
	createAdapter(file: TFile, ...types: string[]): RSSAdapter | null {
		const
			frontmatter = this._plugin.app.metadataCache.getFileCache(file)?.frontmatter,
			role = frontmatter?.role;

		if (role && role in types) {
			const factory = this._adapterFactories[role];
			if (factory) {
				return factory(file, frontmatter);
			}
		}
		return null;
	}

	/**
	 * Expand `{{mustache}}` placeholders with data from a property bag.
	 * @param template - A template string with `{{mustache}}` placeholders.
	 * @param properties - A property bag for replacing `{{mustache}}` placeholdes with data.
	 * @returns template with `{{mustache}}` placeholders substituted.
	 */
	private expandTemplate(template: string, properties: TPropertyBag): string {
		return template.split(RSSfileManager.TOKEN_SPLITTER).map(s => s.startsWith("{{") ? (properties[s] ?? s) : s).join("");
	}

	/**
	 * Read the content of a template from a template folder or from settings.
	 *
	 * The template folder returned from {@link RSSTrackerSettings.getTemplatePath} is checked first.
	 * If no template file exists at that location, the template is read from the settings.
	 *
	 * @param templateName - Name of the template to read.
	 * @returns A `Promise`for the template contents.
	 */
	private async readTemplate(templateName: TTemplateName): Promise<string> {
		const templatePath = this.settings.getTemplatePath(templateName);

		const tplFile = this._vault.getFileByPath(templatePath);
		if (tplFile) {
			// template exists, read and return its contents
			return this._vault.read(tplFile);
		} else {
			// template does not exist, use the factory defined template instead.
			return this.settings[this._templateMap[templateName]];
		}
	}

	/**
	 * Rename a folder
	 * @param oldFolderPath - path to an existing folder
	 * @param newFolderPath - new folder path.
	 * @returns `true` if renaming was successful; `false` otherwise.
	 */
	async renameFolder(oldFolderPath: string, newFolderPath: string): Promise<boolean> {
		if (oldFolderPath === newFolderPath) {
			return false;
		}

		const oldFolder = this._vault.getFolderByPath(oldFolderPath);

		if (oldFolder) {
			await this._vault.rename(oldFolder, newFolderPath);
			return true;
		}
		return false;
	}

	/**
	 * Rename/move a file.
	 * @param oldFilePath - Path to file to rename
	 * @param newFilePath - new path and name of the file
	 * @returns `true` if file was successfully renamed/moved; `false otherwise`
	 */
	async renameFile(oldFilePath: string, newFilePath: string): Promise<boolean> {
		if (oldFilePath === newFilePath) {
			return false;
		}

		const oldFile = this._vault.getFileByPath(oldFilePath);

		if (oldFile) {
			await this._vault.rename(oldFile, newFilePath);
			return true;
		}
		return false;
	}

	async ensureFolderExists(path: string): Promise<TFolder> {
		return this.app.vault.getFolderByPath(path) ?? await this.app.vault.createFolder(path);
	}

	/**
	 * Create a folder with a unique name in a given context.
	 *
	 * @param parentFolder the parent folder in which to create the new folder
	 * @param folderName the name of the new folder
	 * @returns A `Promise` to the new folder handle.
	 */
	async createFolder(parentFolder: TFolder, folderName: string): Promise<TFolder> {
		const parentPath = parentFolder.path;
		let
			uniqueFolderName = folderName,
			index = 1,
			folder: TFolder | null = null;

		do {
			const uniqueFolderPath = parentPath + "/" + uniqueFolderName;
			try {
				folder = await this._vault.createFolder(uniqueFolderPath);
			} catch (e) {
				// folder already exists, try again with a new name
				uniqueFolderName = `${folderName} (${index})`;
				index++;
			}
		} while (folder === null);

		return folder;
	}

	/**
	 * Create a file from an RSS template.
	 *
	 * If a file with the same basename already exists in the given folder location, a new unique basename
	 * is generated.
	 *
	 * ❗The mustache token `{{fileLink}}` is automatically added to the data object. This token links to the generated file (no file extension) and can be used to create wiki-links.
	 *
	 * @param folder - The folder to create the file in.
	 * @param basename - The basename of the new file (without fie extension)
	 * @param templateName - The template to use
	 * @param data - Optional data map for replacing the mustache tokens in the template with custom data.
	 * @param postProcess - Flag indicating if this file requires post processing
	 * @returns A `Promise` to the file handle.
	 */
	async createFileFromTemplate(folder: TFolder, basename: string, templateName: TTemplateName, data: TPropertyBag = {}, postProcess: boolean = false): Promise<TFile> {
		// 1. generate a unique filename based on the given desired file system location info.
		let
			uniqueBasename = basename,
			folderPath = folder.path,
			uniqueFilepath = folderPath + "/" + basename + ".md",
			index = 1;
		const fs = this._vault.adapter;
		while (await fs.exists(uniqueFilepath)) {
			uniqueBasename = `${basename} (${index})`;
			uniqueFilepath = folderPath + "/" + uniqueBasename + ".md";
			index++;
		}
		// 2. augment the data map with a unique wiki link to the file.
		data["{{fileLink}}"] = `[[${folderPath + "/" + uniqueBasename}|${uniqueBasename}]]`;

		// 3. read and expand the template
		const
			tpl = await this.readTemplate(templateName),
			content = this.expandTemplate(tpl, data);

		// 4. Save the expanded template into a file at the given location
		if (postProcess) {
			this._plugin.tagmgr.registerFileForPostProcessing(uniqueFilepath);
		}

		return this._vault.create(uniqueFilepath, content);
	}
}