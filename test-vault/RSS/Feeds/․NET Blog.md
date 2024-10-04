---
role: rssfeed
feedurl: https://localhost/RSS/reference/․NET Blog/assets/feed.xml
site: https://devblogs.microsoft.com/dotnet/
itemlimit: 10
updated: 2024-07-16T10:43:49.716Z
status: OK
tags: 
interval: 77
---
> [!abstract] .NET Blog
> Free. Cross-platform. Open source. A developer platform for building all your apps.
>
> ![image|32x32](https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2018/10/Microsoft-Favicon.png)
# Unread Feed Items 📚
~~~dataview
TASK
FROM [[․NET Blog.md]]
WHERE !completed AND role = "rssitem"
SORT published DESC
~~~

# Pinned Feed Items 📌
~~~dataview
TABLE
published as Published
FROM [[․NET Blog.md]]
WHERE pinned = true AND role = "rssitem"
SORT published DESC
~~~

# Read Feed Items
~~~dataview
TASK
FROM [[․NET Blog.md]]
WHERE completed AND role = "rssitem"
SORT published DESC
~~~