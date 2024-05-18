import { App, Modal, Command, MarkdownView, Editor, MarkdownFileInfo, Setting, TFile, Plugin } from 'obsidian';
import FeedManager from "./FeedManager";
import RSSTrackerPlugin from "./main";

/**
 * Modal dialog to request rss url input from the user.
 */
export class InputUrlModal extends Modal {
    result: string = "";

    onSubmit: (result: string) => void;

    constructor(app: App, onSubmit: (result: string) => void) {
      super(app);
      this.onSubmit = onSubmit;
    }

    onOpen() {
      const { contentEl } = this;
      // Input fiels
      new Setting(contentEl)
        .setName("Feed Url:")
        .setDesc("Enter the url of the rss feed:")
        .setHeading()
        .addText((text) => {
            text.inputEl.style.width="95%";
            text.setPlaceholder("https://x.com/feed")
            text.onChange((value) => {
                this.result = value
            })});

      new Setting(contentEl)
        .addButton((btn) =>
          btn
            .setButtonText("Submit")
            .setCta()
            .onClick(() => {
              this.close();
              this.onSubmit(this.result);
            }));
    }

    onClose() {
      let { contentEl } = this;
      contentEl.empty();
    }
  }

export class SampleModal extends Modal {

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

/**
 * A simple command that can be triggered anywhere
 */
export class EditorModalCommand implements Command {
    id = 'open-sample-modal-simple';
    name = 'Open sample modal (simple)';
    private app: App;
    constructor (app: App) {
        this.app = app;
    }

    callback() : any {
        new SampleModal(this.app).open();
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

    checkCallback(checking: boolean): any  {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            if (!checking) {
                const modal = new InputUrlModal(this.app, async result => {
                    console.log(active);
                });
                modal.open();
            }

            // This command will only show up in Command Palette when the check function returns true
            return true;
        }
        return false;
   }
}

/**
 * An editor command that can perform some operation on the current editor instance
 */
export class EditorCommand implements Command {
    id = 'sample-editor-command';
    name = 'Sample editor command';
    private app: App;
    constructor (app: App) {
        this.app = app;
    }

    editorCallback(editor: Editor, view: MarkdownView | MarkdownFileInfo) : any {
        console.log(editor.getSelection());
		editor.replaceSelection('Sample Editor Command was here');
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
    constructor (app: App,plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    callback(): any  {
        // Conditions to check
        const modal = new InputUrlModal(this.app, async result => {
            console.log(result);
            const f: TFile | null = this.app.workspace.getActiveFile();

            if (f) {
                const parent = this.app.fileManager.getNewFileParent(f.path),
                      mgr = new FeedManager(this.app,this.plugin),
                      leaf = this.app.workspace.getLeaf(false);

                leaf.openFile(await mgr.createFeed(result,parent));
            }
        });
        modal.open();
    }
}
