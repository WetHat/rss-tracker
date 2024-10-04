---
role: rssfeed
feedurl: https://localhost/test/Deno/feed.xml
site: https://deno.com/blog
itemlimit: 10
updated: 2024-10-04T17:08:08.788Z
status: ✅
tags: []
interval: 207
---
> [!abstract] Deno
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> The latest news from Deno Land Inc.

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