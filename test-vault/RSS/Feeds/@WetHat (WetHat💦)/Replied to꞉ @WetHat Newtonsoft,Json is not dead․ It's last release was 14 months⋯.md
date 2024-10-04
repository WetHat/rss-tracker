---
role: rssitem
author: "@WetHat"
published: 2024-05-13T13:43:29.000Z
link: https://fosstodon.org/@WetHat/112434073371395011
id: https://fosstodon.org/@WetHat/112434073371395011
feed: "[[@WetHat (WetHat💦)]]"
tags: []
pinned: false
---

> [!abstract] Replied to: @WetHat Newtonsoft,Json is not dead. It's last release was 14 months ago & the repo has commits in the last month. There is such a thing as stable code that doesn't need constant releases every 5 minutes. by @WetHat - 2024-05-13T13:43:29.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> [@irongut](https://mastodon.scot/@irongut) I did ask some fellow hackers why they would consider [https://github.com/JamesNK/Newtonsoft.Json](https://github.com/JamesNK/Newtonsoft.Json) dead.
> 
> Arguments for 'dead':  
> ➡️ ~700 open issues  
> ➡️~70 open pull requests (oldest being 1 year old)
> 
> Arguments against 'dead':  
> ➡️Reasonably stable and popular (~10k start)  
> ➡️A few commits per year (1 this year; 4 last year)
> 
> I'v updated the post and removed 'and dead', because I'd use this library anytime⋯

🔗Read article [online](https://fosstodon.org/@WetHat/112434073371395011). For other items in this feed see [[@WetHat (WetHat💦)]].

- [ ] [[Replied to꞉ @WetHat Newtonsoft,Json is not dead․ It's last release was 14 months⋯]]

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
[@irongut](https://mastodon.scot/@irongut) I did ask some fellow hackers why they would consider [https://github.com/JamesNK/Newtonsoft.Json](https://github.com/JamesNK/Newtonsoft.Json) dead.

Arguments for 'dead':  
➡️ ~700 open issues  
➡️~70 open pull requests (oldest being 1 year old)

Arguments against 'dead':  
➡️Reasonably stable and popular (~10k start)  
➡️A few commits per year (1 this year; 4 last year)

I'v updated the post and removed 'and dead', because I'd use this library anytime.

- WetHat💦 (@WetHat) [May 13, 2024](https://fosstodon.org/@WetHat/112434073371395011)