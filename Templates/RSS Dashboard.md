---
type: rssdashboard
tags: []
---
> [!abstract]  [headline:: RSS feed Dashboard]
> - [ ] Describe the purpose of this dashboard.
> - [ ] add an image

# Feed Status 💔

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dv.pages(dvjs.fromFeeds);
dvjs.rssTable(
	pages,
	dvjs.getOptions("rss_dashboard_feeds")
)
~~~

# Feed Collections 📚

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

# Topics 🔬

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
		"Tags",
		"Feed",
		"Published"
	],
	f =>
	[
		dvjs.fileLink(f),
		dvjs.hashtagLine(f),
		f.feed,
		f.published
	]) === 0) {
		dv.paragraph("No items pinned")
	}
~~~