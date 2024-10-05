---
role: rssitem
author: "Andy Jiang"
published: 2024-06-18T14:15:00.000Z
link: https://deno.com/blog/guardian
id: https://deno.com/blog/guardian
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] How the Guardian uses Deno to audit accessibility and performance across their 2.7 million articles by Andy Jiang - 2024-06-18T14:15:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> The Guardian receives over 350 million unique page views. Learn how Deno helps the Guardian maximize web performance and adhere to accessibility standards to retain and grow their readership.

🔗Read article [online](https://deno.com/blog/guardian). For other items in this feed see [[Deno]].

- [ ] [[How the Guardian uses Deno to audit accessibility and performance across their 2⋯]]

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
