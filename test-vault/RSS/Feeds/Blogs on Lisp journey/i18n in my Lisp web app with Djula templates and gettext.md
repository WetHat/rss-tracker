---
role: rssitem
author: Unknown
published: 2023-05-08T12:01:34.000Z
link: https://localhost/blog/i18n-in-my-lisp-web-app-with-djula-templates-and-gettext/
id: /blog/i18n-in-my-lisp-web-app-with-djula-templates-and-gettext/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] i18n in my Lisp web app with Djula templates and gettext - 2023-05-08T12:01:34.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> I finally added translations to my Lisp web app \o/ I wanted to do it with gettext and Djula templates. There seemed to be some support for this, but it turned out… not straightforward. After two failed attempts, I decided to offer a little 90 USD bounty for the task (I announced it on the project’s issues and on Discord, watch them out for future bounties ;) ). @fstamour took the challenge and is the person I’ll be eternally grateful for :D He kindly set up everything, answered my questions and⋯

🔗Read article [online](https://localhost/blog/i18n-in-my-lisp-web-app-with-djula-templates-and-gettext/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[i18n in my Lisp web app with Djula templates and gettext]]

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
I finally added translations to my Lisp web app \o/ I wanted to do it with gettext and Djula templates. There seemed to be some support for this, but it turned out… not straightforward. After two failed attempts, I decided to offer a little 90 USD bounty for the task (I announced it on the project’s issues and on Discord, watch them out for future bounties ;) ). @fstamour took the challenge and is the person I’ll be eternally grateful for :D He kindly set up everything, answered my questions and traced down annoying bugs.