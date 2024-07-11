---
feedurl: https://localhost/reference/The GitHub Blog꞉ Product News and Updates/assets/feed.xml
site: https://github.blog/category/product/
itemlimit: 100
updated: 2024-07-10T15:31:24.326Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] The GitHub Blog: Product News and Updates
> Updates, ideas, and inspiration from GitHub to help developers build and design software.
>
> ![[assets/The GitHub Blog꞉ Product News and Updates.svg|200x200]]
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
