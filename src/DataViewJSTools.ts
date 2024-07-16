import { TPropertyBag, TrackedRSSfeed } from './FeedAssembler';
import { RSSTrackerSettings } from './settings';
import { Plugin } from 'obsidian';

type TItemrowBuilder = (feedItem: TPropertyBag) => object[];

/**
 * A callback function type to create a dataview table row for an RSS
 * feed file.
 */
type TFeedRowBuilder = (feed: TPropertyBag) => object[];

type TFileRecord = {
    [key: string]: any;
    file: any
}

type TFileRecordList = {
    /** Map indexes to values. */
    [index: number]: any;
    /** Automatic flattening of fields. Equivalent to implicitly calling `array.to("field")` */
    [field: string]: any;

    [Symbol.iterator](): Iterator<TFileRecord>;
    file: any
}

type TItemPredicate = (fileRecord: TFileRecord) => boolean;

export class DataViewJSTools {
    private dv: TPropertyBag;
    private settings: RSSTrackerSettings;

    static toHashtag(tag: string): string {
        return tag.startsWith("#") ? tag : "#" + tag;
    }

    static getHashtags(fileRecord: TFileRecord): string[] {
        return fileRecord.file.etags.map((t: string) => DataViewJSTools.toHashtag(t))
    }

    constructor(dv: TPropertyBag, settings: RSSTrackerSettings) {
        this.dv = dv;
        this.settings = settings;
    }

    // computed properties
    fileHashtags(fileRecord: TFileRecord): string {
        return DataViewJSTools.getHashtags(fileRecord).join(" ");
    }

    fileLink(fileRecord: TFileRecord): string {
        return this.dv.fileLink(fileRecord.file.path);
    }

    datePublished(fileRecord: TFileRecord): object {
        return this.dv.date(fileRecord.published)
    }
    dateUpdated(fileRecord: TFileRecord): object {
        return this.dv.date(fileRecord.updated)
    }

    ////////////////////////

    fromFeedsExpression(fileRecord: TFileRecord): string {
        const
            anyTags: string[] = fileRecord.file.etags?.map((t: string) => DataViewJSTools.toHashtag(t)) ?? [],
            allTags: string[] = fileRecord?.allof?.map((t: string) => DataViewJSTools.toHashtag(t)) ?? [],
            noneTags: string[] = fileRecord?.noneof?.map((t: string) => DataViewJSTools.toHashtag(t)) ?? [];

        let from = [
            '"' + this.settings.rssFeedFolderPath + '"',
            anyTags.length > 0 ? "( " + anyTags.join(" OR ") + " )" : null,
            allTags.length > 0 ? allTags.join(" AND ") : null,
            noneTags.length > 0 ? "-( " + noneTags.join(" OR ") + " )" : null
        ].filter(expr => expr);
        return from.join(" AND ");
    }

    async getCollectionFeeds(collection: TFileRecord): Promise<TFileRecordList> {
        const
            from = this.fromFeedsExpression(collection),
            pages = await this.dv.pages(from);
        return pages
            .where((rec: TFileRecord) => rec.role == "rssfeed")
            .sort((rec: TFileRecord) => rec.file.name, "asc");
    }

    async getFeedItems(feed: TFileRecord): Promise<TFileRecordList> {
        const
            from = "[[" + feed.file.path + "]]",
            pages = await this.dv.pages(from);
        return pages
            .where((rec: TFileRecord) => rec.role == "rssitem")
            .distinct((rec: TFileRecord) => rec.link);
    }

    async readingList(feed: TFileRecord, read: boolean, header?: string): Promise<number> {
        const
            items = await this.getFeedItems(feed),
            tasks = items.file.tasks.where((t: TPropertyBag) => t.completed === read),
            taskCount = tasks.length;
        if (taskCount > 0) {
            if (header) {
                this.dv.header(2, header + " (" + taskCount + ")");
            }
            this.dv.taskList(tasks, false);
        }
        return taskCount;
    }

    async groupedReadingList(feeds: TFileRecordList, read: boolean = false): Promise<number> {
        let totalTaskCount = 0;

        for (const feed of feeds) {
            totalTaskCount += await this.readingList(feed, read, this.fileLink(feed));
        }
        return totalTaskCount;
    }

    async itemTable(feed: TFileRecord, predicate: TItemPredicate, columnLabels: string[], rowBuilder: TItemrowBuilder, header?: string): Promise<number> {
        const
            items = (await this.getFeedItems(feed)).where((item: TFileRecord) => predicate(item)),
            itemCount = items.length;
        if (itemCount > 0) {
            if (header) {
                this.dv.header(2, header + " (" + itemCount + ")");
            }
            this.dv.table(
                columnLabels,
                items.map((itemRec: TPropertyBag) => rowBuilder(itemRec)));
        }

        return itemCount
    }

    async groupedItemTable(feeds: TFileRecordList, predicate: TItemPredicate, columnLabels: string[], rowBuilder: TItemrowBuilder): Promise<number> {
        let totalItemCount = 0;
        for (const feed of feeds) {
            totalItemCount += await this.itemTable(feed, predicate, columnLabels, rowBuilder, this.fileLink(feed));
        }
        return totalItemCount;
    }

    async feedTable(collection: TFileRecord, columnLabels: string[], rowBuilder: TFeedRowBuilder): Promise<number> {
        const
            feeds = await this.getCollectionFeeds(collection),
            feedCount = feeds.length;

        if (feedCount > 0) {
            this.dv.table(columnLabels, feeds.map((f: TFileRecord) => rowBuilder(f)));
        }
        return feedCount;
    }
}