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
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] The following piece of code takes a PathBuf and extracts the file name, eventually converting it to an owned String.

🌐 Read article [online](https://fettblog.eu/refactoring-rust-abstraction-newtype/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[Refactoring in Rust꞉ Abstraction with the Newtype Pattern]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
The following piece of code takes a `PathBuf` and extracts the file name, eventually converting it to an _owned_ `String`.