---
role: rssfeed
feedurl: https://localhost/test/Python Morsels/feed.xml
site: https://www.pythonmorsels.com/topics/
itemlimit: 10
updated: 2024-10-07T17:50:21.065Z
status: ✅
tags: []
interval: 425
---
> [!abstract] Python Morsels
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Python Morsels

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