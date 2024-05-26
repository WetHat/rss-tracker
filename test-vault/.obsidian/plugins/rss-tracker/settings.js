import { __awaiter } from "tslib";
import { PluginSettingTab, Setting } from 'obsidian';
export const DEFAULT_SETTINGS = {
    feedTemplate: `---
feedurl:{{feedUrl}}
site: {{siteUrl}}
itemlimit: 100
updated: {{lastUpdate}}
status: {{status}}"
---

> [!abstract] {{title}}
> {{description}}

`,
    itemTemplate: `---
title: {{title}}
author: {{author}}
link: {{link}}
published: {{pubDate}}
guid: {{guid}}
read: false
tags: [{{tags}}]
---
{{content}}
- - -
{{media}}
`
};
export class RSSTrackerSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        // feed template setting
        new Setting(containerEl)
            .setName('Default RSS Feed Template')
            .setDesc('Template for new RSS feed description markdown files.')
            .addTextArea(ta => {
            ta
                .setValue(this.plugin.settings.feedTemplate)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.feedTemplate = value;
                yield this.plugin.saveSettings();
            }));
            ta.inputEl.style.width = "100%";
            ta.inputEl.rows = 10;
        })
            .addButton(btn => {
            btn
                .setIcon("reset")
                .setTooltip("Reset feed template to default")
                .onClick((evt) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.feedTemplate = DEFAULT_SETTINGS.feedTemplate;
                yield this.plugin.saveSettings();
                this.display();
            }));
        });
        // item template setting
        new Setting(containerEl)
            .setName('Default RSS Item Template')
            .setDesc('Template for new RSS item description markdown files.')
            .addTextArea(ta => {
            ta
                .setValue(this.plugin.settings.itemTemplate)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.itemTemplate = value;
                yield this.plugin.saveSettings();
            }));
            ta.inputEl.style.width = "100%";
            ta.inputEl.rows = 10;
        })
            .addButton(btn => {
            btn
                .setIcon("reset")
                .setTooltip("Reset item template to default")
                .onClick((evt) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.itemTemplate = DEFAULT_SETTINGS.itemTemplate;
                yield this.plugin.saveSettings();
                this.display();
            }));
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxPQUFPLEVBQU0sTUFBTSxVQUFVLENBQUM7QUFPeEQsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQXVCO0lBQ25ELFlBQVksRUFBRTs7Ozs7Ozs7Ozs7Q0FXZDtJQUNBLFlBQVksRUFBRTs7Ozs7Ozs7Ozs7O0NBWWQ7Q0FDQSxDQUFBO0FBRUQsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGdCQUFnQjtJQUd6RCxZQUFZLEdBQVEsRUFBRSxNQUF3QjtRQUM3QyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxPQUFPO1FBQ04sTUFBTSxFQUFDLFdBQVcsRUFBQyxHQUFHLElBQUksQ0FBQztRQUMzQixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFcEIsd0JBQXdCO1FBQ3hCLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUN0QixPQUFPLENBQUMsMkJBQTJCLENBQUM7YUFDcEMsT0FBTyxDQUFDLHVEQUF1RCxDQUFDO2FBQ2hFLFdBQVcsQ0FBRSxFQUFFLENBQUMsRUFBRTtZQUFHLEVBQUU7aUJBQ3JCLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7aUJBQzNDLFFBQVEsQ0FBQyxDQUFPLEtBQUssRUFBRSxFQUFFO2dCQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbEMsQ0FBQyxDQUFBLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxNQUFNLENBQUM7WUFDOUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQzthQUNGLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUFHLEdBQUc7aUJBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUM7aUJBQ2hCLFVBQVUsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDNUMsT0FBTyxDQUFDLENBQU0sR0FBRyxFQUFDLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUM7Z0JBQ2xFLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDakMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hCLENBQUMsQ0FBQSxDQUFDLENBQUE7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNKLHdCQUF3QjtRQUN4QixJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUM7YUFDdEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDO2FBQ3BDLE9BQU8sQ0FBQyx1REFBdUQsQ0FBQzthQUNoRSxXQUFXLENBQUUsRUFBRSxDQUFDLEVBQUU7WUFBRyxFQUFFO2lCQUNyQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDO2lCQUMzQyxRQUFRLENBQUMsQ0FBTyxLQUFLLEVBQUUsRUFBRTtnQkFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztnQkFDMUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xDLENBQUMsQ0FBQSxDQUFDLENBQUM7WUFDSixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUMsTUFBTSxDQUFDO1lBQzlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUM7YUFDRixTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFBRyxHQUFHO2lCQUNyQixPQUFPLENBQUMsT0FBTyxDQUFDO2lCQUNoQixVQUFVLENBQUMsZ0NBQWdDLENBQUM7aUJBQzVDLE9BQU8sQ0FBQyxDQUFNLEdBQUcsRUFBQyxFQUFFO2dCQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsWUFBWSxDQUFDO2dCQUNsRSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoQixDQUFDLENBQUEsQ0FBQyxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUlNTVHJhY2tlclBsdWdpbiBmcm9tICcuL21haW4nO1xyXG5pbXBvcnQge1BsdWdpblNldHRpbmdUYWIsIFNldHRpbmcsIEFwcH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSU1NUcmFja2VyU2V0dGluZ3Mge1xyXG5cdGZlZWRUZW1wbGF0ZTogc3RyaW5nO1xyXG5cdGl0ZW1UZW1wbGF0ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogUlNTVHJhY2tlclNldHRpbmdzID0ge1xyXG5cdGZlZWRUZW1wbGF0ZTogYC0tLVxyXG5mZWVkdXJsOnt7ZmVlZFVybH19XHJcbnNpdGU6IHt7c2l0ZVVybH19XHJcbml0ZW1saW1pdDogMTAwXHJcbnVwZGF0ZWQ6IHt7bGFzdFVwZGF0ZX19XHJcbnN0YXR1czoge3tzdGF0dXN9fVwiXHJcbi0tLVxyXG5cclxuPiBbIWFic3RyYWN0XSB7e3RpdGxlfX1cclxuPiB7e2Rlc2NyaXB0aW9ufX1cclxuXHJcbmAsXHJcblx0aXRlbVRlbXBsYXRlOiBgLS0tXHJcbnRpdGxlOiB7e3RpdGxlfX1cclxuYXV0aG9yOiB7e2F1dGhvcn19XHJcbmxpbms6IHt7bGlua319XHJcbnB1Ymxpc2hlZDoge3twdWJEYXRlfX1cclxuZ3VpZDoge3tndWlkfX1cclxucmVhZDogZmFsc2VcclxudGFnczogW3t7dGFnc319XVxyXG4tLS1cclxue3tjb250ZW50fX1cclxuLSAtIC1cclxue3ttZWRpYX19XHJcbmBcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJTU1RyYWNrZXJTZXR0aW5nVGFiIGV4dGVuZHMgUGx1Z2luU2V0dGluZ1RhYiB7XHJcblx0cGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luKSB7XHJcblx0XHRzdXBlcihhcHAsIHBsdWdpbik7XHJcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRjb25zdCB7Y29udGFpbmVyRWx9ID0gdGhpcztcclxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblxyXG5cdFx0Ly8gZmVlZCB0ZW1wbGF0ZSBzZXR0aW5nXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0RlZmF1bHQgUlNTIEZlZWQgVGVtcGxhdGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnVGVtcGxhdGUgZm9yIG5ldyBSU1MgZmVlZCBkZXNjcmlwdGlvbiBtYXJrZG93biBmaWxlcy4nKVxyXG5cdFx0XHQuYWRkVGV4dEFyZWEoIHRhID0+IHsgdGFcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5mZWVkVGVtcGxhdGUpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmZlZWRUZW1wbGF0ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRhLmlucHV0RWwuc3R5bGUud2lkdGg9XCIxMDAlXCI7XHJcblx0XHRcdFx0dGEuaW5wdXRFbC5yb3dzID0gMTA7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0LmFkZEJ1dHRvbihidG4gPT4geyBidG5cclxuXHRcdFx0XHQuc2V0SWNvbihcInJlc2V0XCIpXHJcblx0XHRcdFx0LnNldFRvb2x0aXAoXCJSZXNldCBmZWVkIHRlbXBsYXRlIHRvIGRlZmF1bHRcIilcclxuXHRcdFx0XHQub25DbGljayhhc3luYyBldnQgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuZmVlZFRlbXBsYXRlID0gREVGQVVMVF9TRVRUSU5HUy5mZWVkVGVtcGxhdGU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pO1xyXG5cdFx0Ly8gaXRlbSB0ZW1wbGF0ZSBzZXR0aW5nXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ0RlZmF1bHQgUlNTIEl0ZW0gVGVtcGxhdGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnVGVtcGxhdGUgZm9yIG5ldyBSU1MgaXRlbSBkZXNjcmlwdGlvbiBtYXJrZG93biBmaWxlcy4nKVxyXG5cdFx0XHQuYWRkVGV4dEFyZWEoIHRhID0+IHsgdGFcclxuXHRcdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5pdGVtVGVtcGxhdGUpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLml0ZW1UZW1wbGF0ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRhLmlucHV0RWwuc3R5bGUud2lkdGg9XCIxMDAlXCI7XHJcblx0XHRcdFx0dGEuaW5wdXRFbC5yb3dzID0gMTA7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0LmFkZEJ1dHRvbihidG4gPT4geyBidG5cclxuXHRcdFx0XHQuc2V0SWNvbihcInJlc2V0XCIpXHJcblx0XHRcdFx0LnNldFRvb2x0aXAoXCJSZXNldCBpdGVtIHRlbXBsYXRlIHRvIGRlZmF1bHRcIilcclxuXHRcdFx0XHQub25DbGljayhhc3luYyBldnQgPT4ge1xyXG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuaXRlbVRlbXBsYXRlID0gREVGQVVMVF9TRVRUSU5HUy5pdGVtVGVtcGxhdGU7XHJcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdHRoaXMuZGlzcGxheSgpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH0pO1xyXG5cdH1cclxufVxyXG4iXX0=