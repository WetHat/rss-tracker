---
role: rssitem
author: Unknown
published: 2022-01-31T00:00:00.000Z
link: https://fettblog.eu/slides/the-typescript-converging-point/
id: https://fettblog.eu/slides/the-typescript-converging-point/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] The TypeScript converging point - 2022-01-31T00:00:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Usually, when doing TypeScript talks, I just open up a code editor and hack away some cool types that help in a certain scenario. This time, I was asked to do the same thing but within a 20-minute time limit. This has been super tough, so I scripted the entire thing and resorted to slides that have certain progress. Fewer chances for me to screw up! This allows me to give you not only the slides but also a write-up of this talk. I’ll give myself a bit of freedom and flesh it out where appropriat⋯

🔗Read article [online](https://fettblog.eu/slides/the-typescript-converging-point/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[The TypeScript converging point]]

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
Usually, when doing TypeScript talks, I just open up a code editor and hack away some cool types that help in a certain scenario. This time, I was asked to do the same thing but within a 20-minute time limit. This has been super tough, so I scripted the entire thing and resorted to slides that have certain progress. Fewer chances for me to screw up! This allows me to give you not only the slides but also a write-up of this talk. I’ll give myself a bit of freedom and flesh it out where appropriate. Enjoy!