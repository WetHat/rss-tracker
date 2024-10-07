---
role: rssfeed
feedurl: https://localhost/test/@WetHat (WetHat💦)/feed.xml
site: https://fosstodon.org/@WetHat
itemlimit: 10
updated: 2024-10-07T17:50:46.154Z
status: ✅
tags: []
interval: 5
---
> [!abstract] @WetHat (WetHat💦)
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> I enjoy programming computers.

[#rss/fedi22](https://fosstodon.org/tags/fedi22) [#rss/Mastodon](https://fosstodon.org/tags/Mastodon) [#rss/Fediverse](https://fosstodon.org/tags/Fediverse) [#rss/Programming](https://fosstodon.org/tags/Programming) [#rss/OpenSource](https://fosstodon.org/tags/OpenSource) [#rss/FOSS](https://fosstodon.org/tags/FOSS) [#rss/MachineLearning](https://fosstodon.org/tags/MachineLearning) [#rss/ArtificialIntelligence](https://fosstodon.org/tags/ArtificialIntelligence) [#rss/AI](https://fosstodon.org/tags/AI) [#rss/Python](https://fosstodon.org/tags/Python) [#rss/Lisp](https://fosstodon.org/tags/Lisp) [#rss/Dotnet](https://fosstodon.org/tags/Dotnet) [#rss/JupyterNotebooks](https://fosstodon.org/tags/JupyterNotebooks) [#rss/JupyterLab](https://fosstodon.org/tags/JupyterLab)

# Unread Feed Items 📚
~~~dataview
TASK
FROM [[]]
WHERE !completed AND startswith(text,"[[") AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📍
~~~dataview
TABLE
published as Published
FROM [[]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[]]
WHERE completed AND startswith(text,"[[") AND role = "rssitem"
SORT published DESC
~~~