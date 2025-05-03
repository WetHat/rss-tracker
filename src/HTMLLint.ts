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
     * - Looks for LaTex Math markers `\[, \(, \), \], \begin{...}, \end{...}` and changes them
     * to `$$` or `$`.
     * - Removes some unsupported LaTeX math constructs.
     *
     * Note: This transformer should always called first as it sets
     * element attributes.
     *
     * @returns This instance for method chaining design pattern.
     */
    mathTransformer(): TextTransformer {
        const text = this.textNode.textContent;
        if (text) {
            const transformed = text // non-greedy matches
                .replace(/[\$\s]*\\\[([\s\S]*?)\\\][\$\s]*/g,'\n$$$$\n$1\n$$$$\n') // matches \[...\] block math
                .replace(/[\s\$]*(\\begin\{align\}[\s\S]*?\\end\{align\})[\s\$]*/g,'\n$$$$\n$1\n$$$$\n') // matches \begin{align}...\end{align} block math
                .replace(/[\s\$]*(\\begin\{equation\}[\s\S]*?\\end\{equation\})[\s\$]*/g,'\n$$$$\n$1\n$$$$\n') // matches \begin{equation}...\end{equation} block math
                .replace(/\\\((.*?)\\\)/g, "$$$1$$") // matches \(...\) inline math
                .replace(/\\label\{[^}{]+\}/g, ''); // unsupported by Obsidian

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
 *     ...
 *     .injectCodeBlock();
 * ~~~
 */
export class ObsidianHTMLLinter {
    /**
     * A Regular Expression to test for valid HTML attribute and class names.
     */
    private static VALIDATTR = /^[a-zA-Z][a-zA-Z_-]*$/;

    /**
     * The root of an element tree to lint.
     */
    private element: HTMLElement;

    /**
     * Add linefeeds to `<code>` and `<pre>` elements to ensure proper Obsidian code block formatting.
     *
     * This cleanup method is used to change unecessary `<br>` elements
     * to linefeeds and add linefeeds after `<div>`elements to preserve the structure of `<pre>`
     * or `<code>` elements in Obsidian code blocks.
     *
     * @param element - The `<pre>` or `<code>` elment to process.
     * @returns The modified element.
     */
    private static expandBR(element: HTMLElement): HTMLElement {
        let reduceLineFeeds = false
        // Take into account that `<div> elements in preformatted blocks produce linefeeds.`
        const divs = element.getElementsByTagName("div");
        for (let i = 0; i < divs.length; i++) {
            const
                div = divs[i],
                parent = div.parentElement;
            if (parent) {
                parent.insertAfter(element.doc.createTextNode("\n"), div);
                reduceLineFeeds = true;
            }
        }

        // Remove all <br> elements and replace them with linefeeds.
        const brs = element.getElementsByTagName("br");
        while (brs.length > 0) {
            const
                br = brs[0],
                parent = br.parentElement;
            if (parent) {
                parent.insertAfter(element.doc.createTextNode("\n"), br);
                reduceLineFeeds = true;
            }
            br.remove();
        }

        if (reduceLineFeeds) {
             // Remove additional empty lines produced by divs.
            element.textContent = element.textContent?.replace(/\n+/g, "\n") ?? null;
        } else {
            element.textContent = element.textContent ?? null;
        }

        return element; // return the element for method chaining.
    }

    constructor(element: HTMLElement) {
        this.element = element;
    }
    /**
     * Transmute `<audio>` and  `<video>` tags to `<img>` so that Obsidian embeds them properly.
     *
     * @returns instance of this class for method chaining.
     */
    fixEmbeds() {
        this.element.querySelectorAll("audio,:not(iframe) > video,img")
            .forEach(el => {
                el.setAttribute("src", el.getAttribute("src")?.replace(/ /g, "%20") ?? "");
                if (el.localName !== "img") {
                    el.replaceWith(createEl('img', {
                        attr: {
                            src: el.getAttribute("src"),
                            alt: el.getAttribute('alt'),
                        }
                    }))
                }
            });
        return this;
    }
    /**
     * Put mermaid diagrams into a code block so that Obsidian can pick them up.
     *
    * @returns instance of this class for method chaining.
     */
    mermaidToCodeBlock(): ObsidianHTMLLinter {
        const
            mermaids = this.element.getElementsByClassName('mermaid'),
            mermaidCount = mermaids.length;

        for (let i = 0; i < mermaidCount; i++) {
            const mermaid = mermaids[i];

            switch (mermaid.localName) {
                case 'code':
                    mermaid.classList.add('language-mermaid');
                    const mermaidParent = mermaid.parentElement;
                    if (mermaidParent && mermaidParent.localName !== 'pre') {
                        const pre = mermaid.doc.createElement('pre');
                        mermaidParent.insertBefore(pre, mermaid);
                        pre.append(mermaid);
                    }
                    break;

                case 'pre':
                    if (mermaid.firstElementChild?.localName !== 'code') {
                        // create a code block for this diagram
                        const code = mermaid.doc.createElement('code');
                        code.className = 'language-mermaid';
                        while (mermaid.firstChild) {
                            code.append(mermaid.firstChild);
                        }
                        mermaid.append(code);
                    }
                    break;

                default:
                    // create the entire mermaid sub-structure.
                    const
                        pre = mermaid.doc.createElement('pre'),
                        code = mermaid.doc.createElement('code');
                    code.className = 'language-mermaid';
                    pre.append(code);
                    while (mermaid.firstChild) {
                        code.append(mermaid.firstChild);
                    }
                    mermaid.append(pre);
                    break;
            }
        }
        return this;
    }
    /**
     * Scan for `<code>` blocks and make them Obsidian friendly.
     *
     * Applied Transformations:
     * - Replacing all `<br>` elements by linefeeds.
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
            const codeTxt = code.textContent?.trim() ?? "";
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
        this.element.querySelectorAll("[data-syntax-language],[class*=code]")
            .forEach(e => {
                // identify the <code> element
                let code = e.localName === "code"
                    ? e
                    : e.querySelectorAll("pre > code");
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
     * Cleanup Criteria: If there are nested `<code>` or `<pre>` elements inside a `<code>`element,
     * the outer `<code>` element is converted to a `<div>`.
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
     * and injects one.
     *
     * This addresses the case where syntax highlighted code is
     * expressed as HTML and just stuck into a `<pre>` block.
     *
     * Without that `<code>` element Obsidian will not generate a Markdown code block and instead obfuscates
     * any code contained in that '<pre>'.
     *
     * @returns instance of this class for method chaining.
     */
    injectCodeBlock(): ObsidianHTMLLinter {
        const pres = this.element.querySelectorAll("pre:not(:has(code))");
        for (let i = 0; i < pres.length; i++) {
            const pre = pres[i] as HTMLPreElement;
            const
                code = this.element.doc.createElement('code'),
                preClasses = Array.from(pre.classList),
                lang = preClasses.filter(cl => cl.contains("language-") || cl.contains("lang-"));

            if (lang.length > 0)
                code.className = preClasses[0];
            else {
                code.className = 'language-undefined';
            }

            code.textContent = ObsidianHTMLLinter.expandBR(pre).textContent?.trim() ?? "";
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
     * Avoids Obsidian having to deal with complex tables.
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
     *
     * @param transformer - The text transformer function.
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
     * @returns instance of this class for method chaining.
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

    /**
     * Recursively scan an element tree and call a visitor function on each element.
     *
     * @param element - the root of the element tree to scan.
     * @param visitor - the functtion to call.
     */
    private static scanElements(element: Element, visitor: TElementVisitor) {
        visitor(element);
        const children = element.children;
        for (let i = 0; i < element.childElementCount; i++) {
            ObsidianHTMLLinter.scanElements(children[i], visitor);
        }
    }

    /**
     * Remove or clean the attributes of HTML elements.
     *
     * This should be called early in the process so that downstream
     * code does not choke.
     *
     * Actions taken:
     * - Remove Attributes which have illegal names.
     * - Make classes that hint at code explicit.
     *
     * @returns instance of this class for method chaining.
     */
    cleanAttributes(): ObsidianHTMLLinter {
        ObsidianHTMLLinter.scanElements(this.element, (e: Element) => {
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
                } else if (name === "class") {
                    // detect and retain code related classes.
                    const classes = att.value.split(" ");
                    let
                        nCodeAtts = 0,
                        keep: string[] = [];
                    classes
                        .forEach(cl => {
                            if (cl.contains("code")) {
                                nCodeAtts++;
                            } else if (ObsidianHTMLLinter.VALIDATTR.test(cl)) {
                                // that appears to be a good class name.
                                keep.push(cl);
                            }
                        });
                    if (nCodeAtts > 0) {
                        // make sure we keep the 'code' class name, so that we can find this element downstream.
                        keep.push("code");
                        // we now remove all highlight classes to avoid confusion in the extractor.
                        keep = keep.filter(cl => !cl.contains("highlight") && !cl.contains("hljs"));
                    }
                    if (keep.length > 0) {
                        // keep only checked attributes
                        att.value = keep.join(" ");
                    } else {
                        // remove the class attribute as it is empty.
                        illegalNames.push(name);
                    }
                }
            }
            for (const name of illegalNames) {
                e.removeAttribute(name);
            }
        });
        return this;
    }
}
