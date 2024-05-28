---
feedurl: reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-05-28T16:34:30.668Z
status: OK
tags:
  - rss
interval: 168
---

> [!abstract] PyCoder’s Weekly
> 
>
> ![[PyCoder’s WeeklyLogo 3.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "output/PyCoder’s Weekly"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "output/PyCoder’s Weekly"
WHERE completed
SORT published DESC
~~~
