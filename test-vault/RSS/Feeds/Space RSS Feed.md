---
role: rssfeed
tags: []
feedurl: https://localhost/test/Space RSS Feed/feed.xml
site: https://www.space.com
itemlimit: 10
status: ✅
updated: 2025-05-21T19:06:07.304Z
interval: 5
---
> [!abstract] Space RSS Feed
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