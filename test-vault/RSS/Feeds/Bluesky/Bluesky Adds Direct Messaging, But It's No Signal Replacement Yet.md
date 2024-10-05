---
role: rssitem
author: "Rob Pegoraro"
published: 2024-05-23T21:22:41.000Z
link: https://www.pcmag.com/news/bluesky-adds-direct-messaging-but-its-no-signal-replacement-yet
id: flipboard-3e94yS2OQXu3tUSlwd2SQQ:a:221841707-1716499361
feed: "[[Bluesky]]"
tags: [rss/Bluesky,rss/Encryption,rss/Messaging,rss/Security,rss/Technology]
pinned: false
---

> [!abstract] Bluesky Adds Direct Messaging, But It's No Signal Replacement Yet by Rob Pegoraro - 2024-05-23T21:22:41.000Z
> <span class="rss-image">![image|400](https://ic-cdn.flipboard.com/pcmag.com/bb8a66a81ff990c2c3b72c2e4bba7d439a38b4e5/_xlarge.jpeg)</span>
> The decentralized platform checks off one of the most common feature requests from Twitter refugees, but it's a bare-bones experience for now. You now …

🔗Read article [online](https://www.pcmag.com/news/bluesky-adds-direct-messaging-but-its-no-signal-replacement-yet). For other items in this feed see [[Bluesky]].

- [ ] [[Bluesky Adds Direct Messaging, But It's No Signal Replacement Yet]]

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
