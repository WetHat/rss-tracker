---
role: rssfeed
feedurl: https://localhost/RSS/reference/Python Morsels/assets/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2024-07-11T11:39:23.994Z
status: OK
tags: []
interval: 425
---

> [!abstract] Python Morsels
> Python Morsels
>
> ![[Python Morsels.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Python Morsels"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Python Morsels"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Python Morsels"
WHERE completed
SORT published DESC
~~~