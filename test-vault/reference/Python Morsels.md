---
feedurl: https://localhost/reference/Python Morsels/assets/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 100
updated: 2024-06-22T17:44:00.395Z
status: OK
tags: []
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
