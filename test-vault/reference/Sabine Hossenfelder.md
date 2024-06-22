---
feedurl: https://localhost/reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 100
updated: 2024-06-22T17:43:58.158Z
status: OK
tags: []
interval: 24
---

> [!abstract] Sabine Hossenfelder
> 
>
> ![[Sabine Hossenfelder.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "reference/Sabine Hossenfelder"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/Sabine Hossenfelder"
WHERE completed
SORT published DESC
~~~
