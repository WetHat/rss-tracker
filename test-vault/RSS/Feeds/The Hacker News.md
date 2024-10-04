---
role: rssfeed
feedurl: https://localhost/test/The Hacker News/feed.xml
site: https://thehackernews.com
itemlimit: 10
updated: 2024-10-04T17:18:11.249Z
status: ✅
tags: []
interval: 5
---
> [!abstract] The Hacker News
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com

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