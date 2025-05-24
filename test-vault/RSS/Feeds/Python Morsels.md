---
role: rssfeed
aliases: []
site: https://www.pythonmorsels.com/topics/
feedurl: https://localhost/test/Python Morsels/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-24T17:13:19.670Z
interval: 425
tags: []
---

> [!abstract] Python Morsels
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Python Morsels

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