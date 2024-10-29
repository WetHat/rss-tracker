---
role: rssitem
author: "Tara Overfield"
published: 2024-05-15T17:05:00.000Z
link: https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-may-2024-servicing-updates/
id: https://devblogs.microsoft.com/dotnet/?p=51837
feed: "[[․NET Blog]]"
tags: [rss/Maintenance,rss/Updates,rss/_NET,rss/_NET_Framework,rss/_net_framework]
pinned: false
---

> [!abstract] .NET and .NET Framework May 2024 Servicing Updates by Tara Overfield - 2024-05-15T17:05:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] A recap of the latest servicing updates for .NET and .NET Framework for May 2024.
> 
> The post [.NET and .NET Framework May 2024 Servicing Updates](https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-may-2024-servicing-updates/) appeared first on [.NET Blog](https://devblogs.microsoft.com/dotnet).

🌐 Read article [online](https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-may-2024-servicing-updates/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[․NET and ․NET Framework May 2024 Servicing Updates]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
Welcome to our new combined .NET servicing updates for May 2024. To help streamline and help you keep up to date with the latest service releases we have decided to combine together our update posts around both .NET & .NET Framework so you can find all the information in one convenient location on the blog. Don’t forget that you can find updates about .NET previews on [GitHub](https://github.com/dotnet/core/discussions/categories/news), specifically for .NET 9. Let’s get into the latest release of .NET & .NET Framework, here is a quik overview of what’s new in these releases:

- [Security Improvements](#security-improvements)
- [.NET updates](#net-may-2024-updates)
- [.NET Framework updates](#net-framework-may-2024-updates)

## Security improvements

This month you will find two CVEs that have been fixed this month:

|CVE #|Title|Applies to|
|---|---|---|
|[CVE-2024-30046](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-30046)|.NET Elevation of Privilege Vulnerability|.NET 7.0, .NET 8.0|
|[CVE-2024-30045](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-30045)|.NET Remote Code Execution Vulnerability|.NET 7.0, .NET 8.0|

> Note: There are no new security improvements for .NET Framework this release.

## .NET May 2024 Updates

Below you will find a details list of everything from the .NET release for May 2024 including .NET 6.0.30, .NET 7.0.19, and .NET 8.0.5:

||.NET 6.0|.NET 7.0|.NET 8.0|
|---|---|---|---|
|Release Notes|[6.0.30](https://github.com/dotnet/core/blob/main/release-notes/6.0/6.0.30/6.0.30.md)|[7.0.19](https://github.com/dotnet/core/blob/main/release-notes/7.0/7.0.19/7.0.19.md)|[8.0.5](https://github.com/dotnet/core/blob/main/release-notes/8.0/8.0.5/8.0.5.md)|
|Installers and binaries|[6.0.30](https://dotnet.microsoft.com/download/dotnet/6.0)|[7.0.19](https://dotnet.microsoft.com/download/dotnet/7.0)|[8.0.5](https://dotnet.microsoft.com/download/dotnet/8.0)|
|Container Images|[images](https://mcr.microsoft.com/catalog?search=dotnet/)|[images](https://mcr.microsoft.com/catalog?search=dotnet/)|[images](https://mcr.microsoft.com/catalog?search=dotnet/)|
|Linux packages|[6.0.30](https://github.com/dotnet/core/blob/main/release-notes/6.0/install-linux.md)|[7.0.19](https://github.com/dotnet/core/blob/main/release-notes/7.0/install-linux.md)|[8.0.5](https://github.com/dotnet/core/blob/main/release-notes/8.0/install-linux.md)|
|Known Issues|[6.0](https://github.com/dotnet/core/blob/main/release-notes/6.0/known-issues.md)|[7.0](https://github.com/dotnet/core/blob/main/release-notes/7.0/known-issues.md)|[8.0](https://github.com/dotnet/core/blob/main/release-notes/8.0/known-issues.md)|

Share feedback about this release in the [Release feedback issue](https://github.com/dotnet/core/issues/9309).

## .NET Framework May 2024 Updates

This month, there are several non-security updates in these releases, be sure to browse our [release notes for .NET Framework](https://learn.microsoft.com/dotnet/framework/release-notes/2024/05-14-may-security-and-quality-rollup) for more details.

## See you next month

Let us know what you think of these new combined service release blogs as we continue to iterate to bring you the latest news and updates for .NET.

The post [.NET and .NET Framework May 2024 Servicing Updates](https://devblogs.microsoft.com/dotnet/dotnet-and-dotnet-framework-may-2024-servicing-updates/) appeared first on [.NET Blog](https://devblogs.microsoft.com/dotnet).