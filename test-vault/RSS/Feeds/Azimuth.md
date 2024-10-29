---
role: rssfeed
feedurl: https://localhost/test/Azimuth/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 10
updated: 2024-10-29T19:36:02.068Z
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