---
role: rsstopic
tags: []
allof: []
noneof: []
---
> [!abstract] [headline:: A curated collection of RSS items about ???]
> - [ ] Create a headline
> - [ ] Summarize the purpose of this topic.

# Items in this Topic
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
        "Pinned",
		"Feed",
		"Tags"
	],
	f =>
	[
		dvjs.fileLink(f),
		dvjs.rssItemPublishDate(f),
        f.pinned ? "☑️" : "",
		f.feed,
		dvjs.hashtagLine(f)
	]) === 0) {
		dv.paragraph("No items for this topic.")
	}
dv.paragraph("From: " + dvjs.fromTags(topic));
~~~