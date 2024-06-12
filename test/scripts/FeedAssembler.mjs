import { extractFromXml } from '@extractus/feed-extractor';
import { decode, DecodingMode, EntityLevel } from "entities";
/**
 * Utility to convert a string into a valid filename.
 * @param name - A string, such as a title, to create a filename for.
 * @returns valid filename
 */
function toFilename(name) {
    let fname = name
        .replace(/\s*[htps]+:\/\/.*/, "…") // strip urls
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
        .replaceAll("&", "+")
        .replaceAll("*", "✱");
    if (fname.length > 80) {
        fname = fname
            .substring(0, 80)
            .trim() + "…";
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
    id; // A reasonably unique id of an rss item.
    tags; // a list of tags describing the item.
    description; // Item description
    title; // item title
    link; // hyperlink to article.
    published; // publish date
    author; // one or more authors
    image; // The items image
    media; // A list of media associated with the articls
    content; // Optinal item content (in most cases a HTML fragment)
    /**
     * Build a RSS item representation object.
     * @param entry - The parsed RSS item data.
     */
    constructor(entry) {
        let { id, title, description, published, link, creator, image, content, media } = entry;
        this.id = id;
        this.media = media;
        this.tags = (entry.category ?? [])
            .map(c => (typeof c === "string" ? c : c["#text"]))
            .join(",") // turn everything into a comma separated list to catch internal commas
            .split(",") // abd pull it apart again
            .map(c => {
            //return one cleaned up category
            return c.replace(/^#(?=\w)|["\[\]\{\}]+/g, "")
                .replaceAll("#", "＃")
                .replaceAll(".", "〭")
                .replaceAll("&", "＆")
                .replace(/[:;\\/]/g, " ")
                .replace(/\s+/, " ")
                .trim();
        })
            .filter(c => !!c); // remove empty strings;
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
        this.title = title ?? `${creator} - ${published}`;
        if (link) {
            if (typeof link !== "string") {
                link = link["@_href"];
            }
            this.link = link;
        }
        this.author = creator;
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
    return media ?? [];
}
/**
 * Get the _signature_ image associated with the article described
 * by an RSS item
 * @param elem - The parsed RSS item
 * @returns Image medium object, if available.
 */
function assembleImage(elem) {
    let { image } = elem;
    if (typeof image === 'string') {
        return { src: image, type: MediumType.Image };
    }
    if (image?.url) {
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
        let [width, height] = [thumb["@_width"], thumb["@_height"]];
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
    if (enc?.["@_type"]?.includes("image")) {
        let img = { src: enc["@_url"], type: MediumType.Image };
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
        return creator;
    }
    return elem.author?.name || elem.author;
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
    descriptionMaxLen: 5000,
    getExtraEntryFields: (item) => {
        let { id, guid } = item, tracked = {
            id: id || guid?.["#text"] || item.link,
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
        let content = item["content:encoded"] || item.content;
        if (content) {
            tracked.content = typeof content === "string" ? content : content["#text"];
        }
        let title = item.title;
        if (!title) {
            // a title is mandatory - synthesize one
            title = published;
        }
        // remove linefeeds and extra spaces
        tracked.title = (title["#text"] ?? title).replace(/[\s\r\n]+/g, " ");
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
 * Representation of an RSS feed with a canocical set of properties
 * collected from available sources.
 */
export class TrackedRSSfeed {
    title; // Feed title
    description; // Feed Description
    site; // the web site the Feed was published for.
    image; // the _signature_ image of the site
    items; // the RSS items for the articles on the site
    source; // Link to the RSS feed content.
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
        this.source = source;
        options.baseUrl = source.match(/[htps]+:\/\/[^\/]+(?=\/*)/)?.[0];
        const feed = extractFromXml(xml, options);
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
        return toFilename(decode(this.title ?? "Untitled", { mode: DecodingMode.Strict, level: EntityLevel.HTML }));
    }
    /**
     * @returns the avarage time interval between posts of the feed in hours.
     */
    get avgPostInterval() {
        let pubdateMillies = this.items.map(it => new Date(it.published).valueOf()).sort();
        const n = pubdateMillies.length - 1; // number of intervals between posts
        if (n > 0) {
            return Math.round((pubdateMillies[n] - pubdateMillies[0]) / (n * 60 * 60 * 1000));
        }
        return 1;
    }
}
