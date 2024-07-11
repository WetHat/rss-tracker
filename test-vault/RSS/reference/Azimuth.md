---
role: rssfeed
feedurl: https://localhost/RSS/reference/Azimuth/assets/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 10
updated: 2024-07-11T11:39:37.543Z
status: OK
tags: []
interval: 206
---

> [!abstract] Azimuth
> 
>
> ![image](https://s0.wp.com/i/buttonw-com.png)
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Azimuth"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Azimuth"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Azimuth"
WHERE completed
SORT published DESC
~~~