---
role: rssfeed
feedurl: "{{feedUrl}}"
site: "{{siteUrl}}"
itemlimit:
updated:
status:
tags: []
---
> [!abstract] {{title}}
> <span class="rss-image">{{image}}</span> {{description}}

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