---
role: rssfeed
feedurl: https://localhost/test/PyCoder’s Weekly/feed.xml
site: https://pycoders.com/
itemlimit: 10
updated: 2024-10-04T17:19:44.643Z
status: ✅
tags: []
interval: 168
---
> [!abstract] PyCoder’s Weekly
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