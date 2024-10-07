---
role: rssitem
author: Unknown
published: 2024-04-30T14:36:46.000Z
link: https://typescript.tv/hands-on/what-are-generics-and-why-you-should-use-them/
id: https://typescript.tv/hands-on/what-are-generics-and-why-you-should-use-them/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] What are Generics and why you should use them? - 2024-04-30T14:36:46.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Generics in TypeScript help create reusable components that work with
>                 different data types while keeping type safety. They use placeholders for types,
>                 like in the example of managing animals in a zoo, making code adaptable and
>                 efficient.

🔗Read article [online](https://typescript.tv/hands-on/what-are-generics-and-why-you-should-use-them/). For other items in this feed see [[TypeScript TV]].

- [ ] [[What are Generics and why you should use them❓]]

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
