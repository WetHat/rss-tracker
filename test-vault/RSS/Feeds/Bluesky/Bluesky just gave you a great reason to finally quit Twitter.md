---
role: rssitem
author: "By Carrie Marshall"
published: 2024-05-23T11:00:53.000Z
link: https://www.t3.com/news/bluesky-just-gave-you-a-great-reason-to-finally-quit-twitter
id: flipboard-vHcnStzORJigtFrI7LAFHA:a:2571318764-1716462053
feed: "[[Bluesky]]"
tags: [rss/Apps,rss/Bluesky,rss/Technology,rss/ThreadsApp,rss/Twitter_Blue]
pinned: false
---

> [!abstract] Bluesky just gave you a great reason to finally quit Twitter by By Carrie Marshall - 2024-05-23T11:00:53.000Z
> <span class="rss-image">![image|400](https://cdn.mos.cms.futurecdn.net/CcY75ZjGLzBZdVdfGxbdR3-1200-80.jpg)</span> Since Elon Musk took over Twitter there's been no shortage of supposed Twitter killers, but so far the renamed X.com remains very much un-dead. And a …

🔗Read article [online](https://www.t3.com/news/bluesky-just-gave-you-a-great-reason-to-finally-quit-twitter). For other items in this feed see [[Bluesky]].

- [ ] [[Bluesky just gave you a great reason to finally quit Twitter]]

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
