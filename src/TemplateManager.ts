import { App } from "obsidian";
import { TPropertyBag } from "./FeedAssembler";
import RSSTrackerPlugin from "./main";
import { RSSTrackerService } from "./PluginServices";
import { FACTORY_SETTINGS, RSSTrackerSettings, TDefaultTemplateKey } from './settings';

/**
 * The basenames of templates used for RSS content creation.
 * ⚠️Not all templates are available as customizable template files.
 */
export type TTemplateName = "RSS Feed" | "RSS Item" | "RSS Topic" | "RSS Topic Dashboard" | "RSS Collection" | "RSS Collection Dashboard" | "RSS Feed Dashboard" | "RSS Tagmap";

/**
 * Service for managing and expanding RSS file templates for the RSS Tracker plugin.
 *
 * Provides methods to expand mustache-style placeholders in template files using property bags.
 * An instance of this service can be obtained by {@link RSSTrackerPlugin.tplmgr}.
 */
export class TemplateManager extends RSSTrackerService {
    /**
     * Regular expression to split a template string into an array
     * where all mustache tokens of the form `{{mustache}}` have their
     * own slot.
     */
    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;

    /**
     * A map of template names to names in {@link RSSTrackerSettings} containing the default template.
     */
    private readonly _templateMap: { [key in TTemplateName]: TDefaultTemplateKey } = {

        "RSS Item": "rssItemTemplate",
        "RSS Feed": "rssFeedTemplate",
        "RSS Feed Dashboard": "rssFeedDashboardTemplate",
        "RSS Collection": "rssCollectionTemplate",
        "RSS Collection Dashboard": "rssCollectionDashboardTemplate",
        "RSS Topic": "rssTopicTemplate",
        "RSS Topic Dashboard": "rssTopicDashboardTemplate",
        "RSS Tagmap": "rssTagmapTemplate",
    };


    /**
     * Create a new TemplateManager instance.
     * @param app - The Obsidian app instance.
     * @param plugin - The parent RSSTrackerPlugin instance.
     */
    constructor(app: App, plugin: RSSTrackerPlugin) {
        super(app, plugin);
    }

    /**
     * Expand `{{mustache}}` placeholders in a template with data from a property bag.
     *
     * @param templateName - The name of the template to expand.
     * @param properties - A property bag for replacing `{{mustache}}` placeholders with data.
     * @returns The template string with all `{{mustache}}` placeholders substituted.
     */
    async expandTemplate(templateName: TTemplateName, properties: TPropertyBag): Promise<string> {
        let template;
        const templateFolderPath = this.settings.rssTemplateFolderPath;
        if (!templateFolderPath) {
            template = FACTORY_SETTINGS[this._templateMap[templateName]]; // use the default template
        } else {
            const templateFile = this.vault.getFileByPath(templateFolderPath + "/" + templateName + ".md");

            template = templateFile
                ? await this.vault.read(templateFile) // read the template file contents from the vault
                : FACTORY_SETTINGS[this._templateMap[templateName]]; // use the default template from settings
        }

        // here we got the template one way or another.
        return template.split(TemplateManager.TOKEN_SPLITTER).map((s: string) => s.startsWith("{{") ? (properties[s] ?? s) : s).join("");
    }
}
