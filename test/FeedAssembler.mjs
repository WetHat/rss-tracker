import { extractFromXml } from '@extractus/feed-extractor';
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
    return null;
}
function assembleCreator(elem) {
    let { creator, author } = elem;
    if (creator) {
        return creator;
    }
    if (creator = elem["dc:creator"]) {
        return creator;
    }
    return author.name;
}
function assembleDescription(elem) {
    let { description } = elem;
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
const DEFAULT_OPTIONS = {
    getExtraEntryFields: (item) => {
        let { category, pubDate, guid, id, published } = item;
        if (!id && guid) {
            id = guid["#text"];
        }
        let extra = {
            category: typeof category === "string" ? [category] : category,
            published: published || pubDate || "",
            id: id,
            description: assembleDescription(item) ?? ""
        };
        let creator = assembleCreator(item);
        if (creator) {
            extra.creator = creator;
        }
        let image = assembleImage(item);
        if (image) {
            extra.image = image;
        }
        let content = item["content:encoded"];
        if (content) {
            extra.content = content;
        }
        return extra;
    },
    getExtraFeedFields: (feedData) => {
        let extra = {};
        let image = assembleImage(feedData);
        if (image) {
            extra.image = image;
        }
        return extra;
    },
};
function assembleFeed(feed) {
    const { description, title, link, image, entries } = feed;
    // populate the feed obj with all mandatory fields
    let feedObj = {
        feedDescription: description ?? "",
        feedTitle: title ?? "",
        siteUrl: link ?? "",
        items: entries?.map((entry) => {
            const { category, description, id, title, link, published, creator, image, content } = entry;
            // populate the mandatory properties
            let itemObj = {
                itemTags: category ?? [],
                itemDescription: description ?? "",
                itemID: id,
                itemTitle: title ?? `${creator} - ${published}`,
                itemUrl: link ?? "",
                itemPublished: published ?? "",
                itemAuthor: creator ?? ""
            };
            if (image) {
                itemObj.itemImage = image;
            }
            if (content) {
                itemObj.itemContent = content;
            }
            return itemObj;
        }) ?? []
    };
    // add optional fields
    if (image) {
        feedObj.siteImage = image;
    }
    return feedObj;
}
export function assembleFromXml(xml, options = DEFAULT_OPTIONS) {
    return assembleFeed(extractFromXml(xml, options));
}
