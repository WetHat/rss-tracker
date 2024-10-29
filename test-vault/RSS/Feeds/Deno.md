---
role: rssfeed
feedurl: https://localhost/test/Deno/feed.xml
site: https://deno.com/blog
itemlimit: 10
updated: 2024-10-29T19:35:55.291Z
status: ✅
tags: []
interval: 207
---
> [!abstract] Deno
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] The latest news from Deno Land Inc.

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