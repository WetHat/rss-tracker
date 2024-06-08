---
feedurl: reference/Azimuth/assets/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 10
updated: 2024-06-08T16:35:40.895Z
status: OK
tags:
  - rss
interval: 206
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
