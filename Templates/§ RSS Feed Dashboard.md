---
type: about
tags:
  - Programming
  - KnowledgeManagement/Obsidian
---
> [!abstract]  [headline:: RSS feeds Part of the WetHat Lab Knowledge Graph]
>
>  ![[RSS Logo.jpg|400]]
# Map of Content

## Feed Collections 📑

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	collections = await dvjs.rssCollections();
dvjs.rssTable(
	collections,
	[
		"Collection",
		"Headline",
		"Tags"
	],
	c =>
	[
		dvjs.fileLink(c),
		c.headline,
		dvjs.hashtagLine(c)
	]
);
~~~

## Feed Status

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

## All Pinned Items  📌

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

