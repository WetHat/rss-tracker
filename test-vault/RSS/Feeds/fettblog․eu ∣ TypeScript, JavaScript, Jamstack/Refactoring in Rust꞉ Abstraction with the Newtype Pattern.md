---
role: rssitem
aliases:
  - "Refactoring in Rust: Abstraction with the Newtype Pattern"
id: https://fettblog.eu/refactoring-rust-abstraction-newtype/
author: unknown
link: https://fettblog.eu/refactoring-rust-abstraction-newtype/
published: 2023-02-21T00:00:00.000Z
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
pinned: false
tags: []
---

> [!abstract] Refactoring in Rust: Abstraction with the Newtype Pattern (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] The following piece of code takes a PathBuf and extracts the file name, eventually converting it to an owned String.

🌐 Read article [online](https://fettblog.eu/refactoring-rust-abstraction-newtype/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[RSS/Feeds/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/Refactoring in Rust꞉ Abstraction with the Newtype Pattern|Refactoring in Rust꞉ Abstraction with the Newtype Pattern]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

The following piece of code takes a `PathBuf` and extracts the file name, eventually converting it to an _owned_ `String`.