---
role: rssitem
author: "Matthew Dowst"
published: 2024-05-24T12:23:54.000Z
link: https://www.jannemattila.com/azure/2024/05/20/automating-powershell-tasks-with-container-apps.html
id: https://psweekly.dowst.dev/?post_type=link_library_links&p=6892
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] Automating PowerShell tasks with Container App Jobs by Matthew Dowst - 2024-05-24T12:23:54.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> I previously wrote about Automating maintenance tasks with Azure Functions and PowerShell. That
> 
> combo has been my go-to solution for many automation tasks.
> 
> (+)(-)

🔗Read article [online](https://www.jannemattila.com/azure/2024/05/20/automating-powershell-tasks-with-container-apps.html). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Automating PowerShell tasks with Container App Jobs]]

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
I previously wrote about Automating maintenance tasks with Azure Functions and PowerShell. That

combo has been my go-to solution for many automation tasks.

(+)(-)