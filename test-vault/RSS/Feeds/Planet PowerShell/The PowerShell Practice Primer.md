---
role: rssitem
author: "Matthew Dowst"
published: 2024-05-24T12:25:00.000Z
link: https://leanpub.com/psprimer
id: https://psweekly.dowst.dev/?post_type=link_library_links&p=6896
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] The PowerShell Practice Primer by Matthew Dowst - 2024-05-24T12:25:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> A collection of over 100 PowerShell learning exercises targeted for beginners developed by
> 
> PowerShell MVP and veteran teacher Jeff Hicks.
> 
> (+)(-)

🔗Read article [online](https://leanpub.com/psprimer). For other items in this feed see [[Planet PowerShell]].

- [ ] [[The PowerShell Practice Primer]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Other RSS items are referring to the same article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
A collection of over 100 PowerShell learning exercises targeted for beginners developed by

PowerShell MVP and veteran teacher Jeff Hicks.

(+)(-)