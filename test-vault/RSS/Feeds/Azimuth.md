---
role: rssfeed
feedurl: https://localhost/RSS/reference/Azimuth/assets/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 10
updated: 2024-07-16T10:44:18.035Z
status: OK
tags: 
interval: 206
---
> [!abstract] Azimuth
> 
>
> ![image](https://s0.wp.com/i/buttonw-com.png)
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Azimuth.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Azimuth.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Azimuth.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~