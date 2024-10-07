---
role: rssfeed
feedurl: https://localhost/test/Planet PowerShell/feed.xml
site: https://www.planetpowershell.com/
itemlimit: 10
updated: 2024-10-07T13:19:14.595Z
status: ✅
tags: []
interval: 102
---
> [!abstract] Planet PowerShell
> <span class="rss-image">![image|400](https://www.planetpowershell.com/Content/Logo.png)</span> An aggregated feed from the PowerShell community

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