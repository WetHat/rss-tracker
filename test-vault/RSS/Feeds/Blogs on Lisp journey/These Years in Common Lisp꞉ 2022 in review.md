---
role: rssitem
author: Unknown
published: 2023-01-09T18:54:29.000Z
link: https://localhost/blog/these-years-in-common-lisp-2022-in-review/
id: /blog/these-years-in-common-lisp-2022-in-review/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] These Years in Common Lisp: 2022 in review - 2023-01-09T18:54:29.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> And 2022 is over. The Common Lisp language and environment are solid and stable, yet evolve. Implementations, go-to libraries, best practices, communities evolve. We don&rsquo;t need a &ldquo;State of the Ecosystem&rdquo; every two weeks but still, what happened and what did you miss in 2022?
> This is my pick of the most exciting, fascinating, interesting or just cool projects, tools, libraries and articles that popped-up during that time (with a few exceptions that appeared in late 2021).

🔗Read article [online](https://localhost/blog/these-years-in-common-lisp-2022-in-review/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[These Years in Common Lisp꞉ 2022 in review]]

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
