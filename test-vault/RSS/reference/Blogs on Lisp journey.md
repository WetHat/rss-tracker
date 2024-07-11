---
role: rssfeed
feedurl: https://localhost/RSS/reference/Blogs on Lisp journey/assets/feed.xml
site: https://localhost/blog/
itemlimit: 10
updated: 2024-07-11T11:57:54.907Z
status: OK
tags: []
interval: 645
---

> [!abstract] Blogs on Lisp journey
> Recent content in Blogs on Lisp journey
>
> ![[Blogs on Lisp journey.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Blogs on Lisp journey"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Blogs on Lisp journey"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Blogs on Lisp journey"
WHERE completed
SORT published DESC
~~~