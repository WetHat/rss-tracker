---
feedurl: https://localhost/reference/Planet PowerShell/assets/feed.xml
site: https://www.planetpowershell.com/
itemlimit: 10
updated: 2024-06-17T14:31:27.773Z
status: OK
tags:
  - rss
interval: 102
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
