import { ArticleData, Transformation, addTransformations, extractFromHtml, getSanitizeHtmlOptions, setSanitizeHtmlOptions } from "@extractus/article-extractor";
import { htmlToMarkdown } from "obsidian";
import { IRssMedium } from "./FeedAssembler";
import { ToggleRSSfeedActiveStatusMenuItem } from './menus';
import { get } from "http";

type TTExtTransformer = (textNode: Node) => void;

export function formatImage(image: IRssMedium): string {
    const { src, width, height } = image as IRssMedium;
    return `![image|float:right|400](${src})`;
}

/**
 * A utility class to transform HTML into something Obsidian can successfully
 * transform into Markdown.
 *
 * The methods of this utility class support method chaining.
 *
 * @example
 * ~~~ts
 * const linter = new ObsidianHTMLLinter(document.body);
 * linter
 *     .cleanupCodeBlock()
 *     .detectCode()
 *     .flattenTables()
 *     .cleanupFakeCode()
 *     .injectCodeBlock();
 * ~~~
 */
class ObsidianHTMLLinter {
    private element: HTMLElement;

    /**
     * Expand all `<br>` elements to linefeeds.
     * @param element The elment to scan for `<br>`
     * @returns The modified element.
     */
    private static expandBR(element: HTMLElement): HTMLElement {
        const brs = element.getElementsByTagName("br");
        while (brs.length > 0) {
            const
                br = brs[0],
                parent = br.parentElement;
            if (parent) {
                parent.insertAfter(element.doc.createTextNode("\n"), br);
            }
            br.remove();
        }
        return element;
    }

    constructor(element: HTMLElement) {
        this.element = element;
    }

    /**
     * Scan for `<code>` elements and make them Obsidian friendly.
     *
     * Applied Transformations:
     * - Replacing all '<br>' elements by linefeeds.
     * - transforming HTML code to plain text. As formatting and syntax highlighting will be
     *   done by Obsidian.
     *
     * @returns instance of this class for method chaining.
     */
    cleanupCodeBlock(): ObsidianHTMLLinter {
        const codeBlocks = this.element.getElementsByTagName("code");

        // make sure to check the length every time to handle
        // nested <pre> tags.
        for (let i = 0; i < codeBlocks.length; i++) {
            const code = codeBlocks[i];
            ObsidianHTMLLinter.expandBR(code);
            const codeTxt = code.innerText.trim();
            code.textContent = codeTxt;
            const parent = code.parentElement;
            if ("pre" === parent?.localName) {
                const preTxt = parent.innerText.trim();
                if (preTxt.length === codeTxt.length) {
                    parent.replaceChildren(code);
                }
            }
        }
        return this;
    }

    /**
     * Detect elements which are most likely code.
     *
     * @returns instance of this class for method chaining.
     */
    detectCode(): ObsidianHTMLLinter {
        this.element.querySelectorAll("[data-syntax-language],div[class*=code]")
            .forEach(e => {
                // identify the <code> element
                let code = e.localName === "code"
                    ? e
                    : e.querySelectorAll("pre>code");
                if (!code) {
                    // must make a `<code>` element
                    ObsidianHTMLLinter.expandBR(e as HTMLElement);
                    const codeTxt = e.textContent?.trim() ?? "";
                    code = e.doc.createElement("code");
                    let pre = e.localName === "pre"
                        ? e
                        : e.querySelector("pre");
                    if (pre) {
                        pre.append(code);
                    } else {
                        // must make a `<pre>` element too.
                        pre = e.doc.createElement("pre");
                        pre.append(code);
                        e.replaceChildren(pre);
                    }
                    code.textContent = codeTxt;
                }
                const lang = e.getAttribute("data-syntax-language");
                if (lang) {
                    const langClass =  "language-" + lang;
                    if (code instanceof HTMLElement) {
                        code.className = langClass;
                    } else {
                        (code as NodeListOf<HTMLElement>).forEach(c => {
                            c.className = langClass;
                        });
                    }
                }
            });
        return this;
    }

    /**
     * Cleanup incorrectly used '<code>' elements.
     *
     * @returns instance of this class for method chaining.
     */
    cleanupFakeCode(): ObsidianHTMLLinter {
        const fakeCode = this.element.querySelectorAll("code:has(code),code:has(pre)");
        fakeCode.forEach(code => {
            const parent = code.parentElement;
            if (parent) {
                const div = code.doc.createElement("div");
                parent.insertBefore(div, code);
                while (code.firstChild) {
                    div.append(code.firstChild)
                }
                code.remove();
            }
        })
        return this;
    }

    /**
     * An HTML transformation looking for `<pre>` tags which are **not** followed by a `<code>` block
     * and inject one.
     *
     * Without that `<code>` element Obsidian will not generate a Markdown code block and obfuscates any code contained in the '<pre>'.
     *
     * @returns instance of this class for method chaining.
     */
    injectCodeBlock(): ObsidianHTMLLinter {
        const pres = this.element.querySelectorAll("pre:not(:has(code))");
        for (let i = 0; i < pres.length; i++) {
            const pre = pres[i];
            const
                code = this.element.doc.createElement('code'),
                preClasses = Array.from(pre.classList),
                lang = preClasses.filter(cl => cl.startsWith("language-"));

            if (lang.length > 0)
                code.className = preClasses[0];
            else {
                code.className = 'language-undefined';
            }

            code.textContent = ObsidianHTMLLinter.expandBR(pre as HTMLElement).textContent?.trim() ?? "";
            pre.replaceChildren(code);
            pre.removeAttribute("class");
        }
        return this;
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

    /**
     * Flatten single row tables into a sequence of `<section>` elements.
     *
     * @returns instance of this class for method chaining.
     */
    flattenTables(): ObsidianHTMLLinter {
        const tables = Array.from<HTMLTableElement>(this.element.getElementsByTagName("table"));
        tables.forEach(table => ObsidianHTMLLinter.flattenSingleRowTable(table));
        return this;
    }

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
                            if (att.name === "class" && att.value.contains("highlight")) {
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
                const linter = new ObsidianHTMLLinter(document.body);
                linter
                    .cleanupCodeBlock()
                    .detectCode()
                    .flattenTables()
                    .cleanupFakeCode()
                    .injectCodeBlock();

                // enable Obsidian Math and get rid of some special characters
                HTMLxlate.transformText(document.body, (node: Node) => {
                    HTMLxlate.mathTransformer(node);
                    HTMLxlate.entityTransformer(node);
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
        const
            doc = this.parser.parseFromString(html, "text/html"),
            linter = new ObsidianHTMLLinter(doc.body);
        linter
            .cleanupCodeBlock()
            .flattenTables()
            .cleanupFakeCode()
            .injectCodeBlock();

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