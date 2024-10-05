---
role: rssitem
author: "Matthew Dowst"
published: 2024-05-24T12:23:18.000Z
link: https://powershellisfun.com/2024/05/17/parameters-for-powershell-scripts-and-functions/
id: https://psweekly.dowst.dev/?post_type=link_library_links&p=6889
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] Parameters for PowerShell Scripts and Functions by Matthew Dowst - 2024-05-24T12:23:18.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> Using parameters for your Scripts and Functions is very powerful. You don't have to hardcode things
> 
> in them, making running them from a command line easier. This blog post will show you the parameters I use in most of my scripts and how they work.
> 
> (+)(-)

🔗Read article [online](https://powershellisfun.com/2024/05/17/parameters-for-powershell-scripts-and-functions/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Parameters for PowerShell Scripts and Functions]]

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
Using parameters for your Scripts and Functions is very powerful. You don't have to hardcode things

in them, making running them from a command line easier. This blog post will show you the parameters I use in most of my scripts and how they work.

(+)(-)