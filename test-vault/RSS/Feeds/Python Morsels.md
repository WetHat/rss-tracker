---
role: rssfeed
feedurl: https://localhost/test/Python Morsels/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2025-04-03T18:52:17.553Z
status: ✅
tags: []
interval: 425
---
> [!abstract] Python Morsels
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Python Morsels

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