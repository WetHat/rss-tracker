---
role: rssfeed
feedurl: https://localhost/RSS/reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-07-11T11:39:25.894Z
status: OK
tags: []
interval: 168
---

> [!abstract] PyCoder’s Weekly
> 
>
> ![[PyCoder’s Weekly.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/PyCoder’s Weekly"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/PyCoder’s Weekly"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/PyCoder’s Weekly"
WHERE completed
SORT published DESC
~~~