---
role: rssfeed
feedurl: https://localhost/test/@wethat7․bsky․social - WetHat💦/feed.xml
site: https://bsky.app/profile/wethat7.bsky.social
itemlimit: 10
updated: 2025-05-21T12:31:39.293Z
status: ✅
tags: []
interval: 19
---
> [!abstract] @wethat7.bsky.social - WetHat💦
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] I enjoy programming computers

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