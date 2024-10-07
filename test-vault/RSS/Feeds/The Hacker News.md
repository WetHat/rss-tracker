---
role: rssfeed
feedurl: https://localhost/test/The Hacker News/feed.xml
site: https://thehackernews.com
itemlimit: 10
updated: 2024-10-07T13:19:01.120Z
status: ✅
tags: []
interval: 5
---
> [!abstract] The Hacker News
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Most trusted, widely-read independent cybersecurity news source for everyone; supported by hackers and IT professionals — Send TIPs to admin@thehackernews.com

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