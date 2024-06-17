---
feedurl: https://localhost/reference/․NET Blog/assets/feed.xml
site: https://devblogs.microsoft.com/dotnet/
itemlimit: 10
updated: 2024-06-17T14:35:24.095Z
status: OK
tags:
  - rss
interval: 77
---

> [!abstract] .NET Blog
> Free. Cross-platform. Open source. A developer platform for building all your apps.
>
> ![image|32x32](https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2018/10/Microsoft-Favicon.png)
# Unread Feed Items
~~~dataview
TASK
FROM "reference/․NET Blog"
WHERE !completed
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM "reference/․NET Blog"
WHERE completed
SORT published DESC
~~~
