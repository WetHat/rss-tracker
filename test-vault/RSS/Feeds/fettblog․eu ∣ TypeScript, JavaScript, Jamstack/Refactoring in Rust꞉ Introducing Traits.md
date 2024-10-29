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
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] In the same codebase as last time, we extract data from a HashMap called headers, presumably dealing with something similar to HTTP headers.

🌐 Read article [online](https://fettblog.eu/refactoring-rust-introducing-traits/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[Refactoring in Rust꞉ Introducing Traits]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
In the same codebase as [last time](/refactoring-rust-abstraction-newtype/), we extract data from a `HashMap<String, String>` called `headers`, presumably dealing with something similar to HTTP headers.