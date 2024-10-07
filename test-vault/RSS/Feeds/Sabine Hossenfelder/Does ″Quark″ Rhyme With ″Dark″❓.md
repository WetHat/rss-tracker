---
role: rssitem
author: "Sabine Hossenfelder"
published: 2024-05-13T15:00:35.000Z
link: https://www.youtube.com/watch?v=_U3oIWQJqH0
id: yt:video:_U3oIWQJqH0
feed: "[[Sabine Hossenfelder]]"
tags: []
pinned: false
---

> [!abstract] Does "Quark" Rhyme With "Dark"? by Sabine Hossenfelder - 2024-05-13T15:00:35.000Z
> <span class="rss-image">![image|400](https://i4.ytimg.com/vi/_U3oIWQJqH0/hqdefault.jpg)</span> 💌 Support me on Donorbox ➜ https://donorbox.org/swtg 👉 Support me on Patreon ➜ https://www.patreon.com/Sabine 📩 Free weekly science newsletter ➜ https://sabinehossenfelder.com/newsletter/

🔗Read article [online](https://www.youtube.com/watch?v=_U3oIWQJqH0). For other items in this feed see [[Sabine Hossenfelder]].

- [ ] [[Does ″Quark″ Rhyme With ″Dark″❓]]

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
