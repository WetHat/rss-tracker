---
role: rssitem
aliases:
  - "Refactoring in Rust: Introducing Traits"
id: https://fettblog.eu/refactoring-rust-introducing-traits/
author: unknown
link: https://fettblog.eu/refactoring-rust-introducing-traits/
published: 2023-03-02T00:00:00.000Z
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] Refactoring in Rust: Introducing Traits (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] In the same codebase as last time, we extract data from a HashMap called headers, presumably dealing with something similar to HTTP headers.

🌐 Read article [online](https://fettblog.eu/refactoring-rust-introducing-traits/). ⤴ For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[RSS/Feeds/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/Refactoring in Rust꞉ Introducing Traits|Refactoring in Rust꞉ Introducing Traits]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

In the same codebase as [last time](/refactoring-rust-abstraction-newtype/), we extract data from a `HashMap<String, String>` called `headers`, presumably dealing with something similar to HTTP headers.