---
role: rssfeed
feedurl: https://localhost/test/Azimuth/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 10
updated: 2025-03-31T14:39:36.619Z
status: ✅
tags: []
interval: 206
---
> [!abstract] Azimuth
> ![image|float:right|400](https://s0.wp.com/i/buttonw-com.png) 

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