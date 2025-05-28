import { App } from "obsidian";
import { TPropertyBag } from "./FeedAssembler";
import RSSTrackerPlugin from "./main";
import { RSSTrackerService } from "./PluginServices";

/**
 * The basenames of templates used for RSS content creation.
 * ⚠️Not all templates are avaiable as customizable template files.
 */
export type TTemplateName = "RSS Feed" | "RSS Item" | "RSS Topic" | "RSS Topic Dashboard" | "RSS Collection" | "RSS Collection Dashboard" | "RSS Feed Dashboard" | "RSS Tagmap";

/**
 * RSS Tracker Servcce to manage the expansion of RSS file templates.
 *
 * An instance of this service can be obtained by {@link RSSTrackerPlugin.tplmgr}.
 */
export class TemplateManager extends RSSTrackerService {
    /**
     * Regular expression to split a template string into and array
     * where all mustache tokens of the form `{{mustache}}` have their
     * own slot.
     */
    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;

    /**
     * A map of template names to names in {@link RSSTrackerSettings} containing the default template.
     */
    private readonly _templateMap: { [name: string]: string } = {
        "RSS Item": "rssItemTemplate",
        "RSS Feed": "rssFeedTemplate",
        "RSS Feed Dashboard": "rssFeedDashboardTemplate",
        "RSS Collection": "rssCollectionTemplate",
        "RSS Collection Dashboard": "rssCollectionDashboardTemplate",
        "RSS Topic": "rssTopicTemplate",
        "RSS Topic Dashboard": "rssTopicDashboardTemplate",
        "RSS Tagmap": "rssTagmapTemplate",
    };

    constructor(app:App,plugin: RSSTrackerPlugin) {
        super(app,plugin);
    }

    /**
	 * Expand `{{mustache}}` placeholders in a template with data from a property bag.
	 * @param template - A template string with `{{mustache}}` placeholders.
	 * @param properties - A property bag for replacing `{{mustache}}` placeholdes with data.
	 * @returns template with `{{mustache}}` placeholders substituted.
	 */
    async expandTemplate(templateName: TTemplateName, properties: TPropertyBag): Promise<string> {
        let template;
        const templateFolderPath = this.settings.rssTemplateFolderPath;
        if (!templateFolderPath) {
            template = this._templateMap[templateName]; // use the default template
        } else {
            const templateFile = this.vault.getFileByPath(templateFolderPath+ "/" + templateName + ".md");

            template = templateFile
                ? await this.vault.read(templateFile) // read the template file contents from the vault
                : this.settings[this._templateMap[templateName]]; // use the default template from settings
        }

        // here we got the template one way or another.
        return template.split(TemplateManager.TOKEN_SPLITTER).map((s:string) => s.startsWith("{{") ? (properties[s] ?? s) : s).join("")
    }
}
