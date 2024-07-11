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

/**
 * A command that can update an RSS feed if the current file is a RSS feed dashboard.
 */
export class UpdateRSSfeedCommand implements Command {
    id = 'rss-tracker-update-feed-checked';
    name = 'Update RSS feed';
    private app: App;
    private plugin: RSSTrackerPlugin;
    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
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
                this.plugin.feedmgr.updateFeed(cfg, true).then(() => new Notice(`${cfg.source.basename} updated!`));
                return true;
            }
        }
        return false;
    }
}

/**
 * A command that can update an RSS feed uf the current file is a RSS feed dashboard.
 */
export class MarkAllRSSitemsReadCommand implements Command {
    id = 'tracked-rss-mark-items-read-checked';
    name = 'Mark all RSS feed items as read';
    private app: App;
    private plugin: RSSTrackerPlugin;
    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
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

/**
 * A complex command that can check whether the current state of the app allows execution of the command.
 */
export class NewRSSFeedModalCommand implements Command {
    id = 'rss-tracker-new-feed-url-input-modal';
    name = 'New RSS feed';
    private app: App;
    private plugin: RSSTrackerPlugin;
    constructor(app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    callback(): any {
        // Conditions to check
        const modal = new InputUrlModal(this.app, async result => {
            const locationSetting = this.plugin.settings.rssFeedFolder;
            let feedFolder: TFolder | null;
            if (locationSetting === ".") {
                // add feed in same folder as furrent note
                const f: TFile | null = this.app.workspace.getActiveFile();
                if (f) {
                    feedFolder = this.app.fileManager.getNewFileParent(f.path);
                } else {
                    feedFolder = this.app.vault.getFolderByPath("/");
                }
            } else {
                // use folder path
                feedFolder = this.app.vault.getFolderByPath(locationSetting);
                if (!feedFolder) {
                    // try creating the folder
                    feedFolder = await this.app.vault.createFolder(locationSetting);
                }
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
