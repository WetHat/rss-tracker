---
role: rssitem
author: "@WetHat"
published: 2024-05-14T07:34:27.000Z
link: https://fosstodon.org/@WetHat/112438284637950197
id: https://fosstodon.org/@WetHat/112438284637950197
feed: "[[@WetHat (WetHat💦)]]"
tags: []
pinned: false
---

> [!abstract] Replied to: @WetHat I recall several stack overflow libraries had compiler switches so they compiled with readonly in development and not readonly in production builds because the compiler added extra checks to the output and it slowed down hot paths. Not sure if this is still the case. Readonly is certainly important for development at the absolute minimum since it makes several classes of bugs effectively impossible. by @WetHat - 2024-05-14T07:34:27.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> [@cambirch](https://infosec.exchange/@cambirch)
> 
> I remeber these articles too. Hwever, I did not pay much attention because readonly field optimization was the least of my problems at that time.😉
> 
> Apparently, there is an advantage with **static readonly** in [#rss/dotnet](https://fosstodon.org/tags/dotnet) profile guided optimization ([#rss/PGO](https://fosstodon.org/tags/PGO)) according to:  
> ➡️[https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo](https://d⋯

🔗Read article [online](https://fosstodon.org/@WetHat/112438284637950197). For other items in this feed see [[@WetHat (WetHat💦)]].

- [ ] [[Replied to꞉ @WetHat I recall several stack overflow libraries had compiler switc⋯]]

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
[@cambirch](https://infosec.exchange/@cambirch)

I remeber these articles too. Hwever, I did not pay much attention because readonly field optimization was the least of my problems at that time.😉

Apparently, there is an advantage with **static readonly** in [#rss/dotnet](https://fosstodon.org/tags/dotnet) profile guided optimization ([#rss/PGO](https://fosstodon.org/tags/PGO)) according to:  
➡️[https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#tiering-and-dynamic-pgo)  
➡️[https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding](https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8/#constant-folding)

[@kvandermotten](https://mastodon.online/@kvandermotten) found these in a devblog article about performance Improvements in .NET 8

- WetHat💦 (@WetHat) [May 14, 2024](https://fosstodon.org/@WetHat/112438284637950197)