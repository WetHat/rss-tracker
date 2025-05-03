export class TextTransformer {
    constructor(text) {
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
    mathTransformer() {
        const text = this.textNode.textContent;
        if (text) {
            const transformed = text // non-greedy matches
                .replace(/[\$\s]*\\\[([\s\S]*?)\\\][\$\s]*/g, '\n$$$$\n$1\n$$$$\n') // matches \[...\] block math
                .replace(/[\s\$]*(\\begin\{align\}[\s\S]*?\\end\{align\})[\s\$]*/g, '\n$$$$\n$1\n$$$$\n') // matches \begin{align}...\end{align} block math
                .replace(/[\s\$]*(\\begin\{equation\}[\s\S]*?\\end\{equation\})[\s\$]*/g, '\n$$$$\n$1\n$$$$\n') // matches \begin{equation}...\end{equation} block math
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
    entityTransformer() {
        const text = this.textNode.textContent, parent = this.textNode.parentElement;
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
    constructor(element) {
        this.element = element;
    }
    /**
     * Add linefeeds to `<code>` and `<pre>` elements to ensure proper Obsidian code block formatting.
     *
     * This cleanup method is used to change unecessary `<br>` elements
     * to linefeeds and add linefeeds after `<div>`elements to preserve the structure of `<pre>`
     * or `<code>` elements in Obsidian code blocks.
     *
     * @param element The `<pre>` or `<code>` elment to process.
     * @returns The modified element.
     */
    static expandBR(element) {
        var _a, _b, _c;
        let reduceLineFeeds = false;
        // Take into account that `<div> elements in preformatted blocks produce linefeeds.`
        const divs = element.getElementsByTagName("div");
        for (let i = 0; i < divs.length; i++) {
            const div = divs[i], parent = div.parentElement;
            if (parent) {
                parent.insertAfter(element.doc.createTextNode("\n"), div);
                reduceLineFeeds = true;
            }
        }
        // Remove all <br> elements and replace them with linefeeds.
        const brs = element.getElementsByTagName("br");
        while (brs.length > 0) {
            const br = brs[0], parent = br.parentElement;
            if (parent) {
                parent.insertAfter(element.doc.createTextNode("\n"), br);
                reduceLineFeeds = true;
            }
            br.remove();
        }
        if (reduceLineFeeds) {
            // Remove additional empty lines produced by divs.
            element.textContent = (_b = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n+/g, "\n")) !== null && _b !== void 0 ? _b : null;
        }
        else {
            element.textContent = (_c = element.textContent) !== null && _c !== void 0 ? _c : null;
        }
        return element; // return the element for method chaining.
    }
    /**
     * Transmute `<audio>` and  `<video>` tags to `<img>` so that Obsidian embeds them properly.
     *
     * @returns instance of this class for method chaining.
     */
    fixEmbeds() {
        this.element.querySelectorAll("audio,:not(iframe) > video,img")
            .forEach(el => {
            var _a, _b;
            el.setAttribute("src", (_b = (_a = el.getAttribute("src")) === null || _a === void 0 ? void 0 : _a.replace(/ /g, "%20")) !== null && _b !== void 0 ? _b : "");
            if (el.localName !== "img") {
                el.replaceWith(createEl('img', {
                    attr: {
                        src: el.getAttribute("src"),
                        alt: el.getAttribute('alt'),
                    }
                }));
            }
        });
        return this;
    }
    /**
     * Put mermaid diagrams into a code block so that Obsidian can pick them up.
     *
    * @returns instance of this class for method chaining.
     */
    mermaidToCodeBlock() {
        var _a;
        const mermaids = this.element.getElementsByClassName('mermaid'), mermaidCount = mermaids.length;
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
                    if (((_a = mermaid.firstElementChild) === null || _a === void 0 ? void 0 : _a.localName) !== 'code') {
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
                    const pre = mermaid.doc.createElement('pre'), code = mermaid.doc.createElement('code');
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
    cleanupCodeBlock() {
        var _a, _b;
        const codeBlocks = this.element.getElementsByTagName("code");
        // make sure to check the length every time to handle
        // nested <pre> tags.
        for (let i = 0; i < codeBlocks.length; i++) {
            const code = codeBlocks[i];
            ObsidianHTMLLinter.expandBR(code);
            const codeTxt = (_b = (_a = code.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
            code.textContent = codeTxt;
            const parent = code.parentElement;
            if ("pre" === (parent === null || parent === void 0 ? void 0 : parent.localName)) {
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
    detectCode() {
        this.element.querySelectorAll("[data-syntax-language],[class*=code]")
            .forEach(e => {
            var _a, _b;
            // identify the <code> element
            let code = e.localName === "code"
                ? e
                : e.querySelectorAll("pre > code");
            if (!code) {
                // must make a `<code>` element
                ObsidianHTMLLinter.expandBR(e);
                const codeTxt = (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
                code = e.doc.createElement("code");
                let pre = e.localName === "pre"
                    ? e
                    : e.querySelector("pre");
                if (pre) {
                    pre.append(code);
                }
                else {
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
                }
                else {
                    code.forEach(c => {
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
    cleanupFakeCode() {
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
    injectCodeBlock() {
        var _a, _b;
        const pres = this.element.querySelectorAll("pre:not(:has(code))");
        for (let i = 0; i < pres.length; i++) {
            const pre = pres[i];
            const code = this.element.doc.createElement('code'), preClasses = Array.from(pre.classList), lang = preClasses.filter(cl => cl.contains("language-") || cl.contains("lang-"));
            if (lang.length > 0)
                code.className = preClasses[0];
            else {
                code.className = 'language-undefined';
            }
            code.textContent = (_b = (_a = ObsidianHTMLLinter.expandBR(pre).textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
            pre.replaceChildren(code);
            pre.removeAttribute("class");
        }
        return this;
    }
    static flattenSingleRowTable(table) {
        let trs = table.querySelectorAll(":scope > tbody > tr"); // this is static
        if (trs.length == 0) {
            trs = table.querySelectorAll(":scope > tr");
        }
        if (trs.length == 1) {
            trs[0].querySelectorAll(":scope > td").forEach(td => {
                var _a;
                // hoist each td before the table
                const section = table.doc.createElement("section");
                (_a = table.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(section, table);
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
    flattenTables() {
        const tables = Array.from(this.element.getElementsByTagName("table"));
        tables.forEach(table => ObsidianHTMLLinter.flattenSingleRowTable(table));
        return this;
    }
    static scanText(node, transformer) {
        node.childNodes.forEach(n => {
            if (n.nodeType === Node.TEXT_NODE) {
                transformer(new TextTransformer(n));
            }
            else {
                ObsidianHTMLLinter.scanText(n, transformer);
            }
        });
    }
    /**
     * Apply text transformations to all text nodes.
     *
     * @param transformer The text transformer function.
     *
    * @returns instance of this class for method chaining.
     */
    transformText(transformer) {
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
    fixImagesWithoutSrc() {
        this.element.querySelectorAll("picture > img:not([src]").forEach(img => {
            var _a;
            const sources = (_a = img.parentElement) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("source");
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
     * @param element the root of the element tree to scan.
     * @param visitor the functtion to call.
     */
    static scanElements(element, visitor) {
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
    cleanAttributes() {
        ObsidianHTMLLinter.scanElements(this.element, (e) => {
            const illegalNames = [], attribs = e.attributes, attCount = attribs.length;
            for (let i = 0; i < attCount; i++) {
                const att = attribs[i], name = att.name;
                if (!ObsidianHTMLLinter.VALIDATTR.test(name)) {
                    illegalNames.push(name);
                }
                else if (name === "class") {
                    // detect and retain code related classes.
                    const classes = att.value.split(" ");
                    let nCodeAtts = 0, keep = [];
                    classes
                        .forEach(cl => {
                        if (cl.contains("code")) {
                            nCodeAtts++;
                        }
                        else if (ObsidianHTMLLinter.VALIDATTR.test(cl)) {
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
                    }
                    else {
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
/**
 * A Regular Expression to test for valid HTML attribute and class names.
 */
ObsidianHTMLLinter.VALIDATTR = /^[a-zA-Z][a-zA-Z_-]*$/;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRNTExpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvSFRNTExpbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsTUFBTSxPQUFPLGVBQWU7SUFHeEIsWUFBWSxJQUFVO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILGVBQWU7UUFDWCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztRQUN2QyxJQUFJLElBQUksRUFBRTtZQUNOLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxxQkFBcUI7aUJBQ3pDLE9BQU8sQ0FBQyxtQ0FBbUMsRUFBQyxvQkFBb0IsQ0FBQyxDQUFDLDZCQUE2QjtpQkFDL0YsT0FBTyxDQUFDLHlEQUF5RCxFQUFDLG9CQUFvQixDQUFDLENBQUMsaURBQWlEO2lCQUN6SSxPQUFPLENBQUMsK0RBQStELEVBQUMsb0JBQW9CLENBQUMsQ0FBQyx1REFBdUQ7aUJBQ3JKLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQyw4QkFBOEI7aUJBQ2xFLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLDBCQUEwQjtZQUVsRSxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztnQkFDeEMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRTtvQkFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztpQkFDbEQ7YUFDSjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUI7UUFDYixNQUNJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFDaEMsTUFBTSxH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O3dCQUNmLHdGQUF3Rjt3QkFDeEYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDbEIsMkVBQTJFO3dCQUMzRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztxQkFDL0U7b0JBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTt3QkFDakIsK0JBQStCO3dCQUMvQixHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzlCO3lCQUFNO3dCQUNILDZDQUE2Qzt3QkFDN0MsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDM0I7aUJBQ0o7YUFDSjtZQUNELEtBQUssTUFBTSxJQUFJLElBQUksWUFBWSxFQUFFO2dCQUM3QixDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNCO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDOztBQWxhRDs7R0FFRztBQUNZLDRCQUFTLEdBQUcsdUJBQXVCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBUVGV4dFRyYW5zZm9ybWVyQ2FsbGJhY2sgPSAodHJhbnNmb3JtZXI6IFRleHRUcmFuc2Zvcm1lcikgPT4gdm9pZDtcclxuXHJcbnR5cGUgVEVsZW1lbnRWaXNpdG9yID0gKGVsZW1lbnQ6IEVsZW1lbnQpID0+IHZvaWQ7XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dFRyYW5zZm9ybWVyIHtcclxuICAgIHByaXZhdGUgdGV4dE5vZGU6IE5vZGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGV4dDogTm9kZSkge1xyXG4gICAgICAgIHRoaXMudGV4dE5vZGUgPSB0ZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZWN0IExhVGVYIG1hdGggY29kZSBhbmQgcHJlcGFyZSBpdCBmb3IgT2JzaWRpYW5cclxuICAgICAqXHJcbiAgICAgKiAtIExvb2tzIGZvciBMYVRleCBNYXRoIG1hcmtlcnMgYFxcWywgXFwoLCBcXCksIFxcXSwgXFxiZWdpbnsuLi59LCBcXGVuZHsuLi59YCBhbmQgY2hhbmdlcyB0aGVtXHJcbiAgICAgKiB0byBgJCRgIG9yIGAkYC5cclxuICAgICAqIC0gUmVtb3ZlcyBzb21lIHVuc3VwcG9ydGVkIExhVGVYIG1hdGggY29uc3RydWN0cy5cclxuICAgICAqXHJcbiAgICAgKiBOb3RlOiBUaGlzIHRyYW5zZm9ybWVyIHNob3VsZCBhbHdheXMgY2FsbGVkIGZpcnN0IGFzIGl0IHNldHNcclxuICAgICAqIGVsZW1lbnQgYXR0cmlidXRlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBUaGlzIGluc3RhbmNlIGZvciBtZXRob2QgY2hhaW5pbmcgZGVzaWduIHBhdHRlcm4uXHJcbiAgICAgKi9cclxuICAgIG1hdGhUcmFuc2Zvcm1lcigpOiBUZXh0VHJhbnNmb3JtZXIge1xyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnRleHROb2RlLnRleHRDb250ZW50O1xyXG4gICAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gdGV4dCAvLyBub24tZ3JlZWR5IG1hdGNoZXNcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFwkXFxzXSpcXFxcXFxbKFtcXHNcXFNdKj8pXFxcXFxcXVtcXCRcXHNdKi9nLCdcXG4kJCQkXFxuJDFcXG4kJCQkXFxuJykgLy8gbWF0Y2hlcyBcXFsuLi5cXF0gYmxvY2sgbWF0aFxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHNcXCRdKihcXFxcYmVnaW5cXHthbGlnblxcfVtcXHNcXFNdKj9cXFxcZW5kXFx7YWxpZ25cXH0pW1xcc1xcJF0qL2csJ1xcbiQkJCRcXG4kMVxcbiQkJCRcXG4nKSAvLyBtYXRjaGVzIFxcYmVnaW57YWxpZ259Li4uXFxlbmR7YWxpZ259IGJsb2NrIG1hdGhcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFxzXFwkXSooXFxcXGJlZ2luXFx7ZXF1YXRpb25cXH1bXFxzXFxTXSo/XFxcXGVuZFxce2VxdWF0aW9uXFx9KVtcXHNcXCRdKi9nLCdcXG4kJCQkXFxuJDFcXG4kJCQkXFxuJykgLy8gbWF0Y2hlcyBcXGJlZ2lue2VxdWF0aW9ufS4uLlxcZW5ke2VxdWF0aW9ufSBibG9jayBtYXRoXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFxcKCguKj8pXFxcXFxcKS9nLCBcIiQkJDEkJFwiKSAvLyBtYXRjaGVzIFxcKC4uLlxcKSBpbmxpbmUgbWF0aFxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxsYWJlbFxce1tefXtdK1xcfS9nLCAnJyk7IC8vIHVuc3VwcG9ydGVkIGJ5IE9ic2lkaWFuXHJcblxyXG4gICAgICAgICAgICBpZiAodGV4dCAhPT0gdHJhbnNmb3JtZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dE5vZGUudGV4dENvbnRlbnQgPSB0cmFuc2Zvcm1lZDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHROb2RlLnBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHROb2RlLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lID0gXCJtYXRoXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGFuZ2UgZG9tIGNoYXJhY3RlcnMgd2hpY2ggaW50ZXJmZXJlIHdpdGggT25zaWRpYW4gdG8gVW5pY29kZSBMb29rYWxpa2VzLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIFRoaXMgaW5zdGFuY2UgZm9yIG1ldGhvZCBjaGFpbmluZyBkZXNpZ24gcGF0dGVybi5cclxuICAgICAqL1xyXG4gICAgZW50aXR5VHJhbnNmb3JtZXIoKTogVGV4dFRyYW5zZm9ybWVyIHtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICB0ZXh0ID0gdGhpcy50ZXh0Tm9kZS50ZXh0Q29udGVudCxcclxuICAgICAgICAgICAgcGFyZW50ID0gdGhpcy50ZXh0Tm9kZS5wYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodGV4dCAmJiBwYXJlbnQgJiYgcGFyZW50LmxvY2FsTmFtZSAhPT0gXCJjb2RlXCIgJiYgIXBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJtYXRoXCIpKSB7XHJcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgT2JzaWRpYW4gdW5mcmllbmRseSBodG1sIGVudGl0aWVzIGFuZCBjaGFyYWN0ZXJzLlxyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZCA9IHRleHRcclxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8+L2csICfvvJ4nKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzwvZywgJ++8nCcpXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxbL2csICfvvLsnKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXS9nLCAn77y9Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtZWQgIT09IHRleHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dE5vZGUudGV4dENvbnRlbnQgPSB0cmFuc2Zvcm1lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgdXRpbGl0eSBjbGFzcyB0byB0cmFuc2Zvcm0gSFRNTCBpbnRvIHNvbWV0aGluZyBPYnNpZGlhbiBjYW4gc3VjY2Vzc2Z1bGx5XHJcbiAqIHRyYW5zZm9ybSBpbnRvIE1hcmtkb3duLlxyXG4gKlxyXG4gKiBUaGUgbWV0aG9kcyBvZiB0aGlzIHV0aWxpdHkgY2xhc3Mgc3VwcG9ydCBtZXRob2QgY2hhaW5pbmcuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIH5+fnRzXHJcbiAqIGNvbnN0IGxpbnRlciA9IG5ldyBPYnNpZGlhbkhUTUxMaW50ZXIoZG9jdW1lbnQuYm9keSk7XHJcbiAqIGxpbnRlclxyXG4gKiAgICAgLmNsZWFudXBDb2RlQmxvY2soKVxyXG4gKiAgICAgLi4uXHJcbiAqICAgICAuaW5qZWN0Q29kZUJsb2NrKCk7XHJcbiAqIH5+flxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE9ic2lkaWFuSFRNTExpbnRlciB7XHJcbiAgICAvKipcclxuICAgICAqIEEgUmVndWxhciBFeHByZXNzaW9uIHRvIHRlc3QgZm9yIHZhbGlkIEhUTUwgYXR0cmlidXRlIGFuZCBjbGFzcyBuYW1lcy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgVkFMSURBVFRSID0gL15bYS16QS1aXVthLXpBLVpfLV0qJC87XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcm9vdCBvZiBhbiBlbGVtZW50IHRyZWUgdG8gbGludC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBsaW5lZmVlZHMgdG8gYDxjb2RlPmAgYW5kIGA8cHJlPmAgZWxlbWVudHMgdG8gZW5zdXJlIHByb3BlciBPYnNpZGlhbiBjb2RlIGJsb2NrIGZvcm1hdHRpbmcuXHJcbiAgICAgKlxyXG4gICAgICogVGhpcyBjbGVhbnVwIG1ldGhvZCBpcyB1c2VkIHRvIGNoYW5nZSB1bmVjZXNzYXJ5IGA8YnI+YCBlbGVtZW50c1xyXG4gICAgICogdG8gbGluZWZlZWRzIGFuZCBhZGQgbGluZWZlZWRzIGFmdGVyIGA8ZGl2PmBlbGVtZW50cyB0byBwcmVzZXJ2ZSB0aGUgc3RydWN0dXJlIG9mIGA8cHJlPmBcclxuICAgICAqIG9yIGA8Y29kZT5gIGVsZW1lbnRzIGluIE9ic2lkaWFuIGNvZGUgYmxvY2tzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBlbGVtZW50IFRoZSBgPHByZT5gIG9yIGA8Y29kZT5gIGVsbWVudCB0byBwcm9jZXNzLlxyXG4gICAgICogQHJldHVybnMgVGhlIG1vZGlmaWVkIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgc3RhdGljIGV4cGFuZEJSKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIGxldCByZWR1Y2VMaW5lRmVlZHMgPSBmYWxzZVxyXG4gICAgICAgIC8vIFRha2UgaW50byBhY2NvdW50IHRoYXQgYDxkaXY+IGVsZW1lbnRzIGluIHByZWZvcm1hdHRlZCBibG9ja3MgcHJvZHVjZSBsaW5lZmVlZHMuYFxyXG4gICAgICAgIGNvbnN0IGRpdnMgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiZGl2XCIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGl2cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgZGl2ID0gZGl2c1tpXSxcclxuICAgICAgICAgICAgICAgIHBhcmVudCA9IGRpdi5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQuaW5zZXJ0QWZ0ZXIoZWxlbWVudC5kb2MuY3JlYXRlVGV4dE5vZGUoXCJcXG5cIiksIGRpdik7XHJcbiAgICAgICAgICAgICAgICByZWR1Y2VMaW5lRmVlZHMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgYWxsIDxicj4gZWxlbWVudHMgYW5kIHJlcGxhY2UgdGhlbSB3aXRoIGxpbmVmZWVkcy5cclxuICAgICAgICBjb25zdCBicnMgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYnJcIik7XHJcbiAgICAgICAgd2hpbGUgKGJycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICBiciA9IGJyc1swXSxcclxuICAgICAgICAgICAgICAgIHBhcmVudCA9IGJyLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudC5pbnNlcnRBZnRlcihlbGVtZW50LmRvYy5jcmVhdGVUZXh0Tm9kZShcIlxcblwiKSwgYnIpO1xyXG4gICAgICAgICAgICAgICAgcmVkdWNlTGluZUZlZWRzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBici5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChyZWR1Y2VMaW5lRmVlZHMpIHtcclxuICAgICAgICAgICAgIC8vIFJlbW92ZSBhZGRpdGlvbmFsIGVtcHR5IGxpbmVzIHByb2R1Y2VkIGJ5IGRpdnMuXHJcbiAgICAgICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBlbGVtZW50LnRleHRDb250ZW50Py5yZXBsYWNlKC9cXG4rL2csIFwiXFxuXCIpID8/IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGVsZW1lbnQudGV4dENvbnRlbnQgPz8gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlbGVtZW50OyAvLyByZXR1cm4gdGhlIGVsZW1lbnQgZm9yIG1ldGhvZCBjaGFpbmluZy5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zbXV0ZSBgPGF1ZGlvPmAgYW5kICBgPHZpZGVvPmAgdGFncyB0byBgPGltZz5gIHNvIHRoYXQgT2JzaWRpYW4gZW1iZWRzIHRoZW0gcHJvcGVybHkuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmb3IgbWV0aG9kIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBmaXhFbWJlZHMoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhdWRpbyw6bm90KGlmcmFtZSkgPiB2aWRlbyxpbWdcIilcclxuICAgICAgICAgICAgLmZvckVhY2goZWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwic3JjXCIsIGVsLmdldEF0dHJpYnV0ZShcInNyY1wiKT8ucmVwbGFjZSgvIC9nLCBcIiUyMFwiKSA/PyBcIlwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChlbC5sb2NhbE5hbWUgIT09IFwiaW1nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbC5yZXBsYWNlV2l0aChjcmVhdGVFbCgnaW1nJywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM6IGVsLmdldEF0dHJpYnV0ZShcInNyY1wiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdDogZWwuZ2V0QXR0cmlidXRlKCdhbHQnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUHV0IG1lcm1haWQgZGlhZ3JhbXMgaW50byBhIGNvZGUgYmxvY2sgc28gdGhhdCBPYnNpZGlhbiBjYW4gcGljayB0aGVtIHVwLlxyXG4gICAgICpcclxuICAgICogQHJldHVybnMgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmb3IgbWV0aG9kIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBtZXJtYWlkVG9Db2RlQmxvY2soKTogT2JzaWRpYW5IVE1MTGludGVyIHtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBtZXJtYWlkcyA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZXJtYWlkJyksXHJcbiAgICAgICAgICAgIG1lcm1haWRDb3VudCA9IG1lcm1haWRzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXJtYWlkQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBtZXJtYWlkID0gbWVybWFpZHNbaV07XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG1lcm1haWQubG9jYWxOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb2RlJzpcclxuICAgICAgICAgICAgICAgICAgICBtZXJtYWlkLmNsYXNzTGlzdC5hZGQoJ2xhbmd1YWdlLW1lcm1haWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXJtYWlkUGFyZW50ID0gbWVybWFpZC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXJtYWlkUGFyZW50ICYmIG1lcm1haWRQYXJlbnQubG9jYWxOYW1lICE9PSAncHJlJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmUgPSBtZXJtYWlkLmRvYy5jcmVhdGVFbGVtZW50KCdwcmUnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVybWFpZFBhcmVudC5pbnNlcnRCZWZvcmUocHJlLCBtZXJtYWlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlLmFwcGVuZChtZXJtYWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAncHJlJzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWVybWFpZC5maXJzdEVsZW1lbnRDaGlsZD8ubG9jYWxOYW1lICE9PSAnY29kZScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIGEgY29kZSBibG9jayBmb3IgdGhpcyBkaWFncmFtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBtZXJtYWlkLmRvYy5jcmVhdGVFbGVtZW50KCdjb2RlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGUuY2xhc3NOYW1lID0gJ2xhbmd1YWdlLW1lcm1haWQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobWVybWFpZC5maXJzdENoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLmFwcGVuZChtZXJtYWlkLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lcm1haWQuYXBwZW5kKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgZW50aXJlIG1lcm1haWQgc3ViLXN0cnVjdHVyZS5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmUgPSBtZXJtYWlkLmRvYy5jcmVhdGVFbGVtZW50KCdwcmUnKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZSA9IG1lcm1haWQuZG9jLmNyZWF0ZUVsZW1lbnQoJ2NvZGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlLmNsYXNzTmFtZSA9ICdsYW5ndWFnZS1tZXJtYWlkJztcclxuICAgICAgICAgICAgICAgICAgICBwcmUuYXBwZW5kKGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChtZXJtYWlkLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZS5hcHBlbmQobWVybWFpZC5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbWVybWFpZC5hcHBlbmQocHJlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2NhbiBmb3IgYDxjb2RlPmAgYmxvY2tzIGFuZCBtYWtlIHRoZW0gT2JzaWRpYW4gZnJpZW5kbHkuXHJcbiAgICAgKlxyXG4gICAgICogQXBwbGllZCBUcmFuc2Zvcm1hdGlvbnM6XHJcbiAgICAgKiAtIFJlcGxhY2luZyBhbGwgYDxicj5gIGVsZW1lbnRzIGJ5IGxpbmVmZWVkcy5cclxuICAgICAqIC0gdHJhbnNmb3JtaW5nIEhUTUwgY29kZSB0byBwbGFpbiB0ZXh0LiBBcyBmb3JtYXR0aW5nIGFuZCBzeW50YXggaGlnaGxpZ2h0aW5nIHdpbGwgYmVcclxuICAgICAqICAgZG9uZSBieSBPYnNpZGlhbi5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZvciBtZXRob2QgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIGNsZWFudXBDb2RlQmxvY2soKTogT2JzaWRpYW5IVE1MTGludGVyIHtcclxuICAgICAgICBjb25zdCBjb2RlQmxvY2tzID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY29kZVwiKTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRvIGNoZWNrIHRoZSBsZW5ndGggZXZlcnkgdGltZSB0byBoYW5kbGVcclxuICAgICAgICAvLyBuZXN0ZWQgPHByZT4gdGFncy5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvZGVCbG9ja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY29kZSA9IGNvZGVCbG9ja3NbaV07XHJcbiAgICAgICAgICAgIE9ic2lkaWFuSFRNTExpbnRlci5leHBhbmRCUihjb2RlKTtcclxuICAgICAgICAgICAgY29uc3QgY29kZVR4dCA9IGNvZGUudGV4dENvbnRlbnQ/LnRyaW0oKSA/PyBcIlwiO1xyXG4gICAgICAgICAgICBjb2RlLnRleHRDb250ZW50ID0gY29kZVR4dDtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gY29kZS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoXCJwcmVcIiA9PT0gcGFyZW50Py5sb2NhbE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByZVR4dCA9IHBhcmVudC5pbm5lclRleHQudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZVR4dC5sZW5ndGggPT09IGNvZGVUeHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlcGxhY2VDaGlsZHJlbihjb2RlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVjdCBlbGVtZW50cyB3aGljaCBhcmUgbW9zdCBsaWtlbHkgY29kZS5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZvciBtZXRob2QgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIGRldGVjdENvZGUoKTogT2JzaWRpYW5IVE1MTGludGVyIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLXN5bnRheC1sYW5ndWFnZV0sW2NsYXNzKj1jb2RlXVwiKVxyXG4gICAgICAgICAgICAuZm9yRWFjaChlID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIGlkZW50aWZ5IHRoZSA8Y29kZT4gZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgbGV0IGNvZGUgPSBlLmxvY2FsTmFtZSA9PT0gXCJjb2RlXCJcclxuICAgICAgICAgICAgICAgICAgICA/IGVcclxuICAgICAgICAgICAgICAgICAgICA6IGUucXVlcnlTZWxlY3RvckFsbChcInByZSA+IGNvZGVcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBtdXN0IG1ha2UgYSBgPGNvZGU+YCBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgT2JzaWRpYW5IVE1MTGludGVyLmV4cGFuZEJSKGUgYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGVUeHQgPSBlLnRleHRDb250ZW50Py50cmltKCkgPz8gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlID0gZS5kb2MuY3JlYXRlRWxlbWVudChcImNvZGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByZSA9IGUubG9jYWxOYW1lID09PSBcInByZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGUucXVlcnlTZWxlY3RvcihcInByZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZS5hcHBlbmQoY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbXVzdCBtYWtlIGEgYDxwcmU+YCBlbGVtZW50IHRvby5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlID0gZS5kb2MuY3JlYXRlRWxlbWVudChcInByZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlLmFwcGVuZChjb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZS5yZXBsYWNlQ2hpbGRyZW4ocHJlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZS50ZXh0Q29udGVudCA9IGNvZGVUeHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYW5nID0gZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXN5bnRheC1sYW5ndWFnZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChsYW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFuZ0NsYXNzID0gXCJsYW5ndWFnZS1cIiArIGxhbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlLmNsYXNzTmFtZSA9IGxhbmdDbGFzcztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29kZSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PikuZm9yRWFjaChjID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMuY2xhc3NOYW1lID0gbGFuZ0NsYXNzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYW51cCBpbmNvcnJlY3RseSB1c2VkICc8Y29kZT4nIGVsZW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIENsZWFudXAgQ3JpdGVyaWE6IElmIHRoZXJlIGFyZSBuZXN0ZWQgYDxjb2RlPmAgb3IgYDxwcmU+YCBlbGVtZW50cyBpbnNpZGUgYSBgPGNvZGU+YGVsZW1lbnQsXHJcbiAgICAgKiB0aGUgb3V0ZXIgYDxjb2RlPmAgZWxlbWVudCBpcyBjb252ZXJ0ZWQgdG8gYSBgPGRpdj5gLlxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgZm9yIG1ldGhvZCBjaGFpbmluZy5cclxuICAgICAqL1xyXG4gICAgY2xlYW51cEZha2VDb2RlKCk6IE9ic2lkaWFuSFRNTExpbnRlciB7XHJcbiAgICAgICAgY29uc3QgZmFrZUNvZGUgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcImNvZGU6aGFzKGNvZGUpLGNvZGU6aGFzKHByZSlcIik7XHJcbiAgICAgICAgZmFrZUNvZGUuZm9yRWFjaChjb2RlID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gY29kZS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXYgPSBjb2RlLmRvYy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShkaXYsIGNvZGUpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNvZGUuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpdi5hcHBlbmQoY29kZS5maXJzdENoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvZGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFuIEhUTUwgdHJhbnNmb3JtYXRpb24gbG9va2luZyBmb3IgYDxwcmU+YCB0YWdzIHdoaWNoIGFyZSAqKm5vdCoqIGZvbGxvd2VkIGJ5IGEgYDxjb2RlPmAgYmxvY2tcclxuICAgICAqIGFuZCBpbmplY3RzIG9uZS5cclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGFkZHJlc3NlcyB0aGUgY2FzZSB3aGVyZSBzeW50YXggaGlnaGxpZ2h0ZWQgY29kZSBpc1xyXG4gICAgICogZXhwcmVzc2VkIGFzIEhUTUwgYW5kIGp1c3Qgc3R1Y2sgaW50byBhIGA8cHJlPmAgYmxvY2suXHJcbiAgICAgKlxyXG4gICAgICogV2l0aG91dCB0aGF0IGA8Y29kZT5gIGVsZW1lbnQgT2JzaWRpYW4gd2lsbCBub3QgZ2VuZXJhdGUgYSBNYXJrZG93biBjb2RlIGJsb2NrIGFuZCBpbnN0ZWFkIG9iZnVzY2F0ZXNcclxuICAgICAqIGFueSBjb2RlIGNvbnRhaW5lZCBpbiB0aGF0ICc8cHJlPicuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmb3IgbWV0aG9kIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBpbmplY3RDb2RlQmxvY2soKTogT2JzaWRpYW5IVE1MTGludGVyIHtcclxuICAgICAgICBjb25zdCBwcmVzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJwcmU6bm90KDpoYXMoY29kZSkpXCIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwcmUgPSBwcmVzW2ldIGFzIEhUTUxQcmVFbGVtZW50O1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgY29kZSA9IHRoaXMuZWxlbWVudC5kb2MuY3JlYXRlRWxlbWVudCgnY29kZScpLFxyXG4gICAgICAgICAgICAgICAgcHJlQ2xhc3NlcyA9IEFycmF5LmZyb20ocHJlLmNsYXNzTGlzdCksXHJcbiAgICAgICAgICAgICAgICBsYW5nID0gcHJlQ2xhc3Nlcy5maWx0ZXIoY2wgPT4gY2wuY29udGFpbnMoXCJsYW5ndWFnZS1cIikgfHwgY2wuY29udGFpbnMoXCJsYW5nLVwiKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGFuZy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgY29kZS5jbGFzc05hbWUgPSBwcmVDbGFzc2VzWzBdO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvZGUuY2xhc3NOYW1lID0gJ2xhbmd1YWdlLXVuZGVmaW5lZCc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvZGUudGV4dENvbnRlbnQgPSBPYnNpZGlhbkhUTUxMaW50ZXIuZXhwYW5kQlIocHJlKS50ZXh0Q29udGVudD8udHJpbSgpID8/IFwiXCI7XHJcbiAgICAgICAgICAgIHByZS5yZXBsYWNlQ2hpbGRyZW4oY29kZSk7XHJcbiAgICAgICAgICAgIHByZS5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgZmxhdHRlblNpbmdsZVJvd1RhYmxlKHRhYmxlOiBIVE1MVGFibGVFbGVtZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHRycyA9IHRhYmxlLnF1ZXJ5U2VsZWN0b3JBbGwoXCI6c2NvcGUgPiB0Ym9keSA+IHRyXCIpOyAvLyB0aGlzIGlzIHN0YXRpY1xyXG4gICAgICAgIGlmICh0cnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdHJzID0gdGFibGUucXVlcnlTZWxlY3RvckFsbChcIjpzY29wZSA+IHRyXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHJzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIHRyc1swXS5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gdGRcIikuZm9yRWFjaCh0ZCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBob2lzdCBlYWNoIHRkIGJlZm9yZSB0aGUgdGFibGVcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlY3Rpb24gPSB0YWJsZS5kb2MuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICB0YWJsZS5wYXJlbnRFbGVtZW50Py5pbnNlcnRCZWZvcmUoc2VjdGlvbiwgdGFibGUpO1xyXG4gICAgICAgICAgICAgICAgLy8gbW92ZSBhbGwgY2hpbGRyZW4gb2YgdGQgaW50byB0aGUgc2VjdGlvblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRkLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHRkLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGFibGUucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGbGF0dGVuIHNpbmdsZSByb3cgdGFibGVzIGludG8gYSBzZXF1ZW5jZSBvZiBgPHNlY3Rpb24+YCBlbGVtZW50cy5cclxuICAgICAqXHJcbiAgICAgKiBBdm9pZHMgT2JzaWRpYW4gaGF2aW5nIHRvIGRlYWwgd2l0aCBjb21wbGV4IHRhYmxlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyBpbnN0YW5jZSBvZiB0aGlzIGNsYXNzIGZvciBtZXRob2QgY2hhaW5pbmcuXHJcbiAgICAgKi9cclxuICAgIGZsYXR0ZW5UYWJsZXMoKTogT2JzaWRpYW5IVE1MTGludGVyIHtcclxuICAgICAgICBjb25zdCB0YWJsZXMgPSBBcnJheS5mcm9tPEhUTUxUYWJsZUVsZW1lbnQ+KHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRhYmxlXCIpKTtcclxuICAgICAgICB0YWJsZXMuZm9yRWFjaCh0YWJsZSA9PiBPYnNpZGlhbkhUTUxMaW50ZXIuZmxhdHRlblNpbmdsZVJvd1RhYmxlKHRhYmxlKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2NhblRleHQobm9kZTogTm9kZSwgdHJhbnNmb3JtZXI6IFRUZXh0VHJhbnNmb3JtZXJDYWxsYmFjaykge1xyXG4gICAgICAgIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKG4gPT4ge1xyXG4gICAgICAgICAgICBpZiAobi5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWVyKG5ldyBUZXh0VHJhbnNmb3JtZXIobikpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgT2JzaWRpYW5IVE1MTGludGVyLnNjYW5UZXh0KG4sIHRyYW5zZm9ybWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbHkgdGV4dCB0cmFuc2Zvcm1hdGlvbnMgdG8gYWxsIHRleHQgbm9kZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRyYW5zZm9ybWVyIFRoZSB0ZXh0IHRyYW5zZm9ybWVyIGZ1bmN0aW9uLlxyXG4gICAgICpcclxuICAgICogQHJldHVybnMgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmb3IgbWV0aG9kIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICB0cmFuc2Zvcm1UZXh0KHRyYW5zZm9ybWVyOiBUVGV4dFRyYW5zZm9ybWVyQ2FsbGJhY2spOiBPYnNpZGlhbkhUTUxMaW50ZXIge1xyXG4gICAgICAgIE9ic2lkaWFuSFRNTExpbnRlci5zY2FuVGV4dCh0aGlzLmVsZW1lbnQsIHRyYW5zZm9ybWVyKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZpeCBgPGltZz5gIGVsZW1udHMgd2l0aG91dCAnc3JjJyBhdHRyaWJ1dGUgZW5jbG9zZWQgaW4gYSBgPHBpY3R1cmU+YCBlbGVtZW50LlxyXG4gICAgICpcclxuICAgICAqIFRoZSBmaXggaXMgdG8gdXNlIGFuIGltYWdlIHVybCBmcm9tIHRoZSBgc3Jjc2V0YCBhdHRpYnV0ZSBvZiB0aGUgZW5jbG9zaW5nIGA8cGljdHVyZT5gXHJcbiAgICAgKiBlbGVtZW50IGFuZCBhZGQgaXQgdG8gIHRoZSBgPGltZz5gXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmb3IgbWV0aG9kIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBmaXhJbWFnZXNXaXRob3V0U3JjKCk6IE9ic2lkaWFuSFRNTExpbnRlciB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJwaWN0dXJlID4gaW1nOm5vdChbc3JjXVwiKS5mb3JFYWNoKGltZyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZXMgPSBpbWcucGFyZW50RWxlbWVudD8uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzb3VyY2VcIik7XHJcbiAgICAgICAgICAgIGlmIChzb3VyY2VzICYmIHNvdXJjZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3Jjc2V0ID0gc291cmNlc1swXS5nZXRBdHRyaWJ1dGUoXCJzcmNzZXRcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3Jjc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5qZWN0IGEgc3JjIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgc3Jjc2V0LnNsaWNlKDAsIHNyY3NldC5pbmRleE9mKFwiIFwiKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWN1cnNpdmVseSBzY2FuIGFuIGVsZW1lbnQgdHJlZSBhbmQgY2FsbCBhIHZpc2l0b3IgZnVuY3Rpb24gb24gZWFjaCBlbGVtZW50LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBlbGVtZW50IHRoZSByb290IG9mIHRoZSBlbGVtZW50IHRyZWUgdG8gc2Nhbi5cclxuICAgICAqIEBwYXJhbSB2aXNpdG9yIHRoZSBmdW5jdHRpb24gdG8gY2FsbC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgc2NhbkVsZW1lbnRzKGVsZW1lbnQ6IEVsZW1lbnQsIHZpc2l0b3I6IFRFbGVtZW50VmlzaXRvcikge1xyXG4gICAgICAgIHZpc2l0b3IoZWxlbWVudCk7XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBlbGVtZW50LmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudC5jaGlsZEVsZW1lbnRDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIE9ic2lkaWFuSFRNTExpbnRlci5zY2FuRWxlbWVudHMoY2hpbGRyZW5baV0sIHZpc2l0b3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBvciBjbGVhbiB0aGUgYXR0cmlidXRlcyBvZiBIVE1MIGVsZW1lbnRzLlxyXG4gICAgICpcclxuICAgICAqIFRoaXMgc2hvdWxkIGJlIGNhbGxlZCBlYXJseSBpbiB0aGUgcHJvY2VzcyBzbyB0aGF0IGRvd25zdHJlYW1cclxuICAgICAqIGNvZGUgZG9lcyBub3QgY2hva2UuXHJcbiAgICAgKlxyXG4gICAgICogQWN0aW9ucyB0YWtlbjpcclxuICAgICAqIC0gUmVtb3ZlIEF0dHJpYnV0ZXMgd2hpY2ggaGF2ZSBpbGxlZ2FsIG5hbWVzLlxyXG4gICAgICogLSBNYWtlIGNsYXNzZXMgdGhhdCBoaW50IGF0IGNvZGUgZXhwbGljaXQuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcyBmb3IgbWV0aG9kIGNoYWluaW5nLlxyXG4gICAgICovXHJcbiAgICBjbGVhbkF0dHJpYnV0ZXMoKTogT2JzaWRpYW5IVE1MTGludGVyIHtcclxuICAgICAgICBPYnNpZGlhbkhUTUxMaW50ZXIuc2NhbkVsZW1lbnRzKHRoaXMuZWxlbWVudCwgKGU6IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3RcclxuICAgICAgICAgICAgICAgIGlsbGVnYWxOYW1lcyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgYXR0cmlicyA9IGUuYXR0cmlidXRlcyxcclxuICAgICAgICAgICAgICAgIGF0dENvdW50ID0gYXR0cmlicy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF0dENvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0ID0gYXR0cmlic1tpXSxcclxuICAgICAgICAgICAgICAgICAgICBuYW1lID0gYXR0Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIU9ic2lkaWFuSFRNTExpbnRlci5WQUxJREFUVFIudGVzdChuYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlsbGVnYWxOYW1lcy5wdXNoKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuYW1lID09PSBcImNsYXNzXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBkZXRlY3QgYW5kIHJldGFpbiBjb2RlIHJlbGF0ZWQgY2xhc3Nlcy5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gYXR0LnZhbHVlLnNwbGl0KFwiIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgbkNvZGVBdHRzID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAga2VlcDogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGNsID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjbC5jb250YWlucyhcImNvZGVcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuQ29kZUF0dHMrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoT2JzaWRpYW5IVE1MTGludGVyLlZBTElEQVRUUi50ZXN0KGNsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoYXQgYXBwZWFycyB0byBiZSBhIGdvb2QgY2xhc3MgbmFtZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZWVwLnB1c2goY2wpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobkNvZGVBdHRzID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHN1cmUgd2Uga2VlcCB0aGUgJ2NvZGUnIGNsYXNzIG5hbWUsIHNvIHRoYXQgd2UgY2FuIGZpbmQgdGhpcyBlbGVtZW50IGRvd25zdHJlYW0uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlZXAucHVzaChcImNvZGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlIG5vdyByZW1vdmUgYWxsIGhpZ2hsaWdodCBjbGFzc2VzIHRvIGF2b2lkIGNvbmZ1c2lvbiBpbiB0aGUgZXh0cmFjdG9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZWVwID0ga2VlcC5maWx0ZXIoY2wgPT4gIWNsLmNvbnRhaW5zKFwiaGlnaGxpZ2h0XCIpICYmICFjbC5jb250YWlucyhcImhsanNcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2VlcC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGtlZXAgb25seSBjaGVja2VkIGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0LnZhbHVlID0ga2VlcC5qb2luKFwiIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIGNsYXNzIGF0dHJpYnV0ZSBhcyBpdCBpcyBlbXB0eS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWxsZWdhbE5hbWVzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBpbGxlZ2FsTmFtZXMpIHtcclxuICAgICAgICAgICAgICAgIGUucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIl19