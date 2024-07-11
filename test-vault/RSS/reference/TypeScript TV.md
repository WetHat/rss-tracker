---
role: rssfeed
feedurl: https://localhost/RSS/reference/TypeScript TV/assets/feed.xml
site: https://typescript.tv/
itemlimit: 10
updated: 2024-07-11T11:39:12.981Z
status: OK
tags: []
interval: 809
---

> [!abstract] TypeScript TV
> 🚀 Ideal for beginners or advanced TypeScript programmers, our coding course guarantees something new for everyone.
>
> ![[TypeScript TV.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/TypeScript TV"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/TypeScript TV"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/TypeScript TV"
WHERE completed
SORT published DESC
~~~