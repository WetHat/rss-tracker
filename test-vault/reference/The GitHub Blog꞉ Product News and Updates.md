---
feedurl: https://localhost/reference/The GitHub Blog꞉ Product News and Updates/assets/feed.xml
site: https://github.blog/category/product/
itemlimit: 10
updated: 2024-06-12T06:54:10.290Z
status: OK
tags:
  - rss
interval: 165
---

> [!abstract] The GitHub Blog: Product News and Updates
> Updates, ideas, and inspiration from GitHub to help developers build and design software.
>
> ![[The GitHub Blog꞉ Product News and Updates.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/The GitHub Blog꞉ Product News and Updates"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/The GitHub Blog꞉ Product News and Updates"
WHERE completed
SORT published DESC
~~~
