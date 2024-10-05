---
role: rssitem
author: Unknown
published: 2023-07-17T00:00:00.000Z
link: https://fettblog.eu/5-truths-about-typescript/
id: https://fettblog.eu/5-truths-about-typescript/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] 5 Inconvenient Truths about TypeScript - 2023-07-17T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> I’m writing books about TypeScript and I do workshops and trainings online and in-house. Every time I meet a new group of developers there are some TypeScript facts that they need to be confronted with:

🔗Read article [online](https://fettblog.eu/5-truths-about-typescript/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[5 Inconvenient Truths about TypeScript]]

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
I’m writing books about TypeScript and I do workshops and trainings online and in-house. Every time I meet a new group of developers there are some TypeScript facts that they need to be confronted with: