import { App, Command, Notice } from 'obsidian';
import RSSTrackerPlugin from './main';
import { RSScollectionAdapter, RSSfeedAdapter, RSStopicAdapter } from './RSSAdapter';
import { InputUrlModal, RenameRSSFeedModal } from './dialogs';

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
 * A command that can update an RSS feed if the current file is a RSS feed or collection.
 */
export class RenameRSSfeedModalCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin, 'rss-tracker-rename-feed-checked', 'Rename RSS feed');
    }

    checkCallback(checking: boolean): boolean {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const adapter = this.plugin.filemgr.createAdapter(active,"rssfeed");
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return adapter instanceof RSSfeedAdapter;
            }
            if (adapter instanceof RSSfeedAdapter) {
                new RenameRSSFeedModal(this.plugin, adapter).open();
            }
        }
        return false;
    }
}

/**
 * A command that can update an RSS feed if the current file is a RSS feed or collection.
 */
export class UpdateRSSfeedCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin, 'rss-tracker-update-feed-checked', 'Update RSS feed or collection');
    }

    checkCallback(checking: boolean): boolean {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const adapter = this.plugin.filemgr.createAdapter(active,"rssfeed","rsscollection");
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return (adapter instanceof RSSfeedAdapter && !adapter.suspended) || adapter instanceof RSScollectionAdapter;
            }
            if ((adapter instanceof RSSfeedAdapter && !adapter.suspended) || adapter instanceof RSScollectionAdapter) {
                this.plugin.feedmgr.update(true, adapter);
            }
        }
        return false;
    }
}

export class DownloadRSSitemArticleCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin, 'rss-tracker-download-article-checked', 'Download RSS item article');
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
        super(plugin, 'tracked-rss-mark-items-read-checked', 'Mark all RSS feed items as read');
    }

    checkCallback(checking: boolean): any {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();

        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const adapter = this.plugin.filemgr.createAdapter(active,"rssfeed","rsscollection");
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return adapter;
            }
            if (adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter) {
                this.plugin.feedmgr.completeReadingTasks(adapter);
                return true;
            }
        }
        return false;
    }
}

export class NewRSSTopicCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin, 'rss-tracker-new-topic', 'New RSS topic');
    }

    async callback(): Promise<any> {
        await RSStopicAdapter.create(this.plugin)
            .then(topic => {
                const leaf = this.app.workspace.getLeaf(false);
                leaf.openFile(topic.file).catch(reason => new Notice(reason.message))
            })
            .catch(reason => new Notice(`RSS topic could not be created! ${reason.message}`));
    }
}

export class NewRSSFeedCollectionCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin, 'rss-tracker-new-feed-collection', 'New RSS feed collection');
    }

    callback(): any {
        RSScollectionAdapter.create(this.plugin)
            .then(collection => {
                const leaf = this.app.workspace.getLeaf(false);
                leaf.openFile(collection.file).catch(reason => new Notice(reason.message))
            })
            .catch(reason => new Notice(`RSS feed collection not created! ${reason.message}`));
    }
}

/**
 * A complex command that checks whether the current state of the app allows execution of the command.
 */
export class NewRSSFeedModalCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin) {
        super(plugin, 'rss-tracker-new-feed-url-input-modal', 'New RSS feed');
    }

    callback(): any {
        // Conditions to check
        const modal = new InputUrlModal(this.app, async result => {
            const
                mgr = this.plugin.feedmgr,
                leaf = this.app.workspace.getLeaf(false);
            try {
                leaf.openFile((await mgr.createFeedFromUrl(result)).file);
            } catch (err: any) {
                new Notice(err.message);
            }
        });
        modal.open();
    }
}
