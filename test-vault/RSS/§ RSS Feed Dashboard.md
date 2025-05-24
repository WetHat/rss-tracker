---
type: rssdashboard
tags: []
---
> [!abstract]  [headline:: RSS feed Dashboard]
> ![[RSSdefaultImage.svg|float:right|100x100]] See all your subscribed and curated content at a glance.

# Feed Status 💔

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expanded = false,
	feeds = dvjs.rssFeeds;
dvjs.rssFeedDashboard(feeds,expanded);
~~~

# Feed Collections 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	collections = dvjs.rssCollections;
await dvjs.rssCollectionTable(collections,expand);
~~~

# Topics 🔬

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	topics = dvjs.rssTopics;
await dvjs.rssTopicTable(topics,expand);
~~~

# Pinned Items 📍x

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItems.where(i => i.pinned === true);
await dvjs.rssItemTableByFeed(items,expand);
~~~