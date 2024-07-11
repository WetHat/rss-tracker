---
feedurl: https://localhost/reference/Azimuth/assets/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 100
updated: 2024-07-10T15:31:24.450Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] Azimuth
> 
>
> ![image](https://s0.wp.com/i/buttonw-com.png)
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Azimuth"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Azimuth"
WHERE completed
SORT published DESC
~~~
