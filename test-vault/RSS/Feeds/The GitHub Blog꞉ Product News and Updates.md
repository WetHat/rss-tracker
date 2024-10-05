---
role: rssfeed
feedurl: https://localhost/test/The GitHub Blog꞉ Product News and Updates/feed.xml
site: https://github.blog/category/product/
itemlimit: 10
updated: 2024-10-05T09:45:20.709Z
status: ✅
tags: []
interval: 165
---
> [!abstract] The GitHub Blog: Product News and Updates
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
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