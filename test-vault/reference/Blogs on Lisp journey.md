---
feedurl: https://localhost/reference/Blogs on Lisp journey/assets/feed.xml
site: https://localhost/blog/
itemlimit: 10
updated: 2024-06-15T17:13:28.840Z
status: OK
tags:
  - rss
interval: 645
---

> [!abstract] Blogs on Lisp journey
> Recent content in Blogs on Lisp journey
>
> ![[Blogs on Lisp journey.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Blogs on Lisp journey"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Blogs on Lisp journey"
WHERE completed
SORT published DESC
~~~
