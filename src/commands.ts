import { App, Modal, Command, Setting, TFile, Notice } from 'obsidian';
import { FeedConfig } from './FeedManager';
import RSSTrackerPlugin from './main';

/**
 * Modal dialog to request rss url input from the user.
 */
export class InputUrlModal extends Modal {
    result: string = '';

    onSubmit: (result: string) => void;

    constructor (app: App, onSubmit: (result: string) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen () {
        const { contentEl } = this;
        // Input fiels
        new Setting(contentEl)
            .setName('Feed Url:')
            .setDesc('Enter the url of the rss feed:')
            .setHeading()
            .addText(text => {
                text.inputEl.style.width = '95%';
                text.setPlaceholder('https://x.com/feed');
                text.onChange(value => {
                    this.result = value;
                });
            });

        new Setting(contentEl).addButton(btn =>
            btn
                .setButtonText('Submit')
                .setCta()
                .onClick(() => {
                    this.close();
                    this.onSubmit(this.result);
                })
        );
    }

    onClose () {
        const { contentEl } = this;
        contentEl.empty();
    }
}

/**
 * A simple command that can be triggered anywhere
 */
export class UpdateRSSfeedCommand implements Command {
    id = 'update-tracked-rss-feed-checked';
    name = 'Update RSS Feed';
    private app: App;
    private plugin: RSSTrackerPlugin;
    constructor (app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    checkCallback (checking: boolean): any {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const cfg = FeedConfig.fromFile(this.app,active);
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return cfg;
            }
            if (cfg) {
                this.plugin.feedmgr.updateFeed(cfg).then(() => new Notice(`${cfg.source.basename} updated!`));
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
    id = 'rss-tracker-url-input-modal';
    name = 'New RSS Feed';
    private app: App;
    private plugin: RSSTrackerPlugin;
    constructor (app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    callback (): any {
        // Conditions to check
        const modal = new InputUrlModal(this.app, async result => {
            console.log(result);
            const f: TFile | null = this.app.workspace.getActiveFile();

            if (f) {
                const parent = this.app.fileManager.getNewFileParent(f.path);
                    const mgr = this.plugin.feedmgr;
                    const leaf = this.app.workspace.getLeaf(false);

                leaf.openFile(await mgr.createFeed(result, parent));
            }
        });
        modal.open();
    }
}
