---
role: rssfeed
aliases: []
site: https://effectivetypescript.com/
feedurl: https://localhost/test/Effective TypeScript/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-27T08:05:38.996Z
interval: 759
tags: []
---

> [!abstract] Effective TypeScript
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100]] 62 Specific Ways to Improve Your TypeScript

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
