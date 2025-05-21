---
role: rssfeed
feedurl: https://localhost/test/TypeScript TV/feed.xml
site: https://typescript.tv/
itemlimit: 10
updated: 2025-05-21T12:31:01.319Z
status: ✅
tags: []
interval: 809
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