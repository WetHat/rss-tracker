export declare type TTextTransformerCallback = (transformer: TextTransformer) => void;
export declare class TextTransformer {
    private textNode;
    constructor(text: Node);
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
    mathTransformer(): TextTransformer;
    /**
     * Change dom characters which interfere with Onsidian to Unicode Lookalikes.
     *
     * @returns This instance for method chaining design pattern.
     */
    entityTransformer(): TextTransformer;
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
export declare class ObsidianHTMLLinter {
    /**
     * A Regular Expression to test for valid HTML attribute and class names.
     */
    private static VALIDATTR;
    /**
     * The root of an element tree to lint.
     */
    private element;
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
    private static expandBR;
    constructor(element: HTMLElement);
    /**
     * Transmute `<audio>` and  `<video>` tags to `<img>` so that Obsidian embeds them properly.
     *
     * @returns instance of this class for method chaining.
     */
    fixEmbeds(): this;
    /**
     * Put mermaid diagrams into a code block so that Obsidian can pick them up.
     *
    * @returns instance of this class for method chaining.
     */
    mermaidToCodeBlock(): ObsidianHTMLLinter;
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
    cleanupCodeBlock(): ObsidianHTMLLinter;
    /**
     * Detect elements which are most likely code.
     *
     * @returns instance of this class for method chaining.
     */
    detectCode(): ObsidianHTMLLinter;
    /**
     * Cleanup incorrectly used '<code>' elements.
     *
     * Cleanup Criteria: If there are nested `<code>` or `<pre>` elements inside a `<code>`element,
     * the outer `<code>` element is converted to a `<div>`.
     *
     * @returns instance of this class for method chaining.
     */
    cleanupFakeCode(): ObsidianHTMLLinter;
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
    injectCodeBlock(): ObsidianHTMLLinter;
    private static flattenSingleRowTable;
    /**
     * Flatten single row tables into a sequence of `<section>` elements.
     *
     * Avoids Obsidian having to deal with complex tables.
     *
     * @returns instance of this class for method chaining.
     */
    flattenTables(): ObsidianHTMLLinter;
    private static scanText;
    /**
     * Apply text transformations to all text nodes.
     *
     * @param transformer - The text transformer function.
     *
    * @returns instance of this class for method chaining.
     */
    transformText(transformer: TTextTransformerCallback): ObsidianHTMLLinter;
    /**
     * Fix `<img>` elemnts without 'src' attribute enclosed in a `<picture>` element.
     *
     * The fix is to use an image url from the `srcset` attibute of the enclosing `<picture>`
     * element and add it to  the `<img>`
     *
     * @returns instance of this class for method chaining.
     */
    fixImagesWithoutSrc(): ObsidianHTMLLinter;
    /**
     * Recursively scan an element tree and call a visitor function on each element.
     *
     * @param element - the root of the element tree to scan.
     * @param visitor - the functtion to call.
     */
    private static scanElements;
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
    cleanAttributes(): ObsidianHTMLLinter;
}
