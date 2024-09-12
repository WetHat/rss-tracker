import { ArticleData, Transformation, addTransformations, extractFromHtml } from "@extractus/article-extractor";
import { htmlToMarkdown } from "obsidian";

/**
 * A singleton utility class to clanup and translate HTML to Markdown.
 */
export class HTMLxlate {
    private static VALIDATTR = /^[a-zA-Z_-]*$/; // match valid attribute names

    private static _instance?: HTMLxlate;

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
                this.fixImagesWithoutSrc(document);
                // remove all weird attributes
                const allElements = document.body.querySelectorAll("*")
                    .forEach(e => {
                        const
                            illegalNames = [],
                            attribs = e.attributes,
                            attCount = attribs.length;

                        for (let i = 0; i < attCount; i++) {
                            const
                                att = attribs[i],
                                name = att.name;
                            if (!HTMLxlate.VALIDATTR.test(name)) {
                                illegalNames.push(name);
                            }
                        }
                        for (const name of illegalNames) {
                            e.removeAttribute(name);
                        }
                    });
                return document;
            },
            post: document => {
                // look for <pre> tags and make sure their first child is always a <code> tag.
                const pres = document.body.getElementsByTagName("pre");
                for (let i = 0; i < pres.length; i++) {
                    const pre = pres[i];
                    let firstChild = pre.firstChild;
                    if (firstChild && firstChild.nodeName !== "code") {
                        const code = document.createElement("code");
                        let child;
                        while (firstChild) {
                            code.append(firstChild);
                            firstChild = pre.firstChild;
                        }
                        pre.append(code);
                    }
                }
                return document;
            }
        };
        addTransformations([tm]);
    }

    /**
     * Fix `<img>` elemnts without 'src' attribute enclosed in a `<picture>` element.
     *
     * The fix is to use an image url from the `srcset` attibute of the enclosing `<picture>`
     * element and add it to  the `<img>`
     *
     * @param doc The HTML document
     */
    private fixImagesWithoutSrc(doc: Document) {
        doc.body.querySelectorAll("picture > img:not([src]").forEach(img => {
            const sources = img.parentElement?.getElementsByTagName("source");
            if (sources && sources.length > 0) {
                const srcset = sources[0].getAttribute("srcset");
                if (srcset) {
                    // inject a src attribute
                    img.setAttribute("src", srcset.slice(0, srcset.indexOf(" ")));
                }
            }
        });
    }

    private flattenSingleRowTable(doc: Document, table: HTMLTableElement): boolean {
        let trs = table.querySelectorAll(":scope > tbody > tr"); // this is static
        if (trs.length == 0) {
            trs = table.querySelectorAll(":scope > tr");
        }
        if (trs.length == 1) {
            trs[0].querySelectorAll(":scope > td").forEach(td => {
                // hoist each td before the table
                const section = doc.createElement("section");
                table.parentElement?.insertBefore(section, table);
                // move all children of td into the section
                while (td.firstChild) {
                    section.appendChild(td.firstChild);
                }
            });
            table.remove();
            return true;
        }
        return false;
    }

    private flattenTables(doc: Document) {
        const tables = Array.from<HTMLTableElement>(doc.body.getElementsByTagName("table"));
        tables.forEach(table => this.flattenSingleRowTable(doc, table));
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
        const
            parser = new DOMParser(),
            doc = parser.parseFromString("<html><body>" + html + "</body></html)>", "text/html");
        // tidy the docuement
        this.flattenTables(doc);
        return htmlToMarkdown(doc);
    }

    /**
     * Exract the main article from an HTML document
     * @param html The content of an HTML document (including `<html>` and `<body>` elements)
     * @param baseUrl the base url of the document (needed for processing lofac links).
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