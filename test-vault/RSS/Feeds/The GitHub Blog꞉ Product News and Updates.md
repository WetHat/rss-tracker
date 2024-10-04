---
role: rssfeed
feedurl: https://localhost/test/The GitHub Blog꞉ Product News and Updates/feed.xml
site: https://github.blog/category/product/
itemlimit: 10
updated: 2024-10-04T17:19:57.258Z
status: ✅
tags: []
interval: 165
---
> [!abstract] The GitHub Blog: Product News and Updates
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Updates, ideas, and inspiration from GitHub to help developers build and design software.

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