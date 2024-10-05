---
role: rssitem
author: "info@thehackernews.com (The Hacker News)"
published: 2024-05-17T08:46:00.000Z
link: https://thehackernews.com/2024/05/kimsuky-apt-deploying-linux-backdoor.html
id: https://thehackernews.com/2024/05/kimsuky-apt-deploying-linux-backdoor.html
feed: "[[The Hacker News]]"
tags: []
pinned: false
---

> [!abstract] Kimsuky APT Deploying Linux Backdoor Gomir in South Korean Cyber Attacks by info@thehackernews.com (The Hacker News) - 2024-05-17T08:46:00.000Z
> <span class="rss-image">![image|400](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgKkkd9TlpBH69SJ2A5la8Bres_d4l53vzANAK7W2RVh3HJoJjX9PuIhhtiYhO5YlDnu8RuFrT8bAyj_0DwcjPB4tSIcLglj7N2PGus3G1cYnF29ytBkUvgf_DuGCsD5wc7c9NZ-Y5WoSifZzg5ZcNs2nbhRgepHlfcURgaVUvEu_6OQwZktjWfr-did40B/s1600/linux.png)</span>
> The Kimsuky (aka Springtail) advanced persistent threat (APT) group, which is linked to North Korea's Reconnaissance General Bureau (RGB), has been observed deploying a Linux version of its GoBear backdoor as part of a campaign targeting South Korean organizations. The backdoor, codenamed Gomir, is "structurally almost identical to GoBear, with extensive sharing of code between

🔗Read article [online](https://thehackernews.com/2024/05/kimsuky-apt-deploying-linux-backdoor.html). For other items in this feed see [[The Hacker News]].

- [ ] [[Kimsuky APT Deploying Linux Backdoor Gomir in South Korean Cyber Attacks]]

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
