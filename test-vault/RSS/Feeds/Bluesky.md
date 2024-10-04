---
role: rssfeed
feedurl: https://localhost/test/Bluesky/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 10
updated: 2024-10-04T17:02:29.130Z
status: ✅
tags: []
interval: 19
---
> [!abstract] Bluesky
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> 

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