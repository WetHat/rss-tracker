---
role: rssfeed
aliases: []
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
feedurl: https://localhost/test/Sabine Hossenfelder/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-27T08:05:23.628Z
interval: 24
tags: []
---

> [!abstract] Sabine Hossenfelder
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100]] 

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
