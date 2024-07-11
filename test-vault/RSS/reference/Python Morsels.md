---
feedurl: https://localhost/reference/Python Morsels/assets/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 100
updated: 2024-07-10T15:31:24.402Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] Python Morsels
> Python Morsels
>
> ![[assets/Python Morsels.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Python Morsels"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Python Morsels"
WHERE completed
SORT published DESC
~~~
