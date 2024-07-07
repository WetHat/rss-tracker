import { TPropertyBag } from './FeedAssembler';

export type TItemRowFactory = (feedItem: TPropertyBag) => object[];
export type TFeedRowFactory = (feed: TPropertyBag) => object[];

export class DataViewJSTools {
    private dv: TPropertyBag;

    private current?: TPropertyBag;
    private feedCache: any;

    static toHashtag(tag: string): string {
        return tag.startsWith("#") ? tag : "#" + tag;
    }

    static toHashtags(fileRecord: TPropertyBag): string[] {
        return fileRecord.file.etags.map((t: string) => DataViewJSTools.toHashtag(t))
    }

    constructor(dv: TPropertyBag) {
        this.dv = dv;
    }

    fileHashtags(fileRecord: TPropertyBag): string {
        return DataViewJSTools.toHashtags(fileRecord).join(" ");
    }

    async getFeedItems(feedRecord: TPropertyBag): Promise<TPropertyBag> {
        console.log(`getFeedItems for ${feedRecord.file.name}`);

        const from = '"' + feedRecord.file.folder + "/" + feedRecord.file.name + '"';
        return (await this.dv.pages(from).distinct((rec: TPropertyBag) => rec.link)) as Array<TPropertyBag>;
    }

    async selectTopicFeeds() {
        const
            topicTags: string[] = DataViewJSTools.toHashtags(this.dv.current()),
            from = topicTags.join(" OR ");
        return await this.dv.pages(from).where((rec: TPropertyBag) => rec.feedurl).sort((rec: TPropertyBag) => rec.file.name, "asc");
    }
    async groupedReadingList() {
        const topicFeeds = await this.selectTopicFeeds();
        let totalTaskCount = 0;
        for (const feed of topicFeeds) {
            const
                items = await this.getFeedItems(feed),
                tasks = items.file.tasks.where((t: TPropertyBag) => !t.completed),
                taskCount = tasks.length;
            if (taskCount > 0) {
                totalTaskCount += taskCount;
                this.dv.header(2, this.dv.fileLink(feed.file.path) + ` (${taskCount})`);
                this.dv.taskList(tasks, false);
            }
        }
        if (totalTaskCount === 0) {
            this.dv.paragraph("> No unread items.")
        }
    }

    async groupedPinnedItemsTable(columnLabels: string[], rowFactory: TItemRowFactory) {
        const topicFeeds = await this.selectTopicFeeds();
        let totalItemCount = 0
        for (const feed of topicFeeds) {
            const
                items = await this.getFeedItems(feed),
                pinned = items.where((itemRec: TPropertyBag) => itemRec.pinned),
                itemCount = pinned.length;
            console.log(`Pinned ${itemCount}`);
            if (itemCount > 0) {
                totalItemCount += itemCount;
                this.dv.header(2, this.dv.fileLink(feed.file.path) + ` (${itemCount})`);
                this.dv.table(
                    columnLabels,
                    pinned.map((itemRec: TPropertyBag) => rowFactory(itemRec)));
            }
        }
        if (totalItemCount === 0) {
            this.dv.paragraph("> No items pinned.")
        }
    }

    async topicFeedTable(columnLabels: string[], rowFactory: TFeedRowFactory) {
        const topicFeeds = await this.selectTopicFeeds();
        this.dv.table(columnLabels, topicFeeds.map((f: TPropertyBag) => rowFactory(f)));
    }
}