---
role: rssitem
author: Unknown
published: 2024-04-24T14:30:52.000Z
link: https://typescript.tv/hands-on/module-openai-has-no-exported-member/
id: https://typescript.tv/hands-on/module-openai-has-no-exported-member/
feed: "[[TypeScript TV]]"
tags: []
pinned: false
---

> [!abstract] Module openai has no exported member - 2024-04-24T14:30:52.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> OpenAI's Node.js API Library has updated from Version 3 to Version 4. Changes include updating imports adjusting method calls.

🔗Read article [online](https://typescript.tv/hands-on/module-openai-has-no-exported-member/). For other items in this feed see [[TypeScript TV]].

- [ ] [[Module openai has no exported member]]

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
