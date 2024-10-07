---
role: rssfeed
feedurl: https://localhost/test/Azimuth/feed.xml
site: https://johncarlosbaez.wordpress.com
itemlimit: 10
updated: 2024-10-07T17:50:41.695Z
status: ✅
tags: []
interval: 206
---
> [!abstract] Azimuth
> <span class="rss-image">![image|400](https://s0.wp.com/i/buttonw-com.png)</span> 

# Unread Feed Items 📚
~~~dataview
TASK
FROM [[]]
WHERE !completed AND startswith(text,"[[") AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📍
~~~dataview
TABLE
published as Published
FROM [[]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[]]
WHERE completed AND startswith(text,"[[") AND role = "rssitem"
SORT published DESC
~~~