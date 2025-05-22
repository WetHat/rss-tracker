---
role: rssfeed
aliases: []
site: https://www.planetpowershell.com/
feedurl: https://localhost/test/Planet PowerShell/feed.xml
itemlimit: 10
status: "❌Saving 'Keep Microsoft Teams status Available instead of away using PowerShell' of feed 'Planet PowerShell failed': File already exists."
updated: 0
interval: 1
tags: []
---

> [!abstract] Planet PowerShell
> ![image|float:right|400](https://www.planetpowershell.com/Content/Logo.png) An aggregated feed from the PowerShell community

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