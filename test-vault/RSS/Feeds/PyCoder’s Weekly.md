---
role: rssfeed
feedurl: https://localhost/test/PyCoder’s Weekly/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-10-07T17:50:23.309Z
status: ✅
tags: []
interval: 168
---
> [!abstract] PyCoder’s Weekly
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