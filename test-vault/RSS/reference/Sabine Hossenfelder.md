---
feedurl: https://localhost/reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 100
updated: 2024-07-10T15:31:24.398Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] Sabine Hossenfelder
> 
>
> ![[assets/Sabine Hossenfelder.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Sabine Hossenfelder"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Sabine Hossenfelder"
WHERE completed
SORT published DESC
~~~
