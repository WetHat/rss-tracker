---
role: rsstopic
tags: []
allof: []
noneof: []
---
> [!abstract] [headline:: A curated list of RSS items about ???]
> - [ ] Create a headline
> - [ ] Summarize the purpose of this topic.
> - [ ] Specify tags in the `tags`, `allof`, 'noneof' frontmatter properties

# Curated Articles ☑️

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	topic = dv.current(),
	items = await dvjs.rssItems(topic);
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
		dv.paragraph("No articles for this topic.")
	}
dv.paragraph("From: " + dvjs.fromTags(topic));
~~~

# Other Articles

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	topic = dv.current(),
	items = await dvjs.rssItems(topic);
if (dvjs.rssTable(
	items.where(rec => rec.pinned === false),
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
		dv.paragraph("No articles for this topic.")
	}
dv.paragraph("From: " + dvjs.fromTags(topic));
~~~