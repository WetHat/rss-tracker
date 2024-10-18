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

# Unread Feed Items 📚
~~~dataview
TASK
FROM [[]]
WHERE !completed AND startswith(text,"[[") AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dv.pages(await dvjs.fromItemsOf(dv.current()));
dvjs.rssTable(
	pages.where(it => it.pinned === true),
	dvjs.getOptions("rss_feed_items"));
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[]]
WHERE completed AND startswith(text,"[[") AND role = "rssitem"
SORT published DESC
~~~