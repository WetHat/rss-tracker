---
feedurl: https://localhost/reference/Bluesky/assets/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 10
updated: 2024-06-17T14:23:18.703Z
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
