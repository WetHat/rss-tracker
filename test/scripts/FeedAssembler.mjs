import { extractFromXml } from '@extractus/feed-extractor';
/**
 * Utility to convert a string into a valid filename.
 * @param name - A string, such as a title, to create a filename for.
 * @returns valid filename
 */
function toFilename(name) {
    return name.replace(/\w+:\/\/.*/, "") // strip urls
        .replaceAll("?", "❓")
        .replaceAll(".", "․")
        .replaceAll(":", "꞉")
        .replaceAll('"', "″")
        .replaceAll('<"', "＜")
        .replaceAll('>"', "＞")
        .replaceAll('|"', "∣")
        .replaceAll("\\", "/")
        .replaceAll("/", "╱")
        .replaceAll("[", "{")
        .replaceAll("]", "}")
        .replaceAll("#", "＃")
        .replaceAll("^", "△")
        .replaceAll("&", "+")
        .replaceAll("*", "✱")
        .substring(0, 80)
        .trim();
}
export var MediumType;
(function (MediumType) {
    MediumType["Unknown"] = "?";
    MediumType["Image"] = "image";
    MediumType["Video"] = "video";
    MediumType["Audio"] = "audio";
})(MediumType || (MediumType = {}));
/**
 * A tracked RSS feed item with all availabe relevant properties.
 */
export class TrackedRSSitem {
    id;
    tags;
    description;
    title;
    link;
    published;
    author;
    image;
    media;
    content;
    constructor(entry) {
        this.tags = entry.category ?? [];
        let { id, title, description, published, link, category, creator, image, content, media } = entry;
        this.id = id;
        this.media = media;
        this.tags = category?.map(c => {
            const category = typeof c === "string" ? c : c["#text"];
            //return a cleaned up category
            return category.replace(/[#"\[\]\{\}}]*/g, "")
                .replace(/[:;\\/]/g, " ");
        }) ?? [];
        if (description) {
            this.description = description;
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
        this.link = link;
        this.author = creator;
        if (image) {
            this.image = image;
        }
        if (content) {
            this.content = content;
        }
    }
    get fileName() {
        return toFilename(this.title);
    }
}
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
///////////////////////////////
const DEFAULT_OPTIONS = {
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
            tracked.category = typeof category === "string" ? [category] : category;
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
        tracked.title = title.replace(/[\s\r\n]+/g, " ");
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
export class TrackedRSSfeed {
    title;
    description;
    site;
    image;
    items;
    source;
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
        const feed = extractFromXml(xml, options);
        let { link, title, description, image, entries } = feed;
        if (title) {
            this.title = title;
        }
        if (description) {
            this.description = description;
        }
        if (link) {
            this.site = link;
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
    get fileName() {
        return toFilename(this.title ?? "Untitled");
    }
    /**
     * @returns the avarage time interval between posts in the feed in hours.
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
