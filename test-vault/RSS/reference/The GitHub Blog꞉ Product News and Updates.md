---
role: rssfeed
feedurl: https://localhost/RSS/reference/The GitHub Blog꞉ Product News and Updates/assets/feed.xml
site: https://github.blog/category/product/
itemlimit: 10
updated: 2024-07-11T11:39:17.244Z
status: OK
tags: []
interval: 165
---

> [!abstract] The GitHub Blog: Product News and Updates
> Updates, ideas, and inspiration from GitHub to help developers build and design software.
>
> ![[The GitHub Blog꞉ Product News and Updates.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/The GitHub Blog꞉ Product News and Updates"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/The GitHub Blog꞉ Product News and Updates"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/The GitHub Blog꞉ Product News and Updates"
WHERE completed
SORT published DESC
~~~