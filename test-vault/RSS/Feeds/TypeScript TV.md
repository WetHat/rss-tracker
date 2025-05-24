---
role: rssfeed
aliases: []
site: https://typescript.tv/
feedurl: https://localhost/test/TypeScript TV/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-24T17:13:04.752Z
interval: 809
tags: []
---

> [!abstract] TypeScript TV
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] 🚀 Ideal for beginners or advanced TypeScript programmers, our coding course guarantees something new for everyone.

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