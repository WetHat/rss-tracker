---
role: rssfeed
feedurl: https://localhost/test/TypeScript TV/feed.xml
site: https://typescript.tv/
itemlimit: 10
updated: 2024-10-04T17:14:41.559Z
status: ✅
tags: []
interval: 809
---
> [!abstract] TypeScript TV
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> 🚀 Ideal for beginners or advanced TypeScript programmers, our coding course guarantees something new for everyone.

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