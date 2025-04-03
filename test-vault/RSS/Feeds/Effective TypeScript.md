---
role: rssfeed
feedurl: https://localhost/test/Effective TypeScript/feed.xml
site: https://effectivetypescript.com/
itemlimit: 10
updated: 2025-04-03T18:52:28.685Z
status: ✅
tags: []
interval: 759
---
> [!abstract] Effective TypeScript
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] 62 Specific Ways to Improve Your TypeScript

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