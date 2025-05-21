---
role: rssfeed
feedurl: https://localhost/test/The GitHub Blog꞉ Product News and Updates/feed.xml
site: https://github.blog/category/product/
itemlimit: 10
updated: 2025-05-21T12:31:05.689Z
status: ✅
tags: []
interval: 165
---
> [!abstract] The GitHub Blog: Product News and Updates
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Updates, ideas, and inspiration from GitHub to help developers build and design software.

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