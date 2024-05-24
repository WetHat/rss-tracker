import { App, request, TFile, TFolder, htmlToMarkdown, normalizePath, ListItemCache, Vault, Notice } from 'obsidian';
import RSSTrackerPlugin from './main';
import { TrackedRSSfeed, TrackedRSSitem, IRSSimage, TPropertyBag } from './FeedAssembler';
import * as path from 'path';

export class FeedConfig {
    feedUrl: string;
    itemLimit: number;
    source: TFile;

    static fromFile(app: App, file: TFile): FeedConfig | null {
        if (!file) {
            return null;
        }
        // read file frontmatter to determine if this is a feed dashboard
        const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
        if (!frontmatter) {
            return null;
        }
        const { feedurl, itemlimit } = frontmatter
        if (!feedurl || !itemlimit) {
            return null;
        }

        return new FeedConfig(feedurl, itemlimit, file);

    }

    constructor(feedurl: string, itemlimit: string, source: TFile) {
        this.feedUrl = feedurl;
        this.itemLimit = parseInt(itemlimit);
        this.source = source;
    }
}

export class FeedManager {
    private static readonly TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;
    private static readonly ILLEGAL_FS_CHARS = /\.[#\\><\/|\[\]:"?^]/g;
    private static readonly HASH_FINDER = /(?<!\]\([^[\]()]+)#(?=\b)/g;
    private static ITEMLIMIT_FINDER = /(?<=itemlimit:\s*)\d+/;

    private static RSS_IMAGE_SVG = '<svg height="300px" width="300px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 398.668 398.668" xml:space="preserve"> <g> <g> <path style="fill:none;" d="M98.107,275.498c-13.789,0-25.006,11.264-25.006,25.107c0,13.777,11.217,24.986,25.006,24.986 c13.834,0,25.09-11.209,25.09-24.986C123.197,286.762,111.941,275.498,98.107,275.498z"/> <path style="fill:none;" d="M360.057,24H38.613C30.555,24,24,30.557,24,38.613v321.443c0,8.057,6.555,14.611,14.613,14.611 h321.443c8.057,0,14.611-6.555,14.611-14.611V38.613C374.668,30.557,368.113,24,360.057,24z M98.107,349.592 c-27.021,0-49.006-21.975-49.006-48.986c0-27.078,21.984-49.107,49.006-49.107c27.068,0,49.09,22.029,49.09,49.107 C147.197,327.617,125.176,349.592,98.107,349.592z M242.715,347.516c0,0-0.008,0.002-0.016,0h-48.729 c-6.541,0-11.877-5.238-11.998-11.777c-0.584-31.625-13.164-61.316-35.424-83.604c-22.275-22.338-51.846-34.953-83.27-35.527 c-6.541-0.119-11.781-5.457-11.781-11.998v-48.582c0-3.211,1.287-6.287,3.572-8.543c2.248-2.217,5.275-3.457,8.428-3.457 c0.055,0,0.107,0,0.162,0c50.654,0.686,98.338,20.883,134.271,56.873c35.758,35.814,55.896,83.281,56.756,133.732 c0.021,0.291,0.031,0.586,0.031,0.883C254.719,342.143,249.348,347.516,242.715,347.516z M337.582,347.516 c0,0-0.008,0.002-0.016,0h-48.648c-6.578,0-11.93-5.295-12-11.871c-1.254-116.738-97.008-212.74-213.451-214.002 c-6.576-0.072-11.871-5.424-11.871-12V61.078c0-3.201,1.279-6.269,3.553-8.521c2.273-2.254,5.367-3.512,8.555-3.477 c75.951,0.68,147.441,30.768,201.303,84.723c53.689,53.779,83.699,125.096,84.553,200.891c0.02,0.272,0.029,0.547,0.029,0.822 C349.588,342.143,344.215,347.516,337.582,347.516z"/> <path style="fill:#3D6889;" d="M98.107,251.498c-27.021,0-49.006,22.029-49.006,49.107c0,27.012,21.984,48.986,49.006,48.986 c27.068,0,49.09-21.975,49.09-48.986C147.197,273.527,125.176,251.498,98.107,251.498z M98.107,325.592 c-13.789,0-25.006-11.209-25.006-24.986c0-13.844,11.217-25.107,25.006-25.107c13.834,0,25.09,11.264,25.09,25.107 C123.197,314.383,111.941,325.592,98.107,325.592z"/> <path style="fill:#73D0F4;" d="M75.498,168.633v24.668c33.244,3.301,64.15,17.926,88.037,41.881 c23.879,23.906,38.459,54.922,41.746,88.334h24.816C223.066,241.893,156.986,175.689,75.498,168.633z"/> <path style="fill:#3D6889;" d="M197.932,200.9c-35.934-35.99-83.617-56.188-134.271-56.873c-0.055,0-0.107,0-0.162,0 c-3.152,0-6.18,1.24-8.428,3.457c-2.285,2.256-3.572,5.332-3.572,8.543v48.582c0,6.541,5.24,11.879,11.781,11.998 c31.424,0.574,60.994,13.189,83.27,35.527c22.26,22.287,34.84,51.979,35.424,83.604c0.121,6.539,5.457,11.777,11.998,11.777 h48.729c0.008,0.002,0.016,0,0.016,0c6.633,0,12.004-5.373,12.004-12c0-0.297-0.01-0.592-0.031-0.883 C253.828,284.182,233.689,236.715,197.932,200.9z M205.281,323.516c-3.287-33.412-17.867-64.428-41.746-88.334 c-23.887-23.955-54.793-38.58-88.037-41.881v-24.668c81.488,7.057,147.568,73.26,154.6,154.883H205.281z"/> <path style="fill:#73D0F4;" d="M75.596,73.465v24.598c58.516,3.502,113.188,28.121,155.029,70.064 c41.838,41.943,66.391,96.742,69.877,155.389h24.682C317.852,189.59,209.293,80.834,75.596,73.465z"/> <path style="fill:#3D6889;" d="M265.006,133.803C211.145,79.848,139.654,49.76,63.703,49.08c-3.188-0.035-6.281,1.223-8.555,3.477 c-2.273,2.252-3.553,5.32-3.553,8.521v48.565c0,6.576,5.295,11.928,11.871,12c116.443,1.262,212.197,97.264,213.451,214.002 c0.07,6.576,5.422,11.871,12,11.871h48.648c0.008,0.002,0.016,0,0.016,0c6.633,0,12.006-5.373,12.006-12 c0-0.275-0.01-0.551-0.029-0.822C348.705,258.898,318.695,187.582,265.006,133.803z M300.502,323.516 c-3.486-58.646-28.039-113.445-69.877-155.389c-41.842-41.943-96.514-66.563-155.029-70.064V73.465 c133.697,7.369,242.256,116.125,249.588,250.051H300.502z"/> <path style="fill:#3D6889;" d="M360.057,0H38.613C17.322,0,0,17.322,0,38.613v321.443c0,21.291,17.322,38.611,38.613,38.611 h321.443c21.291,0,38.611-17.32,38.611-38.611V38.613C398.668,17.322,381.348,0,360.057,0z M374.668,360.057 c0,8.057-6.555,14.611-14.611,14.611H38.613c-8.059,0-14.613-6.555-14.613-14.611V38.613C24,30.557,30.555,24,38.613,24h321.443 c8.057,0,14.611,6.557,14.611,14.613V360.057z"/> </g> </g> </svg>';
    private app: App;
    private plugin: RSSTrackerPlugin;

    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    private getItemFolderPath(feed: TFile) {
        return normalizePath(path.join(feed.parent?.path ?? "", feed.basename));
    }

    private expandTemplate(template: string, properties: TPropertyBag): string {
        return template.split(FeedManager.TOKEN_SPLITTER).map(s => s.startsWith("{{") ? (properties[s] ?? s) : s).join("");
    }

    private formatImage(image: IRSSimage | TFile): string {
        if (image instanceof TFile) {
            return `![[${image.name}|200x200]]`;
        }

        const { src, width, height } = image as IRSSimage;
        let size = "";
        if (width) {
            size = `|${width}`;
            if (height) {
                size += `x${height}`
            }
        }
        return `![image${size}](${src})`;
    }

    private formatFilename(name: string): string {
        return name.replace(/\w+:\/\/.*/, "")
                   .replaceAll("?","❓")
                   .replaceAll(".","🔸")
                   .replaceAll(":","꞉")
                   .replaceAll('"',"″")
                   .replaceAll('<"',"‹")
                   .replaceAll('>"',"›")
                   .replaceAll('|"',"›")
                   .replaceAll("\\","/")
                   .replaceAll("/","╱")
                   .replace(FeedManager.ILLEGAL_FS_CHARS, " ")
                   .replace(/\s{2,}|🔹\s+/g, " ")
                   .substring(0, 60)
                   .trim();
    }
    private formatTags(tags: string[]): string {
        return "[" + tags.map(t => "rss/" + t.replace(" ", "_")).join(",") + "]";
    }
    private formatHashTags(md: string): string {
        return md.replace(FeedManager.HASH_FINDER, "#rss/");
    }

    private async saveFeedItem(itemFolder: TFolder, item: TrackedRSSitem): Promise<TFile> {
        let { id, tags, title, link, description, published, author, image, content } = item;

        if (description) {
            description = this.formatHashTags(htmlToMarkdown(description));
        }
        if (content) {
            content = this.formatHashTags(htmlToMarkdown(content));
        }
        title = this.formatHashTags(title);

        const byline = author ? ` by ${author}` : "";
        let abstract = `> [!abstract] ${title}${byline} - ${published}`;

        if (description && item.content) {
            abstract += "\n> " + description;
        }
        if (image) {
            abstract += "\n>\n> " + this.formatImage(image);
        }

        if (!content) {
            content = description
        }
        const basename = this.formatFilename(item.title);
        let itemPath = normalizePath(path.join(itemFolder.path, `${basename}.md`));

        // make sure the name is unique
        let uniqueBasename = basename,
            counter: number = 1;
        while (this.app.vault.getFileByPath(itemPath)) {
            uniqueBasename = `${basename} (${counter})`;
            itemPath = normalizePath(path.join(itemFolder.path, `${uniqueBasename}.md`));
            counter++;
        }

        // fill in the template
        const itemContent = this.expandTemplate(this.plugin.settings.itemTemplate, {
            "{{id}}": id,
            "{{author}}": author ?? itemFolder.name,
            "{{link}}": link ?? "",
            "{{publishDate}}": published ?? "",
            "{{tags}}": this.formatTags(tags),
            "{{abstract}}": abstract,
            "{{content}}": content,
            "{{feedName}}": itemFolder.name,
            "{{fileName}}": uniqueBasename,
        });

        return this.app.vault.create(itemPath, itemContent).catch(reason => { throw new Error(reason.message + ` for ${uniqueBasename}`) });
    }

    private async updateFeedItems(feedConfig: FeedConfig, feed: TrackedRSSfeed): Promise<number> {
        const { itemLimit, source } = feedConfig;

        // create the folder for the feed items (if needed)
        const itemFolderPath = this.getItemFolderPath(source);
        let itemFolder = this.app.vault.getFolderByPath(itemFolderPath);
        if (!itemFolder) {
            itemFolder = await this.app.vault.createFolder(itemFolderPath);
        }

        const meta = this.app.metadataCache;
        // get all existing items from the items directory. Oldest items first.
        let items: TFile[] = itemFolder.children.filter((fof) => fof instanceof TFile)
            .map(f => f as TFile)
            .filter(f => {
                const fm = meta.getFileCache(f)?.frontmatter;
                return fm?.["id"] && fm?.["feed"]
            })
            .sort((a, b) => b.stat.mtime - a.stat.mtime);

        // find new items
        const knownIDs = new Set<string>(items.map(it => meta.getFileCache(it)?.frontmatter?.["id"])),
            newItems = feed.items.filter(it => !knownIDs.has(it.id));
        // determine how many items needs to be purged
        const deleteCount = Math.min(items.length + newItems.length - itemLimit, items.length);

        // remove feed obsolete items from disk
        for (let index = 0; index < deleteCount; index++) {
            const item = items[index];
            this.app.vault.delete(item);
        }

        // save items
        const n = Math.min(itemLimit, newItems.length)
        for (let index = 0; index < n; index++) {
            const item = newItems[index];
            this.saveFeedItem(itemFolder, item).catch(reason => { throw reason });
        }
        return n;
    }

    async createFeed(url: string, location: TFolder): Promise<TFile> {
        const feedXML = await request({
            url: url,
            method: "GET"
        }),
            feed = TrackedRSSfeed.assembleFromXml(feedXML);
        const { title, site, description } = feed,
            basename = this.formatFilename(title ?? "Anonymous Feed"),
            itemfolderPath = normalizePath(path.join(location.path, basename)),
            tpl = this.plugin.settings.feedTemplate,
            dashboardPath = normalizePath(path.join(location.path, `${basename}.md`));
        let image: IRSSimage | TFile | undefined = feed.image;
        // generate a default image
        if (!image) {
            const imageAsset = `${basename}Logo.svg`,
                  logoPath = await this.app.fileManager.getAvailablePathForAttachment(imageAsset, dashboardPath);
            image = await this.app.vault.create(logoPath, FeedManager.RSS_IMAGE_SVG);
        }

        const content = this.expandTemplate(tpl, {
            "{{feedUrl}}": url,
            "{{siteUrl}}": site ?? "",
            "{{title}}": title ?? "",
            "{{description}}": description ? this.formatHashTags(htmlToMarkdown(description)) : "",
            "{{folderPath}}": itemfolderPath,
            "{{image}}": image ? this.formatImage(image) : ""
        });

        // create the feed configuration file
        const dashboard = await this.app.vault.create(dashboardPath, content),
            itemlimit = tpl.match(FeedManager.ITEMLIMIT_FINDER)?.[0],
            cfg = new FeedConfig(url, itemlimit ?? "100", dashboard);

        if (dashboard && cfg) {
            let status: string;
            try {
                await this.updateFeedItems(cfg, feed);
                status = "OK";
            } catch (err: any) {
                console.error(err);
                status = err.message;
            }

            this.app.fileManager.processFrontMatter(dashboard, frontmatter => {
                frontmatter.status = status;
                frontmatter.updated = new Date().toISOString();
                frontmatter.interval = feed.avgPostInterval;
            });
        }
        return dashboard;
    }

    async updateFeed(feedConfig: FeedConfig | null, force: boolean): Promise<boolean> {
        if (!feedConfig) {
            return false;
        }

        if (!force) {
            // check if it time to update
            const meta = this.app.metadataCache.getFileCache(feedConfig.source),
                fm = meta?.frontmatter;
            if (fm?.updated && fm?.interval) {
                const now = new Date().valueOf(),
                      lastUpdate = new Date(fm.updated).valueOf(),
                      span = parseInt(fm.interval) * 60 * 60 * 1000;
                if ((lastUpdate + span) > now) {
                    return false; // time has not come
                }
            }
        }

        let interval = 1; // default 1h
        let status = "OK";
        try {
            const feedXML = await request({
                url: feedConfig.feedUrl,
                method: "GET"}),
                feed = TrackedRSSfeed.assembleFromXml(feedXML);
            // compute the new update interval in hours
            interval = feed.avgPostInterval;
            this.updateFeedItems(feedConfig, feed);

        } catch (err: any) {
            status = err.message;
        }

        this.app.fileManager.processFrontMatter(feedConfig.source, fm => {
            fm.status = status;
            fm.updated = new Date().toISOString();
            fm.interval = interval
        });
        return true;
    }

    async markFeedItemsRead(feed: TFile) {
        const itemFolder: TFolder | null = this.app.vault.getFolderByPath(this.getItemFolderPath(feed));
        if (itemFolder) {
            const meta = this.app.metadataCache;
            let items: TFile[] = itemFolder.children.filter((fof) => fof instanceof TFile)
                .map(f => f as TFile)
                .filter(f => {
                    const fm = meta.getFileCache(f)?.frontmatter;
                    return fm?.["id"] && fm?.["feed"]
                });
            for (let item of items) {

                const tasks = meta.getFileCache(item)
                    ?.listItems
                    ?.filter((li: ListItemCache) => li.task === " ");
                const first = tasks?.first();
                if (first) {
                    const data = await this.app.vault.read(item),
                        s = first.position.start.offset,
                        e = first.position.end.offset,
                        newdata = data.substring(0, s) + "- [x]" + data.substring(s + 5);
                    this.app.vault.modify(item, newdata);
                }
            }
        }
    }

    async updateAllRSSfeeds(force: boolean) {
        const updates = this.app.vault.getMarkdownFiles()
            .map(md => FeedConfig.fromFile(this.app,md))
            .filter(cfg => cfg)
            .map(async cfg => await this.updateFeed(cfg,force));
        let n: number = 0;
        for (let u of updates) {
            let r = await u;
            if (r) {
                n++;
            }
        }
        if (n > 0) {
            new Notice(`${n} RSS feeds updated`);
        }
    }
}