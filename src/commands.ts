import { App, Modal, Command, Setting, TFile, TFolder, Notice } from 'obsidian';
import { FeedConfig } from './FeedManager';
import RSSTrackerPlugin from './main';
import { DEFAULT_SETTINGS } from "./settings";

/**
 * Modal dialog to request rss url input from the user.
 */
export class InputUrlModal extends Modal {
    result: string = '';

    onSubmit: (result: string) => void;

    constructor(app: App, onSubmit: (result: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        // Input fiels
        new Setting(contentEl)
            .setName('Feed Url:')
            .setDesc('Enter the url of the rss feed:')
            .setHeading()
            .addText(text => {
                text.inputEl.addEventListener("keyup", (evt) => {
                    var keyCode = evt.code ?? evt.key;
                    if (keyCode === "Enter") {
                        if (this.result) {
                            this.close();
                            this.onSubmit(this.result);
                        }
                        return false;
                    }
                });
                text.inputEl.style.width = '95%';
                text.setPlaceholder('https://x.com/feed')
                    .onChange(value => {
                        this.result = value;
                    });
            });

        new Setting(contentEl).addButton(btn =>
            btn.setButtonText('Submit')
                .setCta()
                .onClick(() => {
                    this.close();
                    this.onSubmit(this.result);
                })
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

abstract class RSSTrackerCommandBase implements Command {
    protected app: App;
    protected plugin: RSSTrackerPlugin;
    readonly id: string;
    readonly name: string;

    constructor(plugin: RSSTrackerPlugin, id: string, name: string) {
        this.app = plugin.app;
        this.plugin = plugin;
        this.id = id;
        this.name = name
    }
}

/**
 * A command that can update an RSS feed if the current file is a RSS feed dashboard.
 */
export class UpdateRSSfeedCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin,'rss-tracker-update-feed-checked','Update RSS feed');
    }

     checkCallback(checking: boolean): boolean {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const cfg = FeedConfig.fromFile(this.app, active);
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return !!cfg;
            }
            if (cfg) {
                this.plugin.feedmgr.updateFeed(cfg, true).then(() => new Notice(`${cfg.source.basename} updated!`));
                return true;
            }
        }
        return false;
    }
}

export class DownloadRSSitemArticleCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin,'rss-tracker-download-article-checked','Download RSS item article');
    }

     checkCallback(checking: boolean): boolean {
        // Conditions to check
        const
            active = this.app.workspace.getActiveFile(),
            feedmgr = this.plugin.feedmgr;

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return feedmgr.canDownloadArticle(active);
            }
            feedmgr.downloadArticle(active).then(v => new Notice(`Article content of "${active.basename}" downloaded`));
            return true;
        }
        return false;
    }
}

/**
 * A command that can update an RSS feed of the current file is a RSS feed dashboard.
 */
export class MarkAllRSSitemsReadCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin,'tracked-rss-mark-items-read-checked','Mark all RSS feed items as read');
    }

    checkCallback(checking: boolean): any {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const cfg = FeedConfig.fromFile(this.app, active);
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return cfg;
            }
            if (cfg) {
                this.plugin.feedmgr.markFeedItemsRead(cfg.source).then(() => new Notice(`${cfg.source.basename} updated!`));
                return true;
            }
        }
        return false;
    }
}

export class NewRSSTopicCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin,'rss-tracker-new-topic','New RSS topic');
    }

    callback(): any {
        this.plugin.filemgr.createFile(this.plugin.settings.rssTopicsFolderPath,"New Topic","RSS Topic")
            .then(topic => {
                const leaf = this.app.workspace.getLeaf(false);
                leaf.openFile(topic).catch(reason => new Notice(reason.message))
            })
            .catch (reason => new Notice(`RSS topic could not be created! ${reason.message}`));
    }
}

export class NewRSSFeedCollectionCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin,'rss-tracker-new-feed-collection','New RSS feed collection');
    }

    callback(): any {
        this.plugin.filemgr.createFile(this.plugin.settings.rssCollectionsFolderPath,"New Feed Collection", "RSS Collection")
            .then (collection => {
                const leaf = this.app.workspace.getLeaf(false);
                leaf.openFile(collection).catch(reason => new Notice(reason.message))
            })
            .catch (reason => new Notice(`RSS feed collection could not be created! ${reason.message}`));
    }
}

/**
 * A complex command that checks whether the current state of the app allows execution of the command.
 */
export class NewRSSFeedModalCommand extends RSSTrackerCommandBase{
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin,'rss-tracker-new-feed-url-input-modal','New RSS feed');
    }

    callback(): any {
        // Conditions to check
        const modal = new InputUrlModal(this.app, async result => {
            const feedFolderPath = this.plugin.settings.rssFeedFolderPath;
            let feedFolder = this.app.vault.getFolderByPath(feedFolderPath);
            if (!feedFolder) {
                // try creating that folder
                feedFolder = await this.app.vault.createFolder(feedFolderPath);
            }

            // create the new feed
            if (feedFolder) {
                const
                    mgr = this.plugin.feedmgr,
                    leaf = this.app.workspace.getLeaf(false);
                try {
                    leaf.openFile(await mgr.createFeedFromUrl(result, feedFolder));
                } catch (err: any) {
                    new Notice(err.message);
                }
            }
        });
        modal.open();
    }
}
