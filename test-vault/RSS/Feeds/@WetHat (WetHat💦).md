---
role: rssfeed
feedurl: https://localhost/test/@WetHat (WetHat💦)/feed.xml
site: https://fosstodon.org/@WetHat
itemlimit: 10
updated: 
status: "❌Saving 'Replied to꞉ @WetHat Newtonsoft,Json is not dead․ It's last release was 14 months⋯' of feed '@WetHat (WetHat💦) failed': File already exists."
tags: []
---
> [!abstract] @WetHat (WetHat💦)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] I enjoy programming computers.

[#fedi22](https://fosstodon.org/tags/fedi22) [#Mastodon](https://fosstodon.org/tags/Mastodon) [#Fediverse](https://fosstodon.org/tags/Fediverse) [#Programming](https://fosstodon.org/tags/Programming) [#OpenSource](https://fosstodon.org/tags/OpenSource) [#FOSS](https://fosstodon.org/tags/FOSS) [#MachineLearning](https://fosstodon.org/tags/MachineLearning) [#ArtificialIntelligence](https://fosstodon.org/tags/ArtificialIntelligence) [#AI](https://fosstodon.org/tags/AI) [#Python](https://fosstodon.org/tags/Python) [#Lisp](https://fosstodon.org/tags/Lisp) [#Dotnet](https://fosstodon.org/tags/Dotnet) [#JupyterNotebooks](https://fosstodon.org/tags/JupyterNotebooks) [#JupyterLab](https://fosstodon.org/tags/JupyterLab)

# Reading List 📑

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = true,
	items = dvjs.rssItemsOfFeed(dv.current());
await dvjs.rssReadingList(items,false,expand);
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = await dvjs.rssItemsOfFeed(dv.current()).where(i => i.pinned === true);
await dvjs.rssItemTable(items,expand);
~~~

# Read Feed Items ✅

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	expand = false,
	items = dvjs.rssItemsOfFeed(dv.current());
await dvjs.rssReadingList(items,true,expand);
~~~