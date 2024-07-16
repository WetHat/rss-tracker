---
role: rssfeed
feedurl: https://localhost/RSS/reference/Deno/assets/feed.xml
site: https://deno.com/blog
itemlimit: 10
updated: 2024-07-16T10:44:11.552Z
status: OK
tags: 
interval: 207
---
> [!abstract] Deno
> The latest news from Deno Land Inc.
>
> ![[Deno.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Deno.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Deno.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Deno.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~