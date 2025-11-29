
import RSSTrackerPlugin from './main';
import { App } from 'obsidian';
import { RSSfileManager } from './RSSFileManager';

/**
 * The placement of RSS dashboard files relative to their data folders.
 * The values are stoidentical to the corresponding settings in the Folder Notes plugin.
 */
export type TDashboardPlacement = "insideFolder" | "parentFolder";

/**
 * The settings for the RSS Tracker plugin.
 *
 * This interface defines settings that can be configured by the user.
 */
export interface IConfigurableRSSTrackerSettings {
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
}

/**
 * The readonly default templates for the RSS Tracker plugin.
 */
interface IRSSTrackerDefaultTemplates {
	readonly rssFeedDashboardTemplate: string;
	readonly rssCollectionDashboardTemplate: string;
	readonly rssCollectionTemplate: string;
	readonly rssFeedTemplate: string;
	readonly rssTopicDashboardTemplate: string;
	readonly rssTopicTemplate: string;
	readonly rssItemTemplate: string;
	readonly rssTagmapTemplate: string;
}

/**
 * The keys of the default templates in {@link FACTORY_SETTINGS}.
 */
export type TDefaultTemplateKey = keyof IRSSTrackerDefaultTemplates;


/**
 * The computed settings for the RSS Tracker plugin.
 */
export interface IRSSTrackerComputedSettings {
	get rssDefaultImageLink(): string;
	get rssDefaultImage(): string;
	get rssFeedFolderPath(): string;
	get rssCollectionsFolderPath(): string;
	get rssTopicsFolderPath(): string;
	get rssTemplateFolderPath(): string;
	get rssTagmapPath(): string;
}

/**
 * Settings cached from other plugins.
 */
export interface IExternalSettings {
	/**
	 * The placement of the RSS dashboard files relative to their data folders (Folder Notes plugin).
	 */
	rssDashboardPlacement: TDashboardPlacement;
	/**
	 * A template to generate the dashboard name from a folder name (Folder Notes plugin).
	 */
	rssDashboardName: string;
}

/**
 * The settings for the RSS Tracker plugin.
 *
 * This interface combines the configurable and external (readonly) settings.
 */
interface IRSSTrackerPersistedSettings extends IConfigurableRSSTrackerSettings, IExternalSettings { }

/**
 * The cache type for persisted settings of the RSSTracker plugin.
 * All properties are optional (because they may or may not be cached).
 */
type TCachedSettings = Partial<IRSSTrackerPersistedSettings>;

/**
 * The default settings for the RSS Tracker plugin where all properties are readonly.
 */
type TDefaultSettings = {
	readonly [K in keyof IRSSTrackerPersistedSettings]: IRSSTrackerPersistedSettings[K]
}

/**
 * The hard-coded settings for the RSS Tracker plugin.
 * Currently these only the RSS templates used by the plugin.
 */
export const FACTORY_SETTINGS: IRSSTrackerDefaultTemplates = {
	rssFeedDashboardTemplate: `---
role:
---
> [!overview]+ RSS feed dashboard
> {{image}} All your subscribed feeds at a glance.

# Feeds & Status

~~~base
filters:
  and:
    - role == "rssfeed"
properties:
  file.name:
    displayName: Feed
  note.status:
    displayName: Feed Status
  note.updated:
    displayName: Last Update
  note.headline:
    displayName: Headline
  note.collections:
    displayName: Collections
views:
  - type: table
    name: Feed Status 💔
    filters:
      and:
        - status != "✅"
    order:
      - file.name
      - status
      - updated
    sort:
      - property: updated
        direction: ASC
    columnSize:
      file.name: 464
      note.status: 178
  - type: table
    name: All Feeds 📰
    order:
      - file.name
      - headline
      - updated
      - collections
    sort:
      - property: updated
        direction: DESC
      - property: collections
        direction: ASC
    columnSize:
      file.name: 277
      note.headline: 367
      note.updated: 182
      note.collections: 200
~~~
`,
	rssItemTemplate: `---
role:
read: false
pinned: false
---

> [!outline]+ {{title}} (by {{author}})
> {{image}} {{description}}

🌐 Read article [online]({{link}}).

~~~base
filters:
  and:
    - role == "rssitem"
    - link == this.note.link
formulas:
  item: if(file == this.file,file.name,file)
properties:
  note.pinned:
    displayName: Pinned
  note.feed:
    displayName: Feed
  note.read:
    displayName: Read
  formula.item:
    displayName: Feed Item
views:
  - type: table
    name: Equivalent Feed Items (Same Article)
    order:
      - read
      - formula.item
      - feed
      - pinned
    columnSize:
      formula.item: 362
      note.feed: 341

~~~

- - -

{{content}}
`,
	rssFeedTemplate: `---
role:
collections: []
headline: A feed about ...
---

> [!overview]+ {{title}}
> {{image}} {{description}}

~~~base
filters:
  and:
    - role == "rssitem"
    - feed.asFile() == this.file
properties:
  file.name:
    displayName: RSS Item
  note.published:
    displayName: Published
  note.pinned:
    displayName: Pinned
  note.read:
    displayName: Read
views:
  - type: table
    name: Reading List 📰
    filters:
      and:
        - read != true
    order:
      - read
      - file.name
      - published
    sort:
      - property: published
        direction: DESC
    columnSize:
      file.name: 618
  - type: table
    name: Read Items ✅
    filters:
      and:
        - read == true
    order:
      - read
      - file.name
      - published
    sort:
      - property: published
        direction: DESC
    columnSize:
      file.name: 575
  - type: table
    name: Pinned Items 📍
    filters:
      and:
        - pinned == true
    order:
      - read
      - pinned
      - file.name
      - published
    sort:
      - property: published
        direction: DESC
    columnSize:
      note.pinned: 76
      file.name: 506
~~~
`,
	rssTagmapTemplate: `---
role: rsstagmap
---

This note defines a mapping betweeen tags in the RSS domain to tags in the domain of the user's knowledge graph.

# Tag Map

The RSS Tag_ column contains tag names in the RSS tag domain configured in the _cache.rss Tracker_ plugin settings (**without** the \`#\` prefix).
The _Mapped Tag_ columns contains the tag from the local knowledge graph the RSS tag is mapped
to (**including the** \`#\` prefix).

| RSS Tag | Mapped Tag |
| ------- | ---------- |`,
	rssCollectionTemplate: `---
role:
headline: A collection of feeds about ...
---

> [!overview]+
> {{image}}
> - [ ] Complete the headline.
> - [ ] Write a brief overview here

# Feeds in this Collection

~~~base
filters:
  and:
    - role == "rssfeed"
properties:
  file.name:
    displayName: Feed
  note.status:
    displayName: Status
  note.updated:
    displayName: Last Update
  note.headline:
    displayName: Headline
  note.collections:
    displayName: Collections
views:
  - type: table
    name: Feeds in this Collection 📰
    filters:
      and:
        - collections.contains(this.file)
    order:
      - file.name
      - headline
      - status
      - updated
      - collections
    sort: []
    columnSize:
      file.name: 218
      note.headline: 326
      note.status: 90
      note.updated: 190
  - type: table
    name: Collectible Feeds by Tag 🧩
    filters:
      and:
        - or:
            - collections.isEmpty()
            - this.file.tags.isEmpty()
            - this.tags.filter(file.hasTag(value)).length > 0
        - "!collections.contains(this.file.asLink())"
    order:
      - file.name
      - headline
      - collections
    sort:
      - property: collections
        direction: ASC
    columnSize:
      file.name: 218
      note.headline: 326
      note.status: 101
~~~

# Feed Items

~~~base
filters:
  and:
    - role == "rssitem"
    - file(feed).properties.collections.contains(this.file)
properties:
  file.name:
    displayName: Feed Item
  note.feed:
    displayName: Feed
  note.published:
    displayName: Published
  note.read:
    displayName: Read
views:
  - type: table
    name: Reading List  📰
    filters:
      and:
        - read == false
    order:
      - read
      - file.name
      - feed
      - published
    sort:
      - property: published
        direction: DESC
    columnSize:
      file.name: 299
      note.feed: 292
      note.published: 183
  - type: table
    name: Read Feed Items  ✅
    filters:
      and:
        - read == true
    groupBy:
      property: feed
      direction: ASC
    order:
      - read
      - file.name
      - published
    sort:
      - property: published
        direction: DESC
    columnSize:
      file.name: 563
      note.published: 158
  - type: table
    name: Pinned Feed Items 📍
    filters:
      and:
        - pinned == true
    groupBy:
      property: feed
      direction: ASC
    order:
      - file.name
      - published
    sort:
      - property: file.mtime
        direction: DESC
    columnSize:
      file.name: 645
      note.published: 202
~~~
`,
	rssCollectionDashboardTemplate: `---
role:
---

> [!overview]+ Curated collections of RSS feeds focused on specific topics.
> {{image}} Each collection is designed to provide a curated blend of authoritative sources, expert insights, and updates within its specific subject area.

# Feed Collections 📚

~~~base
filters:
  and:
    - role == "rsscollection"
properties:
  file.name:
    displayName: Collection
  note.headline:
    displayName: Headline
views:
  - type: table
    name: Collections
    order:
      - file.name
      - headline
    columnSize:
      file.name: 490
    cardSize: 310

~~~

# Unclaimed Feeds

~~~base
filters:
  and:
    - role == "rssfeed"
    - collections.isEmpty()
properties:
  file.name:
    displayName: Feed
  note.headline:
    displayName: Headline
  note.collections:
    displayName: Collections
views:
  - type: table
    name: Feeds
    order:
      - file.name
      - headline
      - collections
    columnSize:
      file.name: 334
      note.headline: 248

~~~
`,
	rssTopicTemplate: `---
role:
tags: []
headline: A curated list of RSS items about ...
---
> [!overview]+
> {{image}}
> - [ ] Create a headline
> - [ ] Specify tags in the \`tags\` frontmatter properties.
> - [ ] Configure additional filters

~~~base
filters:
  and:
    - role == "rssitem"
    - file != this.file
    - this.tags.filter(file.hasTag(value)).length > 0
    - '!file.hasTag("Trump", "ElonMusk")'
properties:
  file.name:
    displayName: Feed Item
  note.feed:
    displayName: Feed
  note.published:
    displayName: Published
  note.read:
    displayName: Read
views:
  - type: table
    name: Pinned Feed Items 📍
    filters:
      and:
        - pinned == true
    groupBy:
      property: feed
      direction: ASC
    order:
      - file.name
      - published
    sort:
      - property: feed
        direction: ASC
    columnSize:
      file.name: 597
      note.published: 154
  - type: table
    name: Similar Feed Items ≈
    filters:
      and:
        - pinned == false
        - read == false
    groupBy:
      property: feed
      direction: ASC
    order:
      - read
      - file.name
      - published
    sort:
      - property: published
        direction: DESC
    columnSize:
      note.read: 62
      file.name: 559
      note.published: 202
~~~
`,
	rssTopicDashboardTemplate: `---
role:
---

> [!overview]+ Curated collections of feed items focused on specific topics.
> {{image}} Each topic is designed to provide a curated blend of reliable sources, expert insights, and updates within its specific subject area.

~~~base
filters:
  and:
    - role == "rsstopic"
properties:
  file.name:
    displayName: Topic
  note.headline:
    displayName: Headline
views:
  - type: cards
    name: Topics
    order:
      - file.name
      - headline
    columnSize:
      file.name: 282
    cardSize: 400
~~~
`,
}

/**
 * Default settings for the RSS Tracker plugin.
 */
export const DEFAULT_SETTINGS: TDefaultSettings = {
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
	rssDashboardName: "{{folder_name}}",
	rssDefaultImagePath: undefined,
}

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
 * update the cache by calling {@link commit} to keep them accessible if these plugins are uavailable.
 */
export class RSSTrackerSettings implements IRSSTrackerPersistedSettings, IRSSTrackerComputedSettings {

	/**
	 * The plugin instance for the RSS Tracker.
	 */
	public plugin: RSSTrackerPlugin;

	/**
	 * The Obsidian app instance.
	 */
	public app: App;

	private get _filemgr(): RSSfileManager {
		return this.plugin.filemgr;
	};

	private _data: IRSSTrackerPersistedSettings = { ...DEFAULT_SETTINGS }; // The settings data loaded from the plugin's settings file.
	private _cache: TCachedSettings = {}; // The cached settings for pending changes and external settings.


	/**
	 * Whether feeds are updated automatically.
	 */
	get autoUpdateFeeds(): boolean {
		return this._data.autoUpdateFeeds;
	}

	/**
	 * Set whether feeds are updated automatically.
	 */
	set autoUpdateFeeds(value: boolean) {
		this._data.autoUpdateFeeds = value;
	}


	/**
	 * The root folder for RSS data.
	 */
	get rssHome(): string {
		return this._cache.rssHome || this._data.rssHome || DEFAULT_SETTINGS.rssHome;
	}

	/**
	 * Set the root folder for RSS data.
	 */
	set rssHome(value: string) {
		this._cache.rssHome = value;
	}


	/**
	 * The folder name for RSS feeds.
	 */
	get rssFeedFolderName(): string {
		return this._cache.rssFeedFolderName || this._data.rssFeedFolderName || DEFAULT_SETTINGS.rssFeedFolderName;
	}

	/**
	 * Set the folder name for RSS feeds.
	 */
	set rssFeedFolderName(value: string) {
		this._cache.rssFeedFolderName = value;
	}


	/**
	 * The folder name for RSS collections.
	 */
	get rssCollectionsFolderName(): string {
		return this._cache.rssCollectionsFolderName || this._data.rssCollectionsFolderName || DEFAULT_SETTINGS.rssCollectionsFolderName;
	}

	/**
	 * Set the folder name for RSS collections.
	 */
	set rssCollectionsFolderName(value: string) {
		this._cache.rssCollectionsFolderName = value;
	}


	/**
	 * The folder name for RSS topics.
	 */
	get rssTopicsFolderName(): string {
		return this._cache.rssTopicsFolderName || this._data.rssTopicsFolderName || DEFAULT_SETTINGS.rssTopicsFolderName;
	}

	/**
	 * Set the folder name for RSS topics.
	 */
	set rssTopicsFolderName(value: string) {
		this._cache.rssTopicsFolderName = value;
	}


	/**
	 * The folder name for RSS templates.
	 */
	get rssTemplateFolderName(): string {
		return this._cache.rssTemplateFolderName || this._data.rssTemplateFolderName || DEFAULT_SETTINGS.rssTemplateFolderName;
	}

	/**
	 * Set the folder name for RSS templates.
	 */
	set rssTemplateFolderName(value: string) {
		this._cache.rssTemplateFolderName = value;
	}


	/**
	 * The name of the RSS tagmap file (without extension).
	 */
	get rssTagmapName(): string {
		return this._cache.rssTagmapName || this._data.rssTagmapName || DEFAULT_SETTINGS.rssTagmapName;
	}

	/**
	 * Set the name of the RSS tagmap file (without extension).
	 */
	set rssTagmapName(value: string) {
		this._cache.rssTagmapName = value;
	}


	/**
	 * The default item limit for RSS feeds.
	 */
	get defaultItemLimit(): number {
		return this._cache.defaultItemLimit || this._data.defaultItemLimit || DEFAULT_SETTINGS.defaultItemLimit;
	}

	/**
	 * Set the default item limit for RSS feeds.
	 */
	set defaultItemLimit(value: number) {
		this._cache.defaultItemLimit = value;
	}


	/**
	 * The tag domain for RSS tags.
	 */
	get rssTagDomain(): string {
		return this._cache.rssTagDomain || this._data.rssTagDomain || DEFAULT_SETTINGS.rssTagDomain;
	}

	/**
	 * Set the tag domain for RSS tags.
	 */
	set rssTagDomain(value: string) {
		this._cache.rssTagDomain = value;
	}


	/**
	 * The path to the default image for RSS feeds.
	 */
	get rssDefaultImagePath(): string {
		return this._cache.rssDefaultImagePath || this._data.rssDefaultImagePath || "";
	}

	/**
	 * Set the path to the default image for RSS feeds.
	 */
	set rssDefaultImagePath(value: string) {
		this._cache.rssDefaultImagePath = value;
	}


	/**
	 * Get the markdown image link for the default RSS image.
	 */
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
			this._cache.rssDashboardPlacement = placement;
			return placement;
		}
		else {
			return this._cache.rssDashboardPlacement || this._data.rssDashboardPlacement || DEFAULT_SETTINGS.rssDashboardPlacement;
		}
	}

	get rssDashboardName(): string {
		const folderNotesSettings = (this.app as any).plugins.plugins["folder-notes"]?.settings;
		if (folderNotesSettings) {
			const folderNoteName = folderNotesSettings.folderNoteName;
			this._cache.rssDashboardName = folderNoteName;
			return folderNoteName;
		}
		else {
			return this._cache.rssDashboardName || this._data.rssDashboardName || DEFAULT_SETTINGS.rssDashboardName;
		}
	}

	/**
	 * Commit the changes to the settings.
	 * This method is called when the user closes the settings UI.
	 */
	async commit() {
		console.log("Commiting changes in settings");
		if (this._cache.rssHome && this._cache.rssHome !== this._data.rssHome) {
			this._data.rssHome = this._cache.rssHome;
			this._cache.rssHome = undefined;
		}

		if (this._cache.rssFeedFolderName && this._cache.rssFeedFolderName !== this._data.rssFeedFolderName) {
			this._data.rssFeedFolderName = this._cache.rssFeedFolderName;
			this._cache.rssFeedFolderName = undefined;
		}

		if (this._cache.rssCollectionsFolderName && this._cache.rssCollectionsFolderName !== this._data.rssCollectionsFolderName) {
			this._data.rssCollectionsFolderName = this._cache.rssCollectionsFolderName;
			this._cache.rssCollectionsFolderName = undefined;
		}

		if (this._cache.rssTopicsFolderName && this._cache.rssTopicsFolderName !== this._data.rssTopicsFolderName) {
			this._data.rssTopicsFolderName = this._cache.rssTopicsFolderName;
			this._cache.rssTopicsFolderName = undefined;
		}

		if (this._cache.rssTemplateFolderName && this._cache.rssTemplateFolderName !== this._data.rssTemplateFolderName) {
			if (await this._filemgr.renameFolder(this.rssTemplateFolderPath, this.rssHome + "/" + this._cache.rssTemplateFolderName)) {
				this._data.rssTemplateFolderName = this._cache.rssTemplateFolderName;
			}

			this._cache.rssTemplateFolderName = undefined;
		}

		if (this._cache.rssTagmapName && this._cache.rssTagmapName !== this._data.rssTagmapName) {
			this._data.rssTagmapName = this._cache.rssTagmapName;
		}

		if (this._cache.defaultItemLimit && this._cache.defaultItemLimit !== this._data.defaultItemLimit) {
			this._data.defaultItemLimit = this._cache.defaultItemLimit;
			this._cache.defaultItemLimit = undefined;
		}

		if (this._cache.rssTagDomain && this._cache.rssTagDomain !== this._data.rssTagDomain) {
			this._data.rssTagDomain = this._cache.rssTagDomain;
			this._cache.rssTagDomain = undefined;
		}

		if (this._cache.rssDashboardPlacement && this._cache.rssDashboardPlacement !== this._data.rssDashboardPlacement) {
			this._data.rssDashboardPlacement = this._cache.rssDashboardPlacement;
			this._cache.rssDashboardPlacement = undefined;
		}

		if (this._cache.rssDashboardName && this._cache.rssDashboardName !== this._data.rssDashboardName) {
			this._data.rssDashboardName = this._cache.rssDashboardName;
			this._cache.rssDashboardName = undefined;
		}

		if (this._cache.rssDefaultImagePath && this._cache.rssDefaultImagePath !== this._data.rssDefaultImagePath) {
			this._data.rssDefaultImagePath = this._cache.rssDefaultImagePath;
			this._cache.rssDefaultImagePath = undefined;
		}

		await this.plugin.saveData(this._data);
	}

	constructor(app: App, plugin: RSSTrackerPlugin) {
		this.app = app;
		this.plugin = plugin;
	}

	async loadData(): Promise<void> {
		const data = await this.plugin.loadData() as IRSSTrackerPersistedSettings;
		if (data) {
			(Object.keys(this._data) as Array<keyof IRSSTrackerPersistedSettings>).forEach((key) => {
				(this._data[key] as any) = data[key];
			});
		} else {
			console.log("rss-tracker first time load");
		}
		console.log("rss-tracker: settings loaded");
	}


	/**
	 * Get the full path to the RSS feed folder.
	 */
	get rssFeedFolderPath(): string {
		return this.rssHome + "/" + this.rssFeedFolderName;
	}

	/**
	 * Get the full path to the RSS collections folder.
	 */
	get rssCollectionsFolderPath(): string {
		return this.rssHome + "/" + this.rssCollectionsFolderName;
	}

	/**
	 * Get the full path to the RSS topics folder.
	 */
	get rssTopicsFolderPath(): string {
		return this.rssHome + "/" + this.rssTopicsFolderName;
	}

	/**
	 * Get the full path to the RSS template folder.
	 */
	get rssTemplateFolderPath(): string {
		return this.rssHome + "/" + this.rssTemplateFolderName;
	}

	/**
	 * Get the full path to the RSS tagmap file (with .md extension).
	 */
	get rssTagmapPath(): string {
		return this.rssHome + "/" + this.rssTagmapName + ".md";
	}
}
