import { Modal, App } from "obsidian";
import { RSSfeedAdapter } from './RSSAdapter';
import RSSTrackerPlugin from "./main";
export declare type TOnSubmitCallback = (result: string) => any;
export declare class RenameRSSFeedModal extends Modal {
    private plugin;
    private newName;
    private feed;
    private btn?;
    private originalBtnColor;
    private originalTextColor;
    constructor(plugin: RSSTrackerPlugin, feed: RSSfeedAdapter);
    isValid(): Promise<boolean>;
    onOpen(): void;
    onClose(): void;
}
/**
 * Modal dialog to request rss url input from the user.
 */
export declare class InputUrlModal extends Modal {
    result: string;
    private onSubmit;
    constructor(app: App, onSubmit: TOnSubmitCallback);
    onOpen(): void;
    onClose(): void;
}
