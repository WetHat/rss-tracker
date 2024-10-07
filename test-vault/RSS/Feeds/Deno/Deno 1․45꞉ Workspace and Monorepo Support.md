---
role: rssitem
author: "Bartek Iwańczuk, Nayeem Rahman, Nathan Whitaker, Yoshiya Hinosawa, Asher Gomez"
published: 2024-07-11T09:00:00.000Z
link: https://deno.com/blog/v1.45
id: https://deno.com/blog/v1.45
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] Deno 1.45: Workspace and Monorepo Support by Bartek Iwańczuk, Nayeem Rahman, Nathan Whitaker, Yoshiya Hinosawa, Asher Gomez - 2024-07-11T09:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Deno 1.45 introduces workspaces and monorepo support, improved Node.js compatibility, updates to `deno install`, the new `deno init --lib` command, deprecation of `deno vendor`, Standard Library stabilization, upgrades to V8 12.7 and TypeScript 5.5.2, and more.

🔗Read article [online](https://deno.com/blog/v1.45). For other items in this feed see [[Deno]].

- [ ] [[Deno 1․45꞉ Workspace and Monorepo Support]]

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
