---
role: rssitem
author: Unknown
published: 2022-05-09T00:00:00.000Z
link: https://fettblog.eu/the-road-to-universal-javascript/
id: https://fettblog.eu/the-road-to-universal-javascript/
feed: "[[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]]"
tags: []
pinned: false
---

> [!abstract] The road to universal JavaScript - 2022-05-09T00:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Universal JavaScript. JavaScript that works in every environment. JavaScript that runs on both the client and the server, something thinking about for years (see 1, 2). Where are we now?

🔗Read article [online](https://fettblog.eu/the-road-to-universal-javascript/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[The road to universal JavaScript]]

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
Universal JavaScript. JavaScript that works in every environment. JavaScript that runs on both the client and the server, something thinking about for years (see [1](https://medium.com/@mjackson/universal-javascript-4761051b7ae9), [2](https://medium.com/airbnb-engineering/isomorphic-javascript-the-future-of-web-apps-10882b7a2ebc)). Where are we now?