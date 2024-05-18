import {App,request,TFile,TFolder,htmlToMarkdown} from "obsidian";
import RSSTrackerPlugin from './main';
import {TrackedRSSfeed,TrackedRSSitem,IRSSimage,TPropertyBag} from "./FeedAssembler"
import * as path from 'path';

export default class FeedManager {

    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;

    private app: App;
    private plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    private expandTemplate(template:string,properties: TPropertyBag): string {
        return template.split(FeedManager.TOKEN_SPLITTER).map( s => s.startsWith("{{") ? properties[s] : s).join("");
    }

    private formatImage(image: IRSSimage): string {
        const {url,width,height} = image;
        let size = "";
        if (width) {
            size = `|${width}`;
            if (height) {
                size += `x${height}`
            }
        }
        return `![image${size}](${url})`;
    }

    private formatTags(tags: string[]): string {
        return "[" + tags.map( t => t.replace(" ","_")).join(",") + "]";
    }

    private async createFeedItem(itemFolder: TFolder, item: TrackedRSSitem): Promise<TFile> {
        let {id,tags,title,link,description,published,author,image,content} = item;

        if (description) {
            description = htmlToMarkdown(description);
        }
        if (content) {
            content = htmlToMarkdown(content);
        }

        const byline = author ? ` by ${author}` : "";
        let abstract = `> [!abstract] [${title}](${link})${byline})`;

        if (description && item.content) {
            abstract += "\n> " + description;
        }
        if (image) {
            abstract += "\n> " + this.formatImage(image);
        }

        if (!content) {
            content = description
        }
        // fill in the template
        const itemContent = this.expandTemplate(this.plugin.settings.itemTemplate, {
                "{{id}}": id,
                "{{title}}": title,
                "{{feedName}}": itemFolder.name,
                "{{author}}": author ?? "",
                "{{link}}": link ?? "",
                "{{publishDate}}": published ?? "",
                "{{tags}}": this.formatTags(tags),
                "{{content}}": abstract + "\n" + content
              });
         return this.app.vault.create(path.join(itemFolder.path,`${title}.md`),itemContent);
    }

    private updateFeedItems(itemLimit:number,itemFolder:TFolder,feed:TrackedRSSfeed) {
        const meta = this.app.metadataCache;
        let items: TFile[] = itemFolder.children.filter( (fof) => fof instanceof TFile)
                                                .map(f => f as TFile)
                                                .filter(f => {
                                                        const fm = meta.getFileCache(f)?.frontmatter;
                                                        return fm?.["id"] && fm?.["feed"]})
                                                .sort( (a,b) => b.stat.mtime - a.stat.mtime);

        const knownIDs = new Set<string>(items.map(it => meta.getFileCache(it)?.frontmatter?.["id"])),
              newItems = feed.items.filter(it => !knownIDs.has(it.id)),
              toDelete = Math.min(items.length + newItems.length - itemLimit,items.length);


        while (toDelete > 0 ) {
             // remove feed Items from disk
        }
        // save items
        for (let item of feed.items) {
            this.createFeedItem(itemFolder,item);
        }
    }

    async createFeed(url: string,location: TFolder): Promise<TFile> {
        const feedXML = await request({
                                url: url,
                                method: "GET",
                             }),
            feed = TrackedRSSfeed.assembleFromXml(feedXML),
            content = this.expandTemplate(this.plugin.settings.feedTemplate,{
                "{{feedUrl}}": url,
                "{{siteUrl}}": feed.site ?? "",
                "{{title}}": feed.title ?? "",
                "{{description}}": feed.description ?? ""
            });
        // create the folder for the feed items
        const itemFolder = await this.app.vault.createFolder(path.join(location.path,`${feed.title}`));
        // create the feed configuration file
        let feedConfig = await this.app.vault.create(path.join(location.path,`${feed.title}.md`),content);
        // get the feed config from the frontmatter and update the items up to the item limit
        const meta = this.app.metadataCache,
              itemLimit = meta.getFileCache(feedConfig)?.frontmatter?.["itemlimit"] ?? "100";

        this.updateFeedItems(parseInt(itemLimit),itemFolder,feed);

        return feedConfig;
    }

    updateFeed(feed: TFile) {
        // obtain feed specifications
        const frontmatter = this.app.metadataCache.getFileCache(feed)?.frontmatter
        if (frontmatter) {
            const url = frontmatter["feedurl"];
        }
    }
}