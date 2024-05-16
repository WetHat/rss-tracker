import * as RssParser from 'rss-parser';

export interface IRSSImage {
    url: string;
    width: string;
    height: string;
}

export type TParserOptions = {[key: string] : any};

export type TRssFeedElement = {[key: string] : any};
export type TRssFeed = TRssFeedElement
type TRssFeedItem = TRssFeedElement;

type TRssData = any[] | {[key: string] : any} | any;

/**
 * A builder class to assembly a normalized RSS feed represenstion suitable
 * for creating a usefull Markdown representation.
 */
export default class TrackedFeed {
    static readonly DEFAULT_OPTIONS: TParserOptions = {
        customFields: {
            item: [
                "media:group",
                "media:thumbnail",
                "media:description"
            ],
            feed: [
            ]
        }
    };

    parser: RssParser;

    constructor(options: TParserOptions = TrackedFeed.DEFAULT_OPTIONS) {
        this.parser = new RssParser(options);
    }

    private assembleImage(element: TRssFeedElement): IRSSImage  {
        let img: TRssData = element.image || element['media:thumbnail'] || element["media:group"]?.["media:thumbnail"] || {};
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

    private assembleDescription(element: TRssFeedElement): string {
        let desc : string | string[] = element.description || element["media:description"] || element["media:group"]?.["media:description"] || "";

        return Array.isArray(desc) ? desc.join(" ") : desc;
    }

    private assembleFeed(feed :TRssFeed) :TRssFeed {
        let cooked: TRssFeed = {};

        // canonical fields
        cooked["feedTitle"] = feed.title;
        cooked["feedUrl"] = feed.feedUrl;
        cooked["siteUrl"] = feed.link;
        cooked["siteDescription"] = feed.description ?? "";

        cooked["siteImage"] = this.assembleImage(feed);

        let items: TRssFeedItem[] = feed.items;

        cooked['items'] = items.map( item => {
            let cookedItem: TRssFeedItem = {};

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
        })

        return cooked;
    }

    async parseUrl(url:string) : Promise<TRssFeed> {
       return this.assembleFeed(await this.parser.parseURL(url));
    }

    async parseString(xml:string) : Promise<TRssFeed>   {
        return this.assembleFeed(await this.parser.parseString(xml));
    }
}