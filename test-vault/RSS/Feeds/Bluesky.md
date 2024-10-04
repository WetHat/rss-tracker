---
role: rssfeed
feedurl: https://localhost/RSS/reference/Bluesky/assets/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 10
updated: 2024-07-16T10:44:13.689Z
status: OK
tags: 
interval: 19
---
> [!abstract] Bluesky
> 
>
> ![[assets/Bluesky.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Bluesky.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Bluesky.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Bluesky.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~