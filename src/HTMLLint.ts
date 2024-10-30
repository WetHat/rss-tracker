export type TTextTransformerCallback = (transformer: TextTransformer) => void;

type TElementVisitor = (element: Element) => void;

export class TextTransformer {
    private textNode: Node;

    constructor(text: Node) {
        this.textNode = text;
    }

    /**
     * Detect LaTeX math code and prepare it for Obsidian
     *
     * Looks for  LaTex Math markers `\[, \(, \), \]` and chenges them
     * to `$$` or `$`.
     *
     * Note: This transformaer should always called first as it sets
     * element attributes.
     *
     * @returns This instance for method chaining design pattern.
     */
    mathTransformer(): TextTransformer {
        const text = this.textNode.textContent;
        if (text) {
            const transformed = text // non-greedy matches
                .replace(/\\\[\s*([\s\S]+?)\\\]/g, '$$$$ $1 $$$$')
                .replace(/\\\((.*?)\\\)/g, "$$$1$$");
            if (text !== transformed) {
                this.textNode.textContent = transformed;
                if (this.textNode.parentElement) {
                    this.textNode.parentElement.className = "math";
                }
            }
        }
        return this;
    }

    /**
     * Change dom characters which interfere with Onsidian to Unicode Lookalikes.
     *
     * @returns This instance for method chaining design pattern.
     */
    entityTransformer(): TextTransformer {
        const
            text = this.textNode.textContent,
            parent = this.textNode.parentElement;

        if (text && parent && parent.localName !== "code" && !parent.classList.contains("math")) {
            // replace Obsidian unfriendly html entities and characters.
            const transformed = text
                .replace(/>/g, '＞')
                .replace(/</g, '＜')
                .replace(/\[/g, '［')
                .replace(/\]/g, '］');

            if (transformed !== text) {
                this.textNode.textContent = transformed;
            }
        }
        return this;
    }
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
export class ObsidianHTMLLinter {
    private static VALIDATTR = /^[a-zA-Z_-]*$/; // match valid attribute names

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
                br = brs[0], parent = br.parentElement;
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
                    const langClass = "language-" + lang;
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
                    div.append(code.firstChild);
                }
                code.remove();
            }
        });
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
                code = this.element.doc.createElement('code'), preClasses = Array.from(pre.classList), lang = preClasses.filter(cl => cl.startsWith("language-"));

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

    private static scanText(node: Node, transformer: TTextTransformerCallback) {
        node.childNodes.forEach(n => {
            if (n.nodeType === Node.TEXT_NODE) {
                transformer(new TextTransformer(n));
            } else {
                ObsidianHTMLLinter.scanText(n, transformer);
            }
        });
    }

    /**
     * Apply text transformations to all text nodes.
     * @param transformer The transformer function.
     *
      * @returns instance of this class for method chaining.
     */
    transformText(transformer: TTextTransformerCallback): ObsidianHTMLLinter {
        ObsidianHTMLLinter.scanText(this.element, transformer);
        return this;
    }

    /**
     * Fix `<img>` elemnts without 'src' attribute enclosed in a `<picture>` element.
     *
     * The fix is to use an image url from the `srcset` attibute of the enclosing `<picture>`
     * element and add it to  the `<img>`
     *
     * @param doc The HTML document
     */
    fixImagesWithoutSrc(): ObsidianHTMLLinter {
        this.element.querySelectorAll("picture > img:not([src]").forEach(img => {
            const sources = img.parentElement?.getElementsByTagName("source");
            if (sources && sources.length > 0) {
                const srcset = sources[0].getAttribute("srcset");
                if (srcset) {
                    // inject a src attribute
                    img.setAttribute("src", srcset.slice(0, srcset.indexOf(" ")));
                }
            }
        });
        return this;
    }

    private static scanElements(element: Element, visitor: TElementVisitor) {
        visitor(element);
        const children = element.children;
        for (let i = 0; i < element.childElementCount; i++) {
            ObsidianHTMLLinter.scanElements(children[i],visitor);
        }
    }

    cleanAttributes() : ObsidianHTMLLinter {
        ObsidianHTMLLinter.scanElements(this.element, (e : Element) => {
            const
                illegalNames = [],
                attribs = e.attributes,
                attCount = attribs.length;

            for (let i = 0; i < attCount; i++) {
                const
                    att = attribs[i],
                    name = att.name;
                if (!ObsidianHTMLLinter.VALIDATTR.test(name)) {
                    illegalNames.push(name);
                }
                // remove some attributes which would cause loss off
                // this element.
                if (att.name === "class" && att.value.contains("highlight")) {
                    illegalNames.push(name);
                }
            }
            for (const name of illegalNames) {
                e.removeAttribute(name);
            }
        });
        return this;
    }
}
