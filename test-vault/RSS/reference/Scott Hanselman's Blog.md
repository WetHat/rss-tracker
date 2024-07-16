---
role: rssfeed
feedurl: https://localhost/RSS/reference/Scott Hanselman's Blog/assets/feed.xml
site: https://www.hanselman.com/blog/
itemlimit: 10
updated: 2024-07-16T10:43:58.307Z
status: OK
tags: 
interval: 2138
---
> [!abstract] Scott Hanselman's Blog
> Scott Hanselman on Programming, User Experience, The Zen of Computers and Life in General
>
> ![image](http://www.hanselman.com/blog/images/tinyheadshot2.jpg)
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Scott Hanselman's Blog.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Scott Hanselman's Blog.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Scott Hanselman's Blog.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~