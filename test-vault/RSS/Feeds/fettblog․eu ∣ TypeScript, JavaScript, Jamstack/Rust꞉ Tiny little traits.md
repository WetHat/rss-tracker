---
role: rssitem
author: Unknown
published: 2022-04-15T00:00:00.000Z
link: https://fettblog.eu/rust-tiny-little-traits/
id: https://fettblog.eu/rust-tiny-little-traits/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] Rust: Tiny little traits - 2022-04-15T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Rust’s trait system has a feature that is often talked about, but which I don’t see used that often in application code: Implementing your traits for types that are not yours. You can see this a lot in the standard library, and also in some libraries (hello itertools), but I see developers shy away from doing that when writing applications. It’s so much fun and so useful, though!

🔗Read article [online](https://fettblog.eu/rust-tiny-little-traits/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[Rust꞉ Tiny little traits]]

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
Rust’s trait system has a feature that is often talked about, but which I don’t see used that often in application code: Implementing your traits for types that are not yours. You can see this a lot in the standard library, and also in some libraries (hello [`itertools`](https://docs.rs/itertools/latest/itertools/)), but I see developers shy away from doing that when writing applications. It’s so much fun and so useful, though!