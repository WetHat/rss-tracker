---
role: rssfeed
feedurl: https://localhost/RSS/reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2024-07-16T10:44:00.415Z
status: OK
tags: 
interval: 24
---
> [!abstract] Sabine Hossenfelder
> 
>
> ![[assets/Sabine Hossenfelder.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Sabine Hossenfelder.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Sabine Hossenfelder.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Sabine Hossenfelder.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~