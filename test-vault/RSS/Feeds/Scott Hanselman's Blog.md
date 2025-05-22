---
role: rssfeed
site: https://www.hanselman.com/blog/
feedurl: https://localhost/test/Scott Hanselman's Blog/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-22T07:13:16.310Z
interval: 2138
tags: []
---

> [!abstract] Scott Hanselman's Blog
> ![image|float:right|400](http://www.hanselman.com/blog/images/tinyheadshot2.jpg) Scott Hanselman on Programming, User Experience, The Zen of Computers and Life in General

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