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
> {{description}}
>
> {{image}}
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[{{fileName}}]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[{{fileName}}]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[{{fileName}}]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~