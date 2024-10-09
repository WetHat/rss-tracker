import { Modal, App, Setting, ButtonComponent } from "obsidian";
import { RSSfeedProxy } from './RSSproxies';
import RSSTrackerPlugin from "./main";

export type TOnSubmitCallback = (result: string) => any;

export class RenameRSSFeedModal extends Modal {
    private plugin: RSSTrackerPlugin;

    private newName: string = "";
    private feed : RSSfeedProxy;
    private btn?: ButtonComponent;
    private originalBtnColor : string = "black";
    private originalTextColor : string = "black";

    constructor(plugin: RSSTrackerPlugin, feed: RSSfeedProxy) {
        super(plugin.app);
        this.plugin = plugin;
        this.feed = feed;
    }

    async isValid() : Promise<boolean> {
        if (this.newName.toLowerCase() === this.feed.file.basename.toLowerCase() || !this.newName) {
            return false;
        }
        const newFolderPath = this.plugin.settings.rssFeedFolderPath + "/" + this.newName;
        return !await this.app.vault.adapter.exists(this.newName);
    }

    onOpen() {
        const { contentEl } = this;
        new Setting(contentEl)
            .setHeading()
            .setName(`Rename RSS Feed: ${this.feed.file.basename}`);

        new Setting(contentEl)
            .setDesc('Enter a new, unique name for the RSS feed.')
            .addText(text => {
                text.inputEl.addEventListener("keyup", async (evt) => {
                    const keyCode = evt.code ?? evt.key;
                    if (keyCode === "Enter" && await this.isValid()) {
                        this.close();
                        await this.feed.rename(this.newName);
                        return false;
                    }
                });
                this.originalTextColor = text.inputEl.style.borderColor;
                text.inputEl.style.width = '95%';
                text.inputEl.style.borderColor= "red";
                text.setPlaceholder('New Feed Name')
                    .setValue(this.feed.file.basename)
                    .onChange(async value => {
                        this.newName = value.trim();
                        const  valid = await this.isValid();
                        if (this.btn) {
                            this.btn.disabled = !valid;
                            this.btn.buttonEl.style.color = valid ? this.originalBtnColor : "red";
                        }
                        text.inputEl.style.borderColor = valid ? this.originalTextColor : "red";
                        return valid;
                    });
            });

        new Setting(contentEl).addButton(btn => {
            this.btn = btn;
            this.originalBtnColor = btn.buttonEl.style.color;
            btn.buttonEl.style.color = "red";
            btn
                .setButtonText('Rename')
                .setCta()
                .onClick(async () => {
                    this.close();
                    await this.feed.rename(this.newName);
                }).disabled = true;
            }
        );
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

/**
 * Modal dialog to request rss url input from the user.
 */
export class InputUrlModal extends Modal {
    result: string = '';

    private onSubmit: TOnSubmitCallback;

    constructor(app: App, onSubmit: TOnSubmitCallback) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        // Input field
        new Setting(contentEl)
            .setHeading()
            .setName('Feed Url')
        new Setting(contentEl)
            .setDesc('Enter the url of the RSS feed:')
            .addText(text => {
                text.inputEl.addEventListener("keyup", async (evt) => {
                    var keyCode = evt.code ?? evt.key;
                    if (keyCode === "Enter") {
                        if (this.result) {
                            this.close();
                            await this.onSubmit(this.result);
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
                .onClick(async () => {
                    this.close();
                    await this.onSubmit(this.result);
                })
        );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
