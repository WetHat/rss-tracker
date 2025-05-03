import { App, TFile, MetadataCache, TFolder } from 'obsidian';
import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings, TTemplateName } from "./settings";
import RSSTrackerPlugin from "./main";
import { RSScollectionAdapter, RSSfeedAdapter, RSSitemAdapter } from './RSSAdapter';
export declare type MetadataCacheEx = MetadataCache & {
    getTags(): TPropertyBag;
};
/**
 * A utility class to manage RSS related files.
 */
export declare class RSSfileManager {
    /**
     * Regular expression to split a template string into and array
     * where all mustache tokens of the form `{{mustache}}` have their
     * own slot.
     */
    private static readonly TOKEN_SPLITTER;
    private _app;
    private _vault;
    private _plugin;
    get settings(): RSSTrackerSettings;
    get app(): App;
    get metadataCache(): MetadataCacheEx;
    constructor(app: App, plugin: RSSTrackerPlugin);
    /**
     * Factory method to create proxies for RSS files
     * @param file An RSS file to create the adapter for.
     * @returns The appropriate adapter, if it exists.
     */
    getAdapter(file: TFile): RSSfeedAdapter | RSSitemAdapter | RSScollectionAdapter | undefined;
    /**
     * Expand `{{mustache}}` placeholders with data from a property bag.
     * @param template - A template string with `{{mustache}}` placeholders.
     * @param properties - A property bag for replacing `{{mustache}}` placeholdes with data.
     * @returns template with `{{mustache}}` placeholders substituted.
     */
    private expandTemplate;
    /**
     * Read the content of a template from the RSS template folder.
     *
     * If the template does not esist, it is installed,
     *
     * @param templateName Name of the template to read
     * @returns Template contents
     */
    private readTemplate;
    /**
     * Rename a folder
     * @param oldFolderPath path to an existing folder
     * @param newFolderPath new folder path.
     * @returns `true` if renaming was successful; `false` otherwise.
     */
    renameFolder(oldFolderPath: string, newFolderPath: string): Promise<boolean>;
    /**
     * Rename/move a file.
     * @param oldFilePath Path to file to rename
     * @param newFilePath new path and name of the file
     * @returns `true` if file was successfully renamed/moved; `false otherwise`
     */
    renameFile(oldFilePath: string, newFilePath: string): Promise<boolean>;
    ensureFolderExists(path: string): Promise<TFolder> | TFolder;
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
    createFile(folderPath: string, basename: string, templateName: TTemplateName, data?: TPropertyBag, postProcess?: boolean): Promise<TFile>;
}
