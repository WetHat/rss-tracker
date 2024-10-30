---
role: rssfeed
feedurl: https://localhost/test/@wethat7․bsky․social - WetHat💦/feed.xml
site: https://bsky.app/profile/wethat7.bsky.social
itemlimit: 10
updated: 2024-10-30T07:53:00.396Z
status: ✅
tags: []
interval: 19
---
> [!abstract] @wethat7.bsky.social - WetHat💦
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] I enjoy programming computers

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