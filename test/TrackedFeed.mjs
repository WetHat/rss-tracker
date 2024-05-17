import * as Parser from 'rss-parser';
/**
 * A builder class to assembly a normalized RSS feed represenstion suitable
 * for creating a usefull Markdown representation.
 */
export default class TrackedFeed {
    static DEFAULT_OPTIONS = {
        customFields: {
            item: [
                "media:group",
                "media:thumbnail",
                "media:description"
            ],
            feed: []
        }
    };
    parser;
    constructor(options = TrackedFeed.DEFAULT_OPTIONS) {
        this.parser = new Parser(options);
    }
    assembleImage(element) {
        let img = element.image || element['media:thumbnail'] || element["media:group"]?.["media:thumbnail"] || {};
        if (Array.isArray(img)) {
            img = img[0];
        }
        img = img["$"] || img;
        return {
            url: img["url"],
            width: img["width"],
            height: img["height"]
        };
    }
    assembleDescription(element) {
        let desc = element.description || element["media:description"] || element["media:group"]?.["media:description"] || "";
        return Array.isArray(desc) ? desc.join(" ") : desc;
    }
    assembleFeed(feed) {
        let cooked = {};
        // canonical fields
        cooked["feedTitle"] = feed.title;
        cooked["feedUrl"] = feed.feedUrl;
        cooked["siteUrl"] = feed.link;
        cooked["siteDescription"] = feed.description ?? "";
        cooked["siteImage"] = this.assembleImage(feed);
        let items = feed.items;
        cooked['items'] = items.map(item => {
            let cookedItem = {};
            // canonical fields
            cookedItem["itemTitle"] = item.title;
            cookedItem["itemUrl"] = item.link;
            cookedItem["itemDescription"] = this.assembleDescription(item);
            cookedItem["itemID"] = item.id || item.guid;
            cookedItem["itemAuthor"] = item.creator || item.author || item["dc:creator"] || "";
            cookedItem["itemPublished"] = item.isoDate;
            cookedItem["itemContent"] = item["content:encoded"] || "";
            cookedItem["itemImage"] = this.assembleImage(item);
            cookedItem["itemTags"] = item["categories"] ?? [];
            return cookedItem;
        });
        return cooked;
    }
    async parseUrl(url) {
        return this.assembleFeed(await this.parser.parseURL(url));
    }
    async parseString(xml) {
        return this.assembleFeed(await this.parser.parseString(xml));
    }
}
