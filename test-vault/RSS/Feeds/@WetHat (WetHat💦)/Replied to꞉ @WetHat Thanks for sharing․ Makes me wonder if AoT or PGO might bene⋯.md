---
role: rssitem
author: "@WetHat"
published: 2024-05-13T13:50:59.000Z
link: https://fosstodon.org/@WetHat/112434102899083500
id: https://fosstodon.org/@WetHat/112434102899083500
feed: "[[@WetHat (WetHat💦)]]"
tags: []
pinned: false
---

> [!abstract] Replied to: @WetHat Thanks for sharing. Makes me wonder if AoT or PGO might benefit from it. Probably also no. by @WetHat - 2024-05-13T13:50:59.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> [@blaue_Fledermaus](https://mstdn.io/@blaue_Fledermaus) I do see some possibility that readonly would allow AoT (Ahead of Time compilation) or PGO (Profile-Guided Optimization) to choose a memory layout better suited for the computing pipeline. However. I'm not aware of any measurements in this direction. And I would agree that the advantage is probably small.
> 
> - WetHat💦 (@WetHat) [May 13, 2024](https://fosstodon.org/@WetHat/112434102899083500)

🔗Read article [online](https://fosstodon.org/@WetHat/112434102899083500). For other items in this feed see [[@WetHat (WetHat💦)]].

- [ ] [[Replied to꞉ @WetHat Thanks for sharing․ Makes me wonder if AoT or PGO might bene⋯]]

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
