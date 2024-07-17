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
 
~~~dataview
TABLE
headline as Headline
FROM "RSS" AND -"RSS/Templates"
WHERE role = "rsscollection"
SORT file.name ASC
~~~

## Feed Status

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	feeds = await dvjs.rssFeeds();
	await dvjs.initializefeedToCollectionMap();
if (dvjs.rssFeedTable(
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
				dvjs.fileLinks(dvjs.rssCollectionsOfFeed(f))
			]) === 0) {
	dv.paragraph("No feeds subscribed")
}
~~~

## Reading List 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	feeds = await dvjs.rssFeeds();
await dvjs.groupedReadingList(feeds,false);
~~~

## All Pinned Items  📌

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	feeds = await dvjs.rssItems();
await dvjs.rssItemTable(
	feeds.where(rec => rec.pinned === true),
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
	]
);
~~~

# Appendix

Drag shortcut to Desktop or Browser bar: [Sandbox - Obsidian](obsidian://open?vault=Sandbox&file=%C2%A7%20About%20this%20Vault)

