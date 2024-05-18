import {App,request,TFile,TFolder,htmlToMarkdown,normalizePath} from "obsidian";
import RSSTrackerPlugin from './main';
import {TrackedRSSfeed,TrackedRSSitem,IRSSimage,TPropertyBag} from "./FeedAssembler"
import * as path from 'path';

export default class FeedManager {

    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;
    private static readonly ILLEGAL_FS_CHARS =/[#\\><\/|\[\]:?^]/g;

    private app: App;
    private plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    private expandTemplate(template:string,properties: TPropertyBag): string {
        return template.split(FeedManager.TOKEN_SPLITTER).map( s => s.startsWith("{{") ? (properties[s] ?? s) : s).join("");
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

    private formatFilename(name: string): string {
        return name.replace(FeedManager.ILLEGAL_FS_CHARS,"🔹");
    }
    private formatTags(tags: string[]): string {
        return "[" + tags.map( t => "rss/" + t.replace(" ","_")).join(",") + "]";
    }

    private async saveFeedItem(itemFolder: TFolder, item: TrackedRSSitem): Promise<TFile> {
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
        const basename = this.formatFilename(item.title);
        const itemPath = path.join(itemFolder.path,this.formatFilename(`${basename}.md`));

        // fill in the template
        const itemContent = this.expandTemplate(this.plugin.settings.itemTemplate, {
                "{{id}}": id,
                "{{title}}": '"' + title + '"',
                "{{feedName}}": '"' + itemFolder.name + '"',
                "{{author}}": author ? ('"' + author + '"') :('"' + itemFolder.name + '"'),
                "{{link}}": link ?? "",
                "{{publishDate}}": published ?? "",
                "{{tags}}": this.formatTags(tags),
                "{{content}}": abstract + "\n" + content,
                "{{fileName}}": basename,
              });
         return this.app.vault.create(itemPath,itemContent);
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
            this.saveFeedItem(itemFolder,item);
        }
    }

    async createFeed(url: string,location: TFolder): Promise<TFile> {
        const feedXML = await request({
                                url: url,
                                method: "GET",
                             }),
            feed = TrackedRSSfeed.assembleFromXml(feedXML);
        const {title,site,description} = feed,
            basename=this.formatFilename(title ?? "Anonymous Feed"),
            itemfolderPath = normalizePath(path.join(location.path,basename)),
            content = this.expandTemplate(this.plugin.settings.feedTemplate,{
                "{{feedUrl}}": url,
                "{{siteUrl}}": site ?? "",
                "{{title}}": title ?? "",
                "{{description}}": description ? htmlToMarkdown(description) : "",
                "{{folderPath}}": itemfolderPath
            });
        // create the feed configuration file
        let feedConfig = await this.app.vault.create(path.join(location.path,`${basename}.md`),content);

        // create the folder for the feed items
        const itemFolder = await this.app.vault.createFolder(itemfolderPath);
        this.updateFeedItems(100,itemFolder,feed);

        this.app.fileManager.processFrontMatter(feedConfig,frontmatter => {
            frontmatter.status = "OK";
            frontmatter.updated = new Date().toISOString();
        });

        return feedConfig;
    }

    async updateFeed(feedConfig: TFile) {
        // get the feed config from the frontmatter and update the items up to the item limit
        const meta = this.app.metadataCache,
              itemLimit = meta.getFileCache(feedConfig)?.frontmatter?.["itemlimit"] ?? "100";

        // obtain feed specifications
        const frontmatter = this.app.metadataCache.getFileCache(feedConfig)?.frontmatter
        if (frontmatter) {
            const url = frontmatter["feedurl"];
        }
         // create the folder for the feed items (if needed)
         const itemFolder = await this.app.vault.createFolder(path.join(feedConfig.path,feedConfig.basename));
    }
}