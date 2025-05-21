---
role: rssfeed
feedurl: https://localhost/test/Sabine Hossenfelder/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2025-05-21T12:31:12.458Z
status: ✅
tags: []
interval: 24
---
> [!abstract] Sabine Hossenfelder
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] 

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