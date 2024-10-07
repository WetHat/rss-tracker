---
role: rssitem
author: "Yusuke Tanaka, Andy Jiang"
published: 2024-07-09T12:00:00.000Z
link: https://deno.com/blog/subhosting-kv-backup
id: https://deno.com/blog/subhosting-kv-backup
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] Introducing KV Backup for Deno Subhosting by Yusuke Tanaka, Andy Jiang - 2024-07-09T12:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> This new feature allows Subhosting users to configure their KV databases to back up data to their own S3-compatible object storage via APIs.

🔗Read article [online](https://deno.com/blog/subhosting-kv-backup). For other items in this feed see [[Deno]].

- [ ] [[Introducing KV Backup for Deno Subhosting]]

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
