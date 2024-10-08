---
role: rssitem
author: Unknown
published: 2023-12-06T14:22:05.000Z
link: https://typescript.tv/best-practices/filtering-arrays-in-typescript-with-correct-types/
id: https://typescript.tv/best-practices/filtering-arrays-in-typescript-with-correct-types/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] Filtering arrays in TypeScript with correct types - 2023-12-06T14:22:05.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> This article explains how to filter arrays in TypeScript while maintaining correct types. It demonstrates how to create a type guard to ensure that the filtered array only contains the desired type. It also discusses the downsides of type guards and compares them to assertion functions.

🔗Read article [online](https://typescript.tv/best-practices/filtering-arrays-in-typescript-with-correct-types/). For other items in this feed see [[TypeScript TV]].

- [ ] [[Filtering arrays in TypeScript with correct types]]

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
