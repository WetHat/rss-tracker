---
role: rssfeed
feedurl: https://localhost/test/Blogs on Lisp journey/feed.xml
site: https://localhost/blog/
itemlimit: 10
updated: 2025-03-31T14:39:34.286Z
status: ✅
tags: []
interval: 645
---
> [!abstract] Blogs on Lisp journey
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Recent content in Blogs on Lisp journey

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