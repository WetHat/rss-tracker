---
role: rssfeed
feedurl: https://localhost/RSS/reference/Planet PowerShell/assets/feed.xml
site: https://www.planetpowershell.com/
itemlimit: 10
updated: 2024-07-11T11:57:34.424Z
status: OK
tags: []
interval: 102
---

> [!abstract] Planet PowerShell
> An aggregated feed from the PowerShell community
>
> ![image](https://www.planetpowershell.com/Content/Logo.png)
# Unread Feed Items 📚
~~~dataview
TASK
FROM "RSS/reference/Planet PowerShell"
WHERE !completed
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM "RSS/reference/Planet PowerShell"
where pinned = true
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "RSS/reference/Planet PowerShell"
WHERE completed
SORT published DESC
~~~