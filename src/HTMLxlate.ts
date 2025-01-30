import { ArticleData, Transformation, addTransformations, extractFromHtml, getSanitizeHtmlOptions, setSanitizeHtmlOptions } from "@extractus/article-extractor";
import { htmlToMarkdown } from "obsidian";
import { IRssMedium } from "./FeedAssembler";
import { ObsidianHTMLLinter } from "./HTMLLint";

export function formatImage(image: IRssMedium): string {
    const { src, width, height } = image as IRssMedium;
    return `![image|float:right|400](${src})`;
}

/**
 * A singleton utility class to cleanup and translate HTML to Obsidian Markdown.
 */
export class HTMLxlate {
    private static _instance?: HTMLxlate;

    private parser = new DOMParser();
    /**
     * Get the singleton instance of the importer.
     * @returns Importer instance.
     */
    static get instance(): HTMLxlate {
        if (!HTMLxlate._instance) {
            HTMLxlate._instance = new HTMLxlate();
        }
        return HTMLxlate._instance;
    }

    private constructor() {
        // configure the article extractor to make the returned content
        // more Obsidian friendly
        const tm: Transformation = {
            patterns: [
                /.*/ // apply to all websites
            ],
            pre: document => {
                const linter = new ObsidianHTMLLinter(document.body);
                linter
                    .fixImagesWithoutSrc()
                    .fixEmbeds()
                    .cleanAttributes();
                return document;
            },
            post: document => {
                // look for <pre> tags and make sure their first child is always a <code> tag.
                const linter = new ObsidianHTMLLinter(document.body);
                linter
                    .cleanupCodeBlock()
                    .detectCode()
                    .flattenTables()
                    .cleanupFakeCode()
                    .injectCodeBlock()
                    .transformText( tm => {
                        tm
                            .mathTransformer()
                            .entityTransformer();
                    });
                return document;
            }
        };
        addTransformations([tm]);
        const
            opts = getSanitizeHtmlOptions(),
            allowedAttributes = opts.allowedAttributes;

        if (!Array.isArray(allowedAttributes.code)) {
            allowedAttributes.code = [];
        }
        allowedAttributes.code.push("class");

        setSanitizeHtmlOptions({
            allowedAttributes: allowedAttributes
        });
    }

    /**
     * Translate an HTML fragment to Markdown text.
     *
     * Following HTML cleanup rules are currently applied.
     * - Flatten tables which contain only a single row into a `section` for each `td`
     *
     * **Notes**:
     * - This addresses nested tables in the 'Node Weekly' feed.
     *
     * @param html A HTML fragment string
     * @return The markdown text generated from the HTML fragment.
     */
    fragmentAsMarkdown(html: string): string {
        html = html.trim();
        // some quick plausibility check to determine if this actually already markdown.
        if (!html.startsWith("<") && html.match(/```|~~~|^\s*#+\s+[^#]$|\]\([^\]\[\)]+\)/)) {
            return html;
        }
        const
            doc = this.parser.parseFromString(html, "text/html"),
            linter = new ObsidianHTMLLinter(doc.body);
        linter
            .cleanupCodeBlock()
            .flattenTables()
            .cleanupFakeCode()
            .injectCodeBlock()
            .transformText(tm => {
                tm
                    .mathTransformer()
                    .entityTransformer();
            });

        return htmlToMarkdown(doc.body);
    }

    /**
     * Exract the main article from an HTML document
     * @param html The content of an HTML document (including `<html>` and `<body>` elements)
     * @param baseUrl the base url of the document (needed for processing local links).
     * @returns Article Markdown text.
     */
    async articleAsMarkdown(html: string, baseUrl: string): Promise<string | null> {
        const article: ArticleData | null = await extractFromHtml(html, baseUrl);
        if (!article) {
            return null;
        }

        const { title, content } = article;

        return "\n# "
            + (title ?? "Downloaded Article")
            + " ⬇️"
            + "\n\n"
            + (content ? htmlToMarkdown(content) : "-");
    }
}