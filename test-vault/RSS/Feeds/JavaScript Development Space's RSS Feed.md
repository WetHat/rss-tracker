---
role: rssfeed
site: http://github.com/dylang/node-rss
feedurl: https://localhost/test/JavaScript Development Space's RSS Feed/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-22T06:11:58.360Z
interval: 138
tags: []
---

> [!abstract] JavaScript Development Space's RSS Feed
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Explore the world of JavaScript at our blog, your ultimate resource for guides, tutorials, and articles. Uncover the latest insights, tips, and trends.

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