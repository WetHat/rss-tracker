---
role: rssitem
author: Unknown
published: 2023-04-19T09:44:56.000Z
link: https://localhost/blog/how-to-parse-command-line-arguments-in-common-lisp/
id: /blog/how-to-parse-command-line-arguments-in-common-lisp/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] How to parse command line arguments in Common Lisp (bis) - 2023-04-19T09:44:56.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> In 2018, I wrote a blog post and the Cookbook page on how to build Common Lisp binaries, and how to parse command-line arguments with the unix-opts library. But since then, new libraries were created an they are pretty good! They are simpler to use, and have much more features. I had a good experience with Clingon: its usage is clear, its documentation is very good, it is very flexible (it has hooks and generic functions waiting to have an :around method) and @dnaeon is not at his first great CL⋯

🔗Read article [online](https://localhost/blog/how-to-parse-command-line-arguments-in-common-lisp/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[How to parse command line arguments in Common Lisp (bis)]]

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
In 2018, I wrote a blog post and the Cookbook page on how to build Common Lisp binaries, and how to parse command-line arguments with the unix-opts library. But since then, new libraries were created an they are pretty good! They are simpler to use, and have much more features. I had a good experience with Clingon: its usage is clear, its documentation is very good, it is very flexible (it has hooks and generic functions waiting to have an :around method) and @dnaeon is not at his first great CL project.