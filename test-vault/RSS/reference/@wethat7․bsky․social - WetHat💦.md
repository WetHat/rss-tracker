---
role: rssfeed
feedurl: https://localhost/RSS/reference/@wethat7․bsky․social - WetHat💦/assets/feed.xml
site: https://bsky.app/profile/wethat7.bsky.social
itemlimit: 10
updated: 2024-07-16T10:44:20.254Z
status: OK
tags: 
interval: 19
---
> [!abstract] @wethat7.bsky.social - WetHat💦
> I enjoy programming computers
>
> ![[@wethat7․bsky․social - WetHat💦.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[@wethat7․bsky․social - WetHat💦.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[@wethat7․bsky․social - WetHat💦.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[@wethat7․bsky․social - WetHat💦.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~