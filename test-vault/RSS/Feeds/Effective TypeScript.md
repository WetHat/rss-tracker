---
role: rssfeed
feedurl: https://localhost/test/Effective TypeScript/feed.xml
site: https://effectivetypescript.com/
itemlimit: 10
updated: 2024-10-07T17:50:32.636Z
status: ✅
tags: []
interval: 759
---
> [!abstract] Effective TypeScript
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> 62 Specific Ways to Improve Your TypeScript

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