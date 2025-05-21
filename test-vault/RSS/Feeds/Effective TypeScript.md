---
role: rssfeed
feedurl: https://localhost/test/Effective TypeScript/feed.xml
site: https://effectivetypescript.com/
itemlimit: 10
updated: 2025-05-21T12:31:28.165Z
status: ✅
tags: []
interval: 759
---
> [!abstract] Effective TypeScript
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] 62 Specific Ways to Improve Your TypeScript

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