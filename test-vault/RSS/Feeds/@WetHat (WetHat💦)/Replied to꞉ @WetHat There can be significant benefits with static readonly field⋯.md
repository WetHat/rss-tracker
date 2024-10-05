---
role: rssitem
author: "@WetHat"
published: 2024-05-13T16:15:50.000Z
link: https://fosstodon.org/@WetHat/112434672435437631
id: https://fosstodon.org/@WetHat/112434672435437631
feed: "[[@WetHat (WetHat💦)]]"
tags: []
pinned: false
---

> [!abstract] Replied to: @WetHat There can be significant benefits with static readonly fields, see https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo and https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding IIRC, the JIT will also optimize multiple loads of the same field better in some cases if it is readonly. by @WetHat - 2024-05-13T16:15:50.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> [@kvandermotten](https://mastodon.online/@kvandermotten) Excellent articles! Thanks for pointing that out!👍
> 
> - WetHat💦 (@WetHat) [May 13, 2024](https://fosstodon.org/@WetHat/112434672435437631)

🔗Read article [online](https://fosstodon.org/@WetHat/112434672435437631). For other items in this feed see [[@WetHat (WetHat💦)]].

- [ ] [[Replied to꞉ @WetHat There can be significant benefits with static readonly field⋯]]

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
