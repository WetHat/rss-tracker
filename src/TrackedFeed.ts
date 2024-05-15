import * as RssParser from 'rss-parser';

export interface ICustomRSSFields {
    item: string[];
}

export type TParserOptions = {[key: string] : any};
export type TRssFeed = {[key: string] : any};
export type TRssFeedItem = {[key: string] : any};

export default class TrackedFeed {
    static readonly DEFAULT_OPTIONS: TParserOptions = {
        customFields: {
            item: [
                "media:group",
                "media:thumbnail",
                "media:description"
            ]
        }
    };

    parser: RssParser;

    constructor(options: TParserOptions = TrackedFeed.DEFAULT_OPTIONS) {
        this.parser = new RssParser(options);
    }

    private normalizeFeed(feed :TRssFeed) :TRssFeed {
        let cooked: TRssFeed = {};

        // canonical fields
        cooked["feedTitle"] = feed.title;
        cooked["feedUrl"] = feed.feedUrl;
        cooked["siteUrl"] = feed.link;
        cooked["siteDescription"] = feed.description ?? "";

        cooked["siteImage"] = feed.image?.url ?? "";

        let items: TRssFeedItem[] = feed.items;

        cooked['items'] = items.map( item => {
            let cookedItem: TRssFeedItem = {};

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
        })

        return cooked;
    }

    async parseUrl(url:string) : Promise<TRssFeed> {
       return this.normalizeFeed(await this.parser.parseURL(url));
    }

    async parseString(xml:string) : Promise<TRssFeed>   {
        return this.normalizeFeed(await this.parser.parseString(xml));
    }
}