---
role: rssfeed
feedurl: https://localhost/test/Python Morsels/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2025-05-21T12:31:16.887Z
status: ✅
tags: []
interval: 425
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