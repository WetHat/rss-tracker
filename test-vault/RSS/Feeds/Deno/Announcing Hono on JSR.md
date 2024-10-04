---
role: rssitem
author: Andy Jiang
published: 2024-06-25T12:00:00.000Z
link: https://deno.com/blog/hono-on-jsr
id: https://deno.com/blog/hono-on-jsr
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] Announcing Hono on JSR by Andy Jiang - 2024-06-25T12:00:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Hono, a lightweight, fast, cross-platform web framework, is now on JSR.

🔗Read article [online](https://deno.com/blog/hono-on-jsr). For other items in this feed see [[Deno]].

- [ ] [[Announcing Hono on JSR]]

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
