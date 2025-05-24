import { App, TFile, MetadataCache, TFolder } from 'obsidian';
import { TPropertyBag } from './FeedAssembler';
import { RSSTrackerSettings, TTemplateName, TDashboardPlacement } from './settings';
import RSSTrackerPlugin from "./main";
import { RSSAdapter } from './RSSAdapter';
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
    private _adapterFactories;
    get settings(): RSSTrackerSettings;
    get app(): App;
    get metadataCache(): MetadataCacheEx;
    /**
     * Get the dashboard file for a given folder.
     * @param folder the folder to get the dashboard for.
     * @param placement the placement of the dashboard. If set to "insideFolder", the dashboard is in the folder itself.
     *       If set to "outsideFolder", the dashboard is in the parent folder.
     * @returns the dashboard file or null if it does not exist.
     */
    getFolderDashboard(folder: TFolder, placement?: TDashboardPlacement): TFile | null;
    constructor(app: App, plugin: RSSTrackerPlugin);
    /**
     * Get the RSS adapter for a given file.
     * @param file the file to get the adapter for.
     * @param types the types of adapters to create. The adapter is created if the file has a frontmatter property `role`
     *              that matches one of the given types.
     * @returns the adapter or null if it does not exist.
     */
    createAdapter(file: TFile, ...types: string[]): RSSAdapter | null;
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
     * @param templateName - Name of the template to read
     * @returns Template contents
     */
    private readTemplate;
    /**
     * Rename a folder
     * @param oldFolderPath - path to an existing folder
     * @param newFolderPath - new folder path.
     * @returns `true` if renaming was successful; `false` otherwise.
     */
    renameFolder(oldFolderPath: string, newFolderPath: string): Promise<boolean>;
    /**
     * Rename/move a file.
     * @param oldFilePath - Path to file to rename
     * @param newFilePath - new path and name of the file
     * @returns `true` if file was successfully renamed/moved; `false otherwise`
     */
    renameFile(oldFilePath: string, newFilePath: string): Promise<boolean>;
    ensureFolderExists(path: string): Promise<TFolder>;
    /**
     * Create a folder with a unique name in a given context.
     * @param parentFolder the parent folder in which to create the new folder
     * @param folderName the name of the new folder
     * @returns A `Promise` to the new folder handle.
     */
    createFolder(parentFolder: TFolder, folderName: string): Promise<TFolder>;
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
    createFileFromTemplate(folder: TFolder, basename: string, templateName: TTemplateName, data?: TPropertyBag, postProcess?: boolean): Promise<TFile>;
}
