import { ReaderOptions, FeedEntry } from '@extractus/feed-extractor';
/**
 * Type for property bag objects (key -> value) with unknown content.
 */
export declare type TPropertyBag = {
    [key: string]: any;
};
/**
 * Enumeration of recognized media types.
 */
export declare enum MediumType {
    Unknown = "?",
    Image = "image",
    Video = "video",
    Audio = "audio"
}
/**
 * Specification of a medium object reference within an RSS feed.
 */
export interface IRssMedium {
    src: string;
    type: MediumType;
    width?: string;
    height?: string;
}
/**
 * Specification of the tracked properties of an RSS item.
 * Some properties overlap with the property specification in the
 * `FeedEntry` interface. These will get special attention during
 * parsing.
 */
interface IEntryDataTracked {
    id: string;
    title?: string;
    description?: string;
    published?: string;
    category?: string[] | object[];
    creator?: string | string[] | object[];
    image?: IRssMedium;
    media: IRssMedium[];
    content?: string;
}
/**
 * Specification of a parsed RSS item including canonical and
 * specifically tracked properties.
 */
interface IEntryDataExtended extends IEntryDataTracked, FeedEntry {
}
/**
 * A tracked RSS feed item with a canonical set of properties
 * collected from available sources.
 */
export declare class TrackedRSSitem {
    id: string;
    tags: string[];
    description?: string;
    title: string;
    link?: string;
    published: string;
    author?: string;
    image?: IRssMedium;
    media: IRssMedium[];
    content?: string;
    /**
     * Build a RSS item representation object.
     * @param entry - The parsed RSS item data.
     */
    constructor(entry: IEntryDataExtended);
    /**
     * Get a filename which is derived from the item*s title and is suitable for
     * writing this item to disk.
     * @returns Filename for this item
     */
    get fileName(): string;
}
/**
 * Representation of an RSS feed with a canoiccal set of properties
 * collected from available sources.
 */
export declare class TrackedRSSfeed {
    title?: string;
    description?: string;
    site?: string;
    image?: IRssMedium;
    items: TrackedRSSitem[];
    source: string;
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
    constructor(xml: string, source: string, options?: ReaderOptions);
    /**
     * Get the a filename for this RSS feed.
     * @returns A valid filename.
     */
    get fileName(): string;
    /**
     * @returns the avarage time interval between posts of the feed in hours.
     */
    get avgPostInterval(): number;
}
export {};
