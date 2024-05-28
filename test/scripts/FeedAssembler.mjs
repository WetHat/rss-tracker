import { extractFromXml } from '@extractus/feed-extractor';
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
    content;
    constructor(entry) {
        this.tags = entry.category ?? [];
        let { id, title, description, published, link, category, creator, image, content } = entry;
        this.id = id;
        this.tags = category?.map(c => {
            const category = typeof c === "string" ? c : c["#text"];
            //return a cleaned up category
            return c.replace(/[#"\[\]\{\}}]*/g, "")
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
}
function assembleImage(elem) {
    let { image } = elem;
    if (typeof image === 'string') {
        return { src: image };
    }
    if (image?.url) {
        const { url, width, height } = image;
        let img = { src: url };
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
        let img = { src: thumb["@_url"] };
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
        let img = { src: enc["@_url"] };
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
        let { id, guid } = item;
        let tracked = {
            id: id || guid?.["#text"] || item.link
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
        tracked.title = title.replace(/[\s\r\n]{2,}/g, " ");
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