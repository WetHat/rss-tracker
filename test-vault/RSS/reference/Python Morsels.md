---
role: rssfeed
feedurl: https://localhost/RSS/reference/Python Morsels/assets/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2024-07-16T10:44:02.654Z
status: OK
tags: 
interval: 425
---
> [!abstract] Python Morsels
> Python Morsels
>
> ![[Python Morsels.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Python Morsels.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Python Morsels.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Python Morsels.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~