---
role: rssfeed
feedurl: https://localhost/RSS/reference/Scott Hanselman's Blog/assets/feed.xml
site: https://www.hanselman.com/blog/
itemlimit: 10
updated: 2024-07-11T11:39:19.541Z
status: OK
tags: []
interval: 2138
---

> [!abstract] Scott Hanselman's Blog
> Scott Hanselman on Programming, User Experience, The Zen of Computers and Life in General
>
> ![image](http://www.hanselman.com/blog/images/tinyheadshot2.jpg)
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Scott Hanselman's Blog"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Scott Hanselman's Blog"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Scott Hanselman's Blog"
WHERE completed
SORT published DESC
~~~