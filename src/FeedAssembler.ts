import { extractFromXml, FeedData, ReaderOptions, FeedEntry } from '@extractus/feed-extractor'
import { decode, DecodingMode, EntityLevel } from "entities";
/**
 * Utility to convert a string into a valid filename.
 * @param name - A string, such as a title, to create a filename for.
 * @returns valid filename without file extension.
 */
function toFilename(name: string): string {
    let fname = name;
    if (fname.length > 80) {
        // find a cutting location
        const cutAt = fname.indexOf(" ", 80);
        fname = fname
            .substring(0, cutAt > 0 ? cutAt : name.length)
            .trim() + "⋯";
    } else {
        fname = fname.trim();
    }
    return fname
        .replace(/\s*[htps]+:\/\/.*/, "⋯") // strip urls
        .replaceAll("?", "❓")
        .replaceAll(".", "․")
        .replaceAll(":", "꞉")
        .replaceAll('"', "″")
        .replaceAll('<', "＜")
        .replaceAll('>', "＞")
        .replaceAll('|', "∣")
        .replaceAll("\\", "/")
        .replaceAll("/", "╱")
        .replaceAll("[", "{")
        .replaceAll("]", "}")
        .replaceAll("#", "＃")
        .replaceAll("^", "△")
        .replaceAll("&", "＆")
        .replaceAll("*", "✱");
}

/**
 * Type for property bag objects (key -\> value) with unknown content.
 */
export type TPropertyBag = { [key: string]: any };

/**
 * Enumeration of recognized media types.
 */
export enum MediumType {
    Unknown = "?",
    Image = "image",
    Video = "video",
    Audio = "audio"
}

/**
 * Specification of a medium object reference within an RSS feed.
 */
export interface IRssMedium {
    src: string; // hyperlink to object
    type: MediumType; // type of medium
    width?: string; // optional embedding width
    height?: string; // optional embedding height
}

/**
 * Specification of the tracked properties of an RSS item.
 * Some properties overlap with the property specification in the
 * {@link FeedEntry}  interface. These will get special attention during
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
 * Specification of specifically tracked properties of an RSS feed.
 */
interface IFeedDataExtra {
    image?: IRssMedium,
}
/**
 * Specification of a parsed RSS feed including canonical and
 * tracked properties.
 */
interface IFeedDataExtended extends IFeedDataExtra, FeedData {
}

/**
 * A tracked RSS feed item with a canonical set of properties
 * collected from available sources.
 */
export class TrackedRSSitem {
    id: string; // A reasonably unique id of an rss item.
    tags: string[]; // a list of tags describing the item.
    description?: string; // Item description
    title: string; // item title
    link?: string; // hyperlink to article.
    published: string; // publish date
    author?: string; // one or more authors
    image?: IRssMedium; // The items image
    media: IRssMedium[]; // A list of media associated with the articles
    content?: string; // Optional item content (in most cases a HTML fragment)

    /**
     * Build a RSS item representation object.
     * @param entry - The parsed RSS item data.
     */
    constructor(entry: IEntryDataExtended) {
        let { id, title, description, published, link, creator, image, content, media } = entry;
        this.id = id;
        this.media = media;
        this.tags = (entry.category ?? [])
            .map((c: string | object) => {
                let tag = null;
                if (typeof c === "string") {
                    tag = c;
                } else if (typeof c === "object") {
                    const cObj = c as { [key: string]: string };
                    tag = cObj["#text"] || cObj["@_term"] || cObj["@_label"] || c.toString();
                } else {
                    tag = "undefined"
                }
                return tag?.replace(/[+&]/g, ",");
            })
            .join(",") // turn everything into a comma separated list to catch internal commas
            .split(",") // abd pull it apart again
            .map(c => {
                // return one cleaned up category
                return c.trim()
                    .replace(/^#|\s*[;"\]\}\)\{\[\(]+\s*/g, "")
                    .replaceAll("#", "＃")
                    .replaceAll("\s*:\s*", "꞉")
                    .replaceAll(".", "۔")
                    .replace(/"'/g, "ʹ")
                    .replace(/\s*\\+\s*/g, "/")
                    .replace(/\s+/g, "_");
            })
            .filter(c => !!c) // remove empty strings;

        // make unique and sort
        this.tags = Array.from(new Set<string>(this.tags)).sort();

        if (description) {
            this.description = typeof description === "string" ? description : (description as TPropertyBag)["#text"];
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

        if (link) {
            if (typeof link !== "string") {
                link = (link as TPropertyBag)["@_href"];
            }
            this.link = link;
        }

        this.author = Array.isArray(creator) ? creator.join(",") : (creator ?? "unknown");
        if (image) {
            this.image = image;
        }
        if (content) {
            this.content = content;
        }
    }

    /**
     * Get a filename which is derived from the item*s title and is suitable for
     * writing this item to disk.
     * @returns Filename for this item
     */
    get fileName(): string {
        return toFilename(decode(this.title, { mode: DecodingMode.Strict, level: EntityLevel.HTML }));
    }
}

/**
 * Gather media associated with an RSS item.
 * @param elem - The parsed RSS item
 * @returns A media content list.
 */
function assembleMedia(elem: TPropertyBag): IRssMedium[] {

    let
        mediaContent = elem["media:content"] || elem["enclosure"],
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
            if (type) {
                if (type.includes("image")) {
                    mediumType = MediumType.Image;
                } else if (type.match(/video|shock/)) {
                    mediumType = MediumType.Video;
                } else if (type.includes("audio")) {
                    mediumType = MediumType.Audio;
                }
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

/**
 * Get the _signature_ image associated with the article described
 * by an RSS item
 * @param elem - The parsed RSS item
 * @returns Image medium object, if available.
 */
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
        const [width, height] = [thumb["@_width"], thumb["@_height"]];
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
        return { src: enc["@_url"], type: MediumType.Image };
    }

    let media = elem["media:content"];
    if (media && media["@_type"]?.includes("image")) {
        const [width, height] = [media["@_width"], media["@_height"]];
        let img: IRssMedium = { src: media["@_url"], type: MediumType.Image };
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

/**
 * Collect author information for the article described by
 * an RSS item.
 * @param elem - The parsed RSS item.
 * @returns Author(s), if available.
 */
function assembleCreator(elem: TPropertyBag): string | null {
    const creator = elem.creator || elem["dc:creator"];
    if (creator) {
        return typeof creator === "string" ? creator : creator["#text"];
    }
    const author = elem.author;
    if (!author || typeof author === "string") {
        return author;
    }
    if (Array.isArray(author)) {
        return author.map((a: TPropertyBag) => a.name).join(", ");
    }
    return author?.name || author;
}

function assembleDescription(elem: TPropertyBag): string | null {
    let description = elem["media:description"];
    if (!description) {
        let group = elem["media:group"];
        if (group) {
            description = group["media:description"];
        }
    }

    return description;
}

/**
 * Custom RSS item and feed processing instructions to build
 * the desired feed representation.
 */
const DEFAULT_OPTIONS: ReaderOptions = {
    descriptionMaxLen: 0, // infinite length
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
            tracked.category = Array.isArray(category) ? category : [category];
        }

        let creator = item.creator || assembleCreator(item);
        if (creator) {
            tracked.creator = creator;
        }

        const image = assembleImage(item);
        if (image) {
            tracked.image = image;
        }

        let content = item["content:encoded"] || item.content || item["dc:content"];
        if (content) {
            tracked.content = typeof content === "string" ? content : content["#text"];
        }

        let title = item.title;
        if (!title) {
            // a title is mandatory - synthesize one
            title = published;
        }
        // remove linefeeds and extra spaces
        tracked.title = (title["#text"] ?? title).toString().replace(/[\s\r\n]+/g, " ");

        return tracked;
    },

    getExtraFeedFields: (feedData: TPropertyBag) => {
        let tracked: IFeedDataExtended = {};
        const image = assembleImage(feedData);
        if (image) {
            tracked.image = image;
        }

        // try to find the site link. This is part of FeedData interface
        // but we need to be sure it is passed though in the right way.
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

/**
 * Representation of an RSS feed with a canonical set of properties
 * collected from available sources.
 */
export class TrackedRSSfeed {
    title?: string; // Feed title
    description?: string; // Feed Description
    site?: string; // the web site the Feed was published for.
    image?: IRssMedium; // the _signature_ image of the site
    items: TrackedRSSitem[]; // the RSS items for the articles on the site
    source: string; // Link to the RSS feed content.

    /**
     * Assemble an RSS feed from its XML representation.
     * Collect a all necessary data that are available data nad backfill
     * canonical properties.
     *
     * @param xml - XML representation of an RSS feed.
     * @param source - The location where the xml data came from. Usually a url or file path.
     * @param options - Optional Parsing options.
     * @returns Feed object {@link TrackedRSSfeed} containing all relevant properties that
     *          were available in the feed.
     */
    constructor(xml: string, source: string, options: ReaderOptions = DEFAULT_OPTIONS) {
        this.source = source;
        options.baseUrl = source.match(/[htps]+:\/\/[^\/]+(?=\/*)/)?.[0];

        const feed = extractFromXml(xml.trimStart(), options);

        let { link, title, description, image, entries } = feed as IFeedDataExtended;

        if (link) {
            if (typeof link === "string") {
                this.site = options.baseUrl && link.startsWith("/") ? options.baseUrl + link : link;
            } else {
                this.site = link["@_href"]
            }
        }

        if (title) {
            this.title = title;
        }
        if (description) {
            this.description = typeof description === "string" ? description : (description as TPropertyBag)["#text"];
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

    /**
     * Get the a filename for this RSS feed.
     * @returns A valid filename.
     */
    get fileName(): string {
        return toFilename(decode(this.title ?? "Untitled", { mode: DecodingMode.Strict, level: EntityLevel.HTML }));
    }

    /**
     * @returns the avarage time interval between posts of the feed in hours.
     */
    get avgPostInterval(): number {
        let pubdateMillies = this.items.map(it => new Date(it.published).valueOf()).sort();
        const n = pubdateMillies.length - 1; // number of intervals between posts
        if (n > 0) {
            return Math.abs(Math.round((pubdateMillies[n] - pubdateMillies[0]) / (n * 60 * 60 * 1000)));
        }

        return 1;
    }

}