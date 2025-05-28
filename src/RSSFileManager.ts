
import { App, TFile, Vault, MetadataCache, TFolder } from 'obsidian';
import { TPropertyBag } from './FeedAssembler';
import { TDashboardPlacement } from './settings';
import RSSTrackerPlugin from "./main";
import { RSSAdapter, RSScollectionAdapter, RSSdashboardAdapter, RSSfeedAdapter, RSSfeedsDashboardAdapter, RSSitemAdapter, RSStopicAdapter, TFrontmatter } from './RSSAdapter';
import { TTemplateName } from './TemplateManager';
import { RSSTrackerService } from './PluginServices';

export type MetadataCacheEx = MetadataCache & {
	getTags(): TPropertyBag; // undocumented non-API method
}

type TAdapterFactory = (f: TFile, fm: TFrontmatter) => RSSAdapter | null;

/**
 * A utility class to manage RSS related files in the Obsidian file system.
 */
export class RSSfileManager extends RSSTrackerService {

	private readonly _adapterFactoriesbyRole: { [role: string]: TAdapterFactory } = {
		"rssfeed": (f: TFile, fm: TFrontmatter) => RSSdashboardAdapter.createFromFile(RSSfeedAdapter, this.plugin, f, this.settings.rssDashboardPlacement, fm),
		"rssitem": (f: TFile, fm: TFrontmatter) => new RSSitemAdapter(this.plugin, f, fm),
		"rsscollection": (f: TFile, fm: TFrontmatter) => new RSScollectionAdapter(this.plugin, f, fm),
		"rsstopic": (f: TFile, fm: TFrontmatter) => new RSStopicAdapter(this.plugin, f, fm),
	}


	get metadataCache(): MetadataCacheEx {
		return this.app.metadataCache as MetadataCacheEx;
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		super(app, plugin);
	}

	async ensureRSShomeFolderExists(): Promise<TFolder> {
		return this.ensureFolderExists(this.settings.rssHome);
	}

	async ensureDefaultImageExists(): Promise<string> {
		if (!this.settings.rssDefaultImagePath || !this.app.vault.adapter.exists(this.settings.rssDefaultImagePath, true)) {
			const
				imagePath = await this.app.fileManager.getAvailablePathForAttachment("RSSdefaultImage.svg", this.settings.rssTagmapPath),
				img = await this.app.vault.create(imagePath, this.settings.rssDefaultImage);
			this.settings.rssDefaultImagePath = img.path;
		}
		return this.settings.rssDefaultImagePath;
	}

	/**
	 * Get the folder associated with a given dashboard.
	 *
	 * @param dashboard The dashboard file to find the folder for.
	 * @param placement the placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
	 *                  If set to "outsideFolder", the dashboard is in the parent folder.
	 * @returns The dashboard folder. `null` if the folder does not exist
	 */
	getDashboardFolder(dashboard: TFile, placement: TDashboardPlacement): TFolder | null {
		const
			folderName = RSSdashboardAdapter.getDashboardFolderName(dashboard),
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
	 * Get the RSS adapter for a given file.
	 * @param file the file to get the adapter for.
	 * @param types the types of adapters to create. The adapter is created if the file has a frontmatter property `role`
	 *              that matches one of the given types.
	 * @returns the adapter or null if it does not exist.
	 */
	createAdapter(file: TFile, ...types: string[]): RSSAdapter | null {
		const
			frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter as TPropertyBag,
			role = frontmatter?.role;

		if (types.includes(role)) {
			const factory = this._adapterFactoriesbyRole[role];
			if (factory) {
				return factory(file, frontmatter);
			}
		}
		return null;
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

		const oldFolder = this.vault.getFolderByPath(oldFolderPath);

		if (oldFolder) {
			await this.vault.rename(oldFolder, newFolderPath);
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

		const oldFile = this.vault.getFileByPath(oldFilePath);

		if (oldFile) {
			await this.vault.rename(oldFile, newFilePath);
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
	async createUniqueFolder(parentFolder: TFolder, folderName: string): Promise<TFolder> {
		const parentPath = parentFolder.path;
		let
			uniqueFolderName = folderName,
			index = 1,
			folder: TFolder | null = null;

		do {
			const uniqueFolderPath = parentPath + "/" + uniqueFolderName;
			try {
				folder = await this.vault.createFolder(uniqueFolderPath);
			} catch (e) {
				// folder already exists, try again with a new name
				uniqueFolderName = `${folderName} (${index})`;
				index++;
			}
		} while (folder === null);

		return folder;
	}

	/**
	 * Create or update a file using an RSS template.
	 *
	 * If a file with the same basename already exists in the given folder location,its content is updated.
	 *
	 * ❗The mustache token `{{fileLink}}` is automatically added to the data object. This token resolves to a Wiki link to the generated file.
	 *
	 * @param folder - The folder to create the file in.
	 * @param basename - The basename of the new file (without fie extension)
	 * @param templateName - The template to use
	 * @param data - Optional data map for replacing the mustache tokens in the template with custom data.
	 * @param postProcess - Flag indicating if this file requires post processing
	 * @returns A `Promise` to the file handle.
	 */
	async upsertFile(folder: TFolder, basename: string, templateName: TTemplateName, data: TPropertyBag = {}, postProcess: boolean = false): Promise<TFile> {
		// 1. generate a unique filename based on the given desired file system location info.
		const
			filepath = folder.path + "/" + basename + ".md",
			content = await this.plugin.tplmgr.expandTemplate(templateName, data);


		// 2. augment the data map with a unique wiki link to the file.
		data["{{fileLink}}"] = `[[${filepath}|${basename}]]`;

		// 4. Save the expanded template into a file at the given location
		if (postProcess) {
			this.plugin.tagmgr.registerFileForPostProcessing(filepath);
		}
		let file = this.vault.getFileByPath(filepath);
		if (file) {
			await this.vault.modify(file, content);
		} else {
			// file does not exist, create it
			file = await this.vault.create(filepath, content);
		}
		return file
	}

	/**
	 * Create a file from an RSS template.
	 *
	 * If a file with the same basename already exists in the given folder location, a new unique basename
	 * is generated.
	 *
	 * ❗The mustache token `{{fileLink}}` is automatically added to the data object. This token resolves to a Wiki link to the generated file.
	 *
	 * @param folder - The folder to create the file in.
	 * @param basename - The basename of the new file (without fie extension)
	 * @param templateName - The template to use
	 * @param data - Optional data map for replacing the mustache tokens in the template with custom data.
	 * @param postProcess - Flag indicating if this file requires post processing
	 * @returns A `Promise` to the file handle.
	 */
	async createUniqueFile(folder: TFolder, basename: string, templateName: TTemplateName, data: TPropertyBag = {}, postProcess: boolean = false): Promise<TFile> {
		// 1. generate a unique filename based on the given desired file system location info.
		let
			uniqueBasename = basename,
			folderPath = folder.path,
			uniqueFilepath = folderPath + "/" + basename + ".md",
			index = 1;
		const fs = this.vault.adapter;
		while (await fs.exists(uniqueFilepath)) {
			uniqueBasename = `${basename} (${index})`;
			uniqueFilepath = folderPath + "/" + uniqueBasename + ".md";
			index++;
		}
		// 2. augment the data map with a unique wiki link to the file.
		data["{{fileLink}}"] = `[[${folderPath + "/" + uniqueBasename}|${uniqueBasename}]]`;

		// 3. read and expand the template
		const content = await this.plugin.tplmgr.expandTemplate(templateName, data);

		// 4. Save the expanded template into a file at the given location
		if (postProcess) {
			this.plugin.tagmgr.registerFileForPostProcessing(uniqueFilepath);
		}

		return this.vault.create(uniqueFilepath, content);
	}
}
