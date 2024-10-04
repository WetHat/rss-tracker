---
role: rssitem
author: Unknown
published: 2024-05-20T16:18:33.000Z
link: https://typescript.tv/hands-on/save-memory-with-typescript-generators/
id: https://typescript.tv/hands-on/save-memory-with-typescript-generators/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] Save memory with TypeScript generators! - 2024-05-20T16:18:33.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Memory usage is a crucial metric when developing applications in TypeScript. It's frequently ignored until the "JavaScript heap out of memory" error appears. This error commonly occurs when loading large datasets in an application. In this tutorial, we will learn how to load big datasets and iterate over them while minimizing our memory usage.

🔗Read article [online](https://typescript.tv/hands-on/save-memory-with-typescript-generators/). For other items in this feed see [[TypeScript TV]].

- [ ] [[Save memory with TypeScript generators!]]

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
