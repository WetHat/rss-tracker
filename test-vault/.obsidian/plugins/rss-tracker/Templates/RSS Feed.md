---
role: rssfeed
feedurl: "{{feedUrl}}"
site: "{{siteUrl}}"
itemlimit: 100
updated: never
status: unknown
tags: []
---
> [!abstract] {{title}}
> {{image}}
> {{description}}

# Unread Feed Items 📚
~~~dataview
TASK
FROM [[]]
WHERE !completed AND role = "rssitem"
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
WHERE completed AND role = "rssitem"
SORT published DESC
~~~