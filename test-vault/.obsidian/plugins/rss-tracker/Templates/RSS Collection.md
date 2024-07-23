---
role: rsscollection
tags: []
allof: []
noneof: []
---
> [!abstract] [headline:: A curated collection of RSS feeds about ???]
> - [ ] Create a headline
> - [ ] Summarize the purpose of this collection.
> - [ ] Specify tags in the `tags`, `allof`, 'noneof' frontmatter properties


# Feeds in this Collection

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	collection = dv.current(),
	feeds = await dvjs.rssFeeds(collection);
if (await dvjs.rssTable(
		feeds,
		[
			"Feed",
			"Status",
			"Updated",
			"Tags"
		],
		f => [
				dvjs.fileLink(f),
				f.status,
				dvjs.rssFeedUpdateDate(f),
				dvjs.hashtagLine(f)
			]) === 0) {
	dv.paragraph("No feeds in this collection")
}
dv.paragraph("From: " + dvjs.fromTags(collection));
~~~

# Reading List 📚

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	collection = dv.current(),
	feeds = await dvjs.rssFeedsOfCollection(collection);
await dvjs.groupedReadingList(feeds,false);
~~~

# Pinned Items 📌

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	collection = dv.current(),
	feeds = await dvjs.rssFeedsOfCollection(collection);
await dvjs.groupedRssItemTable(
	feeds,
	(feed => feed.pinned === true),
	["Item", "Published"],
	itm => [dvjs.fileLink(itm), dvjs.rssItemPublishDate(itm)]
);
~~~