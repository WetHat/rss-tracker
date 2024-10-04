---
role: rssitem
author: Jeffery Hicks
published: 2024-05-24T17:03:43.000Z
link: https://jdhitsolutions.com/blog/books/9389/powershell-scripting-and-toolmaking/
id: 
feed: "[[Planet PowerShell]]"
tags: [rss/Books,rss/LeanPub,rss/PowerShell,rss/Scripting,rss/toolmaking]
pinned: false
---

> [!abstract] PowerShell Scripting and Toolmaking by Jeffery Hicks - 2024-05-24T17:03:43.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Several years ago Don Jones and I wrote what we hoped would be the definitive book on PowerShell scripting and toolmaking. The book takes all off our years of experience, not only from writing PowerShell code, to teaching and conference presentations where we hear first hand what people struggle with. We published the book on...

🔗Read article [online](https://jdhitsolutions.com/blog/books/9389/powershell-scripting-and-toolmaking/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell Scripting and Toolmaking]]

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
