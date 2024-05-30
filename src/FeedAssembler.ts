import { extractFromXml, FeedData, ReaderOptions, FeedEntry } from '@extractus/feed-extractor'

/**
 * Utility to convert a string into a valid filename.
 * @param name - A string, such as a title, to create a filename for.
 * @returns valid filename
 */
function toFilename(name: string): string {
    return name.replace(/\w+:\/\/.*/, "") // strip urls
        .replaceAll("?", "❓")
        .replaceAll(".", "․")
        .replaceAll(":", "꞉")
        .replaceAll('"', "″")
        .replaceAll('<"', "＜")
        .replaceAll('>"', "＞")
        .replaceAll('|"', "∣")
        .replaceAll("\\", "/")
        .replaceAll("/", "╱")
        .replaceAll("[", "{")
        .replaceAll("]", "}")
        .replaceAll("#", "＃")
        .replaceAll("^", "△")
        .replaceAll("&", "+")
        .replaceAll("*", "✱")
        .substring(0, 80)
        .trim();
}

/**
 * Type for property bag objects (key -> value) with unknown content.
 */
export type TPropertyBag = { [key: string]: any };

export enum MediumType {
    Unknown = "?",
    Image = "image",
    Video = "video",
    Audio = "audio"
}

/**
 * Specification of an image reference within an RSS feed.
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
    category?: string[];
    creator?: string;
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
 * Specification of specifically tracked properties of an RSS feed.
 */
interface IFeedDataExtra {
    image?: IRssMedium,
    link?: string;
}
/**
 * Specification of a parsed RSS feed including canonical and
 * tracked properties.
 */
interface IFeedDataExtended extends IFeedDataExtra, FeedData {
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
    image?: IRssMedium;
    media: IRssMedium[];
    content?: string;

    constructor(entry: IEntryDataExtended) {
        this.tags = entry.category ?? [];
        let { id, title, description, published, link, category, creator, image, content, media } = entry;
        this.id = id;
        this.media = media;
        this.tags = category?.map(c => {
            const category = typeof c === "string" ? c : c["#text"];
            //return a cleaned up category
            return category.replace(/^#(?=\w)|["\[\]\{\}]+/g, "")
                .replaceAll("#","＃")
                .replaceAll(".","〭")
                .replaceAll("&","＆")
                .replace(/[:;\\/]/g, " ")
                .replace(/\s+/," ");
        }) ?? [];

        if (description) {
            this.description = description;
        }

        if (published) {
            // normalize date
            const ticks = Date.parse(published);
            if (!isNaN(ticks)) {
                published = new Date(ticks).toISOString();
            }
        } else {
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

    get fileName(): string {
        return toFilename(this.title);
    }
}

function assembleMedia(elem: TPropertyBag): IRssMedium[] {

    let mediaContent = elem["media:content"],
        media: IRssMedium[] | null = null;

    if (!mediaContent) {
        let group = elem["media:group"];
        if (group) {
            mediaContent = group["media:content"];
        }
    }

    if (mediaContent && !Array.isArray(mediaContent)) {
        mediaContent = [mediaContent];
    }

    if (mediaContent) {
        media = mediaContent.map((mc: TPropertyBag): IRssMedium => {
            const type: string = mc["@_type"] || mc["@_medium"];

            let mediumType = MediumType.Unknown;
            if (type.includes("image")) {
                mediumType = MediumType.Image;
            } else if (type.match(/video|shock/)) {
                mediumType = MediumType.Video;
            } else if (type.includes("audio")) {
                mediumType = MediumType.Audio;
            }

            let medium: IRssMedium = { src: mc["@_url"], type: mediumType };
            const
                width: string = elem["@_width"],
                height: string = elem["@_height"];
            if (width && height) {
                medium["width"] = width;
                medium["height"] = height;
            }
            return medium;
        });
    }
    return media ?? [];
}

function assembleImage(elem: TPropertyBag): IRssMedium | null {
    let { image } = elem;

    if (typeof image === 'string') {
        return { src: image, type: MediumType.Image };
    }

    if (image?.url) {
        const { url, width, height } = image;
        let img: IRssMedium = { src: url, type: MediumType.Image };
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
        let img: IRssMedium = { src: thumb["@_url"], type: MediumType.Image };
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
        let img: IRssMedium = { src: enc["@_url"], type: MediumType.Image };

        return img;
    }
    return null;
}

function assembleCreator(elem: TPropertyBag): string {
    const creator = elem.creator || elem["dc:creator"];
    if (creator) {
        return creator;
    }
    return elem.author?.name || elem.author;
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
        let
            { id, guid } = item,
            tracked: IEntryDataTracked = {
                id: id || guid?.["#text"] || item.link,
                media: assembleMedia(item)
            }

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
            title = published;
        }
        // remove linefeeds and extra spaces
        tracked.title = title.replace(/[\s\r\n]+/g, " ");

        return tracked;
    },

    getExtraFeedFields: (feedData: TPropertyBag) => {
        let tracked: IFeedDataExtra = {};
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
                        break
                    }
                }
            } else {
                tracked.link = link;
            }
        }

        return tracked;
    },
}

export class TrackedRSSfeed {
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
    constructor(xml: string, source: string, options: ReaderOptions = DEFAULT_OPTIONS) {
        this.source = source;
        const feed = extractFromXml(xml, options);
        let { link, title, description, image, entries } = feed as IFeedDataExtended;
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
            this.items = (entries as Array<IEntryDataExtended>).map(e => new TrackedRSSitem(e));
        } else {
            this.items = []
        }
    }

    get fileName(): string {
        return toFilename(this.title ?? "Untitled");
    }

    /**
     * @returns the avarage time interval between posts in the feed in hours.
     */
    get avgPostInterval(): number {
        let pubdateMillies = this.items.map(it => new Date(it.published).valueOf()).sort();
        const n = pubdateMillies.length - 1; // number of intervals between posts
        if (n > 0) {
            return Math.round((pubdateMillies[n] - pubdateMillies[0]) / (n * 60 * 60 * 1000));
        }

        return 1;
    }

}