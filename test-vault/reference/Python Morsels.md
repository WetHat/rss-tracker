---
feedurl: https://localhost/reference/Python Morsels/assets/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2024-06-17T14:23:09.847Z
status: OK
tags:
  - rss
interval: 425
---

> [!abstract] Python Morsels
> Python Morsels
>
> ![[Python Morsels.svg|200x200]]
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
