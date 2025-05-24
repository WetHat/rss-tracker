---
role: rssfeed
aliases:
  - fettblog.eu | TypeScript, JavaScript, Jamstack
site: https://fettblog.eu/
feedurl: https://localhost/test/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-24T17:13:28.374Z
interval: 593
tags: []
---

> [!abstract] fettblog.eu | TypeScript, JavaScript, Jamstack
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