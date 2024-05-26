---
feedurl: reference/The Hacker News/assets/feed.xml
site: https://thehackernews.com
itemlimit: 10
updated: 2024-05-26T13:39:42.741Z
status: OK
tags:
  - rss
interval: 5
---

> [!abstract] The Hacker News
> Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com
>
> ![[The Hacker NewsLogo.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/The Hacker News"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/The Hacker News"
WHERE completed
SORT published DESC
~~~
