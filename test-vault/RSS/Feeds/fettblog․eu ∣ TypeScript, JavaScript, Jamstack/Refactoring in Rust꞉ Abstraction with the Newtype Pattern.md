---
role: rssitem
author: Unknown
published: 2023-02-21T00:00:00.000Z
link: https://fettblog.eu/refactoring-rust-abstraction-newtype/
id: https://fettblog.eu/refactoring-rust-abstraction-newtype/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] Refactoring in Rust: Abstraction with the Newtype Pattern - 2023-02-21T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> The following piece of code takes a PathBuf and extracts the file name, eventually converting it to an owned String.

🔗Read article [online](https://fettblog.eu/refactoring-rust-abstraction-newtype/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[Refactoring in Rust꞉ Abstraction with the Newtype Pattern]]

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
The following piece of code takes a `PathBuf` and extracts the file name, eventually converting it to an _owned_ `String`.