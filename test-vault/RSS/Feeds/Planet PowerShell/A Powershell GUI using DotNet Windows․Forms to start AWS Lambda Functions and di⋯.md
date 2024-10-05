---
role: rssitem
author: "Matthew Dowst"
published: 2024-05-24T12:24:44.000Z
link: https://gist.github.com/aeveltstra/94806a1230b8165f43e9b4e4dec9bacc
id: https://psweekly.dowst.dev/?post_type=link_library_links&p=6894
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] A Powershell GUI using DotNet Windows.Forms to start AWS Lambda Functions and display their output by Matthew Dowst - 2024-05-24T12:24:44.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> A Powershell GUI using DotNet Windows.Forms to start AWS Lambda Functions and display their output -
> 
> powershell-gui-aws-lambda-start-functions.ps1
> 
> (+)(-)

🔗Read article [online](https://gist.github.com/aeveltstra/94806a1230b8165f43e9b4e4dec9bacc). For other items in this feed see [[Planet PowerShell]].

- [ ] [[A Powershell GUI using DotNet Windows․Forms to start AWS Lambda Functions and di⋯]]

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
A Powershell GUI using DotNet Windows.Forms to start AWS Lambda Functions and display their output -

powershell-gui-aws-lambda-start-functions.ps1

(+)(-)