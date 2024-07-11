---
role: rssfeed
feedurl: https://localhost/RSS/reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2024-07-11T11:39:21.728Z
status: OK
tags: []
interval: 24
---

> [!abstract] Sabine Hossenfelder
> 
>
> ![[Sabine Hossenfelder.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Sabine Hossenfelder"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Sabine Hossenfelder"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Sabine Hossenfelder"
WHERE completed
SORT published DESC
~~~