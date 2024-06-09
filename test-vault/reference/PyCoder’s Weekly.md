---
feedurl: reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-06-09T20:15:29.696Z
status: OK
tags:
  - rss
interval: 168
---

> [!abstract] PyCoder’s Weekly
> 
>
> ![[PyCoder’s Weekly.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/PyCoder’s Weekly"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/PyCoder’s Weekly"
WHERE completed
SORT published DESC
~~~
