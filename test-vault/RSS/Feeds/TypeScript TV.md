---
role: rssfeed
feedurl: https://localhost/RSS/reference/TypeScript TV/assets/feed.xml
site: https://typescript.tv/
itemlimit: 10
updated: 2024-07-16T10:43:51.742Z
status: OK
tags: 
interval: 809
---
> [!abstract] TypeScript TV
> 🚀 Ideal for beginners or advanced TypeScript programmers, our coding course guarantees something new for everyone.
>
> ![[assets/TypeScript TV.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[TypeScript TV.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[TypeScript TV.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[TypeScript TV.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~