---
role: rsscollection
tags: []
allof: []
noneof: []
---

> [!abstract] [headline:: A curated collection of RSS feeds]
> ![[RSSdefaultImage.svg|float:right|100x100]] Specify tags in the `tags`, `allof`, `noneof` frontmatter properties to collect feeds matching the tag filter.

# Feeds in this Collection 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssTable(
	await await dvjs.rssFeedsOfContext(),
	dvjs.getOptions("rss_context_feeds")
);
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~

# Reading List ⚫

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
await dvjs.groupedReadingList(await dvjs.rssFeedsOfContext(),false);
~~~

# Pinned Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dvjs.rssItemsOfContext();
dvjs.rssTable(
	pages.where(it => it.pinned === true),
	dvjs.getOptions("rss_context_items"));
~~~