---
role: rssitem
author: Harm Veenstra
published: 2024-05-23T16:41:33.000Z
link: https://powershellisfun.com/2024/05/23/keep-microsoft-teams-status-available-instead-of-away-using-powershell/
id: https://powershellisfun.com/?p=7435
feed: "[[Planet PowerShell]]"
tags: [rss/Fun,rss/Microsoft_Teams,rss/PowerShell]
pinned: false
---

> [!abstract] Keep Microsoft Teams status Available instead of away using PowerShell by Harm Veenstra - 2024-05-23T16:41:33.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> It is one of the things I hear my colleagues, and even my girlfriend, mention regularly... Why does Microsoft Teams think I'm away while I'm not / My PC isn't locked yet... I read a few solutions, setting your status duration to a date in the future, etc... Didn't work :( What does work is running my simple PowerShell scripts, which I will show you in this blog post :)

🔗Read article [online](https://powershellisfun.com/2024/05/23/keep-microsoft-teams-status-available-instead-of-away-using-powershell/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Keep Microsoft Teams status Available instead of away using PowerShell (1)]]

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
