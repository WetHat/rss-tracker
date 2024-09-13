---
type: rssdashboard
tags: []
---
> [!abstract]  [headline:: RSS feed Dashboard]
> - [ ] Describe the purpose of this dashboard.

# Feed Status

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	feeds = await dvjs.rssFeeds(),
	map = await dvjs.mapFeedsToCollections();
if (dvjs.rssTable(
		feeds,
		[
			"Feed",
			"Status",
			"Updated",
			"Collections"
		],
		f => [
				dvjs.fileLink(f),
				f.status,
				dvjs.rssFeedUpdateDate(f),
				dvjs.fileLinks(map.rssFeedToCollections(f))
			]) === 0) {
	dv.paragraph("No feeds subscribed")
}
~~~

# Feed Collections 📑

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	collections = await dvjs.rssDashboards("rsscollection");
dvjs.rssTable(
	collections,
	[
		"Collection",
		"Headline"
	],
	c =>
	[
		dvjs.fileLink(c),
		c.headline
	]
);
~~~

# Topics
~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	collections = await dvjs.rssDashboards("rsstopic");
dvjs.rssTable(
	collections,
	[
		"Topic",
		"Headline",
	],
	c =>
	[
		dvjs.fileLink(c),
		c.headline
	]
);
~~~

# Pinned Items  📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	items = await dvjs.rssItems();
if (dvjs.rssTable(
	items.where(rec => rec.pinned === true),
	[
		"Item",
		"Published",
		"Feed",
		"Tags"
	],
	f =>
	[
		dvjs.fileLink(f),
		dvjs.rssItemPublishDate(f),
		f.feed,
		dvjs.hashtagLine(f)
	]) === 0) {
		dv.paragraph("No items pinned")
	}
~~~