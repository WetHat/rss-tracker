---
role: rssitem
author: "@WetHat"
published: 2024-05-13T16:13:42.000Z
link: https://mastodon.online/@kvandermotten/112434653881037869
id: https://mastodon.online/@kvandermotten/112434653881037869
feed: "[[@WetHat (WetHat💦)]]"
tags: []
pinned: false
---

> [!abstract] Boosted: @WetHat There can be significant benefits with static readonly fields, see https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo and https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding IIRC, the JIT will also optimize multiple loads of the same field better in some cases if it is readonly. by @WetHat - 2024-05-13T16:13:42.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> [@WetHat](https://fosstodon.org/@WetHat)  
> There can be significant benefits with static readonly fields, see [https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo) and [https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding)  
> IIRC⋯

🔗Read article [online](https://mastodon.online/@kvandermotten/112434653881037869). For other items in this feed see [[@WetHat (WetHat💦)]].

- [ ] [[Boosted꞉ @WetHat There can be significant benefits with static readonly fields,⋯]]

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
[@WetHat](https://fosstodon.org/@WetHat)  
There can be significant benefits with static readonly fields, see [https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo) and [https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding)  
IIRC, the JIT will also optimize multiple loads of the same field better in some cases if it is readonly.

- Kris Vandermotten (@kvandermotten) [May 13, 2024](https://mastodon.online/@kvandermotten/112434653881037869)