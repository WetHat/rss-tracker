---
role: rssfeed
feedurl: https://localhost/RSS/reference/Bluesky/assets/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 10
updated: 2024-07-11T11:39:33.065Z
status: OK
tags: []
interval: 19
---

> [!abstract] Bluesky
> 
>
> ![[Bluesky.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Bluesky"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Bluesky"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Bluesky"
WHERE completed
SORT published DESC
~~~