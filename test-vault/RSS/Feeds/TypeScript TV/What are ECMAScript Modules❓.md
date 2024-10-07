---
role: rssitem
author: Unknown
published: 2023-11-09T17:07:20.000Z
link: https://typescript.tv/new-features/what-are-ecmascript-modules/
id: https://typescript.tv/new-features/what-are-ecmascript-modules/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] What are ECMAScript Modules? - 2023-11-09T17:07:20.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> ECMAScript Modules (ESM) enable the importing and exporting of code and are
>                 supported in modern web browsers, Deno, Bun, and Node.js. It's recommended to
>                 use ESM as major frameworks are already embracing it. Let this tutorial guide you
>                 through the process.

🔗Read article [online](https://typescript.tv/new-features/what-are-ecmascript-modules/). For other items in this feed see [[TypeScript TV]].

- [ ] [[What are ECMAScript Modules❓]]

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
