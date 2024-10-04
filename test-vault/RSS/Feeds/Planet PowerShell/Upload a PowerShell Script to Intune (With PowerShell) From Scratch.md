---
role: rssitem
author: Adam Bertram
published: 2024-05-22T20:13:52.000Z
link: https://adamtheautomator.com/intune-powershell-script-upload/
id: https://adamtheautomator.com/?p=26256
feed: "[[Planet PowerShell]]"
tags: [rss/IT_Ops,rss/PowerShell]
pinned: false
---

> [!abstract] Upload a PowerShell Script to Intune (With PowerShell) From Scratch by Adam Bertram - 2024-05-22T20:13:52.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Automate deploying PowerShell scripts to Intune devices with Azure app registration, Graph API, and more in this step-by-step tutorial.

🔗Read article [online](https://adamtheautomator.com/intune-powershell-script-upload/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Upload a PowerShell Script to Intune (With PowerShell) From Scratch]]

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
