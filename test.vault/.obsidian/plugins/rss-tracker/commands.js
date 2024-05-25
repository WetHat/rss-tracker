import { Modal, MarkdownView } from 'obsidian';
export class SampleModal extends Modal {
    constructor(app) {
        super(app);
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.setText('Woah!');
    }
    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
/**
 * A simple command that can be triggered anywhere
 */
export class EditorModalCommand {
    constructor(app) {
        this.id = 'open-sample-modal-simple';
        this.name = 'Open sample modal (simple)';
        this.app = app;
    }
    callback() {
        new SampleModal(this.app).open();
    }
}
/**
 * An editor command that can perform some operation on the current editor instance
 */
export class EditorCommand {
    constructor(app) {
        this.id = 'sample-editor-command';
        this.name = 'Sample editor command';
        this.app = app;
    }
    editorCallback(editor, view) {
        console.log(editor.getSelection());
        editor.replaceSelection('Sample Editor Command was here');
    }
}
/**
 * A complex command that can check whether the current state of the app allows execution of the command.
 */
export class EditorComplexModalCommand {
    constructor(app) {
        this.id = 'open-sample-modal-complex';
        this.name = 'Open sample modal (complex)';
        this.app = app;
    }
    checkCallback(checking) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFPLEtBQUssRUFBVyxZQUFZLEVBQTRCLE1BQU0sVUFBVSxDQUFDO0FBRXZGLE1BQU0sT0FBTyxXQUFZLFNBQVEsS0FBSztJQUVyQyxZQUFZLEdBQVE7UUFDbkIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztJQUVELE1BQU07UUFDTCxNQUFNLEVBQUMsU0FBUyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELE9BQU87UUFDTixNQUFNLEVBQUMsU0FBUyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQixDQUFDO0NBQ0Q7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxrQkFBa0I7SUFJM0IsWUFBYSxHQUFRO1FBSHJCLE9BQUUsR0FBRywwQkFBMEIsQ0FBQztRQUNoQyxTQUFJLEdBQUcsNEJBQTRCLENBQUM7UUFHaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVELFFBQVE7UUFDSixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckMsQ0FBQztDQUNKO0FBQ0Q7O0dBRUc7QUFDSCxNQUFNLE9BQU8sYUFBYTtJQUl0QixZQUFhLEdBQVE7UUFIckIsT0FBRSxHQUFHLHVCQUF1QixDQUFDO1FBQzdCLFNBQUksR0FBRyx1QkFBdUIsQ0FBQztRQUczQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQsY0FBYyxDQUFDLE1BQWMsRUFBRSxJQUFxQztRQUNoRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDSjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHlCQUF5QjtJQUlsQyxZQUFhLEdBQVE7UUFIckIsT0FBRSxHQUFHLDJCQUEyQixDQUFDO1FBQ2pDLFNBQUksR0FBRyw2QkFBNkIsQ0FBQztRQUdqQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQsYUFBYSxDQUFDLFFBQWlCO1FBQzNCLHNCQUFzQjtRQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRSxJQUFJLFlBQVksRUFBRTtZQUNkLDBFQUEwRTtZQUMxRSx3RUFBd0U7WUFDeEUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDWCxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEM7WUFFRCx5RkFBeUY7WUFDekYsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUNMLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgTW9kYWwsIENvbW1hbmQsIE1hcmtkb3duVmlldywgRWRpdG9yLCBNYXJrZG93bkZpbGVJbmZvIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZU1vZGFsIGV4dGVuZHMgTW9kYWwge1xyXG5cclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCkge1xyXG5cdFx0c3VwZXIoYXBwKTtcclxuXHR9XHJcblxyXG5cdG9uT3BlbigpIHtcclxuXHRcdGNvbnN0IHtjb250ZW50RWx9ID0gdGhpcztcclxuXHRcdGNvbnRlbnRFbC5zZXRUZXh0KCdXb2FoIScpO1xyXG5cdH1cclxuXHJcblx0b25DbG9zZSgpIHtcclxuXHRcdGNvbnN0IHtjb250ZW50RWx9ID0gdGhpcztcclxuXHRcdGNvbnRlbnRFbC5lbXB0eSgpO1xyXG5cdH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEEgc2ltcGxlIGNvbW1hbmQgdGhhdCBjYW4gYmUgdHJpZ2dlcmVkIGFueXdoZXJlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRWRpdG9yTW9kYWxDb21tYW5kIGltcGxlbWVudHMgQ29tbWFuZCB7XHJcbiAgICBpZCA9ICdvcGVuLXNhbXBsZS1tb2RhbC1zaW1wbGUnO1xyXG4gICAgbmFtZSA9ICdPcGVuIHNhbXBsZSBtb2RhbCAoc2ltcGxlKSc7XHJcbiAgICBwcml2YXRlIGFwcDogQXBwO1xyXG4gICAgY29uc3RydWN0b3IgKGFwcDogQXBwKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbGJhY2soKSA6IGFueSB7XHJcbiAgICAgICAgbmV3IFNhbXBsZU1vZGFsKHRoaXMuYXBwKS5vcGVuKCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEFuIGVkaXRvciBjb21tYW5kIHRoYXQgY2FuIHBlcmZvcm0gc29tZSBvcGVyYXRpb24gb24gdGhlIGN1cnJlbnQgZWRpdG9yIGluc3RhbmNlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRWRpdG9yQ29tbWFuZCBpbXBsZW1lbnRzIENvbW1hbmQge1xyXG4gICAgaWQgPSAnc2FtcGxlLWVkaXRvci1jb21tYW5kJztcclxuICAgIG5hbWUgPSAnU2FtcGxlIGVkaXRvciBjb21tYW5kJztcclxuICAgIHByaXZhdGUgYXBwOiBBcHA7XHJcbiAgICBjb25zdHJ1Y3RvciAoYXBwOiBBcHApIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0b3JDYWxsYmFjayhlZGl0b3I6IEVkaXRvciwgdmlldzogTWFya2Rvd25WaWV3IHwgTWFya2Rvd25GaWxlSW5mbykgOiBhbnkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVkaXRvci5nZXRTZWxlY3Rpb24oKSk7XHJcblx0XHRlZGl0b3IucmVwbGFjZVNlbGVjdGlvbignU2FtcGxlIEVkaXRvciBDb21tYW5kIHdhcyBoZXJlJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBIGNvbXBsZXggY29tbWFuZCB0aGF0IGNhbiBjaGVjayB3aGV0aGVyIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBhcHAgYWxsb3dzIGV4ZWN1dGlvbiBvZiB0aGUgY29tbWFuZC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBFZGl0b3JDb21wbGV4TW9kYWxDb21tYW5kIGltcGxlbWVudHMgQ29tbWFuZCB7XHJcbiAgICBpZCA9ICdvcGVuLXNhbXBsZS1tb2RhbC1jb21wbGV4JztcclxuICAgIG5hbWUgPSAnT3BlbiBzYW1wbGUgbW9kYWwgKGNvbXBsZXgpJztcclxuICAgIHByaXZhdGUgYXBwOiBBcHA7XHJcbiAgICBjb25zdHJ1Y3RvciAoYXBwOiBBcHApIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NhbGxiYWNrKGNoZWNraW5nOiBib29sZWFuKTogYW55ICB7XHJcbiAgICAgICAgLy8gQ29uZGl0aW9ucyB0byBjaGVja1xyXG4gICAgICAgIGNvbnN0IG1hcmtkb3duVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcbiAgICAgICAgaWYgKG1hcmtkb3duVmlldykge1xyXG4gICAgICAgICAgICAvLyBJZiBjaGVja2luZyBpcyB0cnVlLCB3ZSdyZSBzaW1wbHkgXCJjaGVja2luZ1wiIGlmIHRoZSBjb21tYW5kIGNhbiBiZSBydW4uXHJcbiAgICAgICAgICAgIC8vIElmIGNoZWNraW5nIGlzIGZhbHNlLCB0aGVuIHdlIHdhbnQgdG8gYWN0dWFsbHkgcGVyZm9ybSB0aGUgb3BlcmF0aW9uLlxyXG4gICAgICAgICAgICBpZiAoIWNoZWNraW5nKSB7XHJcbiAgICAgICAgICAgICAgICBuZXcgU2FtcGxlTW9kYWwodGhpcy5hcHApLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVGhpcyBjb21tYW5kIHdpbGwgb25seSBzaG93IHVwIGluIENvbW1hbmQgUGFsZXR0ZSB3aGVuIHRoZSBjaGVjayBmdW5jdGlvbiByZXR1cm5zIHRydWVcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==