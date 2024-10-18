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

# Curated Articles 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	from = await dvjs.fromItemsOf(dv.current());
dvjs.rssTable(
	await dv.pages(from).where(p => p.pinned === true),
	dvjs.getOptions("rss_context_items")
)
dv.paragraph("From: " + from);
~~~

# Other Articles

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	from = await dvjs.fromItemsOf(dv.current());
dvjs.rssTable(
	await dv.pages(from).where(p => p.pinned !== true),
	dvjs.getOptions("rss_context_items")
)
dv.paragraph("From: " + from);
~~~