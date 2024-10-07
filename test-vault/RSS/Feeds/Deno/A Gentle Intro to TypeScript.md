---
role: rssitem
author: "Jo Franchetti"
published: 2024-06-27T12:00:00.000Z
link: https://deno.com/blog/deno-bites-ts-intro
id: https://deno.com/blog/deno-bites-ts-intro
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] A Gentle Intro to TypeScript by Jo Franchetti - 2024-06-27T12:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Quick, digestible bites of TypeScript goodness for Deno developers. In this first bite, we introduce TypeScript, how to add type annotations to your code and why you should.

🔗Read article [online](https://deno.com/blog/deno-bites-ts-intro). For other items in this feed see [[Deno]].

- [ ] [[A Gentle Intro to TypeScript]]

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
