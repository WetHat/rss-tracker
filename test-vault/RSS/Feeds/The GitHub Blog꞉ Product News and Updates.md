---
role: rssfeed
feedurl: https://localhost/test/The GitHub Blog꞉ Product News and Updates/feed.xml
site: https://github.blog/category/product/
itemlimit: 10
updated: 2025-04-03T18:52:06.539Z
status: ✅
tags: []
interval: 165
---
> [!abstract] The GitHub Blog: Product News and Updates
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Updates, ideas, and inspiration from GitHub to help developers build and design software.

# Reading List ⚫

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.readingList( await dvjs.rssItemsOfContext(), false);
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dvjs.rssItemsOfContext();
dvjs.rssTable(
	pages.where(it => it.pinned === true),
	dvjs.getOptions("rss_feed_items"));
~~~

# Read Feed Items ✅

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.readingList( await dvjs.rssItemsOfContext(), true);
~~~