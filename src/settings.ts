import { TPropertyBag } from './FeedAssembler';
import RSSTrackerPlugin from './main';
import { App } from 'obsidian';
import { RSSfileManager } from './RSSFileManager';

/**
 * The settings for the RSS Tracker plugin.
 *
 * This interface defines:
 * - Settings that can be configured by the user.
 * - Settings cached from other plugins.
 */
export interface IRSSTrackerSettings {
	[key: string]: any;
	autoUpdateFeeds: boolean;
	rssHome: string;
	rssFeedFolderName: string;
	rssCollectionsFolderName: string;
	rssTopicsFolderName: string;
	rssTemplateFolderName: string;
	rssTagmapName: string;
	rssDefaultImagePath?: string; // The path to the default image, if set
	defaultItemLimit: number;
	rssTagDomain: string;
	rssDashboardPlacement: TDashboardPlacement; // Uses `Folder Notes` plugin
	rssFeedDashboardTemplate: string; // The template for RSS feeds folder dashboard
	rssFeedTemplate: string,
	rssItemTemplate: string,
	rssTagmapTemplate: string,
	rssCollectionDashboardTemplate: string,
	rssCollectionTemplate: string,
	rssTopicDashboardTemplate: string,
	rssTopicTemplate: string,
}

/**
 * Default settings for the RSS Tracker plugin.
 */
export const DEFAULT_SETTINGS: IRSSTrackerSettings = {
	autoUpdateFeeds: false,
	rssHome: "RSS",
	rssFeedFolderName: "Feeds",
	rssCollectionsFolderName: "Collections",
	rssTopicsFolderName: "Topics",
	rssTemplateFolderName: "Templates",
	rssTagmapName: "RSS Tagmap",
	defaultItemLimit: 100,
	rssTagDomain: "rss",
	rssDashboardPlacement: "parentFolder",
	rssDefaultImagePath: undefined,
	rssFeedDashboardTemplate: `---
role:
---
> [!abstract] RSS feed dashboard
> {{image}} All your subscribed feeds at a glance.

# Feed Status 💔

⚠️ Only tagged feeds can be claimed by feed collections.
~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expanded = false,
	feeds = dvjs.rssFeeds;
dv.header(2,"Failed and Suspended Feeds ❌");
dvjs.rssFeedTable(feeds.where(f => f.status !== "✅"),true);

dv.header(2,"Updated Feeds ✅");
dvjs.rssFeedTable(feeds.where(f => f.status === "✅"),expanded);
~~~

# Pinned Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItems.where(i => i.pinned === true);
await dvjs.rssItemTableByFeed(items,expand);
~~~
`,
	rssItemTemplate: `---
role:
---

> [!abstract] {{title}} (by {{author}})
> {{image}} {{description}}

🌐 Read article [online]({{link}}). ⤴ For other items in this feed see {{feedLink}}.

- [ ] {{fileLink}}

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

{{content}}
`,
	rssFeedTemplate: `---
role:
---

> [!abstract] {{title}}
> {{image}} {{description}}

# Reading List 📑

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	items = dvjs.rssItemsOfFeed(dv.current());
await dvjs.rssReadingList(items,false,expand);
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = await dvjs.rssItemsOfFeed(dv.current()).where(i => i.pinned === true);
await dvjs.rssItemTable(items,expand);
~~~

# Read Feed Items ✅

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfFeed(dv.current());
await dvjs.rssReadingList(items,true,expand);
~~~
`,
	rssTagmapTemplate: `---
role: rsstagmap
---

This note defines a mapping betweeen tags in the RSS domain to tags in the domain of the user's knowledge graph.

# Tag Map

The _RSS Tag_ column contains tag names in the RSS tag domain configured in the _RSS Tracker_ plugin settings (**without** the \`#\` prefix).
The _Mapped Tag_ columns contains the tag from the local knowledge graph the RSS tag is mapped
to (**including the** \`#\` prefix).

| RSS Tag | Mapped Tag |
| ------- | ---------- |`,
	rssCollectionTemplate: `---
role:
---

> [!abstract] (headline:: A collection of feeds providing perspectives and knowledge about ...)
> {{image}}
> - [ ] Complete the headline.
> - [ ] Specify tags in the \`tags\`, \`allof\`, \`noneof\` frontmatter properties to collect feeds matching the tag filter.

# Feeds in this Collection 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	feeds = dvjs.rssFeedsOfCollection(dv.current());
await dvjs.rssFeedTable(feeds,expand);
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~

# Reading List 📑

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfCollection(dv.current());
await dvjs.rssReadingListByFeed(items,false,expand);
~~~

# Pinned Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfCollection(dv.current()).where( i => i.pinned === true);
await dvjs.rssItemTableByFeed(items,expand);
~~~
`,
	rssCollectionDashboardTemplate: `---
role:
---

> [!abstract] Curated collections of RSS feeds focused on specific topics.
> {{image}} Each collection is designed to provide a curated blend of authoritative sources, expert insights, and updates within its specific subject area.

# Feed Collections 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	collections = dvjs.rssCollections;
await dvjs.rssCollectionTable(collections,expand);
~~~

# Unclaimed Feeds 📦

⚠️ Only tagged feeds can be claimed by feed collections.

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	unclaimed = dvjs.rssUnclaimedFeeds();

await dvjs.rssFeedTable(unclaimed,expand)
~~~
`,
	rssTopicTemplate: `---
role:
tags: []
allof: []
noneof: []
---
> [!abstract] (headline:: A curated list of RSS items about ...)
> {{image}}
> - [ ] Create a headline
> - [ ] Specify tags in the \`tags\`, \`allof\`, \'noneof\' frontmatter properties

# Curated Articles📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	items = dvjs.rssItemsOfTopic(dv.current()).where(t => t.pinned === true);
await dvjs.rssItemTableByFeed(items,expand)
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~

# Other Articles 📄

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfTopic(dv.current()).where(t => t.pinned !== true);
await dvjs.rssItemTableByFeed(items,expand)
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~
`,
	rssTopicDashboardTemplate: `---
role:
---

> [!abstract] Curated collections of RSS feed posts focused on specific topics.
> {{image}} Each topic is designed to provide a curated blend of authoritative sources, expert insights, and updates within its specific subject area.
~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	topics = dvjs.rssTopics;
await dvjs.rssTopicTable(topics,expand);
~~~
`,
}

/**
 * The placement of RSS dashboard files relative to their data folders.
 * The values are taken from the Folder Notes plugin.
 */
export type TDashboardPlacement = "insideFolder" | "parentFolder";

/**
 * The settings for the RSS Tracker plugin.
 *
 * This class is responsible for:
 * - Lifecycle Management (Load/Save)
 * - Providing read/write access to plugin specifics settings.
 * - Providing readonly access to settings cached from other plugins (e.g. Folder Notes).
 * - Installing the plugin's directory structure and templates.
 *
 * ⚠️ When using cached settings from other plugins it is the responsibility of the caller to
 * update the cache by calling {@link commit}.
 */
export class RSSTrackerSettings implements IRSSTrackerSettings {
	[key: string]: any; // Index signature
	plugin: RSSTrackerPlugin;
	app: App;

	private get _filemgr(): RSSfileManager {
		return this.plugin.filemgr;
	};

	/**
	 * The persisted settings.
	 */
	private _data: IRSSTrackerSettings = { ...DEFAULT_SETTINGS };

	get autoUpdateFeeds(): boolean {
		return this._data.autoUpdateFeeds;
	}

	set autoUpdateFeeds(value: boolean) {
		this._data.autoUpdateFeeds = value;
	}

	private _rssHome?: string; // pending value of the RSS home folder name
	private _rssFeedFolderName?: string; // pending value of the RSS feed folder name
	private _rssCollectionsFolderName?: string; // cached value of the RSS collections folder name
	private _rssTopicsFolderName?: string; // pending value of the RSS topics folder name
	private _rssTemplateFolderName?: string; // pending value of the RSS templates folder name
	private _rssTagmapName?: string; // pending value of the RSS tagmap name
	private _defaultItemLimit?: number; // pending value of the default item limit
	private _rssTagDomain?: string; // pending value of the RSS tag domain
	private _rssDashboardPlacement?: TDashboardPlacement; // pending value of the RSS dashboard placement
	private _rssDefaultImagePath?: string; // pending value of the RSS default image path

	get rssHome(): string {
		return this._rssHome || this._data.rssHome || DEFAULT_SETTINGS.rssHome;
	}

	set rssHome(value: string) {
		this._rssHome = value;
	}

	get rssFeedFolderName(): string {
		return this._rssFeedFolderName || this._data.rssFeedFolderName || DEFAULT_SETTINGS.rssFeedFolderName;
	}

	set rssFeedFolderName(value: string) {
		this._rssFeedFolderName = value;
	}

	get rssCollectionsFolderName(): string {
		return this._rssCollectionsFolderName || this._data.rssCollectionsFolderName || DEFAULT_SETTINGS.rssCollectionsFolderName;
	}

	set rssCollectionsFolderName(value: string) {
		this._rssCollectionsFolderName = value;
	}

	get rssTopicsFolderName(): string {
		return this._rssTopicsFolderName || this._data.rssTopicsFolderName || DEFAULT_SETTINGS.rssTopicsFolderName;
	}

	set rssTopicsFolderName(value: string) {
		this._rssCollectionsFolderName = value;
	}

	get rssTemplateFolderName(): string {
		return this._rssTemplateFolderName || this._data.rssTemplateFolderName || DEFAULT_SETTINGS.rssTemplateFolderName;
	}

	set rssTemplateFolderName(value: string) {
		this._rssTemplateFolderName = value;
	}

	get rssTagmapName(): string {
		return this._rssTagmapName || this._data.rssTagmapName || DEFAULT_SETTINGS.rssTagmapName;
	}

	set rssTagmapName(value: string) {
		this._rssTagmapName = value;
	}

	get defaultItemLimit(): number {
		return this._defaultItemLimit || this._data.defaultItemLimit || DEFAULT_SETTINGS.defaultItemLimit;
	}

	set defaultItemLimit(value: number) {
		this._defaultItemLimit = value;
	}

	get rssTagDomain(): string {
		return this._rssTagDomain || this._data.rssTagDomain || DEFAULT_SETTINGS.rssTagDomain;
	}

	set rssTagDomain(value: string) {
		this._rssTagDomain = value;
	}

	get rssDefaultImagePath(): string {
		return this._rssDefaultImagePath || this._data.rssDefaultImagePath || "";
	}

	set rssDefaultImagePath(value: string) {
		this._rssDefaultImagePath = value;
	}

	get rssDefaultImageLink(): string {
		return `![[${this.rssDefaultImagePath}|float:right|100]]`;
	}

	/**
	 * Get the RSS default image definition (svg).
	 */
	get rssDefaultImage(): string {
		return '<svg height="300px" width="300px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 398.668 398.668" xml:space="preserve"> <g> <g> <path style="fill:none;" d="M98.107,275.498c-13.789,0-25.006,11.264-25.006,25.107c0,13.777,11.217,24.986,25.006,24.986 c13.834,0,25.09-11.209,25.09-24.986C123.197,286.762,111.941,275.498,98.107,275.498z"/> <path style="fill:none;" d="M360.057,24H38.613C30.555,24,24,30.557,24,38.613v321.443c0,8.057,6.555,14.611,14.613,14.611 h321.443c8.057,0,14.611-6.555,14.611-14.611V38.613C374.668,30.557,368.113,24,360.057,24z M98.107,349.592 c-27.021,0-49.006-21.975-49.006-48.986c0-27.078,21.984-49.107,49.006-49.107c27.068,0,49.09,22.029,49.09,49.107 C147.197,327.617,125.176,349.592,98.107,349.592z M242.715,347.516c0,0-0.008,0.002-0.016,0h-48.729 c-6.541,0-11.877-5.238-11.998-11.777c-0.584-31.625-13.164-61.316-35.424-83.604c-22.275-22.338-51.846-34.953-83.27-35.527 c-6.541-0.119-11.781-5.457-11.781-11.998v-48.582c0-3.211,1.287-6.287,3.572-8.543c2.248-2.217,5.275-3.457,8.428-3.457 c0.055,0,0.107,0,0.162,0c50.654,0.686,98.338,20.883,134.271,56.873c35.758,35.814,55.896,83.281,56.756,133.732 c0.021,0.291,0.031,0.586,0.031,0.883C254.719,342.143,249.348,347.516,242.715,347.516z M337.582,347.516 c0,0-0.008,0.002-0.016,0h-48.648c-6.578,0-11.93-5.295-12-11.871c-1.254-116.738-97.008-212.74-213.451-214.002 c-6.576-0.072-11.871-5.424-11.871-12V61.078c0-3.201,1.279-6.269,3.553-8.521c2.273-2.254,5.367-3.512,8.555-3.477 c75.951,0.68,147.441,30.768,201.303,84.723c53.689,53.779,83.699,125.096,84.553,200.891c0.02,0.272,0.029,0.547,0.029,0.822 C349.588,342.143,344.215,347.516,337.582,347.516z"/> <path style="fill:#3D6889;" d="M98.107,251.498c-27.021,0-49.006,22.029-49.006,49.107c0,27.012,21.984,48.986,49.006,48.986 c27.068,0,49.09-21.975,49.09-48.986C147.197,273.527,125.176,251.498,98.107,251.498z M98.107,325.592 c-13.789,0-25.006-11.209-25.006-24.986c0-13.844,11.217-25.107,25.006-25.107c13.834,0,25.09,11.264,25.09,25.107 C123.197,314.383,111.941,325.592,98.107,325.592z"/> <path style="fill:#73D0F4;" d="M75.498,168.633v24.668c33.244,3.301,64.15,17.926,88.037,41.881 c23.879,23.906,38.459,54.922,41.746,88.334h24.816C223.066,241.893,156.986,175.689,75.498,168.633z"/> <path style="fill:#3D6889;" d="M197.932,200.9c-35.934-35.99-83.617-56.188-134.271-56.873c-0.055,0-0.107,0-0.162,0 c-3.152,0-6.18,1.24-8.428,3.457c-2.285,2.256-3.572,5.332-3.572,8.543v48.582c0,6.541,5.24,11.879,11.781,11.998 c31.424,0.574,60.994,13.189,83.27,35.527c22.26,22.287,34.84,51.979,35.424,83.604c0.121,6.539,5.457,11.777,11.998,11.777 h48.729c0.008,0.002,0.016,0,0.016,0c6.633,0,12.004-5.373,12.004-12c0-0.297-0.01-0.592-0.031-0.883 C253.828,284.182,233.689,236.715,197.932,200.9z M205.281,323.516c-3.287-33.412-17.867-64.428-41.746-88.334 c-23.887-23.955-54.793-38.58-88.037-41.881v-24.668c81.488,7.057,147.568,73.26,154.6,154.883H205.281z"/> <path style="fill:#73D0F4;" d="M75.596,73.465v24.598c58.516,3.502,113.188,28.121,155.029,70.064 c41.838,41.943,66.391,96.742,69.877,155.389h24.682C317.852,189.59,209.293,80.834,75.596,73.465z"/> <path style="fill:#3D6889;" d="M265.006,133.803C211.145,79.848,139.654,49.76,63.703,49.08c-3.188-0.035-6.281,1.223-8.555,3.477 c-2.273,2.252-3.553,5.32-3.553,8.521v48.565c0,6.576,5.295,11.928,11.871,12c116.443,1.262,212.197,97.264,213.451,214.002 c0.07,6.576,5.422,11.871,12,11.871h48.648c0.008,0.002,0.016,0,0.016,0c6.633,0,12.006-5.373,12.006-12 c0-0.275-0.01-0.551-0.029-0.822C348.705,258.898,318.695,187.582,265.006,133.803z M300.502,323.516 c-3.486-58.646-28.039-113.445-69.877-155.389c-41.842-41.943-96.514-66.563-155.029-70.064V73.465 c133.697,7.369,242.256,116.125,249.588,250.051H300.502z"/> <path style="fill:#3D6889;" d="M360.057,0H38.613C17.322,0,0,17.322,0,38.613v321.443c0,21.291,17.322,38.611,38.613,38.611 h321.443c21.291,0,38.611-17.32,38.611-38.611V38.613C398.668,17.322,381.348,0,360.057,0z M374.668,360.057 c0,8.057-6.555,14.611-14.611,14.611H38.613c-8.059,0-14.613-6.555-14.613-14.611V38.613C24,30.557,30.555,24,38.613,24h321.443 c8.057,0,14.611,6.557,14.611,14.613V360.057z"/> </g> </g> </svg>'
	}

	/**
	 * Get the placement of an RSS dashboard.
	 *
	 * By default this setting is `parentFolder`, unless the 'Folder Notes' plugin is enabled, then it is taken
	 * from the that plugin's settings.
	 *
	 * The placement can only be changed by the 'Folder Notes' plugin.
	 */
	get rssDashboardPlacement(): TDashboardPlacement {
		const folderNotesSettings = (this.app as any).plugins.plugins["folder-notes"]?.settings;

		if (folderNotesSettings) {
			const placement = folderNotesSettings.storageLocation;
			this._rssDashboardPlacement = placement;
			return placement;
		}
		else {
			return this._rssDashboardPlacement || this._data.rssDashboardPlacement || DEFAULT_SETTINGS.rssDashboardPlacement;
		}
	}

	//#region Template Accessors
	get rssFeedDashboardTemplate(): string {
		return DEFAULT_SETTINGS.rssFeedDashboardTemplate;
	}

	get rssFeedTemplate(): string {
		return DEFAULT_SETTINGS.rssFeedTemplate;
	}

	get rssCollectionDashboardTemplate(): string {
		return DEFAULT_SETTINGS.rssCollectionDashboardTemplate;
	}

	get rssCollectionTemplate(): string {
		return DEFAULT_SETTINGS.rssCollectionTemplate;
	}

	get rssTopicDashboardTemplate(): string {
		return DEFAULT_SETTINGS.rssTopicDashboardTemplate;
	}

	get rssTopicTemplate(): string {
		return DEFAULT_SETTINGS.rssTopicTemplate;
	}

	get rssItemTemplate(): string {
		return DEFAULT_SETTINGS.rssItemTemplate;
	}

	get rssTagmapTemplate(): string {
		return DEFAULT_SETTINGS.rssTagmapTemplate;
	}
	//#endregion Template Accessors

	/**
	 * Commit the changes to the settings.
	 * This method is called when the user closes the settings UI.
	 */
	async commit() {
		console.log("Commiting changes in settings");
		if (this._rssHome && this._rssHome !== this._data.rssHome) {
			this._data.rssHome = this._rssHome;
			this._rssHome = undefined;
			await this.install(); // setup a new RSS folder if needed
		}

		if (this._rssFeedFolderName && this._rssFeedFolderName !== this._data.rssFeedFolderName) {
			this._data.rssFeedFolderName = this._rssFeedFolderName;
			this._rssFeedFolderName = undefined;
		}

		if (this._rssCollectionsFolderName && this._rssCollectionsFolderName !== this._data.rssCollectionsFolderName) {
			this._data.rssCollectionsFolderName = this._rssCollectionsFolderName;
			this._rssCollectionsFolderName = undefined;
		}

		if (this._rssTopicsFolderName && this._rssTopicsFolderName !== this._data.rssTopicsFolderName) {
			this._data.rssTopicsFolderName = this._rssTopicsFolderName;
			this._rssTopicsFolderName = undefined;
		}

		if (this._rssTemplateFolderName && this._rssTemplateFolderName !== this._data.rssTemplateFolderName) {
			if (await this._filemgr.renameFolder(this.rssTemplateFolderPath, this.rssHome + "/" + this._rssTemplateFolderName)) {
				this._data.rssTemplateFolderName = this._rssTemplateFolderName;
			}

			this._rssTemplateFolderName = undefined;
		}

		if (this._rssTagmapName && this._rssTagmapName !== this._data.rssTagmapName) {
			this._data.rssTagmapName = this._rssTagmapName;
			this._rssDashboardName = undefined;
		}

		if (this._defaultItemLimit && this._defaultItemLimit !== this._data.defaultItemLimit) {
			this._data.defaultItemLimit = this._defaultItemLimit;
			this._defaultItemLimit = undefined;
		}

		if (this._rssTagDomain && this._rssTagDomain !== this._data.rssTagDomain) {
			this._data.rssTagDomain = this._rssTagDomain;
			this._rssTagDomain = undefined;
		}

		if (this._rssDashboardPlacement && this._rssDashboardPlacement !== this._data.rssDashboardPlacement) {
			this._data.rssDashboardPlacement = this._rssDashboardPlacement;
			this._rssDashboardPlacement = undefined;
		}

		if (this._rssDefaultImagePath && this._rssDefaultImagePath !== this._data.rssDefaultImagePath) {
			this._data.rssDefaultImagePath = this._rssDefaultImagePath;
			this._rssDefaultImagePath = undefined;
		}

		await this.saveData();
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	async loadData(): Promise<void> {
		const data: TPropertyBag = await this.plugin.loadData();
		if (data) {
			for (const propertyName in this._data) {
				if (propertyName in data) {
					this._data[propertyName] = data[propertyName];
				}
			}
		} else {
			console.log("rss-tracker first time load");
		}
		console.log("rss-tracker: settings loaded");
	}

	async saveData(): Promise<void> {
		return this.plugin.saveData(this._data);
	}

	get rssFeedFolderPath(): string {
		return this.rssHome + "/" + this.rssFeedFolderName;
	}

	get rssCollectionsFolderPath(): string {
		return this.rssHome + "/" + this.rssCollectionsFolderName;
	}

	get rssTopicsFolderPath(): string {
		return this.rssHome + "/" + this.rssTopicsFolderName;
	}

	get rssTemplateFolderPath(): string {
		return this.rssHome + "/" + this.rssTemplateFolderName;
	}

	get rssTagmapPath(): string {
		return this.rssHome + "/" + this.rssTagmapName + ".md";
	}
}
