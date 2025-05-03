import { extractFromXml } from '@extractus/feed-extractor';
import { decode, DecodingMode, EntityLevel } from "entities";
/**
 * Utility to convert a string into a valid filename.
 * @param name - A string, such as a title, to create a filename for.
 * @returns valid filename without file extension.
 */
function toFilename(name) {
    let fname = name
        .replace(/\s*[htps]+:\/\/.*/, "⋯") // strip urls
        .replaceAll("?", "❓")
        .replaceAll(".", "․")
        .replaceAll(":", "꞉")
        .replaceAll('"', "″")
        .replaceAll('<', "＜")
        .replaceAll('>', "＞")
        .replaceAll('|', "∣")
        .replaceAll("\\", "/")
        .replaceAll("/", "╱")
        .replaceAll("[", "{")
        .replaceAll("]", "}")
        .replaceAll("#", "＃")
        .replaceAll("^", "△")
        .replaceAll("&", "＆")
        .replaceAll("*", "✱");
    if (fname.length > 80) {
        fname = fname
            .substring(0, 80)
            .trim() + "⋯";
    }
    else {
        fname = fname.trim();
    }
    return fname;
}
/**
 * Enumeration of recognized media types.
 */
export var MediumType;
(function (MediumType) {
    MediumType["Unknown"] = "?";
    MediumType["Image"] = "image";
    MediumType["Video"] = "video";
    MediumType["Audio"] = "audio";
})(MediumType || (MediumType = {}));
/**
 * A tracked RSS feed item with a canonical set of properties
 * collected from available sources.
 */
export class TrackedRSSitem {
    /**
     * Build a RSS item representation object.
     * @param entry - The parsed RSS item data.
     */
    constructor(entry) {
        var _a;
        let { id, title, description, published, link, creator, image, content, media } = entry;
        this.id = id;
        this.media = media;
        this.tags = ((_a = entry.category) !== null && _a !== void 0 ? _a : [])
            .map((c) => {
            let tag = null;
            if (typeof c === "string") {
                tag = c;
            }
            else if (typeof c === "object") {
                const cObj = c;
                tag = cObj["#text"] || cObj["@_term"] || cObj["@_label"] || c.toString();
            }
            else {
                tag = "undefined";
            }
            return tag === null || tag === void 0 ? void 0 : tag.replace(/[+&]/g, ",");
        })
            .join(",") // turn everything into a comma separated list to catch internal commas
            .split(",") // abd pull it apart again
            .map(c => {
            // return one cleaned up category
            return c.trim()
                .replace(/^#|\s*[;"\]\}\)\{\[\(]+\s*/g, "")
                .replaceAll("#", "＃")
                .replace(/"'/g, "ʹ")
                .replace(/\s*[\\:]+\s*/g, "/")
                .replace(/[\s\.]+/g, "_");
        })
            .filter(c => !!c); // remove empty strings;
        // make unique and sort
        this.tags = Array.from(new Set(this.tags)).sort();
        if (description) {
            this.description = typeof description === "string" ? description : description["#text"];
        }
        if (published) {
            // normalize date
            const ticks = Date.parse(published);
            if (!isNaN(ticks)) {
                published = new Date(ticks).toISOString();
            }
        }
        else {
            published = new Date().toISOString();
        }
        this.published = published;
        this.title = title !== null && title !== void 0 ? title : `${creator} - ${published}`;
        if (link) {
            if (typeof link !== "string") {
                link = link["@_href"];
            }
            this.link = link;
        }
        this.author = Array.isArray(creator) ? creator.join(",") : (creator !== null && creator !== void 0 ? creator : "unknown");
        if (image) {
            this.image = image;
        }
        if (content) {
            this.content = content;
        }
    }
    /**
     * Get a filename which is derived from the item*s title and is suitable for
     * writing this item to disk.
     * @returns Filename for this item
     */
    get fileName() {
        return toFilename(decode(this.title, { mode: DecodingMode.Strict, level: EntityLevel.HTML }));
    }
}
/**
 * Gather media associated with an RSS item.
 * @param elem - The parsed RSS item
 * @returns A media content list.
 */
function assembleMedia(elem) {
    let mediaContent = elem["media:content"], media = null;
    if (!mediaContent) {
        let group = elem["media:group"];
        if (group) {
            mediaContent = group["media:content"];
        }
    }
    if (mediaContent && !Array.isArray(mediaContent)) {
        mediaContent = [mediaContent];
    }
    if (mediaContent) {
        media = mediaContent.map((mc) => {
            const type = mc["@_type"] || mc["@_medium"];
            let mediumType = MediumType.Unknown;
            if (type.includes("image")) {
                mediumType = MediumType.Image;
            }
            else if (type.match(/video|shock/)) {
                mediumType = MediumType.Video;
            }
            else if (type.includes("audio")) {
                mediumType = MediumType.Audio;
            }
            let medium = { src: mc["@_url"], type: mediumType };
            const width = elem["@_width"], height = elem["@_height"];
            if (width && height) {
                medium["width"] = width;
                medium["height"] = height;
            }
            return medium;
        });
    }
    return media !== null && media !== void 0 ? media : [];
}
/**
 * Get the _signature_ image associated with the article described
 * by an RSS item
 * @param elem - The parsed RSS item
 * @returns Image medium object, if available.
 */
function assembleImage(elem) {
    var _a, _b;
    let { image } = elem;
    if (typeof image === 'string') {
        return { src: image, type: MediumType.Image };
    }
    if (image === null || image === void 0 ? void 0 : image.url) {
        const { url, width, height } = image;
        let img = { src: url, type: MediumType.Image };
        if (width) {
            img.width = width;
        }
        if (height) {
            img.height = height;
        }
        return img;
    }
    let thumb = elem["media:thumbnail"];
    if (!thumb) {
        let group = elem["media:group"];
        if (group) {
            thumb = group["media:thumbnail"];
        }
    }
    if (thumb) {
        const [width, height] = [thumb["@_width"], thumb["@_height"]];
        let img = { src: thumb["@_url"], type: MediumType.Image };
        if (width) {
            img.width = width;
        }
        if (height) {
            img.height = height;
        }
        return img;
    }
    let enc = elem.enclosure;
    if ((_a = enc === null || enc === void 0 ? void 0 : enc["@_type"]) === null || _a === void 0 ? void 0 : _a.includes("image")) {
        return { src: enc["@_url"], type: MediumType.Image };
    }
    let media = elem["media:content"];
    if (media && ((_b = media["@_type"]) === null || _b === void 0 ? void 0 : _b.includes("image"))) {
        const [width, height] = [media["@_width"], media["@_height"]];
        let img = { src: media["@_url"], type: MediumType.Image };
        if (width) {
            img.width = width;
        }
        if (height) {
            img.height = height;
        }
        return img;
    }
    return null;
}
/**
 * Collect author information for the article described by
 * an RSS item.
 * @param elem - The parsed RSS item.
 * @returns Author(s), if available.
 */
function assembleCreator(elem) {
    const creator = elem.creator || elem["dc:creator"];
    if (creator) {
        return typeof creator === "string" ? creator : creator["#text"];
    }
    const author = elem.author;
    if (!author || typeof author === "string") {
        return author;
    }
    if (Array.isArray(author)) {
        return author.map((a) => a.name).join(", ");
    }
    return (author === null || author === void 0 ? void 0 : author.name) || author;
}
function assembleDescription(elem) {
    let description = elem["media:description"];
    if (!description) {
        let group = elem["media:group"];
        if (group) {
            description = group["media:description"];
        }
    }
    return description;
}
/**
 * Custom RSS item and feed processing instructions to build
 * the desired feed representation.
 */
const DEFAULT_OPTIONS = {
    descriptionMaxLen: 0,
    getExtraEntryFields: (item) => {
        var _a;
        let { id, guid } = item, tracked = {
            id: id || (guid === null || guid === void 0 ? void 0 : guid["#text"]) || item.link,
            media: assembleMedia(item)
        };
        let description = item.description || assembleDescription(item);
        if (description) {
            tracked.description = description;
        }
        let published = item.published || item.pubDate;
        if (published) {
            tracked.published = published;
        }
        const category = item.category;
        if (category) {
            tracked.category = Array.isArray(category) ? category : [category];
        }
        let creator = item.creator || assembleCreator(item);
        if (creator) {
            tracked.creator = creator;
        }
        const image = assembleImage(item);
        if (image) {
            tracked.image = image;
        }
        let content = item["content:encoded"] || item.content || item["dc:content"];
        if (content) {
            tracked.content = typeof content === "string" ? content : content["#text"];
        }
        let title = item.title;
        if (!title) {
            // a title is mandatory - synthesize one
            title = published;
        }
        // remove linefeeds and extra spaces
        tracked.title = ((_a = title["#text"]) !== null && _a !== void 0 ? _a : title).toString().replace(/[\s\r\n]+/g, " ");
        return tracked;
    },
    getExtraFeedFields: (feedData) => {
        let tracked = {};
        const image = assembleImage(feedData);
        if (image) {
            tracked.image = image;
        }
        let link = feedData.link;
        if (link) {
            if (Array.isArray(link)) {
                for (let l of link) {
                    if (l["@_rel"] !== 'self') {
                        tracked.link = l["@_href"];
                        break;
                    }
                }
            }
            else {
                tracked.link = link;
            }
        }
        return tracked;
    },
};
/**
 * Representation of an RSS feed with a canoiccal set of properties
 * collected from available sources.
 */
export class TrackedRSSfeed {
    /**
     * Assemble an RSS feed from its XML representation.
     * Collect a all necessary data that are available data nad backfill
     * canonical properties.
     *
     * @param xml - XML representation of an RSS feed.
     * @param source - The location where the xml data came from. Usually a url or file path.
     * @param options Optional Parsing options.
     * @returns Feed obkect {TrackedRSSfeed} contaiing all relevant properties that
     *          were available in the feed.
     */
    constructor(xml, source, options = DEFAULT_OPTIONS) {
        var _a;
        this.source = source;
        options.baseUrl = (_a = source.match(/[htps]+:\/\/[^\/]+(?=\/*)/)) === null || _a === void 0 ? void 0 : _a[0];
        const feed = extractFromXml(xml.trimStart(), options);
        let { link, title, description, image, entries } = feed;
        if (link) {
            this.site = link.startsWith("/") && options.baseUrl ? options.baseUrl + link : link;
        }
        if (title) {
            this.title = title;
        }
        if (description) {
            this.description = typeof description === "string" ? description : description["#text"];
        }
        if (image) {
            this.image = image;
        }
        if (Array.isArray(entries)) {
            this.items = entries.map(e => new TrackedRSSitem(e));
        }
        else {
            this.items = [];
        }
    }
    /**
     * Get the a filename for this RSS feed.
     * @returns A valid filename.
     */
    get fileName() {
        var _a;
        return toFilename(decode((_a = this.title) !== null && _a !== void 0 ? _a : "Untitled", { mode: DecodingMode.Strict, level: EntityLevel.HTML }));
    }
    /**
     * @returns the avarage time interval between posts of the feed in hours.
     */
    get avgPostInterval() {
        let pubdateMillies = this.items.map(it => new Date(it.published).valueOf()).sort();
        const n = pubdateMillies.length - 1; // number of intervals between posts
        if (n > 0) {
            return Math.abs(Math.round((pubdateMillies[n] - pubdateMillies[0]) / (n * 60 * 60 * 1000)));
        }
        return 1;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmVlZEFzc2VtYmxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9GZWVkQXNzZW1ibGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQXNDLE1BQU0sMkJBQTJCLENBQUE7QUFDOUYsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzdEOzs7O0dBSUc7QUFDSCxTQUFTLFVBQVUsQ0FBQyxJQUFZO0lBQzVCLElBQUksS0FBSyxHQUFHLElBQUk7U0FDWCxPQUFPLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLENBQUMsYUFBYTtTQUMvQyxVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQztTQUNyQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUNwQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTFCLElBQUksS0FBSyxDQUFDLE1B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SyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsb0NBQW9DO1FBQ3pFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNQLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQy9GO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0NBRUoiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHRyYWN0RnJvbVhtbCwgRmVlZERhdGEsIFJlYWRlck9wdGlvbnMsIEZlZWRFbnRyeSB9IGZyb20gJ0BleHRyYWN0dXMvZmVlZC1leHRyYWN0b3InXHJcbmltcG9ydCB7IGRlY29kZSwgRGVjb2RpbmdNb2RlLCBFbnRpdHlMZXZlbCB9IGZyb20gXCJlbnRpdGllc1wiO1xyXG4vKipcclxuICogVXRpbGl0eSB0byBjb252ZXJ0IGEgc3RyaW5nIGludG8gYSB2YWxpZCBmaWxlbmFtZS5cclxuICogQHBhcmFtIG5hbWUgLSBBIHN0cmluZywgc3VjaCBhcyBhIHRpdGxlLCB0byBjcmVhdGUgYSBmaWxlbmFtZSBmb3IuXHJcbiAqIEByZXR1cm5zIHZhbGlkIGZpbGVuYW1lIHdpdGhvdXQgZmlsZSBleHRlbnNpb24uXHJcbiAqL1xyXG5mdW5jdGlvbiB0b0ZpbGVuYW1lKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBsZXQgZm5hbWUgPSBuYW1lXHJcbiAgICAgICAgLnJlcGxhY2UoL1xccypbaHRwc10rOlxcL1xcLy4qLywgXCLii69cIikgLy8gc3RyaXAgdXJsc1xyXG4gICAgICAgIC5yZXBsYWNlQWxsKFwiP1wiLCBcIuKdk1wiKVxyXG4gICAgICAgIC5yZXBsYWNlQWxsKFwiLlwiLCBcIuKApFwiKVxyXG4gICAgICAgIC5yZXBsYWNlQWxsKFwiOlwiLCBcIuqeiVwiKVxyXG4gICAgICAgIC5yZXBsYWNlQWxsKCdcIicsIFwi4oCzXCIpXHJcbiAgICAgICAgLnJlcGxhY2VBbGwoJzwnLCBcIu+8nFwiKVxyXG4gICAgICAgIC5yZXBsYWNlQWxsKCc+JywgXCLvvJ5cIilcclxuICAgICAgICAucmVwbGFjZUFsbCgnfCcsIFwi4oijXCIpXHJcbiAgICAgICAgLnJlcGxhY2VBbGwoXCJcXFxcXCIsIFwiL1wiKVxyXG4gICAgICAgIC5yZXBsYWNlQWxsKFwiL1wiLCBcIuKVsVwiKVxyXG4gICAgICAgIC5yZXBsYWNlQWxsKFwiW1wiLCBcIntcIilcclxuICAgICAgICAucmVwbGFjZUFsbChcIl1cIiwgXCJ9XCIpXHJcbiAgICAgICAgLnJlcGxhY2VBbGwoXCIjXCIsIFwi77yDXCIpXHJcbiAgICAgICAgLnJlcGxhY2VBbGwoXCJeXCIsIFwi4pazXCIpXHJcbiAgICAgICAgLnJlcGxhY2VBbGwoXCImXCIsIFwi77yGXCIpXHJcbiAgICAgICAgLnJlcGxhY2VBbGwoXCIqXCIsIFwi4pyxXCIpO1xyXG5cclxuICAgIGlmIChmbmFtZS5sZW5ndGggPiA4MCkge1xyXG4gICAgICAgIGZuYW1lID0gZm5hbWVcclxuICAgICAgICAgICAgLnN1YnN0cmluZygwLCA4MClcclxuICAgICAgICAgICAgLnRyaW0oKSArIFwi4ouvXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZuYW1lID0gZm5hbWUudHJpbSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmbmFtZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFR5cGUgZm9yIHByb3BlcnR5IGJhZyBvYmplY3RzIChrZXkgLT4gdmFsdWUpIHdpdGggdW5rbm93biBjb250ZW50LlxyXG4gKi9cclxuZXhwb3J0IHR5cGUgVFByb3BlcnR5QmFnID0geyBba2V5OiBzdHJpbmddOiBhbnkgfTtcclxuXHJcbi8qKlxyXG4gKiBFbnVtZXJhdGlvbiBvZiByZWNvZ25pemVkIG1lZGlhIHR5cGVzLlxyXG4gKi9cclxuZXhwb3J0IGVudW0gTWVkaXVtVHlwZSB7XHJcbiAgICBVbmtub3duID0gXCI/XCIsXHJcbiAgICBJbWFnZSA9IFwiaW1hZ2VcIixcclxuICAgIFZpZGVvID0gXCJ2aWRlb1wiLFxyXG4gICAgQXVkaW8gPSBcImF1ZGlvXCJcclxufVxyXG5cclxuLyoqXHJcbiAqIFNwZWNpZmljYXRpb24gb2YgYSBtZWRpdW0gb2JqZWN0IHJlZmVyZW5jZSB3aXRoaW4gYW4gUlNTIGZlZWQuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElSc3NNZWRpdW0ge1xyXG4gICAgc3JjOiBzdHJpbmc7IC8vIGh5cGVybGluayB0byBvYmplY3RcclxuICAgIHR5cGU6IE1lZGl1bVR5cGU7IC8vIHR5cGUgb2YgbWVkaXVtXHJcbiAgICB3aWR0aD86IHN0cmluZzsgLy8gb3B0aW9uYWwgZW1iZWRkaW5nIHdpZHRoXHJcbiAgICBoZWlnaHQ/OiBzdHJpbmc7IC8vIG9wdGlvbmFsIGVtYmVkZGluZyBoZWlnaHRcclxufVxyXG5cclxuLyoqXHJcbiAqIFNwZWNpZmljYXRpb24gb2YgdGhlIHRyYWNrZWQgcHJvcGVydGllcyBvZiBhbiBSU1MgaXRlbS5cclxuICogU29tZSBwcm9wZXJ0aWVzIG92ZXJsYXAgd2l0aCB0aGUgcHJvcGVydHkgc3BlY2lmaWNhdGlvbiBpbiB0aGVcclxuICogYEZlZWRFbnRyeWAgaW50ZXJmYWNlLiBUaGVzZSB3aWxsIGdldCBzcGVjaWFsIGF0dGVudGlvbiBkdXJpbmdcclxuICogcGFyc2luZy5cclxuICovXHJcbmludGVyZmFjZSBJRW50cnlEYXRhVHJhY2tlZCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZztcclxuICAgIHB1Ymxpc2hlZD86IHN0cmluZztcclxuICAgIGNhdGVnb3J5Pzogc3RyaW5nW10gfCBvYmplY3RbXTtcclxuICAgIGNyZWF0b3I/OiBzdHJpbmcgfCBzdHJpbmdbXSB8IG9iamVjdFtdO1xyXG4gICAgaW1hZ2U/OiBJUnNzTWVkaXVtO1xyXG4gICAgbWVkaWE6IElSc3NNZWRpdW1bXTtcclxuICAgIGNvbnRlbnQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTcGVjaWZpY2F0aW9uIG9mIGEgcGFyc2VkIFJTUyBpdGVtIGluY2x1ZGluZyBjYW5vbmljYWwgYW5kXHJcbiAqIHNwZWNpZmljYWxseSB0cmFja2VkIHByb3BlcnRpZXMuXHJcbiAqL1xyXG5pbnRlcmZhY2UgSUVudHJ5RGF0YUV4dGVuZGVkIGV4dGVuZHMgSUVudHJ5RGF0YVRyYWNrZWQsIEZlZWRFbnRyeSB7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBTcGVjaWZpY2F0aW9uIG9mIHNwZWNpZmljYWxseSB0cmFja2VkIHByb3BlcnRpZXMgb2YgYW4gUlNTIGZlZWQuXHJcbiAqL1xyXG5pbnRlcmZhY2UgSUZlZWREYXRhRXh0cmEge1xyXG4gICAgaW1hZ2U/OiBJUnNzTWVkaXVtLFxyXG4gICAgbGluaz86IHN0cmluZztcclxufVxyXG4vKipcclxuICogU3BlY2lmaWNhdGlvbiBvZiBhIHBhcnNlZCBSU1MgZmVlZCBpbmNsdWRpbmcgY2Fub25pY2FsIGFuZFxyXG4gKiB0cmFja2VkIHByb3BlcnRpZXMuXHJcbiAqL1xyXG5pbnRlcmZhY2UgSUZlZWREYXRhRXh0ZW5kZWQgZXh0ZW5kcyBJRmVlZERhdGFFeHRyYSwgRmVlZERhdGEge1xyXG59XHJcblxyXG4vKipcclxuICogQSB0cmFja2VkIFJTUyBmZWVkIGl0ZW0gd2l0aCBhIGNhbm9uaWNhbCBzZXQgb2YgcHJvcGVydGllc1xyXG4gKiBjb2xsZWN0ZWQgZnJvbSBhdmFpbGFibGUgc291cmNlcy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBUcmFja2VkUlNTaXRlbSB7XHJcbiAgICBpZDogc3RyaW5nOyAvLyBBIHJlYXNvbmFibHkgdW5pcXVlIGlkIG9mIGFuIHJzcyBpdGVtLlxyXG4gICAgdGFnczogc3RyaW5nW107IC8vIGEgbGlzdCBvZiB0YWdzIGRlc2NyaWJpbmcgdGhlIGl0ZW0uXHJcbiAgICBkZXNjcmlwdGlvbj86IHN0cmluZzsgLy8gSXRlbSBkZXNjcmlwdGlvblxyXG4gICAgdGl0bGU6IHN0cmluZzsgLy8gaXRlbSB0aXRsZVxyXG4gICAgbGluaz86IHN0cmluZzsgLy8gaHlwZXJsaW5rIHRvIGFydGljbGUuXHJcbiAgICBwdWJsaXNoZWQ6IHN0cmluZzsgLy8gcHVibGlzaCBkYXRlXHJcbiAgICBhdXRob3I/OiBzdHJpbmc7IC8vIG9uZSBvciBtb3JlIGF1dGhvcnNcclxuICAgIGltYWdlPzogSVJzc01lZGl1bTsgLy8gVGhlIGl0ZW1zIGltYWdlXHJcbiAgICBtZWRpYTogSVJzc01lZGl1bVtdOyAvLyBBIGxpc3Qgb2YgbWVkaWEgYXNzb2NpYXRlZCB3aXRoIHRoZSBhcnRpY2xzXHJcbiAgICBjb250ZW50Pzogc3RyaW5nOyAvLyBPcHRpbmFsIGl0ZW0gY29udGVudCAoaW4gbW9zdCBjYXNlcyBhIEhUTUwgZnJhZ21lbnQpXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCBhIFJTUyBpdGVtIHJlcHJlc2VudGF0aW9uIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBlbnRyeSAtIFRoZSBwYXJzZWQgUlNTIGl0ZW0gZGF0YS5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoZW50cnk6IElFbnRyeURhdGFFeHRlbmRlZCkge1xyXG4gICAgICAgIGxldCB7IGlkLCB0aXRsZSwgZGVzY3JpcHRpb24sIHB1Ymxpc2hlZCwgbGluaywgY3JlYXRvciwgaW1hZ2UsIGNvbnRlbnQsIG1lZGlhIH0gPSBlbnRyeTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5tZWRpYSA9IG1lZGlhO1xyXG4gICAgICAgIHRoaXMudGFncyA9IChlbnRyeS5jYXRlZ29yeSA/PyBbXSlcclxuICAgICAgICAgICAgLm1hcCgoYzogc3RyaW5nIHwgb2JqZWN0ICkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBjO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNPYmogPSBjIGFzIHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gY09ialtcIiN0ZXh0XCJdIHx8IGNPYmpbXCJAX3Rlcm1cIl0gfHwgY09ialtcIkBfbGFiZWxcIl0gfHwgYy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWcgPSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFnPy5yZXBsYWNlKC9bKyZdL2csIFwiLFwiKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmpvaW4oXCIsXCIpIC8vIHR1cm4gZXZlcnl0aGluZyBpbnRvIGEgY29tbWEgc2VwYXJhdGVkIGxpc3QgdG8gY2F0Y2ggaW50ZXJuYWwgY29tbWFzXHJcbiAgICAgICAgICAgIC5zcGxpdChcIixcIikgLy8gYWJkIHB1bGwgaXQgYXBhcnQgYWdhaW5cclxuICAgICAgICAgICAgLm1hcChjID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybiBvbmUgY2xlYW5lZCB1cCBjYXRlZ29yeVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMudHJpbSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL14jfFxccypbO1wiXFxdXFx9XFwpXFx7XFxbXFwoXStcXHMqL2csIFwiXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoXCIjXCIsIFwi77yDXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1wiJy9nLCBcIsq5XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccypbXFxcXDpdK1xccyovZywgXCIvXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHNcXC5dKy9nLCBcIl9cIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoYyA9PiAhIWMpIC8vIHJlbW92ZSBlbXB0eSBzdHJpbmdzO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHVuaXF1ZSBhbmQgc29ydFxyXG4gICAgICAgIHRoaXMudGFncyA9IEFycmF5LmZyb20obmV3IFNldDxzdHJpbmc+KHRoaXMudGFncykpLnNvcnQoKTtcclxuXHJcbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0eXBlb2YgZGVzY3JpcHRpb24gPT09IFwic3RyaW5nXCIgPyBkZXNjcmlwdGlvbiA6IChkZXNjcmlwdGlvbiBhcyBUUHJvcGVydHlCYWcpW1wiI3RleHRcIl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocHVibGlzaGVkKSB7XHJcbiAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSBkYXRlXHJcbiAgICAgICAgICAgIGNvbnN0IHRpY2tzID0gRGF0ZS5wYXJzZShwdWJsaXNoZWQpO1xyXG4gICAgICAgICAgICBpZiAoIWlzTmFOKHRpY2tzKSkge1xyXG4gICAgICAgICAgICAgICAgcHVibGlzaGVkID0gbmV3IERhdGUodGlja3MpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwdWJsaXNoZWQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnB1Ymxpc2hlZCA9IHB1Ymxpc2hlZDtcclxuICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGUgPz8gYCR7Y3JlYXRvcn0gLSAke3B1Ymxpc2hlZH1gO1xyXG5cclxuICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxpbmsgIT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGxpbmsgPSAobGluayBhcyBUUHJvcGVydHlCYWcpW1wiQF9ocmVmXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubGluayA9IGxpbms7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmF1dGhvciA9IEFycmF5LmlzQXJyYXkoY3JlYXRvcikgPyBjcmVhdG9yLmpvaW4oXCIsXCIpIDogKGNyZWF0b3IgPz8gXCJ1bmtub3duXCIpO1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlID0gaW1hZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgZmlsZW5hbWUgd2hpY2ggaXMgZGVyaXZlZCBmcm9tIHRoZSBpdGVtKnMgdGl0bGUgYW5kIGlzIHN1aXRhYmxlIGZvclxyXG4gICAgICogd3JpdGluZyB0aGlzIGl0ZW0gdG8gZGlzay5cclxuICAgICAqIEByZXR1cm5zIEZpbGVuYW1lIGZvciB0aGlzIGl0ZW1cclxuICAgICAqL1xyXG4gICAgZ2V0IGZpbGVOYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRvRmlsZW5hbWUoZGVjb2RlKHRoaXMudGl0bGUsIHsgbW9kZTogRGVjb2RpbmdNb2RlLlN0cmljdCwgbGV2ZWw6IEVudGl0eUxldmVsLkhUTUwgfSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR2F0aGVyIG1lZGlhIGFzc29jaWF0ZWQgd2l0aCBhbiBSU1MgaXRlbS5cclxuICogQHBhcmFtIGVsZW0gLSBUaGUgcGFyc2VkIFJTUyBpdGVtXHJcbiAqIEByZXR1cm5zIEEgbWVkaWEgY29udGVudCBsaXN0LlxyXG4gKi9cclxuZnVuY3Rpb24gYXNzZW1ibGVNZWRpYShlbGVtOiBUUHJvcGVydHlCYWcpOiBJUnNzTWVkaXVtW10ge1xyXG5cclxuICAgIGxldCBtZWRpYUNvbnRlbnQgPSBlbGVtW1wibWVkaWE6Y29udGVudFwiXSxcclxuICAgICAgICBtZWRpYTogSVJzc01lZGl1bVtdIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgaWYgKCFtZWRpYUNvbnRlbnQpIHtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBlbGVtW1wibWVkaWE6Z3JvdXBcIl07XHJcbiAgICAgICAgaWYgKGdyb3VwKSB7XHJcbiAgICAgICAgICAgIG1lZGlhQ29udGVudCA9IGdyb3VwW1wibWVkaWE6Y29udGVudFwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1lZGlhQ29udGVudCAmJiAhQXJyYXkuaXNBcnJheShtZWRpYUNvbnRlbnQpKSB7XHJcbiAgICAgICAgbWVkaWFDb250ZW50ID0gW21lZGlhQ29udGVudF07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1lZGlhQ29udGVudCkge1xyXG4gICAgICAgIG1lZGlhID0gbWVkaWFDb250ZW50Lm1hcCgobWM6IFRQcm9wZXJ0eUJhZyk6IElSc3NNZWRpdW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eXBlOiBzdHJpbmcgPSBtY1tcIkBfdHlwZVwiXSB8fCBtY1tcIkBfbWVkaXVtXCJdO1xyXG5cclxuICAgICAgICAgICAgbGV0IG1lZGl1bVR5cGUgPSBNZWRpdW1UeXBlLlVua25vd247XHJcbiAgICAgICAgICAgIGlmICh0eXBlLmluY2x1ZGVzKFwiaW1hZ2VcIikpIHtcclxuICAgICAgICAgICAgICAgIG1lZGl1bVR5cGUgPSBNZWRpdW1UeXBlLkltYWdlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUubWF0Y2goL3ZpZGVvfHNob2NrLykpIHtcclxuICAgICAgICAgICAgICAgIG1lZGl1bVR5cGUgPSBNZWRpdW1UeXBlLlZpZGVvO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUuaW5jbHVkZXMoXCJhdWRpb1wiKSkge1xyXG4gICAgICAgICAgICAgICAgbWVkaXVtVHlwZSA9IE1lZGl1bVR5cGUuQXVkaW87XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBtZWRpdW06IElSc3NNZWRpdW0gPSB7IHNyYzogbWNbXCJAX3VybFwiXSwgdHlwZTogbWVkaXVtVHlwZSB9O1xyXG4gICAgICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHN0cmluZyA9IGVsZW1bXCJAX3dpZHRoXCJdLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBzdHJpbmcgPSBlbGVtW1wiQF9oZWlnaHRcIl07XHJcbiAgICAgICAgICAgIGlmICh3aWR0aCAmJiBoZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIG1lZGl1bVtcIndpZHRoXCJdID0gd2lkdGg7XHJcbiAgICAgICAgICAgICAgICBtZWRpdW1bXCJoZWlnaHRcIl0gPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1lZGl1bTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBtZWRpYSA/PyBbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgX3NpZ25hdHVyZV8gaW1hZ2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBhcnRpY2xlIGRlc2NyaWJlZFxyXG4gKiBieSBhbiBSU1MgaXRlbVxyXG4gKiBAcGFyYW0gZWxlbSAtIFRoZSBwYXJzZWQgUlNTIGl0ZW1cclxuICogQHJldHVybnMgSW1hZ2UgbWVkaXVtIG9iamVjdCwgaWYgYXZhaWxhYmxlLlxyXG4gKi9cclxuZnVuY3Rpb24gYXNzZW1ibGVJbWFnZShlbGVtOiBUUHJvcGVydHlCYWcpOiBJUnNzTWVkaXVtIHwgbnVsbCB7XHJcbiAgICBsZXQgeyBpbWFnZSB9ID0gZWxlbTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGltYWdlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiB7IHNyYzogaW1hZ2UsIHR5cGU6IE1lZGl1bVR5cGUuSW1hZ2UgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaW1hZ2U/LnVybCkge1xyXG4gICAgICAgIGNvbnN0IHsgdXJsLCB3aWR0aCwgaGVpZ2h0IH0gPSBpbWFnZTtcclxuICAgICAgICBsZXQgaW1nOiBJUnNzTWVkaXVtID0geyBzcmM6IHVybCwgdHlwZTogTWVkaXVtVHlwZS5JbWFnZSB9O1xyXG4gICAgICAgIGlmICh3aWR0aCkge1xyXG4gICAgICAgICAgICBpbWcud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGhlaWdodCkge1xyXG4gICAgICAgICAgICBpbWcuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW1nO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0aHVtYiA9IGVsZW1bXCJtZWRpYTp0aHVtYm5haWxcIl07XHJcbiAgICBpZiAoIXRodW1iKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZWxlbVtcIm1lZGlhOmdyb3VwXCJdO1xyXG4gICAgICAgIGlmIChncm91cCkge1xyXG4gICAgICAgICAgICB0aHVtYiA9IGdyb3VwW1wibWVkaWE6dGh1bWJuYWlsXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGh1bWIpIHtcclxuICAgICAgICBjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBbdGh1bWJbXCJAX3dpZHRoXCJdLCB0aHVtYltcIkBfaGVpZ2h0XCJdXTtcclxuICAgICAgICBsZXQgaW1nOiBJUnNzTWVkaXVtID0geyBzcmM6IHRodW1iW1wiQF91cmxcIl0sIHR5cGU6IE1lZGl1bVR5cGUuSW1hZ2UgfTtcclxuICAgICAgICBpZiAod2lkdGgpIHtcclxuICAgICAgICAgICAgaW1nLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoZWlnaHQpIHtcclxuICAgICAgICAgICAgaW1nLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGltZztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZW5jID0gZWxlbS5lbmNsb3N1cmU7XHJcbiAgICBpZiAoZW5jPy5bXCJAX3R5cGVcIl0/LmluY2x1ZGVzKFwiaW1hZ2VcIikpIHtcclxuICAgICAgICByZXR1cm4geyBzcmM6IGVuY1tcIkBfdXJsXCJdLCB0eXBlOiBNZWRpdW1UeXBlLkltYWdlIH07XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG1lZGlhID0gZWxlbVtcIm1lZGlhOmNvbnRlbnRcIl07XHJcbiAgICBpZiAobWVkaWEgJiYgbWVkaWFbXCJAX3R5cGVcIl0/LmluY2x1ZGVzKFwiaW1hZ2VcIikpIHtcclxuICAgICAgICBjb25zdCBbd2lkdGgsIGhlaWdodF0gPSBbbWVkaWFbXCJAX3dpZHRoXCJdLCBtZWRpYVtcIkBfaGVpZ2h0XCJdXTtcclxuICAgICAgICBsZXQgaW1nOiBJUnNzTWVkaXVtID0geyBzcmM6IG1lZGlhW1wiQF91cmxcIl0sIHR5cGU6IE1lZGl1bVR5cGUuSW1hZ2UgfTtcclxuICAgICAgICBpZiAod2lkdGgpIHtcclxuICAgICAgICAgICAgaW1nLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChoZWlnaHQpIHtcclxuICAgICAgICAgICAgaW1nLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGltZztcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuICogQ29sbGVjdCBhdXRob3IgaW5mb3JtYXRpb24gZm9yIHRoZSBhcnRpY2xlIGRlc2NyaWJlZCBieVxyXG4gKiBhbiBSU1MgaXRlbS5cclxuICogQHBhcmFtIGVsZW0gLSBUaGUgcGFyc2VkIFJTUyBpdGVtLlxyXG4gKiBAcmV0dXJucyBBdXRob3IocyksIGlmIGF2YWlsYWJsZS5cclxuICovXHJcbmZ1bmN0aW9uIGFzc2VtYmxlQ3JlYXRvcihlbGVtOiBUUHJvcGVydHlCYWcpOiBzdHJpbmcgfCBudWxsIHtcclxuICAgIGNvbnN0IGNyZWF0b3IgPSBlbGVtLmNyZWF0b3IgfHwgZWxlbVtcImRjOmNyZWF0b3JcIl07XHJcbiAgICBpZiAoY3JlYXRvcikge1xyXG4gICAgICAgIHJldHVybiB0eXBlb2YgY3JlYXRvciA9PT0gXCJzdHJpbmdcIiA/IGNyZWF0b3IgOiBjcmVhdG9yW1wiI3RleHRcIl07XHJcbiAgICB9XHJcbiAgICBjb25zdCBhdXRob3IgPSBlbGVtLmF1dGhvcjtcclxuICAgIGlmICghYXV0aG9yIHx8IHR5cGVvZiBhdXRob3IgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICByZXR1cm4gYXV0aG9yO1xyXG4gICAgfVxyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXV0aG9yKSkge1xyXG4gICAgICAgIHJldHVybiBhdXRob3IubWFwKChhIDogVFByb3BlcnR5QmFnKSA9PiBhLm5hbWUpLmpvaW4oXCIsIFwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhdXRob3I/Lm5hbWUgfHwgYXV0aG9yO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhc3NlbWJsZURlc2NyaXB0aW9uKGVsZW06IFRQcm9wZXJ0eUJhZyk6IHN0cmluZyB8IG51bGwge1xyXG4gICAgbGV0IGRlc2NyaXB0aW9uID0gZWxlbVtcIm1lZGlhOmRlc2NyaXB0aW9uXCJdO1xyXG4gICAgaWYgKCFkZXNjcmlwdGlvbikge1xyXG4gICAgICAgIGxldCBncm91cCA9IGVsZW1bXCJtZWRpYTpncm91cFwiXTtcclxuICAgICAgICBpZiAoZ3JvdXApIHtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBncm91cFtcIm1lZGlhOmRlc2NyaXB0aW9uXCJdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVzY3JpcHRpb247XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gUlNTIGl0ZW0gYW5kIGZlZWQgcHJvY2Vzc2luZyBpbnN0cnVjdGlvbnMgdG8gYnVpbGRcclxuICogdGhlIGRlc2lyZWQgZmVlZCByZXByZXNlbnRhdGlvbi5cclxuICovXHJcbmNvbnN0IERFRkFVTFRfT1BUSU9OUzogUmVhZGVyT3B0aW9ucyA9IHtcclxuICAgIGRlc2NyaXB0aW9uTWF4TGVuOiAwLCAvLyBpbmZpbml0ZSBsZW5ndGhcclxuICAgIGdldEV4dHJhRW50cnlGaWVsZHM6IChpdGVtOiBUUHJvcGVydHlCYWcpOiBJRW50cnlEYXRhVHJhY2tlZCA9PiB7XHJcbiAgICAgICAgbGV0XHJcbiAgICAgICAgICAgIHsgaWQsIGd1aWQgfSA9IGl0ZW0sXHJcbiAgICAgICAgICAgIHRyYWNrZWQ6IElFbnRyeURhdGFUcmFja2VkID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGlkIHx8IGd1aWQ/LltcIiN0ZXh0XCJdIHx8IGl0ZW0ubGluayxcclxuICAgICAgICAgICAgICAgIG1lZGlhOiBhc3NlbWJsZU1lZGlhKGl0ZW0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRlc2NyaXB0aW9uID0gaXRlbS5kZXNjcmlwdGlvbiB8fCBhc3NlbWJsZURlc2NyaXB0aW9uKGl0ZW0pO1xyXG4gICAgICAgIGlmIChkZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICB0cmFja2VkLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHVibGlzaGVkID0gaXRlbS5wdWJsaXNoZWQgfHwgaXRlbS5wdWJEYXRlO1xyXG4gICAgICAgIGlmIChwdWJsaXNoZWQpIHtcclxuICAgICAgICAgICAgdHJhY2tlZC5wdWJsaXNoZWQgPSBwdWJsaXNoZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjYXRlZ29yeSA9IGl0ZW0uY2F0ZWdvcnk7XHJcbiAgICAgICAgaWYgKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgIHRyYWNrZWQuY2F0ZWdvcnkgPSBBcnJheS5pc0FycmF5KGNhdGVnb3J5KSA/IGNhdGVnb3J5IDogW2NhdGVnb3J5XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjcmVhdG9yID0gaXRlbS5jcmVhdG9yIHx8IGFzc2VtYmxlQ3JlYXRvcihpdGVtKTtcclxuICAgICAgICBpZiAoY3JlYXRvcikge1xyXG4gICAgICAgICAgICB0cmFja2VkLmNyZWF0b3IgPSBjcmVhdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBhc3NlbWJsZUltYWdlKGl0ZW0pO1xyXG4gICAgICAgIGlmIChpbWFnZSkge1xyXG4gICAgICAgICAgICB0cmFja2VkLmltYWdlID0gaW1hZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29udGVudCA9IGl0ZW1bXCJjb250ZW50OmVuY29kZWRcIl0gfHwgaXRlbS5jb250ZW50IHx8IGl0ZW1bXCJkYzpjb250ZW50XCJdIDtcclxuICAgICAgICBpZiAoY29udGVudCkge1xyXG4gICAgICAgICAgICB0cmFja2VkLmNvbnRlbnQgPSB0eXBlb2YgY29udGVudCA9PT0gXCJzdHJpbmdcIiA/IGNvbnRlbnQgOiBjb250ZW50W1wiI3RleHRcIl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGl0bGUgPSBpdGVtLnRpdGxlO1xyXG4gICAgICAgIGlmICghdGl0bGUpIHtcclxuICAgICAgICAgICAgLy8gYSB0aXRsZSBpcyBtYW5kYXRvcnkgLSBzeW50aGVzaXplIG9uZVxyXG4gICAgICAgICAgICB0aXRsZSA9IHB1Ymxpc2hlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVtb3ZlIGxpbmVmZWVkcyBhbmQgZXh0cmEgc3BhY2VzXHJcbiAgICAgICAgdHJhY2tlZC50aXRsZSA9ICh0aXRsZVtcIiN0ZXh0XCJdID8/IHRpdGxlKS50b1N0cmluZygpLnJlcGxhY2UoL1tcXHNcXHJcXG5dKy9nLCBcIiBcIik7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFja2VkO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRFeHRyYUZlZWRGaWVsZHM6IChmZWVkRGF0YTogVFByb3BlcnR5QmFnKSA9PiB7XHJcbiAgICAgICAgbGV0IHRyYWNrZWQ6IElGZWVkRGF0YUV4dHJhID0ge307XHJcbiAgICAgICAgY29uc3QgaW1hZ2UgPSBhc3NlbWJsZUltYWdlKGZlZWREYXRhKTtcclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgdHJhY2tlZC5pbWFnZSA9IGltYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgbGluayA9IGZlZWREYXRhLmxpbms7XHJcbiAgICAgICAgaWYgKGxpbmspIHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGluaykpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGwgb2YgbGluaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsW1wiQF9yZWxcIl0gIT09ICdzZWxmJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFja2VkLmxpbmsgPSBsW1wiQF9ocmVmXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyYWNrZWQubGluayA9IGxpbms7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cmFja2VkO1xyXG4gICAgfSxcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGFuIFJTUyBmZWVkIHdpdGggYSBjYW5vaWNjYWwgc2V0IG9mIHByb3BlcnRpZXNcclxuICogY29sbGVjdGVkIGZyb20gYXZhaWxhYmxlIHNvdXJjZXMuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVHJhY2tlZFJTU2ZlZWQge1xyXG4gICAgdGl0bGU/OiBzdHJpbmc7IC8vIEZlZWQgdGl0bGVcclxuICAgIGRlc2NyaXB0aW9uPzogc3RyaW5nOyAvLyBGZWVkIERlc2NyaXB0aW9uXHJcbiAgICBzaXRlPzogc3RyaW5nOyAvLyB0aGUgd2ViIHNpdGUgdGhlIEZlZWQgd2FzIHB1Ymxpc2hlZCBmb3IuXHJcbiAgICBpbWFnZT86IElSc3NNZWRpdW07IC8vIHRoZSBfc2lnbmF0dXJlXyBpbWFnZSBvZiB0aGUgc2l0ZVxyXG4gICAgaXRlbXM6IFRyYWNrZWRSU1NpdGVtW107IC8vIHRoZSBSU1MgaXRlbXMgZm9yIHRoZSBhcnRpY2xlcyBvbiB0aGUgc2l0ZVxyXG4gICAgc291cmNlOiBzdHJpbmc7IC8vIExpbmsgdG8gdGhlIFJTUyBmZWVkIGNvbnRlbnQuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBc3NlbWJsZSBhbiBSU1MgZmVlZCBmcm9tIGl0cyBYTUwgcmVwcmVzZW50YXRpb24uXHJcbiAgICAgKiBDb2xsZWN0IGEgYWxsIG5lY2Vzc2FyeSBkYXRhIHRoYXQgYXJlIGF2YWlsYWJsZSBkYXRhIG5hZCBiYWNrZmlsbFxyXG4gICAgICogY2Fub25pY2FsIHByb3BlcnRpZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHhtbCAtIFhNTCByZXByZXNlbnRhdGlvbiBvZiBhbiBSU1MgZmVlZC5cclxuICAgICAqIEBwYXJhbSBzb3VyY2UgLSBUaGUgbG9jYXRpb24gd2hlcmUgdGhlIHhtbCBkYXRhIGNhbWUgZnJvbS4gVXN1YWxseSBhIHVybCBvciBmaWxlIHBhdGguXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBQYXJzaW5nIG9wdGlvbnMuXHJcbiAgICAgKiBAcmV0dXJucyBGZWVkIG9ia2VjdCB7VHJhY2tlZFJTU2ZlZWR9IGNvbnRhaWluZyBhbGwgcmVsZXZhbnQgcHJvcGVydGllcyB0aGF0XHJcbiAgICAgKiAgICAgICAgICB3ZXJlIGF2YWlsYWJsZSBpbiB0aGUgZmVlZC5cclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoeG1sOiBzdHJpbmcsIHNvdXJjZTogc3RyaW5nLCBvcHRpb25zOiBSZWFkZXJPcHRpb25zID0gREVGQVVMVF9PUFRJT05TKSB7XHJcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICAgICAgb3B0aW9ucy5iYXNlVXJsID0gc291cmNlLm1hdGNoKC9baHRwc10rOlxcL1xcL1teXFwvXSsoPz1cXC8qKS8pPy5bMF07XHJcblxyXG4gICAgICAgIGNvbnN0IGZlZWQgPSBleHRyYWN0RnJvbVhtbCh4bWwudHJpbVN0YXJ0KCksIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBsZXQgeyBsaW5rLCB0aXRsZSwgZGVzY3JpcHRpb24sIGltYWdlLCBlbnRyaWVzIH0gPSBmZWVkIGFzIElGZWVkRGF0YUV4dGVuZGVkO1xyXG5cclxuICAgICAgICBpZiAobGluaykge1xyXG4gICAgICAgICAgICB0aGlzLnNpdGUgPSBsaW5rLnN0YXJ0c1dpdGgoXCIvXCIpICYmIG9wdGlvbnMuYmFzZVVybCA/IG9wdGlvbnMuYmFzZVVybCArIGxpbmsgOiBsaW5rO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSB0eXBlb2YgZGVzY3JpcHRpb24gPT09IFwic3RyaW5nXCIgPyBkZXNjcmlwdGlvbiA6IChkZXNjcmlwdGlvbiBhcyBUUHJvcGVydHlCYWcpW1wiI3RleHRcIl07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW1hZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IGltYWdlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbnRyaWVzKSkge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gKGVudHJpZXMgYXMgQXJyYXk8SUVudHJ5RGF0YUV4dGVuZGVkPikubWFwKGUgPT4gbmV3IFRyYWNrZWRSU1NpdGVtKGUpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gW11cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIGEgZmlsZW5hbWUgZm9yIHRoaXMgUlNTIGZlZWQuXHJcbiAgICAgKiBAcmV0dXJucyBBIHZhbGlkIGZpbGVuYW1lLlxyXG4gICAgICovXHJcbiAgICBnZXQgZmlsZU5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdG9GaWxlbmFtZShkZWNvZGUodGhpcy50aXRsZSA/PyBcIlVudGl0bGVkXCIsIHsgbW9kZTogRGVjb2RpbmdNb2RlLlN0cmljdCwgbGV2ZWw6IEVudGl0eUxldmVsLkhUTUwgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMgdGhlIGF2YXJhZ2UgdGltZSBpbnRlcnZhbCBiZXR3ZWVuIHBvc3RzIG9mIHRoZSBmZWVkIGluIGhvdXJzLlxyXG4gICAgICovXHJcbiAgICBnZXQgYXZnUG9zdEludGVydmFsKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHB1YmRhdGVNaWxsaWVzID0gdGhpcy5pdGVtcy5tYXAoaXQgPT4gbmV3IERhdGUoaXQucHVibGlzaGVkKS52YWx1ZU9mKCkpLnNvcnQoKTtcclxuICAgICAgICBjb25zdCBuID0gcHViZGF0ZU1pbGxpZXMubGVuZ3RoIC0gMTsgLy8gbnVtYmVyIG9mIGludGVydmFscyBiZXR3ZWVuIHBvc3RzXHJcbiAgICAgICAgaWYgKG4gPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhNYXRoLnJvdW5kKChwdWJkYXRlTWlsbGllc1tuXSAtIHB1YmRhdGVNaWxsaWVzWzBdKSAvIChuICogNjAgKiA2MCAqIDEwMDApKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbn0iXX0=