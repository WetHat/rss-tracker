---
role: rssfeed
aliases: []
site: https://fosstodon.org/@WetHat
feedurl: https://localhost/test/@WetHat (WetHat💦)/feed.xml
itemlimit: 10
status: ✅
updated: 2025-05-24T17:13:43.542Z
interval: 5
tags: []
---

> [!abstract] @WetHat (WetHat💦)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] I enjoy programming computers.

[#rss/fedi22](https://fosstodon.org/tags/fedi22) [#rss/Mastodon](https://fosstodon.org/tags/Mastodon) [#rss/Fediverse](https://fosstodon.org/tags/Fediverse) [#rss/Programming](https://fosstodon.org/tags/Programming) [#rss/OpenSource](https://fosstodon.org/tags/OpenSource) [#rss/FOSS](https://fosstodon.org/tags/FOSS) [#rss/MachineLearning](https://fosstodon.org/tags/MachineLearning) [#rss/ArtificialIntelligence](https://fosstodon.org/tags/ArtificialIntelligence) [#rss/AI](https://fosstodon.org/tags/AI) [#rss/Python](https://fosstodon.org/tags/Python) [#rss/Lisp](https://fosstodon.org/tags/Lisp) [#rss/Dotnet](https://fosstodon.org/tags/Dotnet) [#rss/JupyterNotebooks](https://fosstodon.org/tags/JupyterNotebooks) [#rss/JupyterLab](https://fosstodon.org/tags/JupyterLab)

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