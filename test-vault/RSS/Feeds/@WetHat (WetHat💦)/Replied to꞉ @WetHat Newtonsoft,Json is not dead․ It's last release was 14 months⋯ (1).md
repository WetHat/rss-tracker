---
role: rssitem
author: "@WetHat"
published: 2024-05-13T12:22:02.000Z
link: https://fosstodon.org/@WetHat/112433753157520180
id: https://fosstodon.org/@WetHat/112433753157520180
feed: "[[@WetHat (WetHat💦)]]"
tags: []
pinned: false
---

> [!abstract] Replied to: @WetHat Newtonsoft,Json is not dead. It's last release was 14 months ago & the repo has commits in the last month. There is such a thing as stable code that doesn't need constant releases every 5 minutes. by @WetHat - 2024-05-13T12:22:02.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> [@irongut](https://mastodon.scot/@irongut) You are right! Newtonsoft,Json is still with us!
> 
> - WetHat💦 (@WetHat) [May 13, 2024](https://fosstodon.org/@WetHat/112433753157520180)

🔗Read article [online](https://fosstodon.org/@WetHat/112433753157520180). For other items in this feed see [[@WetHat (WetHat💦)]].

- [ ] [[Replied to꞉ @WetHat Newtonsoft,Json is not dead․ It's last release was 14 months⋯ (1)]]

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
