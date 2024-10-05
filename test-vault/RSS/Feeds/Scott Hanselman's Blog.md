---
role: rssfeed
feedurl: https://localhost/test/Scott Hanselman's Blog/feed.xml
site: https://www.hanselman.com/blog/
itemlimit: 10
updated: 2024-10-05T09:45:23.031Z
status: ✅
tags: []
interval: 2138
---
> [!abstract] Scott Hanselman's Blog
> <span class="rss-image">![image|400](http://www.hanselman.com/blog/images/tinyheadshot2.jpg)</span>
> Scott Hanselman on Programming, User Experience, The Zen of Computers and Life in General

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