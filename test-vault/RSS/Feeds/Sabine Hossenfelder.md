---
role: rssfeed
feedurl: https://localhost/test/Sabine Hossenfelder/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2024-10-07T17:50:18.872Z
status: ✅
tags: []
interval: 24
---
> [!abstract] Sabine Hossenfelder
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> 

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