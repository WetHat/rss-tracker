---
role: rssitem
author: "Bert Belder"
published: 2024-05-17T15:30:00.000Z
link: https://deno.com/blog/build-secure-performant-cloud-platform
id: https://deno.com/blog/build-secure-performant-cloud-platform
feed: "[[Deno]]"
tags: []
pinned: false
---

> [!abstract] How we built a secure, performant, multi-tenant cloud platform to run untrusted code by Bert Belder - 2024-05-17T15:30:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> When building a modern cloud platform to securely run untrusted code, it can be difficult to balance cost and performance. Here’s how we built Deno Deploy and Deno Subhosting.

🔗Read article [online](https://deno.com/blog/build-secure-performant-cloud-platform). For other items in this feed see [[Deno]].

- [ ] [[How we built a secure, performant, multi-tenant cloud platform to run untrusted⋯]]

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
