---
role: rsscollection
tags: []
allof: []
noneof: []
---

> [!abstract] [headline:: A curated collection of RSS feeds about ???]
> - [ ] Add an image like so `[[ogo.png|float:right|400]]`
> - [ ] Create a headline
> - [ ] Summarize the purpose of this collection.
> - [ ] Specify tags in the `tags`, `allof`, 'noneof' frontmatter properties

# Feeds in this Collection

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssTable(
	await dv.pages(dvjs.fromFeedsOf(dv.current())),
	dvjs.getOptions("rss_context_feeds")
);
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~

# Reading List 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	feeds = await dv.pages(dvjs.fromFeedsOf(dv.current()));
await dvjs.groupedReadingList(feeds,false);
~~~

# Pinned Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dv.pages(await dvjs.fromItemsOf(dv.current()));
dvjs.rssTable(
	pages.where(it => it.pinned === true),
	dvjs.getOptions("rss_context_items"));
~~~