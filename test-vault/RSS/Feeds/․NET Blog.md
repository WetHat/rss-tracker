---
role: rssfeed
feedurl: https://localhost/test/․NET Blog/feed.xml
site: https://devblogs.microsoft.com/dotnet/
itemlimit: 10
updated: 2024-10-04T17:04:40.856Z
status: ✅
tags: []
interval: 77
---
> [!abstract] .NET Blog
> ![image|400](https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2018/10/Microsoft-Favicon.png){.rss-image}
> Free. Cross-platform. Open source. A developer platform for building all your apps.

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