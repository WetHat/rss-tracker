import {App,request,TFile,TFolder} from "obsidian";
import RSSTrackerPlugin from './main';
import {TrackedRSSfeed} from "./FeedAssembler"
import * as path from 'path';

export default class FeedManager {

    private app: App;
    private plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    async createFeed(url: string,location: TFolder): Promise<TFile> {
        const tpl = this.plugin.settings.feedTemplate,
            feedXML = await request({
                                url: url,
                                method: "GET",
                            }),
            feed = TrackedRSSfeed.assembleFromXml(feedXML),
            content = tpl.replace("{{feedUrl}}",url)
                         .replace("{{siteUrl}}", feed.site ?? "")
                         .replace("{{title}}",feed.title ?? "")
                         .replace("{{description}}", feed.description ?? "");
        // create the folder for the feed items
        await this.app.vault.createFolder(path.join(location.path,`${feed.title}`));
        // create the feed configuration file
        let feedConfig = await this.app.vault.create(path.join(location.path,`${feed.title}.md`),content);

        return feedConfig;
    }

    updateFeed(feed: TFile) {
        // obtain feed specifications

    }
}