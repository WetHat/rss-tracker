---
feedurl: https://localhost/reference/․NET Blog/assets/feed.xml
site: https://devblogs.microsoft.com/dotnet/
itemlimit: 100
updated: 2024-07-10T15:31:19.959Z
status: net::ERR_CONNECTION_REFUSED
tags: []
interval: 1
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
