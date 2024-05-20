import RSSTrackerPlugin from './main';
import { App, Notice, Menu, TFile } from 'obsidian';

export class UpdateRSSfeedMenuItem {
    protected app: App;
    protected plugin: RSSTrackerPlugin;

    constructor (app: App, plugin: RSSTrackerPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    private addItem(menu : Menu, file : TFile | null) {
        if (file) {
            const feedconfig = this.plugin.feedmgr.getFeedConfig(file);
            if (feedconfig) {
                menu.addItem(item => {
                    item.setTitle('Update RSS feed')
                        .setIcon('rss')
                        .onClick(async () => {
                            new Notice(`${file?.name ?? 'unavailable'  } updated`);
                        });
                });
            }
        }
    }

    get editorMenuHandler() {
        return this.app.workspace.on('editor-menu', (menu, editor, view) => {
            this.addItem(menu,view?.file);
        });
    }
    get fileMenuHandler() {
        return this.app.workspace.on('file-menu', (menu, file) => {
            this.addItem(menu, file instanceof TFile ? file : null);
        });
    }
}