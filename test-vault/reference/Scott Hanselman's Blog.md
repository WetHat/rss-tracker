---
feedurl: https://localhost/reference/Scott Hanselman's Blog/assets/feed.xml
site: https://www.hanselman.com/blog/
itemlimit: 10
updated: 2024-06-17T14:38:12.083Z
status: OK
tags:
  - rss
interval: 2138
---

> [!abstract] Scott Hanselman's Blog
> Scott Hanselman on Programming, User Experience, The Zen of Computers and Life in General
>
> ![image](http://www.hanselman.com/blog/images/tinyheadshot2.jpg)
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Scott Hanselman's Blog"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Scott Hanselman's Blog"
WHERE completed
SORT published DESC
~~~
