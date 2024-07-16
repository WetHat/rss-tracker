---
role: rssfeed
feedurl: https://localhost/RSS/reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-07-16T10:44:04.610Z
status: OK
tags: 
interval: 168
---
> [!abstract] PyCoder’s Weekly
> 
>
> ![[PyCoder’s Weekly.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[PyCoder’s Weekly.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[PyCoder’s Weekly.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[PyCoder’s Weekly.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~