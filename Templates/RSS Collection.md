---
role: rsscollection
tags: []
allof: []
noneof: []
---

> [!abstract] [headline:: A curated collection of RSS feeds]
> ![[RSSdefaultImage.svg|float:right|100x100]] Specify tags in the `tags`, `allof`, `noneof` frontmatter properties to collect feeds matching the tag filter.

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
	items = await dvjs.rssItemsOfContext().where( i => i.pinned === true);
await dvjs.rssItemTableByFeed(items,expand);
~~~