import { __awaiter } from "tslib";
import { Notice } from 'obsidian';
import { RSScollectionAdapter, RSSfeedAdapter } from './RSSAdapter';
import { InputUrlModal, RenameRSSFeedModal } from './dialogs';
class RSSTrackerCommandBase {
    constructor(plugin, id, name) {
        this.app = plugin.app;
        this.plugin = plugin;
        this.id = id;
        this.name = name;
    }
}
/**
 * A command that can update an RSS feed if the current file is a RSS feed or collection.
 */
export class RenameRSSfeedModalCommand extends RSSTrackerCommandBase {
    constructor(plugin) {
        super(plugin, 'rss-tracker-rename-feed-checked', 'Rename RSS feed');
    }
    checkCallback(checking) {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();
        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const adapter = this.plugin.filemgr.getAdapter(active);
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
    constructor(plugin) {
        super(plugin, 'rss-tracker-update-feed-checked', 'Update RSS feed or collection');
    }
    checkCallback(checking) {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();
        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const adapter = this.plugin.filemgr.getAdapter(active);
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return (adapter instanceof RSSfeedAdapter && !adapter.suspended) || adapter instanceof RSScollectionAdapter;
            }
            if ((adapter instanceof RSSfeedAdapter && !adapter.suspended) || adapter instanceof RSScollectionAdapter) {
                this.plugin.feedmgr.update(true, adapter).then(() => this.plugin.refreshActiveFile());
            }
        }
        return false;
    }
}
export class DownloadRSSitemArticleCommand extends RSSTrackerCommandBase {
    constructor(plugin) {
        super(plugin, 'rss-tracker-download-article-checked', 'Download RSS item article');
    }
    checkCallback(checking) {
        // Conditions to check
        const active = this.app.workspace.getActiveFile(), feedmgr = this.plugin.feedmgr;
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
    constructor(plugin) {
        super(plugin, 'tracked-rss-mark-items-read-checked', 'Mark all RSS feed items as read');
    }
    checkCallback(checking) {
        // Conditions to check
        const active = this.app.workspace.getActiveFile();
        if (active) {
            // If checking is true, we're simply "checking" if the command can be run.
            // If checking is false, then we want to actually perform the operation.
            const adapter = this.plugin.filemgr.getAdapter(active);
            if (checking) {
                // This command will only show up in Command Palette when the check function returns true
                // check if active file is a rss feed dashboard.
                return adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter;
            }
            if (adapter instanceof RSSfeedAdapter || adapter instanceof RSScollectionAdapter) {
                this.plugin.feedmgr.completeReadingTasks(adapter).then(() => this.plugin.refreshActiveFile());
                return true;
            }
        }
        return false;
    }
}
export class NewRSSTopicCommand extends RSSTrackerCommandBase {
    constructor(plugin) {
        super(plugin, 'rss-tracker-new-topic', 'New RSS topic');
    }
    callback() {
        this.plugin.filemgr.createFile(this.plugin.settings.rssTopicsFolderPath, "New Topic", "RSS Topic")
            .then(topic => {
            const leaf = this.app.workspace.getLeaf(false);
            leaf.openFile(topic).catch(reason => new Notice(reason.message));
        })
            .catch(reason => new Notice(`RSS topic could not be created! ${reason.message}`));
    }
}
export class NewRSSFeedCollectionCommand extends RSSTrackerCommandBase {
    constructor(plugin) {
        super(plugin, 'rss-tracker-new-feed-collection', 'New RSS feed collection');
    }
    callback() {
        RSScollectionAdapter.create(this.plugin)
            .then(collection => {
            const leaf = this.app.workspace.getLeaf(false);
            leaf.openFile(collection.file).catch(reason => new Notice(reason.message));
        })
            .catch(reason => new Notice(`RSS feed collection not created! ${reason.message}`));
    }
}
/**
 * A complex command that checks whether the current state of the app allows execution of the command.
 */
export class NewRSSFeedModalCommand extends RSSTrackerCommandBase {
    constructor(plugin) {
        super(plugin, 'rss-tracker-new-feed-url-input-modal', 'New RSS feed');
    }
    callback() {
        // Conditions to check
        const modal = new InputUrlModal(this.app, (result) => __awaiter(this, void 0, void 0, function* () {
            const mgr = this.plugin.feedmgr, leaf = this.app.workspace.getLeaf(false);
            try {
                leaf.openFile((yield mgr.createFeedFromUrl(result)).file);
            }
            catch (err) {
                new Notice(err.message);
            }
        }));
        modal.open();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBZ0IsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWhELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUU5RCxNQUFlLHFCQUFxQjtJQU1oQyxZQUFZLE1BQXdCLEVBQUUsRUFBVSxFQUFFLElBQVk7UUFDMUQsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDcEIsQ0FBQztDQUNKO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8seUJBQTBCLFNBQVEscUJBQXFCO0lBQ2hFLFlBQVksTUFBd0I7UUFDaEMsS0FBSyxDQUFDLE1BQU0sRUFBRSxpQ0FBaUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxhQUFhLENBQUMsUUFBaUI7UUFDM0Isc0JBQXNCO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRWxELElBQUksTUFBTSxFQUFFO1lBQ1IsMEVBQTBFO1lBQzFFLHdFQUF3RTtZQUN4RSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YseUZBQXlGO2dCQUN6RixnREFBZ0Q7Z0JBQ2hELE9BQU8sT0FBTyxZQUFZLGNB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QUFNLENBQUMsT0FBTyxFQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdDLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0Q7WUFBQyxPQUFPLEdBQVEsRUFBRTtnQkFDZixJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDM0I7UUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pCLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgQ29tbWFuZCwgTm90aWNlIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5pbXBvcnQgUlNTVHJhY2tlclBsdWdpbiBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQgeyBSU1Njb2xsZWN0aW9uQWRhcHRlciwgUlNTZmVlZEFkYXB0ZXIgfSBmcm9tICcuL1JTU0FkYXB0ZXInO1xyXG5pbXBvcnQgeyBJbnB1dFVybE1vZGFsLCBSZW5hbWVSU1NGZWVkTW9kYWwgfSBmcm9tICcuL2RpYWxvZ3MnO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgUlNTVHJhY2tlckNvbW1hbmRCYXNlIGltcGxlbWVudHMgQ29tbWFuZCB7XHJcbiAgICBwcm90ZWN0ZWQgYXBwOiBBcHA7XHJcbiAgICBwcm90ZWN0ZWQgcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luO1xyXG4gICAgcmVhZG9ubHkgaWQ6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwbHVnaW46IFJTU1RyYWNrZXJQbHVnaW4sIGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuYXBwID0gcGx1Z2luLmFwcDtcclxuICAgICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQSBjb21tYW5kIHRoYXQgY2FuIHVwZGF0ZSBhbiBSU1MgZmVlZCBpZiB0aGUgY3VycmVudCBmaWxlIGlzIGEgUlNTIGZlZWQgb3IgY29sbGVjdGlvbi5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZW5hbWVSU1NmZWVkTW9kYWxDb21tYW5kIGV4dGVuZHMgUlNTVHJhY2tlckNvbW1hbmRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKHBsdWdpbiwgJ3Jzcy10cmFja2VyLXJlbmFtZS1mZWVkLWNoZWNrZWQnLCAnUmVuYW1lIFJTUyBmZWVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDYWxsYmFjayhjaGVja2luZzogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIC8vIENvbmRpdGlvbnMgdG8gY2hlY2tcclxuICAgICAgICBjb25zdCBhY3RpdmUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xyXG5cclxuICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIC8vIElmIGNoZWNraW5nIGlzIHRydWUsIHdlJ3JlIHNpbXBseSBcImNoZWNraW5nXCIgaWYgdGhlIGNvbW1hbmQgY2FuIGJlIHJ1bi5cclxuICAgICAgICAgICAgLy8gSWYgY2hlY2tpbmcgaXMgZmFsc2UsIHRoZW4gd2Ugd2FudCB0byBhY3R1YWxseSBwZXJmb3JtIHRoZSBvcGVyYXRpb24uXHJcbiAgICAgICAgICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLnBsdWdpbi5maWxlbWdyLmdldEFkYXB0ZXIoYWN0aXZlKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNraW5nKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGNvbW1hbmQgd2lsbCBvbmx5IHNob3cgdXAgaW4gQ29tbWFuZCBQYWxldHRlIHdoZW4gdGhlIGNoZWNrIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWN0aXZlIGZpbGUgaXMgYSByc3MgZmVlZCBkYXNoYm9hcmQuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhZGFwdGVyIGluc3RhbmNlb2YgUlNTZmVlZEFkYXB0ZXIpIHtcclxuICAgICAgICAgICAgICAgIG5ldyBSZW5hbWVSU1NGZWVkTW9kYWwodGhpcy5wbHVnaW4sIGFkYXB0ZXIpLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNvbW1hbmQgdGhhdCBjYW4gdXBkYXRlIGFuIFJTUyBmZWVkIGlmIHRoZSBjdXJyZW50IGZpbGUgaXMgYSBSU1MgZmVlZCBvciBjb2xsZWN0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVwZGF0ZVJTU2ZlZWRDb21tYW5kIGV4dGVuZHMgUlNTVHJhY2tlckNvbW1hbmRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKHBsdWdpbiwgJ3Jzcy10cmFja2VyLXVwZGF0ZS1mZWVkLWNoZWNrZWQnLCAnVXBkYXRlIFJTUyBmZWVkIG9yIGNvbGxlY3Rpb24nKTtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NhbGxiYWNrKGNoZWNraW5nOiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgLy8gQ29uZGl0aW9ucyB0byBjaGVja1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmUpIHtcclxuICAgICAgICAgICAgLy8gSWYgY2hlY2tpbmcgaXMgdHJ1ZSwgd2UncmUgc2ltcGx5IFwiY2hlY2tpbmdcIiBpZiB0aGUgY29tbWFuZCBjYW4gYmUgcnVuLlxyXG4gICAgICAgICAgICAvLyBJZiBjaGVja2luZyBpcyBmYWxzZSwgdGhlbiB3ZSB3YW50IHRvIGFjdHVhbGx5IHBlcmZvcm0gdGhlIG9wZXJhdGlvbi5cclxuICAgICAgICAgICAgY29uc3QgYWRhcHRlciA9IHRoaXMucGx1Z2luLmZpbGVtZ3IuZ2V0QWRhcHRlcihhY3RpdmUpO1xyXG4gICAgICAgICAgICBpZiAoY2hlY2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgY29tbWFuZCB3aWxsIG9ubHkgc2hvdyB1cCBpbiBDb21tYW5kIFBhbGV0dGUgd2hlbiB0aGUgY2hlY2sgZnVuY3Rpb24gcmV0dXJucyB0cnVlXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBhY3RpdmUgZmlsZSBpcyBhIHJzcyBmZWVkIGRhc2hib2FyZC5cclxuICAgICAgICAgICAgICAgIHJldHVybiAoYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyICYmICFhZGFwdGVyLnN1c3BlbmRlZCkgfHwgYWRhcHRlciBpbnN0YW5jZW9mIFJTU2NvbGxlY3Rpb25BZGFwdGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgoYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyICYmICFhZGFwdGVyLnN1c3BlbmRlZCkgfHwgYWRhcHRlciBpbnN0YW5jZW9mIFJTU2NvbGxlY3Rpb25BZGFwdGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsdWdpbi5mZWVkbWdyLnVwZGF0ZSh0cnVlLCBhZGFwdGVyKS50aGVuKCgpID0+IHRoaXMucGx1Z2luLnJlZnJlc2hBY3RpdmVGaWxlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIERvd25sb2FkUlNTaXRlbUFydGljbGVDb21tYW5kIGV4dGVuZHMgUlNTVHJhY2tlckNvbW1hbmRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKHBsdWdpbiwgJ3Jzcy10cmFja2VyLWRvd25sb2FkLWFydGljbGUtY2hlY2tlZCcsICdEb3dubG9hZCBSU1MgaXRlbSBhcnRpY2xlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDYWxsYmFjayhjaGVja2luZzogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgIC8vIENvbmRpdGlvbnMgdG8gY2hlY2tcclxuICAgICAgICBjb25zdFxyXG4gICAgICAgICAgICBhY3RpdmUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpLFxyXG4gICAgICAgICAgICBmZWVkbWdyID0gdGhpcy5wbHVnaW4uZmVlZG1ncjtcclxuXHJcbiAgICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICAgICAvLyBJZiBjaGVja2luZyBpcyB0cnVlLCB3ZSdyZSBzaW1wbHkgXCJjaGVja2luZ1wiIGlmIHRoZSBjb21tYW5kIGNhbiBiZSBydW4uXHJcbiAgICAgICAgICAgIC8vIElmIGNoZWNraW5nIGlzIGZhbHNlLCB0aGVuIHdlIHdhbnQgdG8gYWN0dWFsbHkgcGVyZm9ybSB0aGUgb3BlcmF0aW9uLlxyXG4gICAgICAgICAgICBpZiAoY2hlY2tpbmcpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgY29tbWFuZCB3aWxsIG9ubHkgc2hvdyB1cCBpbiBDb21tYW5kIFBhbGV0dGUgd2hlbiB0aGUgY2hlY2sgZnVuY3Rpb24gcmV0dXJucyB0cnVlXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBhY3RpdmUgZmlsZSBpcyBhIHJzcyBmZWVkIGRhc2hib2FyZC5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmZWVkbWdyLmNhbkRvd25sb2FkQXJ0aWNsZShhY3RpdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZlZWRtZ3IuZG93bmxvYWRBcnRpY2xlKGFjdGl2ZSkudGhlbih2ID0+IG5ldyBOb3RpY2UoYEFydGljbGUgY29udGVudCBvZiBcIiR7YWN0aXZlLmJhc2VuYW1lfVwiIGRvd25sb2FkZWRgKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNvbW1hbmQgdGhhdCBjYW4gdXBkYXRlIGFuIFJTUyBmZWVkIG9mIHRoZSBjdXJyZW50IGZpbGUgaXMgYSBSU1MgZmVlZCBkYXNoYm9hcmQuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgTWFya0FsbFJTU2l0ZW1zUmVhZENvbW1hbmQgZXh0ZW5kcyBSU1NUcmFja2VyQ29tbWFuZEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luKSB7XHJcbiAgICAgICAgc3VwZXIocGx1Z2luLCAndHJhY2tlZC1yc3MtbWFyay1pdGVtcy1yZWFkLWNoZWNrZWQnLCAnTWFyayBhbGwgUlNTIGZlZWQgaXRlbXMgYXMgcmVhZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ2FsbGJhY2soY2hlY2tpbmc6IGJvb2xlYW4pOiBhbnkge1xyXG4gICAgICAgIC8vIENvbmRpdGlvbnMgdG8gY2hlY2tcclxuICAgICAgICBjb25zdCBhY3RpdmUgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlRmlsZSgpO1xyXG5cclxuICAgICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgICAgIC8vIElmIGNoZWNraW5nIGlzIHRydWUsIHdlJ3JlIHNpbXBseSBcImNoZWNraW5nXCIgaWYgdGhlIGNvbW1hbmQgY2FuIGJlIHJ1bi5cclxuICAgICAgICAgICAgLy8gSWYgY2hlY2tpbmcgaXMgZmFsc2UsIHRoZW4gd2Ugd2FudCB0byBhY3R1YWxseSBwZXJmb3JtIHRoZSBvcGVyYXRpb24uXHJcbiAgICAgICAgICAgIGNvbnN0IGFkYXB0ZXIgPSB0aGlzLnBsdWdpbi5maWxlbWdyLmdldEFkYXB0ZXIoYWN0aXZlKTtcclxuICAgICAgICAgICAgaWYgKGNoZWNraW5nKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGNvbW1hbmQgd2lsbCBvbmx5IHNob3cgdXAgaW4gQ29tbWFuZCBQYWxldHRlIHdoZW4gdGhlIGNoZWNrIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgYWN0aXZlIGZpbGUgaXMgYSByc3MgZmVlZCBkYXNoYm9hcmQuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyIHx8IGFkYXB0ZXIgaW5zdGFuY2VvZiBSU1Njb2xsZWN0aW9uQWRhcHRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYWRhcHRlciBpbnN0YW5jZW9mIFJTU2ZlZWRBZGFwdGVyIHx8IGFkYXB0ZXIgaW5zdGFuY2VvZiBSU1Njb2xsZWN0aW9uQWRhcHRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uZmVlZG1nci5jb21wbGV0ZVJlYWRpbmdUYXNrcyhhZGFwdGVyKS50aGVuKCgpID0+IHRoaXMucGx1Z2luLnJlZnJlc2hBY3RpdmVGaWxlKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3UlNTVG9waWNDb21tYW5kIGV4dGVuZHMgUlNTVHJhY2tlckNvbW1hbmRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKHBsdWdpbiwgJ3Jzcy10cmFja2VyLW5ldy10b3BpYycsICdOZXcgUlNTIHRvcGljJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbGJhY2soKTogYW55IHtcclxuICAgICAgICB0aGlzLnBsdWdpbi5maWxlbWdyLmNyZWF0ZUZpbGUodGhpcy5wbHVnaW4uc2V0dGluZ3MucnNzVG9waWNzRm9sZGVyUGF0aCwgXCJOZXcgVG9waWNcIiwgXCJSU1MgVG9waWNcIilcclxuICAgICAgICAgICAgLnRoZW4odG9waWMgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGxlYWYub3BlbkZpbGUodG9waWMpLmNhdGNoKHJlYXNvbiA9PiBuZXcgTm90aWNlKHJlYXNvbi5tZXNzYWdlKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiBuZXcgTm90aWNlKGBSU1MgdG9waWMgY291bGQgbm90IGJlIGNyZWF0ZWQhICR7cmVhc29uLm1lc3NhZ2V9YCkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmV3UlNTRmVlZENvbGxlY3Rpb25Db21tYW5kIGV4dGVuZHMgUlNTVHJhY2tlckNvbW1hbmRCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBsdWdpbjogUlNTVHJhY2tlclBsdWdpbikge1xyXG4gICAgICAgIHN1cGVyKHBsdWdpbiwgJ3Jzcy10cmFja2VyLW5ldy1mZWVkLWNvbGxlY3Rpb24nLCAnTmV3IFJTUyBmZWVkIGNvbGxlY3Rpb24nKTtcclxuICAgIH1cclxuXHJcbiAgICBjYWxsYmFjaygpOiBhbnkge1xyXG4gICAgICAgIFJTU2NvbGxlY3Rpb25BZGFwdGVyLmNyZWF0ZSh0aGlzLnBsdWdpbilcclxuICAgICAgICAgICAgLnRoZW4oY29sbGVjdGlvbiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgbGVhZi5vcGVuRmlsZShjb2xsZWN0aW9uLmZpbGUpLmNhdGNoKHJlYXNvbiA9PiBuZXcgTm90aWNlKHJlYXNvbi5tZXNzYWdlKSlcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmNhdGNoKHJlYXNvbiA9PiBuZXcgTm90aWNlKGBSU1MgZmVlZCBjb2xsZWN0aW9uIG5vdCBjcmVhdGVkISAke3JlYXNvbi5tZXNzYWdlfWApKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgY29tcGxleCBjb21tYW5kIHRoYXQgY2hlY2tzIHdoZXRoZXIgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGFwcCBhbGxvd3MgZXhlY3V0aW9uIG9mIHRoZSBjb21tYW5kLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5ld1JTU0ZlZWRNb2RhbENvbW1hbmQgZXh0ZW5kcyBSU1NUcmFja2VyQ29tbWFuZEJhc2Uge1xyXG4gICAgY29uc3RydWN0b3IocGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luKSB7XHJcbiAgICAgICAgc3VwZXIocGx1Z2luLCAncnNzLXRyYWNrZXItbmV3LWZlZWQtdXJsLWlucHV0LW1vZGFsJywgJ05ldyBSU1MgZmVlZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGNhbGxiYWNrKCk6IGFueSB7XHJcbiAgICAgICAgLy8gQ29uZGl0aW9ucyB0byBjaGVja1xyXG4gICAgICAgIGNvbnN0IG1vZGFsID0gbmV3IElucHV0VXJsTW9kYWwodGhpcy5hcHAsIGFzeW5jIHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0XHJcbiAgICAgICAgICAgICAgICBtZ3IgPSB0aGlzLnBsdWdpbi5mZWVkbWdyLFxyXG4gICAgICAgICAgICAgICAgbGVhZiA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRMZWFmKGZhbHNlKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGxlYWYub3BlbkZpbGUoKGF3YWl0IG1nci5jcmVhdGVGZWVkRnJvbVVybChyZXN1bHQpKS5maWxlKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9kYWwub3BlbigpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==