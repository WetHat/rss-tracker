---
role: rssfeed
feedurl: https://localhost/RSS/reference/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/assets/feed.xml
site: https://fettblog.eu/
itemlimit: 10
updated: 2024-07-11T11:56:34.075Z
status: OK
tags: []
interval: 593
---

> [!abstract] fettblog.eu | TypeScript, JavaScript, Jamstack
> 
>
> ![[fettblog․eu ∣ TypeScript, JavaScript, Jamstack.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
WHERE completed
SORT published DESC
~~~