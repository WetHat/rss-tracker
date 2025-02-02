---
role: rssfeed
feedurl: "{{feedUrl}}"
site: "{{siteUrl}}"
itemlimit:
updated:
status:
tags: []
---
> [!abstract] {{title}}
> {{image}} {{description}}

# Reading List ⚫

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
if (await dvjs.rssReadingList(dv.current(),false,true) === 0) {
	dv.paragraph("⛔");
};
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dvjs.rssItemsOfContext();
dvjs.rssTable(
	pages.where(it => it.pinned === true),
	dvjs.getOptions("rss_feed_items"));
~~~

# Read Feed Items ✅

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
if (await dvjs.rssReadingList(dv.current(),true,false) === 0) {
	dv.paragraph("⛔");
};
~~~