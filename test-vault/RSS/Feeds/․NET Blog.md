---
role: rssfeed
feedurl: https://localhost/test/․NET Blog/feed.xml
site: https://devblogs.microsoft.com/dotnet/
itemlimit: 10
updated: 2025-05-21T12:30:59.391Z
status: ✅
tags: []
interval: 77
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