---
feedurl: reference/Bluesky/assets/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 10
updated: 2024-06-11T11:42:27.847Z
status: OK
tags:
  - rss
interval: 19
---

> [!abstract] Bluesky
> 
>
> ![[Bluesky.svg|200x200]]
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
