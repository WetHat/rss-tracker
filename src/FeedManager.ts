import {App,Plugin,TFile,TFolder} from "obsidian";
import RSSTrackerPlugin from './main';
import {TrackedRSSfeed} from "./FeedAssembler"

export default class FeedManager {

    private app: App;
    private plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    /**
    async createFeed(url: string,location: TFolder): Promise<TFile> {
        let template = this.plugin.settings.feedTemplate,
            feed = await assembleFromUrl(url)


        return feedSpec;
    }
    */
    updateFeed(feed: TFile) {
        // obtain feed specifications

    }
}