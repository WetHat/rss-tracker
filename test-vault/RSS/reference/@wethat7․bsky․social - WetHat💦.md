---
role: rssfeed
feedurl: https://localhost/RSS/reference/@wethat7․bsky․social - WetHat💦/assets/feed.xml
site: https://bsky.app/profile/wethat7.bsky.social
itemlimit: 10
updated: 2024-07-11T11:39:39.733Z
status: OK
tags: []
interval: 19
---

> [!abstract] @wethat7.bsky.social - WetHat💦
> I enjoy programming computers
>
> ![[@wethat7․bsky․social - WetHat💦.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/@wethat7․bsky․social - WetHat💦"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/@wethat7․bsky․social - WetHat💦"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/@wethat7․bsky․social - WetHat💦"
WHERE completed
SORT published DESC
~~~