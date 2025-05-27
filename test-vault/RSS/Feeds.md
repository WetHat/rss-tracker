---
role: rssfeed-dashboard
---
> [!abstract] RSS feed Dashboard
> ![[RSSdefaultImage.svg|float:right|100]] See all your subscribed and curated content at a glance.

# Feed Status 💔

⚠️ Untagged feeds cannot be claimed by feed collections.
~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expanded = false,
	feeds = dvjs.rssFeeds;
dv.header(2,"Failed and Suspended Feeds ❌");
dvjs.rssFeedTable(feeds.where(f => f.status !== "✅"),true);

dv.header(2,"Updated Feeds ✅");
dvjs.rssFeedTable(feeds.where(f => f.status === "✅"),expanded);
~~~

# Pinned Items 📍x

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItems.where(i => i.pinned === true);
await dvjs.rssItemTableByFeed(items,expand);
~~~
