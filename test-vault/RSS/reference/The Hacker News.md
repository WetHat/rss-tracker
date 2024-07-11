---
feedurl: https://localhost/reference/The Hacker News/assets/feed.xml
site: https://thehackernews.com
itemlimit: 100
updated: 2024-07-10T15:31:24.392Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] The Hacker News
> Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com
>
> ![[assets/The Hacker News.svg|200x200]]
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
