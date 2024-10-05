
import { App, TFile, Vault, MetadataCache, TFolder } from 'obsidian';
import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings, TTemplateName } from "./settings";
import RSSTrackerPlugin from "./main";
import { RSSfeedProxy, RSSitemProxy } from './RSSproxies';

export type MetadataCacheEx = MetadataCache & {
	getTags(): TPropertyBag; // undocumented non-API method
}


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

	get settings(): RSSTrackerSettings {
		return this._plugin.settings;
	}

	get app(): App {
		return this._app;
	}

	get metadataCache(): MetadataCacheEx {
		return this._app.metadataCache as MetadataCacheEx;
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this._app = app;
		this._vault = app.vault;
		this._plugin = plugin;
	}
	/**
	 * Factory method to create proxies for RSS files
	 * @param file An RSS file to create the proxy for.
	 * @returns The appropriate proxy, if it exists.
	 */
	getProxy(file: TFile): RSSfeedProxy | RSSitemProxy | undefined {
		const frontmatter = this.metadataCache.getFileCache(file)?.frontmatter;
		if (frontmatter) {
			switch (frontmatter.role) {
				case "rssfeed":
					return new RSSfeedProxy(this._plugin, file, frontmatter);
				case "rssitem":
					return new RSSitemProxy(this._plugin, file, frontmatter);
			}
		}
		return undefined;
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
	 * Read the content of a template from the RSS template folder.
	 *
	 * If the template does not esist, it is installed,
	 *
	 * @param templateName Name of the template to read
	 * @returns Template contents
	 */
	private async readTemplate(templateName: TTemplateName): Promise<string> {
		const
			fs = this._vault.adapter,
			templatePath = this.settings.getTemplatePath(templateName);

		if (!fs.exists(this.settings.rssTemplateFolderPath) || !fs.exists(templatePath)) {
			await this.settings.install(); // recovering from missing template
		}

		const tplFile = this._vault.getFileByPath(templatePath);
		if (!tplFile) {
			throw new Error(`Template ${templatePath} unavailable!`);
		}

		return this._vault.cachedRead(tplFile);
	}

	/**
	 * Rename a folder
	 * @param oldFolderPath path to an existing folder
	 * @param newFolderPath new folder path.
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
	 * @param oldFilePath Path to file to rename
	 * @param newFilePath new path and name of the file
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

	ensureFolderExists(path : string) : Promise<TFolder> | TFolder {
		return this.app.vault.getFolderByPath(path) ?? this.app.vault.createFolder(path);
	}

	/**
	 * Create a file from an RSS template.
	 *
	 * If a file with the same basename already exists in the given folder location, a new unique basename
	 * is generated.
	 *
	 * ❗The mustache token `{{fileName}}` is automatically added to the data object. This token maps to the unique
	 * basename of the generated file (no file extension) and can be used to create wiki-links.
	 *
	 * @param folderPath THe location of the new file
	 * @param basename The basename of the new file (without fie extension)
	 * @param templateName The template to use
	 * @param data Optional data map for replacing the mustache tokens in the template with custom data.
	 * @param postProcess Flag indicating if this file requires post processing
	 * @returns The new file created
	 */
	async createFile(folderPath: string, basename: string, templateName: TTemplateName, data: TPropertyBag = {}, postProcess: boolean = false): Promise<TFile> {
		await this.ensureFolderExists(folderPath);
		// 1. generate a unique filename based on the given desired file system location info.
		let
			uniqueBasename = basename,
			uniqueFilepath = folderPath + "/" + basename + ".md",
			index = 1;
		const fs = this._vault.adapter;
		while (await fs.exists(uniqueFilepath)) {
			uniqueBasename = `${basename} (${index})`;
			uniqueFilepath = folderPath + "/" + uniqueBasename + ".md";
			index++;
		}
		// 2. augment the data map with the unique basename
		data["{{fileName}}"] = uniqueBasename;

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
/*
	getFeedsOfCollection(collection: TFile): TFile[] {
		const collectionFrontmatter = this._app.metadataCache.getFileCache(collection)?.frontmatter;
		if (collectionFrontmatter?.role !== "rsscollection") {
			return [];
		}
		// get the conditions
		const
			anyofSet = new Set<string>(collectionFrontmatter.tags),
			noneofSet = new Set<string>(collectionFrontmatter.noneof),
			allof: string[] = collectionFrontmatter.allof ?? [];
		return this.getFeeds()
			.filter(f => {
				const
					feedFrontmatter = this._app.metadataCache.getFileCache(f)?.frontmatter,
					tags: string[] = feedFrontmatter?.tags ?? [],
					tagSet = new Set<string>(tags);
				return !tags.some(t => noneofSet.has(t)) && !allof.some(t => !tagSet.has(t)) && tags.some(t => anyofSet.has(t));
			});
	}
			*/
}