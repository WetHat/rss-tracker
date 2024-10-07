---
role: rssitem
author: Unknown
published: 2023-12-22T15:52:51.000Z
link: https://localhost/blog/latest-string-manipulation-functions/
id: /blog/latest-string-manipulation-functions/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] Latest string manipulation functions in the STR library - 2023-12-22T15:52:51.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> We just released cl-str v0.21. It&rsquo;s been a while since the last release, and many enhancements make it more useful than ever. Let&rsquo;s review the changes, the newest first.
> But first, I want to you thank everyone who contributed, by sending pull requests or feedback. Special thanks to @kilianmh who suddenly appeared one day, helped with new features as well as grunt work, and who is now a co-maintainer.

🔗Read article [online](https://localhost/blog/latest-string-manipulation-functions/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Latest string manipulation functions in the STR library]]

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
