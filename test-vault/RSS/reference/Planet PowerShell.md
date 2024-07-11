---
feedurl: https://localhost/reference/Planet PowerShell/assets/feed.xml
site: https://www.planetpowershell.com/
itemlimit: 100
updated: 2024-07-10T15:31:24.435Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
---

> [!abstract] Planet PowerShell
> An aggregated feed from the PowerShell community
>
> ![image](https://www.planetpowershell.com/Content/Logo.png)
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Planet PowerShell"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Planet PowerShell"
WHERE completed
SORT published DESC
~~~
