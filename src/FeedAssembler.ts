import {extractFromXml,extract,FeedData,ReaderOptions,FeedEntry} from '@extractus/feed-extractor'

/**
 * Type for property bag objects with unknown content.
 */
type TPropertyBag = {[key: string] :any};

/**
 * Specification of an image reference within an RSS feed.
 */
interface IRSSimage {
    url: string;
    width?: string;
    height?:string;
}

/**
 * Specification of the tracked properties of an RSS item.
 * Some properties overlap with the property specification in the
 * `FeedEntry` interface.
 */
interface IEntryDataTracked{
    id: string;
    description?:string;
    published?: string;
    category?: string[];
    creator?: string;
    image?: IRSSimage;
    content?: string;
}

/**
 * Specification of a parsed RSS item including canonical and
 * tracked properties.
 */
interface IEntryDataExtended extends IEntryDataTracked, FeedEntry {
}

/**
 * Specification of tracked properties of an RSS feed.
 */
interface IFeedDataExtra {
    image?: IRSSimage
}
/**
 * Specification of a parsed RSS feed including canonical and
 * tracked properties.
 */
interface IFeedDataExtended extends IFeedDataExtra,FeedData {
}

/**
 * A tracked RSS feed item with all availabe relevant properties.
 */
export class TrackedRSSitem {
    id: string;
    tags: string[];
    description?: string;
    title: string;
    link?: string;
    published: string;
    author?: string;
    image?: IRSSimage;
    content?:string;

    constructor(entry: IEntryDataExtended ) {
        this.tags = entry.category ?? [];
        let {id,title,description,published,link,category,creator,image,content} = entry;
        this.id = id;
        this.tags = this.tags = category ?? [];

        if (description) {
            this.description = description;
        }

        this.published = published ?? new Date().toISOString();
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


function assembleImage(elem: TPropertyBag): IRSSimage | null {
    let {image} = elem;

    if (typeof image === 'string') {
        return {url: image};
    }

    if (image?.url) {
        const {url , width, height} = image;
        let img:IRSSimage = {url: url};
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
        let [width,height] = [thumb["@_width"], thumb["@_height"]];
        let img:IRSSimage = {url: thumb["@_url"]};
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

function assembleCreator(elem: TPropertyBag) :string {
    let {creator, author} = elem;
    if (creator) {
        return creator;
    }

    if (creator = elem["dc:creator"]) {
        return creator;
    }

    return author.name;
}

function assembleDescription(elem: TPropertyBag): string {
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
const DEFAULT_OPTIONS: ReaderOptions = {
    getExtraEntryFields: (item: TPropertyBag): IEntryDataTracked => {
        let {id, guid} = item;
        let tracked: IEntryDataTracked = {
            id: id || (guid ? guid["#text"] : ""),
        }

        let description = item.description;
        if (!description && (description = assembleDescription(item))) {
            tracked.description = description;
        }

        let {published,pubDate} = item;
        if (!published && pubDate) {
            tracked.published = pubDate;
        }

        let category = item.category;
        if (category) {
            tracked.category = typeof category === "string" ? [category] : category;
        }

        let creator = item.creator;
        if (!creator && (creator = assembleCreator(item))) {
            tracked.creator = creator;
        }

        let image = assembleImage(item);
        if (image) {
            tracked.image = image;
        }

        let content = item["content:encoded"];
        if (content) {
            tracked.content = content;
        }
        return tracked;
    },

    getExtraFeedFields: (feedData: TPropertyBag ) => {
        let tracked: IFeedDataExtra = {};
        let image = assembleImage(feedData);
        if (image) {
            tracked.image = image;
        }
        return tracked;
    },
}

export class TrackedRSSfeed {
    /**
     * Factory method to assemble an RSS feed from its XMK representation.
     * @param xml {string} - XML represntation of an RSS feed.
     * @param options {ReaderOptions} Parsing options.
     * @returns Feed obkect {TrackedRSSfeed} contaiing all relevant properties that
     *          were available in the feed.
     */
    static assembleFromXml(xml:string,options: ReaderOptions =DEFAULT_OPTIONS) : TrackedRSSfeed {
        return new TrackedRSSfeed(extractFromXml(xml,options));
    }

    static async assembleFromUrl(url:string,options=DEFAULT_OPTIONS) : Promise<TrackedRSSfeed> {
        return new TrackedRSSfeed(await extract(url,options));
    }

    title?: string;
    description?: string;
    site?: string;
    image?: IRSSimage;
    items: TrackedRSSitem[];

    constructor(feed: IFeedDataExtended) {
        let {link,title,description,image,entries} = feed;
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
            this.items = (entries as Array<IEntryDataExtended>).map( e => new TrackedRSSitem(e));
        } else {
            this.items = []
        }
    }
}