import {App,request,TFile,TFolder,htmlToMarkdown,normalizePath} from "obsidian";
import RSSTrackerPlugin from './main';
import {TrackedRSSfeed,TrackedRSSitem,IRSSimage,TPropertyBag} from "./FeedAssembler"
import * as path from 'path';

export class FeedConfig {
    feedUrl: string;
    itemLimit: number;
    itemFolder: string ;

    static fromFile(app:App,file: TFile) : FeedConfig | null {
        if (!file) {
            return null;
        }
        // read file frontmatter to determine if this is a feed dashboard
        const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
        if (!frontmatter) {
            return null;
        }
        const {feedurl,itemlimit} = frontmatter
        if (!feedurl || !itemlimit) {
            return null;
        }

        return new FeedConfig(feedurl,itemlimit,path.join(file.parent?.path ?? "",file.basename));

    }

    private constructor (feedurl:string, itemlimit: string, itemfolder: string) {
        this.feedUrl = feedurl;
        this.itemLimit = parseInt(itemlimit);
        this.itemFolder = itemfolder;
    }
}

export class FeedManager {
    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;
    private static readonly ILLEGAL_FS_CHARS =/[#\\><\/|\[\]:?^]/g;
    private static readonly HASH_FINDER = /(?<!\]\([^[\]()]+)#(?=\b)/g;
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
        return name.replace(/\w+:\/\/.*/,"")
                   .replace(FeedManager.ILLEGAL_FS_CHARS,"🔹")
                   .replace(/🔹{2,🔹}|🔹\s+/g,"🔹")
                   .substring(0,60)
                   .replace(/[.\s🔹]*$/,"");
    }
    private formatTags(tags: string[]): string {
        return "[" + tags.map( t => "rss/" + t.replace(" ","_")).join(",") + "]";
    }
    private formatHashTags(md: string) : string {
        return md.replace(FeedManager.HASH_FINDER,"#rss/");
    }

    private async saveFeedItem(itemFolder: TFolder, item: TrackedRSSitem): Promise<TFile> {
        let {id,tags,title,link,description,published,author,image,content} = item;

        if (description) {
            description = this.formatHashTags(htmlToMarkdown(description));
        }
        if (content) {
            content = this.formatHashTags(htmlToMarkdown(content));
        }
        title = this.formatHashTags(title);

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
        let itemPath = normalizePath(path.join(itemFolder.path,`${basename}.md`));

        // make sure the name is unique
        let uniqueBasename = basename,
            counter:number = 1;
        while (this.app.vault.getFileByPath(itemPath)) {
            uniqueBasename = `${basename} (${counter})`;
            itemPath = normalizePath(path.join(itemFolder.path,`${uniqueBasename}.md`));
            counter++;
        }

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
                "{{fileName}}": uniqueBasename,
              });

        return this.app.vault.create(itemPath,itemContent).catch(reason => {throw reason});
    }

    private async updateFeedItems(itemLimit:number,itemFolder:TFolder,feed:TrackedRSSfeed) {
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
            await this.saveFeedItem(itemFolder,item).catch(reason => {throw reason});
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
                "{{description}}": description ? this.formatHashTags(htmlToMarkdown(description)) : "",
                "{{folderPath}}": itemfolderPath
            });
        // create the feed configuration file
        let feedConfig = await this.app.vault.create(path.join(location.path,`${basename}.md`),content);

        // create the folder for the feed items
        const itemFolder = await this.app.vault.createFolder(itemfolderPath);
        let status: any;

        try {
            await this.updateFeedItems(100,itemFolder,feed);
            status = "OK";
        } catch (err:any) {
            console.error(err);
            status = err.message;
        }

        this.app.fileManager.processFrontMatter(feedConfig,frontmatter => {
            frontmatter.status = status;
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

    getFeedConfig(file: TFile): FeedConfig | null {
       return FeedConfig.fromFile(this.app,file);
    }
}