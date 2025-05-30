---
role: rssfeed
aliases:
  - "The GitHub Blog: Product News and Updates"
site: https://github.blog/category/product/
feedurl: https://localhost/test/The GitHub Blog꞉ Product News and Updates/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-27T08:05:17.364Z
interval: 165
tags: []
---

> [!abstract] The GitHub Blog: Product News and Updates
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100]] Updates, ideas, and inspiration from GitHub to help developers build and design software.

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
