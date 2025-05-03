import { __awaiter } from "tslib";
import { RSScollectionAdapter, RSSfeedAdapter, RSSitemAdapter } from './RSSAdapter';
/**
 * A utility class to manage RSS related files.
 */
export class RSSfileManager {
    constructor(app, plugin) {
        this._app = app;
        this._vault = app.vault;
        this._plugin = plugin;
    }
    get settings() {
        return this._plugin.settings;
    }
    get app() {
        return this._app;
    }
    get metadataCache() {
        return this._app.metadataCache;
    }
    /**
     * Factory method to create proxies for RSS files
     * @param file An RSS file to create the adapter for.
     * @returns The appropriate adapter, if it exists.
     */
    getAdapter(file) {
        var _a;
        const frontmatter = (_a = this.metadataCache.getFileCache(file)) === null || _a === void 0 ? void 0 : _a.frontmatter;
        if (frontmatter) {
            switch (frontmatter.role) {
                case "rssfeed":
                    return new RSSfeedAdapter(this._plugin, file, frontmatter);
                case "rssitem":
                    return new RSSitemAdapter(this._plugin, file, frontmatter);
                case "rsscollection":
                    return new RSScollectionAdapter(this._plugin, file, frontmatter);
            }
        }
        return undefined;
    }
    /**
     * Expand `{{mustache}}` placeholders with data from a property bag.
     * @param template - A template string with `{{mustache}}` placeholders.
     * @param properties - A property bag for replacing `{{mustache}}` placeholdes with data.
     * @returns template with `{{mustache}}` placeholders substituted.
     */
    expandTemplate(template, properties) {
        return template.split(RSSfileManager.TOKEN_SPLITTER).map(s => { var _a; return s.startsWith("{{") ? ((_a = properties[s]) !== null && _a !== void 0 ? _a : s) : s; }).join("");
    }
    /**
     * Read the content of a template from the RSS template folder.
     *
     * If the template does not esist, it is installed,
     *
     * @param templateName Name of the template to read
     * @returns Template contents
     */
    readTemplate(templateName) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = this._vault.adapter, templatePath = this.settings.getTemplatePath(templateName);
            if (!fs.exists(this.settings.rssTemplateFolderPath) || !fs.exists(templatePath)) {
                yield this.settings.install(); // recovering from missing template
            }
            const tplFile = this._vault.getFileByPath(templatePath);
            if (!tplFile) {
                throw new Error(`Template ${templatePath} unavailable!`);
            }
            return this._vault.cachedRead(tplFile);
        });
    }
    /**
     * Rename a folder
     * @param oldFolderPath path to an existing folder
     * @param newFolderPath new folder path.
     * @returns `true` if renaming was successful; `false` otherwise.
     */
    renameFolder(oldFolderPath, newFolderPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldFolderPath === newFolderPath) {
                return false;
            }
            const oldFolder = this._vault.getFolderByPath(oldFolderPath);
            if (oldFolder) {
                yield this._vault.rename(oldFolder, newFolderPath);
                return true;
            }
            return false;
        });
    }
    /**
     * Rename/move a file.
     * @param oldFilePath Path to file to rename
     * @param newFilePath new path and name of the file
     * @returns `true` if file was successfully renamed/moved; `false otherwise`
     */
    renameFile(oldFilePath, newFilePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (oldFilePath === newFilePath) {
                return false;
            }
            const oldFile = this._vault.getFileByPath(oldFilePath);
            if (oldFile) {
                yield this._vault.rename(oldFile, newFilePath);
                return true;
            }
            return false;
        });
    }
    ensureFolderExists(path) {
        var _a;
        return (_a = this.app.vault.getFolderByPath(path)) !== null && _a !== void 0 ? _a : this.app.vault.createFolder(path);
    }
    /**
     * Create a file from an RSS template.
     *
     * If a file with the same basename already exists in the given folder location, a new unique basename
     * is generated.
     *
     * ❗The mustache token `{{fileName}}` is automatically added to the data object. This token maps to the unique
     * basename of the generated file (no file extension) and can be used to create wiki-links.
     *
     * @param folderPath THe location of the new file
     * @param basename The basename of the new file (without fie extension)
     * @param templateName The template to use
     * @param data Optional data map for replacing the mustache tokens in the template with custom data.
     * @param postProcess Flag indicating if this file requires post processing
     * @returns The new file created
     */
    createFile(folderPath, basename, templateName, data = {}, postProcess = false) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ensureFolderExists(folderPath);
            // 1. generate a unique filename based on the given desired file system location info.
            let uniqueBasename = basename, uniqueFilepath = folderPath + "/" + basename + ".md", index = 1;
            const fs = this._vault.adapter;
            while (yield fs.exists(uniqueFilepath)) {
                uniqueBasename = `${basename} (${index})`;
                uniqueFilepath = folderPath + "/" + uniqueBasename + ".md";
                index++;
            }
            // 2. augment the data map with the unique basename
            data["{{fileName}}"] = uniqueBasename;
            // 3. read and expand the template
            const tpl = yield this.readTemplate(templateName), content = this.expandTemplate(tpl, data);
            // 4. Save the expanded template into a file at the given location
            if (postProcess) {
                this._plugin.tagmgr.registerFileForPostProcessing(uniqueFilepath);
            }
            return this._vault.create(uniqueFilepath, content);
        });
    }
}
/**
 * Regular expression to split a template string into and array
 * where all mustache tokens of the form `{{mustache}}` have their
 * own slot.
 */
RSSfileManager.TOKEN_SPLITTER = /(?<={{[^{}]+}})|(?={{[^{}]+}})/g;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUlNTRmlsZU1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUlNTRmlsZU1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUtBLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBT3BGOztHQUVHO0FBQ0gsTUFBTSxPQUFPLGNBQWM7SUF1QjFCLFlBQVksR0FBUSxFQUFFLE1BQXdCO1FBQzdDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBaEJELElBQUksUUFBUTtRQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUVELElBQUksR0FBRztRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSSxhQUFhO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFnQyxDQUFDO0lBQ25ELENBQUM7SUFPRDs7OztPQUlHO0lBQ0gsVUFBVSxDQUFDLElBQVc7O1FBQ3JCLE1BQU0sV0FBVyxHQUFHLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLDBDQUFFLFdBQVcsQ0FBQztRQUN2RSxJQUFJLFdBQVcsRUFBRTtZQUNoQixRQUFRLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3pCLEtBQUssU0FBUztvQkFDYixPQUFPLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUM1RCxLQUFLLFNBQVM7b0JBQ2IsT0FBTyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMs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Q29udGVudCI6WyJcclxuaW1wb3J0IHsgQXBwLCBURmlsZSwgVmF1bHQsIE1ldGFkYXRhQ2FjaGUsIFRGb2xkZXIgfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IFRQcm9wZXJ0eUJhZyB9IGZyb20gJy4vRmVlZEFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFJTU1RyYWNrZXJTZXR0aW5ncywgVFRlbXBsYXRlTmFtZSB9IGZyb20gXCIuL3NldHRpbmdzXCI7XHJcbmltcG9ydCBSU1NUcmFja2VyUGx1Z2luIGZyb20gXCIuL21haW5cIjtcclxuaW1wb3J0IHsgUlNTY29sbGVjdGlvbkFkYXB0ZXIsIFJTU2ZlZWRBZGFwdGVyLCBSU1NpdGVtQWRhcHRlciB9IGZyb20gJy4vUlNTQWRhcHRlcic7XHJcblxyXG5leHBvcnQgdHlwZSBNZXRhZGF0YUNhY2hlRXggPSBNZXRhZGF0YUNhY2hlICYge1xyXG5cdGdldFRhZ3MoKTogVFByb3BlcnR5QmFnOyAvLyB1bmRvY3VtZW50ZWQgbm9uLUFQSSBtZXRob2RcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBBIHV0aWxpdHkgY2xhc3MgdG8gbWFuYWdlIFJTUyByZWxhdGVkIGZpbGVzLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFJTU2ZpbGVNYW5hZ2VyIHtcclxuXHQvKipcclxuXHQgKiBSZWd1bGFyIGV4cHJlc3Npb24gdG8gc3BsaXQgYSB0ZW1wbGF0ZSBzdHJpbmcgaW50byBhbmQgYXJyYXlcclxuXHQgKiB3aGVyZSBhbGwgbXVzdGFjaGUgdG9rZW5zIG9mIHRoZSBmb3JtIGB7e211c3RhY2hlfX1gIGhhdmUgdGhlaXJcclxuXHQgKiBvd24gc2xvdC5cclxuXHQgKi9cclxuXHRwcml2YXRlIHN0YXRpYyByZWFkb25seSBUT0tFTl9TUExJVFRFUiA9IC8oPzw9e3tbXnt9XSt9fSl8KD89e3tbXnt9XSt9fSkvZztcclxuXHRwcml2YXRlIF9hcHA6IEFwcDtcclxuXHRwcml2YXRlIF92YXVsdDogVmF1bHQ7XHJcblx0cHJpdmF0ZSBfcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luO1xyXG5cclxuXHRnZXQgc2V0dGluZ3MoKTogUlNTVHJhY2tlclNldHRpbmdzIHtcclxuXHRcdHJldHVybiB0aGlzLl9wbHVnaW4uc2V0dGluZ3M7XHJcblx0fVxyXG5cclxuXHRnZXQgYXBwKCk6IEFwcCB7XHJcblx0XHRyZXR1cm4gdGhpcy5fYXBwO1xyXG5cdH1cclxuXHJcblx0Z2V0IG1ldGFkYXRhQ2FjaGUoKTogTWV0YWRhdGFDYWNoZUV4IHtcclxuXHRcdHJldHVybiB0aGlzLl9hcHAubWV0YWRhdGFDYWNoZSBhcyBNZXRhZGF0YUNhY2hlRXg7XHJcblx0fVxyXG5cclxuXHRjb25zdHJ1Y3RvcihhcHA6IEFwcCwgcGx1Z2luOiBSU1NUcmFja2VyUGx1Z2luKSB7XHJcblx0XHR0aGlzLl9hcHAgPSBhcHA7XHJcblx0XHR0aGlzLl92YXVsdCA9IGFwcC52YXVsdDtcclxuXHRcdHRoaXMuX3BsdWdpbiA9IHBsdWdpbjtcclxuXHR9XHJcblx0LyoqXHJcblx0ICogRmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIHByb3hpZXMgZm9yIFJTUyBmaWxlc1xyXG5cdCAqIEBwYXJhbSBmaWxlIEFuIFJTUyBmaWxlIHRvIGNyZWF0ZSB0aGUgYWRhcHRlciBmb3IuXHJcblx0ICogQHJldHVybnMgVGhlIGFwcHJvcHJpYXRlIGFkYXB0ZXIsIGlmIGl0IGV4aXN0cy5cclxuXHQgKi9cclxuXHRnZXRBZGFwdGVyKGZpbGU6IFRGaWxlKTogUlNTZmVlZEFkYXB0ZXIgfCBSU1NpdGVtQWRhcHRlciB8IFJTU2NvbGxlY3Rpb25BZGFwdGVyIHwgdW5kZWZpbmVkIHtcclxuXHRcdGNvbnN0IGZyb250bWF0dGVyID0gdGhpcy5tZXRhZGF0YUNhY2hlLmdldEZpbGVDYWNoZShmaWxlKT8uZnJvbnRtYXR0ZXI7XHJcblx0XHRpZiAoZnJvbnRtYXR0ZXIpIHtcclxuXHRcdFx0c3dpdGNoIChmcm9udG1hdHRlci5yb2xlKSB7XHJcblx0XHRcdFx0Y2FzZSBcInJzc2ZlZWRcIjpcclxuXHRcdFx0XHRcdHJldHVybiBuZXcgUlNTZmVlZEFkYXB0ZXIodGhpcy5fcGx1Z2luLCBmaWxlLCBmcm9udG1hdHRlcik7XHJcblx0XHRcdFx0Y2FzZSBcInJzc2l0ZW1cIjpcclxuXHRcdFx0XHRcdHJldHVybiBuZXcgUlNTaXRlbUFkYXB0ZXIodGhpcy5fcGx1Z2luLCBmaWxlLCBmcm9udG1hdHRlcik7XHJcblx0XHRcdFx0Y2FzZSBcInJzc2NvbGxlY3Rpb25cIjpcclxuXHRcdFx0XHRcdHJldHVybiBuZXcgUlNTY29sbGVjdGlvbkFkYXB0ZXIodGhpcy5fcGx1Z2luLCBmaWxlLCBmcm9udG1hdHRlcik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0fVxyXG5cdC8qKlxyXG5cdCAqIEV4cGFuZCBge3ttdXN0YWNoZX19YCBwbGFjZWhvbGRlcnMgd2l0aCBkYXRhIGZyb20gYSBwcm9wZXJ0eSBiYWcuXHJcblx0ICogQHBhcmFtIHRlbXBsYXRlIC0gQSB0ZW1wbGF0ZSBzdHJpbmcgd2l0aCBge3ttdXN0YWNoZX19YCBwbGFjZWhvbGRlcnMuXHJcblx0ICogQHBhcmFtIHByb3BlcnRpZXMgLSBBIHByb3BlcnR5IGJhZyBmb3IgcmVwbGFjaW5nIGB7e211c3RhY2hlfX1gIHBsYWNlaG9sZGVzIHdpdGggZGF0YS5cclxuXHQgKiBAcmV0dXJucyB0ZW1wbGF0ZSB3aXRoIGB7e211c3RhY2hlfX1gIHBsYWNlaG9sZGVycyBzdWJzdGl0dXRlZC5cclxuXHQgKi9cclxuXHRwcml2YXRlIGV4cGFuZFRlbXBsYXRlKHRlbXBsYXRlOiBzdHJpbmcsIHByb3BlcnRpZXM6IFRQcm9wZXJ0eUJhZyk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gdGVtcGxhdGUuc3BsaXQoUlNTZmlsZU1hbmFnZXIuVE9LRU5fU1BMSVRURVIpLm1hcChzID0+IHMuc3RhcnRzV2l0aChcInt7XCIpID8gKHByb3BlcnRpZXNbc10gPz8gcykgOiBzKS5qb2luKFwiXCIpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUmVhZCB0aGUgY29udGVudCBvZiBhIHRlbXBsYXRlIGZyb20gdGhlIFJTUyB0ZW1wbGF0ZSBmb2xkZXIuXHJcblx0ICpcclxuXHQgKiBJZiB0aGUgdGVtcGxhdGUgZG9lcyBub3QgZXNpc3QsIGl0IGlzIGluc3RhbGxlZCxcclxuXHQgKlxyXG5cdCAqIEBwYXJhbSB0ZW1wbGF0ZU5hbWUgTmFtZSBvZiB0aGUgdGVtcGxhdGUgdG8gcmVhZFxyXG5cdCAqIEByZXR1cm5zIFRlbXBsYXRlIGNvbnRlbnRzXHJcblx0ICovXHJcblx0cHJpdmF0ZSBhc3luYyByZWFkVGVtcGxhdGUodGVtcGxhdGVOYW1lOiBUVGVtcGxhdGVOYW1lKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdGNvbnN0XHJcblx0XHRcdGZzID0gdGhpcy5fdmF1bHQuYWRhcHRlcixcclxuXHRcdFx0dGVtcGxhdGVQYXRoID0gdGhpcy5zZXR0aW5ncy5nZXRUZW1wbGF0ZVBhdGgodGVtcGxhdGVOYW1lKTtcclxuXHJcblx0XHRpZiAoIWZzLmV4aXN0cyh0aGlzLnNldHRpbmdzLnJzc1RlbXBsYXRlRm9sZGVyUGF0aCkgfHwgIWZzLmV4aXN0cyh0ZW1wbGF0ZVBhdGgpKSB7XHJcblx0XHRcdGF3YWl0IHRoaXMuc2V0dGluZ3MuaW5zdGFsbCgpOyAvLyByZWNvdmVyaW5nIGZyb20gbWlzc2luZyB0ZW1wbGF0ZVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHRwbEZpbGUgPSB0aGlzLl92YXVsdC5nZXRGaWxlQnlQYXRoKHRlbXBsYXRlUGF0aCk7XHJcblx0XHRpZiAoIXRwbEZpbGUpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUZW1wbGF0ZSAke3RlbXBsYXRlUGF0aH0gdW5hdmFpbGFibGUhYCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhdWx0LmNhY2hlZFJlYWQodHBsRmlsZSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBSZW5hbWUgYSBmb2xkZXJcclxuXHQgKiBAcGFyYW0gb2xkRm9sZGVyUGF0aCBwYXRoIHRvIGFuIGV4aXN0aW5nIGZvbGRlclxyXG5cdCAqIEBwYXJhbSBuZXdGb2xkZXJQYXRoIG5ldyBmb2xkZXIgcGF0aC5cclxuXHQgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgcmVuYW1pbmcgd2FzIHN1Y2Nlc3NmdWw7IGBmYWxzZWAgb3RoZXJ3aXNlLlxyXG5cdCAqL1xyXG5cdGFzeW5jIHJlbmFtZUZvbGRlcihvbGRGb2xkZXJQYXRoOiBzdHJpbmcsIG5ld0ZvbGRlclBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cdFx0aWYgKG9sZEZvbGRlclBhdGggPT09IG5ld0ZvbGRlclBhdGgpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IG9sZEZvbGRlciA9IHRoaXMuX3ZhdWx0LmdldEZvbGRlckJ5UGF0aChvbGRGb2xkZXJQYXRoKTtcclxuXHJcblx0XHRpZiAob2xkRm9sZGVyKSB7XHJcblx0XHRcdGF3YWl0IHRoaXMuX3ZhdWx0LnJlbmFtZShvbGRGb2xkZXIsIG5ld0ZvbGRlclBhdGgpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFJlbmFtZS9tb3ZlIGEgZmlsZS5cclxuXHQgKiBAcGFyYW0gb2xkRmlsZVBhdGggUGF0aCB0byBmaWxlIHRvIHJlbmFtZVxyXG5cdCAqIEBwYXJhbSBuZXdGaWxlUGF0aCBuZXcgcGF0aCBhbmQgbmFtZSBvZiB0aGUgZmlsZVxyXG5cdCAqIEByZXR1cm5zIGB0cnVlYCBpZiBmaWxlIHdhcyBzdWNjZXNzZnVsbHkgcmVuYW1lZC9tb3ZlZDsgYGZhbHNlIG90aGVyd2lzZWBcclxuXHQgKi9cclxuXHRhc3luYyByZW5hbWVGaWxlKG9sZEZpbGVQYXRoOiBzdHJpbmcsIG5ld0ZpbGVQYXRoOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuXHRcdGlmIChvbGRGaWxlUGF0aCA9PT0gbmV3RmlsZVBhdGgpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IG9sZEZpbGUgPSB0aGlzLl92YXVsdC5nZXRGaWxlQnlQYXRoKG9sZEZpbGVQYXRoKTtcclxuXHJcblx0XHRpZiAob2xkRmlsZSkge1xyXG5cdFx0XHRhd2FpdCB0aGlzLl92YXVsdC5yZW5hbWUob2xkRmlsZSwgbmV3RmlsZVBhdGgpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdGVuc3VyZUZvbGRlckV4aXN0cyhwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFRGb2xkZXI+IHwgVEZvbGRlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5hcHAudmF1bHQuZ2V0Rm9sZGVyQnlQYXRoKHBhdGgpID8/IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZUZvbGRlcihwYXRoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENyZWF0ZSBhIGZpbGUgZnJvbSBhbiBSU1MgdGVtcGxhdGUuXHJcblx0ICpcclxuXHQgKiBJZiBhIGZpbGUgd2l0aCB0aGUgc2FtZSBiYXNlbmFtZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgZ2l2ZW4gZm9sZGVyIGxvY2F0aW9uLCBhIG5ldyB1bmlxdWUgYmFzZW5hbWVcclxuXHQgKiBpcyBnZW5lcmF0ZWQuXHJcblx0ICpcclxuXHQgKiDinZdUaGUgbXVzdGFjaGUgdG9rZW4gYHt7ZmlsZU5hbWV9fWAgaXMgYXV0b21hdGljYWxseSBhZGRlZCB0byB0aGUgZGF0YSBvYmplY3QuIFRoaXMgdG9rZW4gbWFwcyB0byB0aGUgdW5pcXVlXHJcblx0ICogYmFzZW5hbWUgb2YgdGhlIGdlbmVyYXRlZCBmaWxlIChubyBmaWxlIGV4dGVuc2lvbikgYW5kIGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSB3aWtpLWxpbmtzLlxyXG5cdCAqXHJcblx0ICogQHBhcmFtIGZvbGRlclBhdGggVEhlIGxvY2F0aW9uIG9mIHRoZSBuZXcgZmlsZVxyXG5cdCAqIEBwYXJhbSBiYXNlbmFtZSBUaGUgYmFzZW5hbWUgb2YgdGhlIG5ldyBmaWxlICh3aXRob3V0IGZpZSBleHRlbnNpb24pXHJcblx0ICogQHBhcmFtIHRlbXBsYXRlTmFtZSBUaGUgdGVtcGxhdGUgdG8gdXNlXHJcblx0ICogQHBhcmFtIGRhdGEgT3B0aW9uYWwgZGF0YSBtYXAgZm9yIHJlcGxhY2luZyB0aGUgbXVzdGFjaGUgdG9rZW5zIGluIHRoZSB0ZW1wbGF0ZSB3aXRoIGN1c3RvbSBkYXRhLlxyXG5cdCAqIEBwYXJhbSBwb3N0UHJvY2VzcyBGbGFnIGluZGljYXRpbmcgaWYgdGhpcyBmaWxlIHJlcXVpcmVzIHBvc3QgcHJvY2Vzc2luZ1xyXG5cdCAqIEByZXR1cm5zIFRoZSBuZXcgZmlsZSBjcmVhdGVkXHJcblx0ICovXHJcblx0YXN5bmMgY3JlYXRlRmlsZShmb2xkZXJQYXRoOiBzdHJpbmcsIGJhc2VuYW1lOiBzdHJpbmcsIHRlbXBsYXRlTmFtZTogVFRlbXBsYXRlTmFtZSwgZGF0YTogVFByb3BlcnR5QmFnID0ge30sIHBvc3RQcm9jZXNzOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPFRGaWxlPiB7XHJcblx0XHRhd2FpdCB0aGlzLmVuc3VyZUZvbGRlckV4aXN0cyhmb2xkZXJQYXRoKTtcclxuXHRcdC8vIDEuIGdlbmVyYXRlIGEgdW5pcXVlIGZpbGVuYW1lIGJhc2VkIG9uIHRoZSBnaXZlbiBkZXNpcmVkIGZpbGUgc3lzdGVtIGxvY2F0aW9uIGluZm8uXHJcblx0XHRsZXRcclxuXHRcdFx0dW5pcXVlQmFzZW5hbWUgPSBiYXNlbmFtZSxcclxuXHRcdFx0dW5pcXVlRmlsZXBhdGggPSBmb2xkZXJQYXRoICsgXCIvXCIgKyBiYXNlbmFtZSArIFwiLm1kXCIsXHJcblx0XHRcdGluZGV4ID0gMTtcclxuXHRcdGNvbnN0IGZzID0gdGhpcy5fdmF1bHQuYWRhcHRlcjtcclxuXHRcdHdoaWxlIChhd2FpdCBmcy5leGlzdHModW5pcXVlRmlsZXBhdGgpKSB7XHJcblx0XHRcdHVuaXF1ZUJhc2VuYW1lID0gYCR7YmFzZW5hbWV9ICgke2luZGV4fSlgO1xyXG5cdFx0XHR1bmlxdWVGaWxlcGF0aCA9IGZvbGRlclBhdGggKyBcIi9cIiArIHVuaXF1ZUJhc2VuYW1lICsgXCIubWRcIjtcclxuXHRcdFx0aW5kZXgrKztcclxuXHRcdH1cclxuXHRcdC8vIDIuIGF1Z21lbnQgdGhlIGRhdGEgbWFwIHdpdGggdGhlIHVuaXF1ZSBiYXNlbmFtZVxyXG5cdFx0ZGF0YVtcInt7ZmlsZU5hbWV9fVwiXSA9IHVuaXF1ZUJhc2VuYW1lO1xyXG5cclxuXHRcdC8vIDMuIHJlYWQgYW5kIGV4cGFuZCB0aGUgdGVtcGxhdGVcclxuXHRcdGNvbnN0XHJcblx0XHRcdHRwbCA9IGF3YWl0IHRoaXMucmVhZFRlbXBsYXRlKHRlbXBsYXRlTmFtZSksXHJcblx0XHRcdGNvbnRlbnQgPSB0aGlzLmV4cGFuZFRlbXBsYXRlKHRwbCwgZGF0YSk7XHJcblxyXG5cdFx0Ly8gNC4gU2F2ZSB0aGUgZXhwYW5kZWQgdGVtcGxhdGUgaW50byBhIGZpbGUgYXQgdGhlIGdpdmVuIGxvY2F0aW9uXHJcblx0XHRpZiAocG9zdFByb2Nlc3MpIHtcclxuXHRcdFx0dGhpcy5fcGx1Z2luLnRhZ21nci5yZWdpc3RlckZpbGVGb3JQb3N0UHJvY2Vzc2luZyh1bmlxdWVGaWxlcGF0aCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuX3ZhdWx0LmNyZWF0ZSh1bmlxdWVGaWxlcGF0aCwgY29udGVudCk7XHJcblx0fVxyXG59Il19