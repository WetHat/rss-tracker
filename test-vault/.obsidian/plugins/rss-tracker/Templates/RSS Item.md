---
role: rssitem
author: {{author}}
published: {{publishDate}}
link: {{link}}
id: {{id}}
feed: "[[{{feedFileName}}]]"
tags: [{{tags}}]
pinned: false
---

> [!abstract] {{title}}
> <span class="rss-image">{{image}}</span> {{description}}

🔗Read article [online]({{link}}). For other items in this feed see [[{{feedFileName}}]].

- [ ] [[{{fileName}}]]

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
{{content}}