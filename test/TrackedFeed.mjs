import * as RssParser from 'rss-parser';
export default class TrackedFeed {
    static DEFAULT_OPTIONS = {
        customFields: {
            item: [
                "media:group",
                "media:thumbnail",
                "media:description"
            ]
        }
    };
    parser;
    constructor(options = TrackedFeed.DEFAULT_OPTIONS) {
        this.parser = new RssParser.default(options);
    }
    normalizeFeed(feed) {
        let cooked = {};
        // canonical fields
        cooked["feedTitle"] = feed.title;
        cooked["feedUrl"] = feed.feedUrl;
        cooked["siteUrl"] = feed.link;
        cooked["siteDescription"] = feed.description ?? "";
        cooked["siteImage"] = feed.image?.url ?? "";
        let items = feed.items;
        cooked['items'] = items.map(item => {
            let cookedItem = {};
            // canonical fields
            cookedItem["itemTitle"] = item.title;
            cookedItem["itemUrl"] = item.link;
            cookedItem["itemDescription"] = item.description || item["media:description"] || item["media:group"]?.["media:description"] || "";
            cookedItem["itemID"] = item.id || item.guid;
            cookedItem["itemAuthor"] = item.creator || item.author || item["dc:creator"] || "";
            cookedItem["itemPublished"] = item.isoDate;
            cookedItem["itemContent"] = item["content:encoded"] || "";
            cookedItem["itemImage"] = item['media:thumbnail'] || item["media:group"]?.["media:thumbnail"] || "";
            return cookedItem;
        });
        return cooked;
    }
    async parseUrl(url) {
        return this.normalizeFeed(await this.parser.parseURL(url));
    }
    async parseString(xml) {
        return this.normalizeFeed(await this.parser.parseString(xml));
    }
}
