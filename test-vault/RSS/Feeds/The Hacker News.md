---
role: rssfeed
feedurl: https://localhost/test/The Hacker News/feed.xml
site: https://thehackernews.com
itemlimit: 10
updated: 2024-10-30T07:52:23.397Z
status: ✅
tags: []
interval: 5
---
> [!abstract] The Hacker News
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com

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