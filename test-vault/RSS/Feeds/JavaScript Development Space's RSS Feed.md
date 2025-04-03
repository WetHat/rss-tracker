---
role: rssfeed
feedurl: https://localhost/test/JavaScript Development Space's RSS Feed/feed.xml
site: http://github.com/dylang/node-rss
itemlimit: 10
updated: 2025-04-03T18:52:24.331Z
status: ✅
tags: []
interval: 138
---
> [!abstract] JavaScript Development Space's RSS Feed
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Explore the world of JavaScript at our blog, your ultimate resource for guides, tutorials, and articles. Uncover the latest insights, tips, and trends.

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