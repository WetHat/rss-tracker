---
role: rssfeed
feedurl: https://localhost/test/Real Python/feed.xml
site: https://realpython.com/
itemlimit: 10
updated: 2025-04-03T18:52:15.299Z
status: ✅
tags: []
interval: 50
---
> [!abstract] Real Python
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] 

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