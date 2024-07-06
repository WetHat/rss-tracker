import { App } from 'obsidian';
import RSSTrackerPlugin from './main';
import { TPropertyBag } from './FeedAssembler';

export type TItemRowFactory = (feedItem: TPropertyBag) => object[];
export type TFeedRowFactory = (feed: TPropertyBag) => object[];

export class DataViewJSTools {
    private app: App;
    private plugin: RSSTrackerPlugin;

    private current?: TPropertyBag;
    private feedCache: any;

    static toHashtag(tag: string): string {
        return tag.startsWith("#") ? tag : "#" + tag;
    }

    static toHashtags(fileRecord: TPropertyBag): string[] {
        return fileRecord.file.etags.map((t: string) => DataViewJSTools.toHashtag(t))
    }

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    getFileHashtagLine(fileRecord: TPropertyBag): string {
        return DataViewJSTools.toHashtags(fileRecord).join(" ");
    }

    async getFeedItems(dv: TPropertyBag, feedRecord: TPropertyBag): Promise<TPropertyBag> {
        console.log(`getFeedItems for ${feedRecord.file.name}`);

        const from = '"' + feedRecord.file.folder + "/" + feedRecord.file.name + '"';
        return (await dv.pages(from).distinct((rec: TPropertyBag) => rec.link)) as Array<TPropertyBag>;
    }

    async getTopicFeeds(dv: TPropertyBag) {
        const
            topicTags: string[] = DataViewJSTools.toHashtags(dv.current()),
            from = topicTags.join(" OR ");
        return await dv.pages(from).where((rec: TPropertyBag) => rec.feedurl).sort((rec: TPropertyBag) => rec.file.name, "asc");
    }

    async groupedReadingList(dv: TPropertyBag) {
        const topicFeeds = await this.getTopicFeeds(dv);
        let totalTaskCount = 0;
        for (const feed of topicFeeds) {
            const
                items = await this.getFeedItems(dv, feed),
                tasks = items.file.tasks.where((t: TPropertyBag) => !t.completed),
                taskCount = tasks.length;
            if (taskCount > 0) {
                totalTaskCount += taskCount;
                dv.header(2, dv.fileLink(feed.file.path) + ` (${taskCount})`);
                dv.taskList(tasks, false);
            }
        }
        if (totalTaskCount === 0) {
            dv.paragraph("> No unread items.")
        }
    }

    async groupedPinnedItemsTable(dv: TPropertyBag, columnLabels: string[], rowFactory: TItemRowFactory) {
        const topicFeeds = await this.getTopicFeeds(dv);
        let totalItemCount = 0
        for (const feed of topicFeeds) {
            const
                items = await this.getFeedItems(dv, feed),
                pinned = items.where((itemRec: TPropertyBag) => itemRec.pinned),
                itemCount = pinned.length;
            console.log(`Pinned ${itemCount}`);
            if (itemCount > 0) {
                totalItemCount += itemCount;
                dv.header(2, dv.fileLink(feed.file.path) + ` (${itemCount})`);
                dv.table(
                    columnLabels,
                    pinned.map((itemRec: TPropertyBag) => rowFactory(itemRec)));
            }
        }
        if (totalItemCount === 0) {
            dv.paragraph("> No items pinned.")
        }
    }

    async topicFeedTable(dv: TPropertyBag, columnLabels: string[], rowFactory: TFeedRowFactory) {
        const topicFeeds = await this.getTopicFeeds(dv);
        dv.table(columnLabels, topicFeeds.map((f: TPropertyBag) => rowFactory(f)));
    }
}