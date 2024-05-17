import {extractFromXml,FeedData,ReaderOptions,FeedEntry} from '@extractus/feed-extractor'

type TPropertyBag = {[key: string] :any};

interface IRSSimage {
    url: string;
    width?: string;
    height?:string;
}

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

interface IRSSfeed {
    feedTitle: string;
    feedDescription: string;
    siteUrl: string;
    siteImage?: IRSSimage;
    content?: string;
    items: IRSSitem[];
}

//////////////////////////////////////
interface IEntryDataExtra{
    category?: string[] ;
    published?: string;
    id: string;
    creator?: string;
    image?: IRSSimage;
    content?: string;
    description?: string;
}

interface IEntryDataExtended extends IEntryDataExtra,FeedEntry {
}

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
    let {description} = elem;
    if (description) {
        return description;
    }

    description = elem["media:description"];
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
    getExtraEntryFields: (item: TPropertyBag): IEntryDataExtra => {
        let {category,pubDate, guid,id,published} = item;
        if (!id && guid) {
            id = guid["#text"];
        }

        let extra: IEntryDataExtra = {
            category: typeof category === "string" ? [category] : category,
            published:  published || pubDate || "",
            id: id,
            description: assembleDescription(item) ?? ""
        }

        let creator: string = assembleCreator(item);
        if (creator) {
            extra.creator = creator;
        }

        let image = assembleImage(item);
        if (image) {
            extra.image = image;
        }

        let content: string = item["content:encoded"];
        if (content) {
            extra.content = content;
        }
        return extra;
    },
    getExtraFeedFields: (feedData: TPropertyBag ) => {
        let extra: IFeedDataExtra = {};
        let image = assembleImage(feedData);
        if (image) {
            extra.image = image;
        }
        return extra;
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
        feedObj.siteImage = image;
    }

    return feedObj;
}

export function assembleFromXml(xml:string,options=DEFAULT_OPTIONS) : IRSSfeed {
    return assembleFeed(extractFromXml(xml,options));
}