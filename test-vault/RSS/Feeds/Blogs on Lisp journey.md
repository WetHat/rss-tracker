---
role: rssfeed
feedurl: https://localhost/test/Blogs on Lisp journey/feed.xml
site: https://localhost/blog/
itemlimit: 10
updated: 2024-10-05T09:45:41.354Z
status: ✅
tags: []
interval: 645
---
> [!abstract] Blogs on Lisp journey
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
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