---
role: rssfeed
feedurl: https://localhost/RSS/reference/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/assets/feed.xml
site: https://fettblog.eu/
itemlimit: 10
updated: 2024-07-16T10:44:09.247Z
status: OK
tags: 
interval: 593
---
> [!abstract] fettblog.eu | TypeScript, JavaScript, Jamstack
> 
>
> ![[assets/fettblog․eu ∣ TypeScript, JavaScript, Jamstack.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~