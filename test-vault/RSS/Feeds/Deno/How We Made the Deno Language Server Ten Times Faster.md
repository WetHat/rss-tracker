---
role: rssitem
author: "Andy Jiang, Nathan Whitaker"
published: 2024-06-20T20:00:00.000Z
link: https://deno.com/blog/optimizing-our-lsp
id: https://deno.com/blog/optimizing-our-lsp
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] How We Made the Deno Language Server Ten Times Faster by Andy Jiang, Nathan Whitaker - 2024-06-20T20:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> When a customer reported performance issues with the Deno language server, we began a performance investigation that resulted in reducing auto-completion times from 6-8 seconds to under one second in large codebases. This is how we did it.

🔗Read article [online](https://deno.com/blog/optimizing-our-lsp). For other items in this feed see [[Deno]].

- [ ] [[How We Made the Deno Language Server Ten Times Faster]]

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
