
import { App, TFile, Vault } from "obsidian";
import { TPropertyBag } from "./FeedAssembler";
import { RSSTrackerSettings, TTemplateName } from "./settings";
import RSSTrackerPlugin from "./main";

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

	private _vault: Vault;
	private _plugin : RSSTrackerPlugin;

	private get _settings(): RSSTrackerSettings {
		return this._plugin.settings;
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this._vault = app.vault;
		this._plugin = plugin;
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

	private async readTemplate(templateName: TTemplateName): Promise<string> {
		const
			fs = this._vault.adapter,
			templatePath = this._settings.getTemplatePath(templateName);

		if (!fs.exists(this._settings.rssTemplateFolderPath) || !fs.exists(templatePath)) {
			await this._settings.install(); // recovering from missing template
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
	 * @param data Optional data map for replacing the mustache tokens in the template with custom data,
	 * @returns The new file created
	 */
	async createFile(folderPath: string, basename: string, templateName: TTemplateName, data: TPropertyBag = {}): Promise<TFile> {
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
		data[`{{fileName}}`] = uniqueBasename;

		// 3. read and expand the template
		const
			tpl = await this.readTemplate(templateName),
			content = this.expandTemplate(tpl, data);

		// 4. Save the expanded templkate into a file at the given location
		return this._vault.create(uniqueFilepath, content);
	}
}