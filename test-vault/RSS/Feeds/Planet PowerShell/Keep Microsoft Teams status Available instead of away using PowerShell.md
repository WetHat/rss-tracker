---
role: rssitem
author: "Matthew Dowst"
published: 2024-05-24T12:23:30.000Z
link: https://powershellisfun.com/2024/05/23/keep-microsoft-teams-status-available-instead-of-away-using-powershell/
id: https://psweekly.dowst.dev/?post_type=link_library_links&p=6890
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] Keep Microsoft Teams status Available instead of away using PowerShell by Matthew Dowst - 2024-05-24T12:23:30.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> It is one of the things I hear my colleagues, and even my girlfriend, mention regularly... Why does
> 
> Microsoft Teams think I'm away while I'm not / My PC isn't locked yet... I read a few solutions, setting your status duration to a date in the future, etc... Didn't work :( What does work is running my simple PowerShell scripts, which I will show you in this blog post :)
> 
> (+)(-)

🔗Read article [online](https://powershellisfun.com/2024/05/23/keep-microsoft-teams-status-available-instead-of-away-using-powershell/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Keep Microsoft Teams status Available instead of away using PowerShell]]

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
It is one of the things I hear my colleagues, and even my girlfriend, mention regularly... Why does

Microsoft Teams think I'm away while I'm not / My PC isn't locked yet... I read a few solutions, setting your status duration to a date in the future, etc... Didn't work :( What does work is running my simple PowerShell scripts, which I will show you in this blog post :)

(+)(-)