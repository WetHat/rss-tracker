import { __awaiter } from "tslib";
import { addTransformations, extractFromHtml, getSanitizeHtmlOptions, setSanitizeHtmlOptions } from "@extractus/article-extractor";
import { htmlToMarkdown } from "obsidian";
import { ObsidianHTMLLinter } from "./HTMLLint";
export function formatImage(image) {
    const { src, width, height } = image;
    return `![image|float:right|400](${src})`;
}
/**
 * A singleton utility class to cleanup and translate HTML to Obsidian Markdown.
 */
export class HTMLxlate {
    constructor() {
        this.parser = new DOMParser();
        // configure the article extractor to make the returned content
        // more Obsidian friendly
        const tm = {
            patterns: [
                /.*/ // apply to all websites
            ],
            pre: document => {
                const linter = new ObsidianHTMLLinter(document.body);
                linter
                    .fixImagesWithoutSrc()
                    .fixEmbeds()
                    .cleanAttributes()
                    .cleanupFakeCode()
                    .detectCode()
                    .injectCodeBlock()
                    .cleanupCodeBlock();
                return document;
            },
            post: document => {
                // look for <pre> tags and make sure their first child is always a <code> tag.
                const linter = new ObsidianHTMLLinter(document.body);
                linter
                    .flattenTables()
                    .transformText(tm => {
                    tm
                        .mathTransformer()
                        .entityTransformer();
                });
                return document;
            }
        };
        addTransformations([tm]);
        const opts = getSanitizeHtmlOptions(), allowedAttributes = opts.allowedAttributes;
        if (!Array.isArray(allowedAttributes.code)) {
            allowedAttributes.code = [];
        }
        allowedAttributes.code.push("class");
        setSanitizeHtmlOptions({
            allowedAttributes: allowedAttributes
        });
    }
    /**
     * Get the singleton instance of the importer.
     * @returns Importer instance.
     */
    static get instance() {
        if (!HTMLxlate._instance) {
            HTMLxlate._instance = new HTMLxlate();
        }
        return HTMLxlate._instance;
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
    fragmentAsMarkdown(html) {
        html = html.trim();
        // some quick plausibility check to determine if this actually already markdown.
        if (!html.startsWith("<") && html.match(/```|~~~|^\s*#+\s+[^#]$|\]\([^\]\[\)]+\)/)) {
            return html;
        }
        const doc = this.parser.parseFromString(html, "text/html"), linter = new ObsidianHTMLLinter(doc.body);
        linter
            .flattenTables()
            .cleanupFakeCode()
            .injectCodeBlock()
            .cleanupCodeBlock()
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
    articleAsMarkdown(html, baseUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const article = yield extractFromHtml(html, baseUrl);
            if (!article) {
                return null;
            }
            const { title, content } = article;
            return "\n# "
                + (title !== null && title !== void 0 ? title : "Downloaded Article")
                + " ⬇️"
                + "\n\n"
                + (content ? htmlToMarkdown(content) : "-");
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSFRNTHhsYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0hUTUx4bGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUErQixrQkFBa0IsRUFBRSxlQUFlLEVBQUUsc0JBQXNCLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNoSyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRTFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUVoRCxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQWlCO0lBQ3pDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEtBQW1CLENBQUM7SUFDbkQsT0FBTyw0QkFBNEIsR0FBRyxHQUFHLENBQUM7QUFDOUMsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFlbEI7UUFaUSxXQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQWE3QiwrREFBK0Q7UUFDL0QseUJBQXlCO1FBQ3pCLE1BQU0sRUFBRSxHQUFtQjtZQUN2QixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxDQUFDLHdCQUF3QjthQUNoQztZQUNELEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRTtnQkFDWixNQUFNLE1BQU0sR0FBRyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckQsTUFBTTtxQkFDRCxtQkFBbUIsRUFBRTtxQkFDckIsU0FBUyxFQUFFO3FCQUNYLGVBQWUsRUFBRTtxQkFDakIsZUFBZSxFQUFFO3FCQUNqQixVQUFVLEVBQUU7cUJBQ1osZUFBZSxFQUFFO3FCQUNqQixnQkFBZ0IsRUFBRSxDQUFDO2dCQUN4QixPQUFPLFFBQVEsQ0FBQztZQUNwQixDQUFDO1lBQ0QsSUFBSSxFQUFFLFFBQVEsQ0FBQyxFQUFFO2dCQUNiLDhFQUE4RTtnQkFDOUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JELE1BQU07cUJBQ0QsYUFBYSxFQUFFO3FCQUNmLGFBQWEsQ0FBRSxFQUFFLENBQUMsRUFBRTtvQkFDakIsRUFBRTt5QkFDRyxlQUFlLEVBQUU7eUJBQ2pCLGlCQUFpQixFQUFFLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sUUFBUSxDQUFDO1lBQ3BCLENBQUM7U0FDSixDQUFDO1FBQ0Ysa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE1BQ0ksSUFBSSxHQUFHLHNCQUFzQixFQUFFLEVBQy9CLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztRQUUvQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVyQyxzQkFBc0IsQ0FBQztZQUNuQixpQkFBaUIsRUFBRSxpQkFBaUI7U0FDdkMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQXhERDs7O09BR0c7SUFDSCxNQUFNLEtBQUssUUFBUTtRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO1lBQ3RCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztTQUN6QztRQUNELE9BQU8sU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUMvQixDQUFDO0lBaUREOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsa0JBQWtCLENBQUMsSUFBWTtRQUMzQixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25CLGdGQUFnRjtRQUNoRixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLEVBQUU7WUFDaEYsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQ0ksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsRUFDcEQsTUFBTSxHQUFHLElBQUksa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLE1BQU07YUFDRCxhQUFhLEVBQUU7YUFDZixlQUFlLEVBQUU7YUFDakIsZUFBZSxFQUFFO2FBQ2pCLGdCQUFnQixFQUFFO2FBQ2xCLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNoQixFQUFFO2lCQUNHLGVBQWUsRUFBRTtpQkFDakIsaUJBQWlCLEVBQUUsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQztRQUVQLE9BQU8sY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDRyxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsT0FBZTs7WUFDakQsTUFBTSxPQUFPLEdBQXVCLE1BQU0sZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNWLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFFRCxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQztZQUVuQyxPQUFPLE1BQU07a0JBQ1AsQ0FBQyxLQUFLLGFBQUwsS0FBSyxjQUFMLEtBQUssR0FBSSxvQkFBb0IsQ0FBQztrQkFDL0IsS0FBSztrQkFDTCxNQUFNO2tCQUNOLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELENBQUM7S0FBQTtDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJ0aWNsZURhdGEsIFRyYW5zZm9ybWF0aW9uLCBhZGRUcmFuc2Zvcm1hdGlvbnMsIGV4dHJhY3RGcm9tSHRtbCwgZ2V0U2FuaXRpemVIdG1sT3B0aW9ucywgc2V0U2FuaXRpemVIdG1sT3B0aW9ucyB9IGZyb20gXCJAZXh0cmFjdHVzL2FydGljbGUtZXh0cmFjdG9yXCI7XHJcbmltcG9ydCB7IGh0bWxUb01hcmtkb3duIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7IElSc3NNZWRpdW0gfSBmcm9tIFwiLi9GZWVkQXNzZW1ibGVyXCI7XHJcbmltcG9ydCB7IE9ic2lkaWFuSFRNTExpbnRlciB9IGZyb20gXCIuL0hUTUxMaW50XCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0SW1hZ2UoaW1hZ2U6IElSc3NNZWRpdW0pOiBzdHJpbmcge1xyXG4gICAgY29uc3QgeyBzcmMsIHdpZHRoLCBoZWlnaHQgfSA9IGltYWdlIGFzIElSc3NNZWRpdW07XHJcbiAgICByZXR1cm4gYCFbaW1hZ2V8ZmxvYXQ6cmlnaHR8NDAwXSgke3NyY30pYDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgc2luZ2xldG9uIHV0aWxpdHkgY2xhc3MgdG8gY2xlYW51cCBhbmQgdHJhbnNsYXRlIEhUTUwgdG8gT2JzaWRpYW4gTWFya2Rvd24uXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgSFRNTHhsYXRlIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9pbnN0YW5jZT86IEhUTUx4bGF0ZTtcclxuXHJcbiAgICBwcml2YXRlIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgdGhlIGltcG9ydGVyLlxyXG4gICAgICogQHJldHVybnMgSW1wb3J0ZXIgaW5zdGFuY2UuXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgaW5zdGFuY2UoKTogSFRNTHhsYXRlIHtcclxuICAgICAgICBpZiAoIUhUTUx4bGF0ZS5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgSFRNTHhsYXRlLl9pbnN0YW5jZSA9IG5ldyBIVE1MeGxhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEhUTUx4bGF0ZS5faW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvLyBjb25maWd1cmUgdGhlIGFydGljbGUgZXh0cmFjdG9yIHRvIG1ha2UgdGhlIHJldHVybmVkIGNvbnRlbnRcclxuICAgICAgICAvLyBtb3JlIE9ic2lkaWFuIGZyaWVuZGx5XHJcbiAgICAgICAgY29uc3QgdG06IFRyYW5zZm9ybWF0aW9uID0ge1xyXG4gICAgICAgICAgICBwYXR0ZXJuczogW1xyXG4gICAgICAgICAgICAgICAgLy4qLyAvLyBhcHBseSB0byBhbGwgd2Vic2l0ZXNcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlOiBkb2N1bWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW50ZXIgPSBuZXcgT2JzaWRpYW5IVE1MTGludGVyKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgICAgICAgICAgbGludGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpeEltYWdlc1dpdGhvdXRTcmMoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maXhFbWJlZHMoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jbGVhbkF0dHJpYnV0ZXMoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jbGVhbnVwRmFrZUNvZGUoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5kZXRlY3RDb2RlKClcclxuICAgICAgICAgICAgICAgICAgICAuaW5qZWN0Q29kZUJsb2NrKClcclxuICAgICAgICAgICAgICAgICAgICAuY2xlYW51cENvZGVCbG9jaygpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3N0OiBkb2N1bWVudCA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBsb29rIGZvciA8cHJlPiB0YWdzIGFuZCBtYWtlIHN1cmUgdGhlaXIgZmlyc3QgY2hpbGQgaXMgYWx3YXlzIGEgPGNvZGU+IHRhZy5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbnRlciA9IG5ldyBPYnNpZGlhbkhUTUxMaW50ZXIoZG9jdW1lbnQuYm9keSk7XHJcbiAgICAgICAgICAgICAgICBsaW50ZXJcclxuICAgICAgICAgICAgICAgICAgICAuZmxhdHRlblRhYmxlcygpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRyYW5zZm9ybVRleHQoIHRtID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXRoVHJhbnNmb3JtZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGl0eVRyYW5zZm9ybWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGFkZFRyYW5zZm9ybWF0aW9ucyhbdG1dKTtcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBvcHRzID0gZ2V0U2FuaXRpemVIdG1sT3B0aW9ucygpLFxyXG4gICAgICAgICAgICBhbGxvd2VkQXR0cmlidXRlcyA9IG9wdHMuYWxsb3dlZEF0dHJpYnV0ZXM7XHJcblxyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhbGxvd2VkQXR0cmlidXRlcy5jb2RlKSkge1xyXG4gICAgICAgICAgICBhbGxvd2VkQXR0cmlidXRlcy5jb2RlID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFsbG93ZWRBdHRyaWJ1dGVzLmNvZGUucHVzaChcImNsYXNzXCIpO1xyXG5cclxuICAgICAgICBzZXRTYW5pdGl6ZUh0bWxPcHRpb25zKHtcclxuICAgICAgICAgICAgYWxsb3dlZEF0dHJpYnV0ZXM6IGFsbG93ZWRBdHRyaWJ1dGVzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUcmFuc2xhdGUgYW4gSFRNTCBmcmFnbWVudCB0byBNYXJrZG93biB0ZXh0LlxyXG4gICAgICpcclxuICAgICAqIEZvbGxvd2luZyBIVE1MIGNsZWFudXAgcnVsZXMgYXJlIGN1cnJlbnRseSBhcHBsaWVkLlxyXG4gICAgICogLSBGbGF0dGVuIHRhYmxlcyB3aGljaCBjb250YWluIG9ubHkgYSBzaW5nbGUgcm93IGludG8gYSBgc2VjdGlvbmAgZm9yIGVhY2ggYHRkYFxyXG4gICAgICpcclxuICAgICAqICoqTm90ZXMqKjpcclxuICAgICAqIC0gVGhpcyBhZGRyZXNzZXMgbmVzdGVkIHRhYmxlcyBpbiB0aGUgJ05vZGUgV2Vla2x5JyBmZWVkLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBodG1sIEEgSFRNTCBmcmFnbWVudCBzdHJpbmdcclxuICAgICAqIEByZXR1cm4gVGhlIG1hcmtkb3duIHRleHQgZ2VuZXJhdGVkIGZyb20gdGhlIEhUTUwgZnJhZ21lbnQuXHJcbiAgICAgKi9cclxuICAgIGZyYWdtZW50QXNNYXJrZG93bihodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGh0bWwgPSBodG1sLnRyaW0oKTtcclxuICAgICAgICAvLyBzb21lIHF1aWNrIHBsYXVzaWJpbGl0eSBjaGVjayB0byBkZXRlcm1pbmUgaWYgdGhpcyBhY3R1YWxseSBhbHJlYWR5IG1hcmtkb3duLlxyXG4gICAgICAgIGlmICghaHRtbC5zdGFydHNXaXRoKFwiPFwiKSAmJiBodG1sLm1hdGNoKC9gYGB8fn5+fF5cXHMqIytcXHMrW14jXSR8XFxdXFwoW15cXF1cXFtcXCldK1xcKS8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBkb2MgPSB0aGlzLnBhcnNlci5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIiksXHJcbiAgICAgICAgICAgIGxpbnRlciA9IG5ldyBPYnNpZGlhbkhUTUxMaW50ZXIoZG9jLmJvZHkpO1xyXG4gICAgICAgIGxpbnRlclxyXG4gICAgICAgICAgICAuZmxhdHRlblRhYmxlcygpXHJcbiAgICAgICAgICAgIC5jbGVhbnVwRmFrZUNvZGUoKVxyXG4gICAgICAgICAgICAuaW5qZWN0Q29kZUJsb2NrKClcclxuICAgICAgICAgICAgLmNsZWFudXBDb2RlQmxvY2soKVxyXG4gICAgICAgICAgICAudHJhbnNmb3JtVGV4dCh0bSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0bVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXRoVHJhbnNmb3JtZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5lbnRpdHlUcmFuc2Zvcm1lcigpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGh0bWxUb01hcmtkb3duKGRvYy5ib2R5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEV4cmFjdCB0aGUgbWFpbiBhcnRpY2xlIGZyb20gYW4gSFRNTCBkb2N1bWVudFxyXG4gICAgICogQHBhcmFtIGh0bWwgVGhlIGNvbnRlbnQgb2YgYW4gSFRNTCBkb2N1bWVudCAoaW5jbHVkaW5nIGA8aHRtbD5gIGFuZCBgPGJvZHk+YCBlbGVtZW50cylcclxuICAgICAqIEBwYXJhbSBiYXNlVXJsIHRoZSBiYXNlIHVybCBvZiB0aGUgZG9jdW1lbnQgKG5lZWRlZCBmb3IgcHJvY2Vzc2luZyBsb2NhbCBsaW5rcykuXHJcbiAgICAgKiBAcmV0dXJucyBBcnRpY2xlIE1hcmtkb3duIHRleHQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGFydGljbGVBc01hcmtkb3duKGh0bWw6IHN0cmluZywgYmFzZVVybDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XHJcbiAgICAgICAgY29uc3QgYXJ0aWNsZTogQXJ0aWNsZURhdGEgfCBudWxsID0gYXdhaXQgZXh0cmFjdEZyb21IdG1sKGh0bWwsIGJhc2VVcmwpO1xyXG4gICAgICAgIGlmICghYXJ0aWNsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIGNvbnRlbnQgfSA9IGFydGljbGU7XHJcblxyXG4gICAgICAgIHJldHVybiBcIlxcbiMgXCJcclxuICAgICAgICAgICAgKyAodGl0bGUgPz8gXCJEb3dubG9hZGVkIEFydGljbGVcIilcclxuICAgICAgICAgICAgKyBcIiDirIfvuI9cIlxyXG4gICAgICAgICAgICArIFwiXFxuXFxuXCJcclxuICAgICAgICAgICAgKyAoY29udGVudCA/IGh0bWxUb01hcmtkb3duKGNvbnRlbnQpIDogXCItXCIpO1xyXG4gICAgfVxyXG59Il19