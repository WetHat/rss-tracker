---
role: rssitem
author: Unknown
published: 2022-05-11T00:00:00.000Z
link: https://fettblog.eu/typescript-iterating-over-objects/
id: https://fettblog.eu/typescript-iterating-over-objects/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] TypeScript: Iterating over objects - 2022-05-11T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> There is rarely a head-scratcher in TypeScript as prominent as trying to access an object property via iterating through its keys. This is a pattern that’s so common in JavaScript, yet TypeScript seems to through all the obstacles at you. This simple line:

🔗Read article [online](https://fettblog.eu/typescript-iterating-over-objects/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[TypeScript꞉ Iterating over objects]]

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
There is rarely a head-scratcher in TypeScript as prominent as trying to access an object property via iterating through its keys. This is a pattern that’s so common in JavaScript, yet TypeScript seems to through all the obstacles at you. This simple line: