import { App, Modal, Command, MarkdownView, Editor, MarkdownFileInfo } from 'obsidian';

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
 * A simple command that can be triggered anywhere
 */
export class EditorComplexModalCommand implements Command {
    id = 'open-sample-modal-complex';
    name = 'Open sample modal (complex)';
    private app: App;
    constructor (app: App) {
        this.app = app;
    }

    checkCallback(checking: boolean): any  {
        // Conditions to check
        const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            if (!checking) {
                new SampleModal(this.app).open();
            }

            // This command will only show up in Command Palette when the check function returns true
            return true;
        }
    }
}
