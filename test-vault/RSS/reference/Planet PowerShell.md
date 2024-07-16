---
role: rssfeed
feedurl: https://localhost/RSS/reference/Planet PowerShell/assets/feed.xml
site: https://www.planetpowershell.com/
itemlimit: 10
updated: 2024-07-16T10:44:07.278Z
status: OK
tags: 
interval: 102
---
> [!abstract] Planet PowerShell
> An aggregated feed from the PowerShell community
>
> ![image](https://www.planetpowershell.com/Content/Logo.png)
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[Planet PowerShell.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[Planet PowerShell.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[Planet PowerShell.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~