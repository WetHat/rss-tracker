---
feedurl: reference/Python Morsels/assets/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2024-05-29T17:17:12.269Z
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
