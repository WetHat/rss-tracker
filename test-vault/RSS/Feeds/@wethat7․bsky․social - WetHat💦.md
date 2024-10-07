---
role: rssfeed
feedurl: https://localhost/test/@wethat7․bsky․social - WetHat💦/feed.xml
site: https://bsky.app/profile/wethat7.bsky.social
itemlimit: 10
updated: 2024-10-07T17:50:43.995Z
status: ✅
tags: []
interval: 19
---
> [!abstract] @wethat7.bsky.social - WetHat💦
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> I enjoy programming computers

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