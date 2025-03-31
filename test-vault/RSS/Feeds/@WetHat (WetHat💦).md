---
role: rssfeed
feedurl: https://localhost/test/@WetHat (WetHat💦)/feed.xml
site: https://fosstodon.org/@WetHat
itemlimit: 10
updated: 2025-03-31T14:39:40.644Z
status: ✅
tags: []
interval: 5
---
> [!abstract] @WetHat (WetHat💦)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] I enjoy programming computers.

[#rss/fedi22](https://fosstodon.org/tags/fedi22) [#rss/Mastodon](https://fosstodon.org/tags/Mastodon) [#rss/Fediverse](https://fosstodon.org/tags/Fediverse) [#rss/Programming](https://fosstodon.org/tags/Programming) [#rss/OpenSource](https://fosstodon.org/tags/OpenSource) [#rss/FOSS](https://fosstodon.org/tags/FOSS) [#rss/MachineLearning](https://fosstodon.org/tags/MachineLearning) [#rss/ArtificialIntelligence](https://fosstodon.org/tags/ArtificialIntelligence) [#rss/AI](https://fosstodon.org/tags/AI) [#rss/Python](https://fosstodon.org/tags/Python) [#rss/Lisp](https://fosstodon.org/tags/Lisp) [#rss/Dotnet](https://fosstodon.org/tags/Dotnet) [#rss/JupyterNotebooks](https://fosstodon.org/tags/JupyterNotebooks) [#rss/JupyterLab](https://fosstodon.org/tags/JupyterLab)

# Reading List ⚫

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.readingList( await dvjs.rssItemsOfContext(), false);
~~~

# Pinned Feed Items 📍

~~~dataviewjs
const
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	pages = await dvjs.rssItemsOfContext();
dvjs.rssTable(
	pages.where(it => it.pinned === true),
	dvjs.getOptions("rss_feed_items"));
~~~

# Read Feed Items ✅

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.readingList( await dvjs.rssItemsOfContext(), true);
~~~