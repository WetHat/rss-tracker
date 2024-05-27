---
feedurl: reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2024-05-27T08:49:51.091Z
status: OK
tags:
  - rss
interval: 24
---

> [!abstract] Sabine Hossenfelder
> 
>
> ![[Sabine HossenfelderLogo 1.svg|200x200]]
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
