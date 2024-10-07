---
role: rssfeed
feedurl: https://localhost/test/Space RSS Feed/feed.xml
site: https://www.space.com
itemlimit: 10
updated: 2024-10-07T14:00:32.486Z
status: ✅
tags: []
interval: 5
---
> [!abstract] Space RSS Feed
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