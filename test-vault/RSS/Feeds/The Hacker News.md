---
role: rssfeed
feedurl: https://localhost/RSS/reference/The Hacker News/assets/feed.xml
site: https://thehackernews.com
itemlimit: 10
updated: 2024-07-16T10:43:53.930Z
status: OK
tags: 
interval: 5
---
> [!abstract] The Hacker News
> Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com
>
> ![[assets/The Hacker News.svg|200x200]]
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[The Hacker News.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[The Hacker News.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[The Hacker News.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~