import { App, Command } from 'obsidian';
import RSSTrackerPlugin from './main';
declare abstract class RSSTrackerCommandBase implements Command {
    protected app: App;
    protected plugin: RSSTrackerPlugin;
    readonly id: string;
    readonly name: string;
    constructor(plugin: RSSTrackerPlugin, id: string, name: string);
}
/**
 * A command that can update an RSS feed if the current file is a RSS feed or collection.
 */
export declare class RenameRSSfeedModalCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    checkCallback(checking: boolean): boolean;
}
/**
 * A command that can update an RSS feed if the current file is a RSS feed or collection.
 */
export declare class UpdateRSSfeedCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    checkCallback(checking: boolean): boolean;
}
export declare class DownloadRSSitemArticleCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    checkCallback(checking: boolean): boolean;
}
/**
 * A command that can update an RSS feed of the current file is a RSS feed dashboard.
 */
export declare class MarkAllRSSitemsReadCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    checkCallback(checking: boolean): any;
}
export declare class NewRSSTopicCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    callback(): Promise<any>;
}
export declare class NewRSSFeedCollectionCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    callback(): any;
}
/**
 * A complex command that checks whether the current state of the app allows execution of the command.
 */
export declare class NewRSSFeedModalCommand extends RSSTrackerCommandBase {
    constructor(plugin: RSSTrackerPlugin);
    callback(): any;
}
export {};
