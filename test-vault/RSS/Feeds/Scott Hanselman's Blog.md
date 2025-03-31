---
role: rssfeed
feedurl: https://localhost/test/Scott Hanselman's Blog/feed.xml
site: https://www.hanselman.com/blog/
itemlimit: 10
updated: 2025-03-31T14:39:09.636Z
status: ✅
tags: []
interval: 2138
---
> [!abstract] Scott Hanselman's Blog
> ![image|float:right|400](http://www.hanselman.com/blog/images/tinyheadshot2.jpg) Scott Hanselman on Programming, User Experience, The Zen of Computers and Life in General

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