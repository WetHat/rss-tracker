---
feedurl: reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-05-27T08:59:01.447Z
status: OK
tags:
  - rss
interval: 168
---

> [!abstract] PyCoder’s Weekly
> 
>
> ![[PyCoder’s WeeklyLogo.svg|200x200]]
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
