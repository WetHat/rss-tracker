---
role: rssitem
author: Unknown
published: 2023-06-01T17:03:35.000Z
link: https://localhost/blog/nodgui-now-has-a-nice-looking-theme-by-default/
id: /blog/nodgui-now-has-a-nice-looking-theme-by-default/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] Pretty GUIs now: nodgui comes with a pre-installed nice looking theme - 2023-06-01T17:03:35.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Being able to load a custom theme is great, but it would be even better if we didn’t have to manually install one. Well, recent changes in nodgui from yesterday and today just dramatically improved the GUI situation for Common Lisp［0］. nodgui now ships the yaru theme @cage commited the Yaru theme from ttkthemes in nodgui’s repository, and we added QoL improvements. To use it, now you can simply do:

🔗Read article [online](https://localhost/blog/nodgui-now-has-a-nice-looking-theme-by-default/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Pretty GUIs now꞉ nodgui comes with a pre-installed nice looking theme]]

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
