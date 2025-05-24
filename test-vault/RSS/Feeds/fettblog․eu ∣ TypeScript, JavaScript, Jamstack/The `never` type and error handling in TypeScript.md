---
role: rssitem
aliases: []
id: https://fettblog.eu/typescript-never-and-error-handling/
author: unknown
link: https://fettblog.eu/typescript-never-and-error-handling/
published: 2024-03-05T00:00:00.000Z
feed: "[[RSS/Feeds/fettblog․eu ∣ TypeScript, JavaScript, Jamstack.md | fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] The `never` type and error handling in TypeScript (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] One thing that I see more often recently is that folks find out about the never type, and start using it more often, especially trying to model error handling. But more often than not, they don’t use it properly or overlook some fundamental features of never. This can lead to faulty code that might act up in production, so I want to clear doubts and misconceptions, and show you what you can really do with never.

🌐 Read article [online](https://fettblog.eu/typescript-never-and-error-handling/). ⤴ For other items in this feed see [[RSS/Feeds/fettblog․eu ∣ TypeScript, JavaScript, Jamstack.md | fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[RSS/Feeds/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/The `never` type and error handling in TypeScript|The `never` type and error handling in TypeScript]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

One thing that I see more often recently is that folks find out about the `never` type, and start using it more often, especially trying to model error handling. But more often than not, they don’t use it properly or overlook some fundamental features of `never`. This can lead to faulty code that might act up in production, so I want to clear doubts and misconceptions, and show you what you can really do with `never`.