---
role: rssitem
author: Matthew Dowst
published: 2024-05-24T12:24:12.000Z
link: https://www.youtube.com/watch?v=ZqAShden9qA
id: 
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] Frontend PowerShell with Google Forms: Part 1 Getting your data by Matthew Dowst - 2024-05-24T12:24:12.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> ［OC］ Learn how to get data from a Google Form into PowerShell, by building a repeatable and reusable
> 
> automation you can use to with any form.
> 
> (+)(-)

🔗Read article [online](https://www.youtube.com/watch?v=ZqAShden9qA). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Frontend PowerShell with Google Forms꞉ Part 1 Getting your data]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Additional RSS Items Referring to This Article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
［OC］ Learn how to get data from a Google Form into PowerShell, by building a repeatable and reusable

automation you can use to with any form.

(+)(-)