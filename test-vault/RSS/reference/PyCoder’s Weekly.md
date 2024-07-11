---
feedurl: https://localhost/reference/PyCoder’s Weekly/assets/feed.xml
site: https://pycoders.com/
itemlimit: 100
updated: 2024-07-10T15:31:24.406Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] PyCoder’s Weekly
> 
>
> ![[assets/PyCoder’s Weekly.svg|200x200]]
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
