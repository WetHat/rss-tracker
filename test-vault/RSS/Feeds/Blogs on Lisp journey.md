---
role: rssfeed
feedurl: https://localhost/RSS/reference/Blogs on Lisp journey/assets/feed.xml
site: https://localhost/blog/
itemlimit: 10
updated: 2024-07-16T10:44:15.922Z
status: OK
tags: 
interval: 645
---
> [!abstract] Blogs on Lisp journey
> Recent content in Blogs on Lisp journey
>
> ![[assets/Blogs on Lisp journey.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Blogs on Lisp journey.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Blogs on Lisp journey.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Blogs on Lisp journey.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~