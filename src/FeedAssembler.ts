import {extractFromXml,FeedData,ReaderOptions,FeedEntry} from '@extractus/feed-extractor'

/**
 * Type for property bag objects with unknown content.
 */
type TPropertyBag = {[key: string] :any};

/**
 * An image reference within an RSS feed.
 */
interface IRSSimage {
    url: string;
    width?: string;
    height?:string;
}

/**
 * Specification of an item of an RSS feed.
 */
interface IRSSitem {
    itemTags: string[];
    itemDescription: string;
    itemID: string;
    itemTitle: string;
    itemUrl: string;
    itemPublished: string;
    itemAuthor: string;
    itemImage?: IRSSimage;
    itemContent?:string;
}

/**
 * Specification of an RSS feed.
 */
interface IRSSfeed {
    feedTitle: string;
    feedDescription: string;
    siteUrl: string;
    feedImage?: IRSSimage;
    items: IRSSitem[];
}

//////////////////////////////////////

/**
 * Specification of the tracked properties of an RSS item.
 * Some properties overlap with the property specification in the
 * `FeedEntry` interface.
 */
interface IEntryDataTracked{
    id: string;
    description?:string;
    published?: string;
    category?: string[] ;
    creator?: string;
    image?: IRSSimage;
    content?: string;
}

/**
 * Specification of a parsed RSS item including canonical and
 * extra properties.
 */
interface IEntryDataExtended extends IEntryDataTracked, FeedEntry {
}

/**
 * Specification of tracked properties of an RSS feed.
 */
interface IFeedDataExtra {
    image?: IRSSimage
}

interface IFeedDataExtended extends IFeedDataExtra,FeedData {
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

function assembleFeed(feed: IFeedDataExtended): IRSSfeed {
    const {description,title,link,image, entries} = feed;

    // populate the feed obj with all mandatory fields
    let feedObj: IRSSfeed = {
        feedDescription: description ?? "",
        feedTitle: title ?? "",
        siteUrl: link ?? "",

        items: entries?.map( (entry: IEntryDataExtended): IRSSitem  => {
            const {category,description,id,title,link,published,creator,image,content} = entry;
            // populate the mandatory properties
            let itemObj: IRSSitem = {
                itemTags: category ?? [],
                itemDescription: description ?? "",
                itemID: id,
                itemTitle: title ?? `${creator} - ${published}`,
                itemUrl: link ?? "",
                itemPublished: published ?? "",
                itemAuthor: creator ?? ""
            }
            if (image) {
                itemObj.itemImage = image;
            }
            if (content) {
                itemObj.itemContent = content;
            }
            return itemObj;
        }) ?? []};

    // add optional fields
    if (image) {
        feedObj.feedImage = image;
    }

    return feedObj;
}

export function assembleFromXml(xml:string,options=DEFAULT_OPTIONS) : IRSSfeed {
    return assembleFeed(extractFromXml(xml,options));
}