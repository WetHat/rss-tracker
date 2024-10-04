---
role: rssitem
author: Yoshiya Hinosawa
published: 2024-06-10T16:00:00.000Z
link: https://deno.com/blog/stabilize-std
id: https://deno.com/blog/stabilize-std
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] The stabilization process of the Standard Library has begun by Yoshiya Hinosawa - 2024-06-10T16:00:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> The Deno Standard Library is going to reach 1.0.0 shortly. We hope you try RC versions of the packages and give us feedback!

🔗Read article [online](https://deno.com/blog/stabilize-std). For other items in this feed see [[Deno]].

- [ ] [[The stabilization process of the Standard Library has begun]]

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
