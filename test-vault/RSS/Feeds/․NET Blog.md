---
role: rssfeed
site: https://devblogs.microsoft.com/dotnet/
feedurl: https://localhost/test/․NET Blog/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-22T06:11:34.203Z
interval: 77
tags: []
---

> [!abstract] .NET Blog
> ![image|float:right|400](https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2018/10/Microsoft-Favicon.png) Free. Cross-platform. Open source. A developer platform for building all your apps.

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