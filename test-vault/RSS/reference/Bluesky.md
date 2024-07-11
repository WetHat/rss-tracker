---
feedurl: https://localhost/reference/Bluesky/assets/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 100
updated: 2024-07-10T15:31:24.442Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] Bluesky
> 
>
> ![[assets/Bluesky.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Bluesky"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Bluesky"
WHERE completed
SORT published DESC
~~~
