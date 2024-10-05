---
role: rssitem
author: "Yusuke Tanaka, Andy Jiang"
published: 2024-06-14T12:00:00.000Z
link: https://deno.com/blog/subhosting-flexible-domain-association
id: https://deno.com/blog/subhosting-flexible-domain-association
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] Introducing More Flexible Domain Association for Deno Subhosting by Yusuke Tanaka, Andy Jiang - 2024-06-14T12:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> This new update simplifies programmatically managing custom domains, wildcard domains, subdomains for different deployments, and more.

🔗Read article [online](https://deno.com/blog/subhosting-flexible-domain-association). For other items in this feed see [[Deno]].

- [ ] [[Introducing More Flexible Domain Association for Deno Subhosting]]

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
