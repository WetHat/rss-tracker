---
role: rssitem
author: Unknown
published: 2022-11-07T00:00:00.000Z
link: https://fettblog.eu/announcing-the-typescript-cookbook/
id: https://fettblog.eu/announcing-the-typescript-cookbook/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] Announcing the TypeScript Cookbook - 2022-11-07T00:00:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Oops, I did it again! I’m writing another book, and it’s again about TypeScript. I’m happy to announce The TypeScript Cookbook, to be published in 2023 by O’Reilly. You can check it out in Early Release on the O’Reilly website.

🔗Read article [online](https://fettblog.eu/announcing-the-typescript-cookbook/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[Announcing the TypeScript Cookbook]]

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
Oops, I did it again! I’m writing another book, and it’s again about TypeScript. I’m happy to announce _The TypeScript Cookbook_, to be published in 2023 by O’Reilly. You can check it out in Early Release on the [O’Reilly website](https://www.oreilly.com/library/view/typescript-cookbook/9781098136642/).