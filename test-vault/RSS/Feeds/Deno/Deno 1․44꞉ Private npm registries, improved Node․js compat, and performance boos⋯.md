---
role: rssitem
author: "Bartek Iwańczuk, Marvin Hagemeister, Ryan Dahl"
published: 2024-05-30T09:00:00.000Z
link: https://deno.com/blog/v1.44
id: https://deno.com/blog/v1.44
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] Deno 1.44: Private npm registries, improved Node.js compat, and performance boosts by Bartek Iwańczuk, Marvin Hagemeister, Ryan Dahl - 2024-05-30T09:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Deno 1.44 adds support for private npm registries, gRPC connections, improved Node.js compat with initial Next.js support, and significant performance improvements.

🔗Read article [online](https://deno.com/blog/v1.44). For other items in this feed see [[Deno]].

- [ ] [[Deno 1․44꞉ Private npm registries, improved Node․js compat, and performance boos⋯]]

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
