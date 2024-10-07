---
role: rssitem
author: Unknown
published: 2023-03-02T00:00:00.000Z
link: https://fettblog.eu/refactoring-rust-introducing-traits/
id: https://fettblog.eu/refactoring-rust-introducing-traits/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] Refactoring in Rust: Introducing Traits - 2023-03-02T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> In the same codebase as last time, we extract data from a HashMap called headers, presumably dealing with something similar to HTTP headers.

🔗Read article [online](https://fettblog.eu/refactoring-rust-introducing-traits/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[Refactoring in Rust꞉ Introducing Traits]]

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
In the same codebase as [last time](/refactoring-rust-abstraction-newtype/), we extract data from a `HashMap<String, String>` called `headers`, presumably dealing with something similar to HTTP headers.