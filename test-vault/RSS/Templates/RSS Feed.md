---
role: rssfeed
feedurl: {{feedUrl}}
site: "{{siteUrl}}"
itemlimit: 10
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
FROM "{{folderPath}}"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "{{folderPath}}"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "{{folderPath}}"
WHERE completed
SORT published DESC
~~~