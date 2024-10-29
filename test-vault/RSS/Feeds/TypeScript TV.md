---
role: rssfeed
feedurl: https://localhost/test/TypeScript TV/feed.xml
site: https://typescript.tv/
itemlimit: 10
updated: 2024-10-29T19:35:27.419Z
status: ✅
tags: []
interval: 809
---
> [!abstract] TypeScript TV
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] 🚀 Ideal for beginners or advanced TypeScript programmers, our coding course guarantees something new for everyone.

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