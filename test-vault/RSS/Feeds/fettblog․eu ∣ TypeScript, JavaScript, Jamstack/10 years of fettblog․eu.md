---
role: rssitem
author: Unknown
published: 2022-04-27T00:00:00.000Z
link: https://fettblog.eu/10-years-of-fettblog/
id: https://fettblog.eu/10-years-of-fettblog/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] 10 years of fettblog.eu - 2022-04-27T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> I missed a little anniversary. Roughly 10 years ago (on April 8, 2012), I started blogging on fettblog.eu! Time flies! I think this is my longest-running project, let’s take some time to reflect.

🔗Read article [online](https://fettblog.eu/10-years-of-fettblog/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[10 years of fettblog․eu]]

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
I missed a little anniversary. Roughly 10 years ago (on April 8, 2012), I started blogging on [fettblog.eu](http://fettblog.eu)! Time flies! I think this is my longest-running project, let’s take some time to reflect.