---
role: rssfeed
feedurl: https://localhost/test/fettblog․eu ∣ TypeScript, JavaScript, Jamstack/feed.xml
site: https://fettblog.eu/
itemlimit: 10
updated: 2024-10-04T17:34:28.403Z
status: ✅
tags: []
interval: 593
---
> [!abstract] fettblog.eu | TypeScript, JavaScript, Jamstack
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> 

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