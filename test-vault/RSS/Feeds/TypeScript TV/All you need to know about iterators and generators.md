---
role: rssitem
author: Unknown
published: 2024-05-23T11:18:50.000Z
link: https://typescript.tv/hands-on/all-you-need-to-know-about-iterators-and-generators/
id: https://typescript.tv/hands-on/all-you-need-to-know-about-iterators-and-generators/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] All you need to know about iterators and generators - 2024-05-23T11:18:50.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Learn about iterators and generators in TypeScript. Understand how to use
>                 for-of loops, iterator protocol, iterable protocol, and async generators. See
>                 examples and practical applications.

🔗Read article [online](https://typescript.tv/hands-on/all-you-need-to-know-about-iterators-and-generators/). For other items in this feed see [[TypeScript TV]].

- [ ] [[All you need to know about iterators and generators]]

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
