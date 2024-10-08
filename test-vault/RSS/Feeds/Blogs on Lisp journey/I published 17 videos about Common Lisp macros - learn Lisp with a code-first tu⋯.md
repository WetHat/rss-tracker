---
role: rssitem
author: Unknown
published: 2023-09-15T15:07:23.000Z
link: https://localhost/blog/17-new-videos-on-common-lisp-macros/
id: /blog/17-new-videos-on-common-lisp-macros/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] I published 17 videos about Common Lisp macros - learn Lisp with a code-first tutorial 🎥 ⭐ - 2023-09-15T15:07:23.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> For those who don’t know and who didn’t see the banner :D I am creating a Common Lisp course on the Udemy platform (with complementary videos on Youtube). I wanted to do something different and complementary than writing on the Cookbook. I worked on new videos this summer and I just finished editing the subtitles. I have added 17 videos (worth 1h30+ of code-driven content) about Common Lisp macros!

🔗Read article [online](https://localhost/blog/17-new-videos-on-common-lisp-macros/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[I published 17 videos about Common Lisp macros - learn Lisp with a code-first tu⋯]]

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
