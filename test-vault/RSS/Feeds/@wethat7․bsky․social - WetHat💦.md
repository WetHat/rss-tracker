---
role: rssfeed
aliases:
  - "@wethat7.bsky.social - WetHat💦"
site: https://bsky.app/profile/wethat7.bsky.social
feedurl: https://localhost/test/@wethat7․bsky․social - WetHat💦/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-27T08:05:49.623Z
interval: 19
tags: []
---

> [!abstract] @wethat7.bsky.social - WetHat💦
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100]] I enjoy programming computers

# Reading List 📑

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	items = dvjs.rssItemsOfFeed(dv.current());
await dvjs.rssReadingList(items,false,expand);
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = await dvjs.rssItemsOfFeed(dv.current()).where(i => i.pinned === true);
await dvjs.rssItemTable(items,expand);
~~~

# Read Feed Items ✅

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfFeed(dv.current());
await dvjs.rssReadingList(items,true,expand);
~~~
