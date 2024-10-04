---
role: rssfeed
feedurl: https://localhost/test/Blogs on Lisp journey/feed.xml
site: https://localhost/blog/
itemlimit: 10
updated: 2024-10-04T17:17:38.917Z
status: ✅
tags: []
interval: 645
---
> [!abstract] Blogs on Lisp journey
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Recent content in Blogs on Lisp journey

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