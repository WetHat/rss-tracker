---
role: rssfeed
feedurl: https://localhost/test/Bluesky/feed.xml
site: https://flipboard.com/topic/blueskysocial
itemlimit: 10
updated: 2024-10-05T09:45:39.082Z
status: ✅
tags: []
interval: 19
---
> [!abstract] Bluesky
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
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