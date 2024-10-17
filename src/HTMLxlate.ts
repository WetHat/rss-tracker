import { ArticleData, Transformation, addTransformations, extractFromHtml } from "@extractus/article-extractor";
import { htmlToMarkdown } from "obsidian";
import { IRssMedium } from "./FeedAssembler";

type TTExtTransformer = (textNode: Node) => void;

export function formatImage(image: IRssMedium): string {
    const { src, width, height } = image as IRssMedium;
    return `![image|float:right|400](${src})`;
}

/**
 * A singleton utility class to clanup and translate HTML to Markdown.
 */
export class HTMLxlate {
    private static VALIDATTR = /^[a-zA-Z_-]*$/; // match valid attribute names

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

    /**
     * An HTML transformation looking for `<pre>` tags which are **not** immediately followed by a `<code>` block
     * and inject one.
     *
     * Without that `<code>` element Obsidian will not generate a Markdown code block and obfuscates any code contained in the '<pre>'.
     *
     * @param element an element of an HTML document.
     */
    private static injectCodeBlock(element: HTMLElement) {
        const pres = Array.from(element.getElementsByTagName('pre'));
        for (let i = 0; i < pres.length; i++) {
            const pre = pres[i];
            let firstChild = pre.firstChild;

            // remove emptylines
            while (firstChild?.nodeType === Node.TEXT_NODE && firstChild.textContent?.trim().length === 0) {
                firstChild.remove();
                firstChild = pre.firstChild;
            }

            const firstChildelement = pre.firstElementChild;

            if (!firstChildelement || firstChildelement.localName !== 'code') {
                const
                    code = element.doc.createElement('code'),
                    preClasses = Array.from(pre.classList),
                    lang = preClasses.filter(cl => cl.startsWith("language-"));

                if (lang.length > 0)
                    code.classList.add(...lang);
                else {
                    code.className = 'language-undefined';
                }

                code.textContent = HTMLxlate.expandBR(pre).textContent;
                pre.innerHTML = "";
                pre.append(code);
                pre.removeAttribute("class");
            }
        }
    }

    private static expandBR(element: HTMLElement): HTMLElement {
        const brs = element.getElementsByTagName("br");
        while (brs.length > 0) {
            const
                br = brs[0],
                parent = br.parentElement;
            if (parent) {
                br.parentElement?.insertAfter(element.doc.createTextNode("\n"), br);
            }
            br.remove();
        }
        return element;
    }

    private static cleanupCodeBlock(element: HTMLElement) {
        const
            codeBlocks = element.getElementsByTagName("code"),
            blockCount = codeBlocks.length;

        for (let i = 0; i < blockCount; i++) {
            const code = HTMLxlate.expandBR(codeBlocks[i]);
            code.textContent = code.innerText;
        }
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
                HTMLxlate.flattenTables(document.body);
                HTMLxlate.cleanupCodeBlock(document.body);
                HTMLxlate.injectCodeBlock(document.body);


                // enable Obsidian Math and get rid of some special characters
                HTMLxlate.transformText(document.body, (node: Node) => {
                    HTMLxlate.mathTransformer(node);
                    HTMLxlate.entityTransformer(node);
                });

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

    private static flattenSingleRowTable(table: HTMLTableElement): boolean {
        let trs = table.querySelectorAll(":scope > tbody > tr"); // this is static
        if (trs.length == 0) {
            trs = table.querySelectorAll(":scope > tr");
        }
        if (trs.length == 1) {
            trs[0].querySelectorAll(":scope > td").forEach(td => {
                // hoist each td before the table
                const section = table.doc.createElement("section");
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

    private static flattenTables(element: Element) {
        const tables = Array.from<HTMLTableElement>(element.getElementsByTagName("table"));
        tables.forEach(table => HTMLxlate.flattenSingleRowTable(table));
    }

    private static mathTransformer(textNode: Node) {
        const text = textNode.textContent;
        if (text) {
            const transformed = text // non-greedy matches
                .replace(/\\\[\s*([\s\S]+?)\\\]/g, '$$$$ $1 $$$$')
                .replace(/\\\((.*?)\\\)/g, "$$$1$$");
            if (textNode.textContent !== transformed) {
                textNode.textContent = transformed;
                if (textNode.parentElement) {
                    textNode.parentElement.className = "math";
                }
            }
        }
    }

    private static entityTransformer(textNode: Node) {
        const
            text = textNode.textContent,
            parent = textNode.parentElement;

        if (text && parent && parent.localName !== "code" && !parent.classList.contains("math")) {
            // replace Obsidian unfriendly html entities and characters.
            const transformed = text
                .replace(/>/g, '＞')
                .replace(/</g, '＜')
                .replace(/\[/g, '［')
                .replace(/\]/g, '］');

            if (transformed !== text) {
                textNode.textContent = transformed;
            }
        }
    }

    private static transformText(node: Node, transformer: TTExtTransformer) {
        node.childNodes.forEach(n => {
            if (n.nodeType === Node.TEXT_NODE) {
                transformer(n);
            } else {
                HTMLxlate.transformText(n, transformer);
            }
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
        const doc = this.parser.parseFromString(html, "text/html");
        // tidy the docuement
        HTMLxlate.flattenTables(doc.body);
        HTMLxlate.cleanupCodeBlock((doc.body));
        HTMLxlate.injectCodeBlock((doc.body));

        HTMLxlate.transformText(doc.body, (node: Node) => {
            HTMLxlate.mathTransformer(node);
            HTMLxlate.entityTransformer(node);
        });

        return htmlToMarkdown(doc.body);
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