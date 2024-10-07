---
role: rssfeed
feedurl: https://localhost/test/JavaScript Development Space's RSS Feed/feed.xml
site: http://github.com/dylang/node-rss
itemlimit: 10
updated: 2024-10-07T17:46:02.376Z
status: ✅
tags: []
interval: 138
---
> [!abstract] JavaScript Development Space's RSS Feed
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Explore the world of JavaScript at our blog, your ultimate resource for guides, tutorials, and articles. Uncover the latest insights, tips, and trends.

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