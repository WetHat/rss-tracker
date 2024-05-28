---
feedurl: reference/Sabine Hossenfelder/assets/feed.xml
site: https://www.youtube.com/channel/UC1yNl2E66ZzKApQdRuTQ4tw
itemlimit: 10
updated: 2024-05-28T20:14:14.075Z
status: OK
tags:
  - rss
interval: 24
---

> [!abstract] Sabine Hossenfelder
> 
>
> ![[Sabine HossenfelderLogo 7.svg|200x200]]
# Unread Feed Items
~~~dataview
TASK
FROM "output/Sabine Hossenfelder"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "output/Sabine Hossenfelder"
WHERE completed
SORT published DESC
~~~
