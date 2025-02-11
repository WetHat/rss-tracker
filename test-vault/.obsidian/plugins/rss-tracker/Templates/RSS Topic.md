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

# Curated Articles📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	items = dvjs.rssItemsOfTopic(dv.current()).where(t => t.pinned === true);
await dvjs.rssItemTableByFeed(items,expand)
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~

# Other Articles 📄

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfTopic(dv.current()).where(t => t.pinned !== true);
await dvjs.rssItemTableByFeed(items,expand)
dv.paragraph("From: " + dvjs.fromTags(dv.current()));
~~~