---
role: rssitem
author: Unknown
published: 2024-01-10T15:37:39.000Z
link: https://typescript.tv/hands-on/enumberable-vs-iterable-in-typescript-whats-the-difference/
id: https://typescript.tv/hands-on/enumberable-vs-iterable-in-typescript-whats-the-difference/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] Enumberable vs. Iterable in TypeScript: What's the Difference? - 2024-01-10T15:37:39.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> In TypeScript, "enumerable" and "iterable" are terms used to describe different aspects of data collections. Enumerable refers to an object's properties that can be counted or iterated over using a `for...in` loop. Iterable, on the other hand, refers to an object that can be traversed through its elements one by one using a `for...of` loop.

🔗Read article [online](https://typescript.tv/hands-on/enumberable-vs-iterable-in-typescript-whats-the-difference/). For other items in this feed see [[TypeScript TV]].

- [ ] [[Enumberable vs․ Iterable in TypeScript꞉ What's the Difference❓]]

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
