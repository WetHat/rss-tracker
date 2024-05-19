import { extractFromXml, extract } from '@extractus/feed-extractor';
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
        this.tags = this.tags = category ?? [];
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
        return { url: image };
    }
    if (image?.url) {
        const { url, width, height } = image;
        let img = { url: url };
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
        let img = { url: thumb["@_url"] };
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
        let img = { url: enc["@_url"] };
        return img;
    }
    return null;
}
function assembleCreator(elem) {
    const creator = elem.creator || elem["dc:creator"];
    if (creator) {
        return creator;
    }
    return elem.author?.name;
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
            tracked.title = published;
        }
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
    /**
     * Factory method to assemble an RSS feed from its XMK representation.
     * @param xml {string} - XML represntation of an RSS feed.
     * @param options {ReaderOptions} Parsing options.
     * @returns Feed obkect {TrackedRSSfeed} contaiing all relevant properties that
     *          were available in the feed.
     */
    static assembleFromXml(xml, options = DEFAULT_OPTIONS) {
        return new TrackedRSSfeed(extractFromXml(xml, options));
    }
    static async assembleFromUrl(url, options = DEFAULT_OPTIONS) {
        return new TrackedRSSfeed(await extract(url, options));
    }
    title;
    description;
    site;
    image;
    items;
    constructor(feed) {
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
}
