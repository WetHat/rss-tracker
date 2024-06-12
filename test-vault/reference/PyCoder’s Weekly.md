---
feedurl: https://localhost/reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-06-12T06:53:08.018Z
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
