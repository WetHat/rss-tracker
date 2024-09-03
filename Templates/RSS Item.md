---
role: rssitem
author: "{{author}}"
published: {{publishDate}}
link: {{link}}
id: {{id}}
feed: "[[{{feedFileName}}]]"
tags: [{{tags}}]
pinned: false
---

> [!abstract] {{title}}
> {{image}}
> {{description}}

🔗Read article [online]({{link}}). For other items in this feed see [[{{feedFileName}}]].

- [ ] [[{{fileName}}]]

~~~dataviewjs
 const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(dv.current());
if (tasks.length > 0) {
	dv.header(1,"⚠ Found Items in Other Feeds also Referring to This Article");
    dv.taskList(tasks,false);
}
~~~

- - -
{{content}}