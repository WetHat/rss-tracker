import { IRssMedium } from "./FeedAssembler";
export declare function formatImage(image: IRssMedium): string;
/**
 * A singleton utility class to cleanup and translate HTML to Obsidian Markdown.
 */
export declare class HTMLxlate {
    private static _instance?;
    private parser;
    /**
     * Get the singleton instance of the importer.
     * @returns Importer instance.
     */
    static get instance(): HTMLxlate;
    private constructor();
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
    fragmentAsMarkdown(html: string): string;
    /**
     * Exract the main article from an HTML document
     * @param html The content of an HTML document (including `<html>` and `<body>` elements)
     * @param baseUrl the base url of the document (needed for processing local links).
     * @returns Article Markdown text.
     */
    articleAsMarkdown(html: string, baseUrl: string): Promise<string | null>;
}
