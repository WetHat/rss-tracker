---
role: rssfeed
feedurl: https://localhost/RSS/reference/The Hacker News/assets/feed.xml
site: https://thehackernews.com
itemlimit: 10
updated: 2024-07-11T11:39:15.110Z
status: OK
tags: []
interval: 5
---

> [!abstract] The Hacker News
> Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com
>
> ![[The Hacker News.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/The Hacker News"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/The Hacker News"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/The Hacker News"
WHERE completed
SORT published DESC
~~~