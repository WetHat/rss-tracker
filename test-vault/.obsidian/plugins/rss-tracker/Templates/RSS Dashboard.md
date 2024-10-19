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
	pages = await dvjs.rssCollections();
dvjs.rssTable(
	pages,
	dvjs.getOptions("rss_collections")
);
~~~

# Topics 🔬

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dvjs.rssTopics();
dvjs.rssTable(
	pages,
	dvjs.getOptions("rss_topics")
);
~~~

# Pinned Items  📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dvjs.rssItems();
dvjs.rssTable(
	pages.where(p => p.pinned === true),
	dvjs.getOptions("rss_context_items")
	)
~~~