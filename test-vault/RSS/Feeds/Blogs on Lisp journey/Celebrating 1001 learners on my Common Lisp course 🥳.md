---
role: rssitem
author: Unknown
published: 2024-02-14T16:05:44.000Z
link: https://localhost/blog/celebrating-1001-learners-on-my-common-lisp-course/
id: /blog/celebrating-1001-learners-on-my-common-lisp-course/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] Celebrating 1001 learners on my Common Lisp course 🥳 - 2024-02-14T16:05:44.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> I just got 1001 learners on my Common Lisp course on Udemy. Thanks everybody for your support, here or elsewhere! Starting with CL was honestly not easy. The first thing I did was writing the “data structures” page on the Cookbook, bewildered that it didn’t exist yet. A few years and a few projects later, this course allows me to share more, learn more, have fun, and have some rewards to keep the motivation up.

🔗Read article [online](https://localhost/blog/celebrating-1001-learners-on-my-common-lisp-course/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Celebrating 1001 learners on my Common Lisp course 🥳]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Additional RSS Items Referring to This Article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
