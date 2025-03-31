---
role: rssfeed
feedurl: https://localhost/test/Planet PowerShell/feed.xml
site: https://www.planetpowershell.com/
itemlimit: 10
updated: 2025-03-31T14:39:21.393Z
status: ✅
tags: []
interval: 102
---
> [!abstract] Planet PowerShell
> ![image|float:right|400](https://www.planetpowershell.com/Content/Logo.png) An aggregated feed from the PowerShell community

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