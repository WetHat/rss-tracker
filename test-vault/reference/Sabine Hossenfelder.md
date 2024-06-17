---
feedurl: https://localhost/reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2024-06-17T14:23:07.618Z
status: OK
tags:
  - rss
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
