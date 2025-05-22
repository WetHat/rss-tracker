---
role: rssitem
aliases:
  - Upgrading a 20 year old University Project to .NET 6 with dotnet-upgrade-assistant
id: https://www.hanselman.com/blog/post/efee6f41-a33b-4fb4-9af0-6a8df6b9539b
author: Scott Hanselman
link: https://feeds.hanselman.com/~/673659136/0/scotthanselman~Upgrading-a-year-old-University-Project-to-NET-with-dotnetupgradeassistant
published: 2021-11-18T21:18:00.000Z
feed: "[[Scott Hanselman's Blog]]"
tags:
  - rss/DotNetCore
  - rss/Open_Source
pinned: false
---

> [!abstract] Upgrading a 20 year old University Project to .NET 6 with dotnet-upgrade-assistant (by Scott Hanselman)
> ![image|float:right|400](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/16297583fa52_12B8A/image_102c9b35-682a-46ed-9bb3-3d313ddda313.png "Updating .NET project with the upgrade assistant") I wrote a [Tiny Virtual Operating System](https://www.hanselman.com/blog/rescuing-the-tiny-os-in-c) for a 300-level OS class in C# for college back in 2001 (?) and later [moved it to VB.NET in 2002](https://www.hanselman.com/blog/ive-ported-my-tiny-abstract-os-and-cpu-in-c-projectnbspfr). This is all pre-.NET Core, and on early .NET 1.1 or 2.0 on Windows. I [moved it to GitHub 5 years ago](https://github.com/shanselman/TinyOS) and [ported it to .NET Core 2.0 at the time](https://www.hanselman.com/blog/porting-a-15-year-old-net-11-virtual-cpu-tiny-operating-system-school-project-to-net-core-20). At this point it was 15 years old, so it was cool to see this project running on Windows, Linux, in Docker, and on a Raspberry Pi...a machine that didn't exist when the project was originally writte⋯

🌐 Read article [online](https://feeds.hanselman.com/~/673659136/0/scotthanselman~Upgrading-a-year-old-University-Project-to-NET-with-dotnetupgradeassistant). ⤴ For other items in this feed see [[Scott Hanselman's Blog]].

- [ ] [[RSS/Feeds/Scott Hanselman's Blog/Upgrading a 20 year old University Project to ․NET 6 with dotnet-upgrade-assista⋯|Upgrading a 20 year old University Project to ․NET 6 with dotnet-upgrade-assista⋯]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

I wrote a [Tiny Virtual Operating System](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/rescuing-the-tiny-os-in-c) for a 300-level OS class in C# for college back in 2001 (?) and later [moved it to VB.NET in 2002](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/ive-ported-my-tiny-abstract-os-and-cpu-in-c-projectnbspfr). This is all pre-.NET Core, and on early .NET 1.1 or 2.0 on Windows. I [moved it to GitHub 5 years ago](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://github.com/shanselman/TinyOS) and [ported it to .NET Core 2.0 at the time](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/porting-a-15-year-old-net-11-virtual-cpu-tiny-operating-system-school-project-to-net-core-20). At this point it was 15 years old, so it was cool to see this project running on Windows, Linux, in Docker, and on a Raspberry Pi...a machine that didn't exist when the project was originally written.

> **NOTE:** If the timeline is confusing, I had already been working in industry for years at this point but was still plugging away at my 4 year degree at night. It eventually took 11 years to complete my BS in Software Engineering.

This evening, as the children slept, I wanted to see if I could run the [.NET Upgrade Assistant](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://dotnet.microsoft.com/platform/upgrade-assistant) on this now 20 year old app and get it running on .NET 6.

Let's start:

```undefined
$ upgrade-assistant upgrade .\TinyOS.sln
-----------------------------------------------------------------------------------------------------------------
Microsoft .NET Upgrade Assistant v0.3.256001+3c4e05c787f588e940fe73bfa78d7eedfe0190bd
We are interested in your feedback! Please use the following link to open a survey: https://aka.ms/DotNetUASurvey
-----------------------------------------------------------------------------------------------------------------
[22:58:01 INF] Loaded 5 extensions
[22:58:02 INF] Using MSBuild from C:\Program Files\dotnet\sdk\6.0.100\
[22:58:02 INF] Using Visual Studio install from C:\Program Files\Microsoft Visual Studio\2022\Preview [v17]
[22:58:06 INF] Initializing upgrade step Select an entrypoint
[22:58:07 INF] Setting entrypoint to only project in solution: C:\Users\scott\TinyOS\src\TinyOSCore\TinyOSCore.csproj
[22:58:07 INF] Recommending executable TFM net6.0 because the project builds to an executable
[22:58:07 INF] Initializing upgrade step Select project to upgrade
[22:58:07 INF] Recommending executable TFM net6.0 because the project builds to an executable
[22:58:07 INF] Recommending executable TFM net6.0 because the project builds to an executable
[22:58:07 INF] Initializing upgrade step Back up project
```

See how the process is interactive at the command line, with color prompts and a series of dynamic multiple-choice questions?

![Updating .NET project with the upgrade assistant](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/16297583fa52_12B8A/image_102c9b35-682a-46ed-9bb3-3d313ddda313.png "Updating .NET project with the upgrade assistant")

Interestingly, it builds on the first try, no errors.

When I manually look at the .csproj I can see some weird version numbers, likely from some not-quite-baked version of .NET Core 2 I used many years ago. My spidey sense says this is wrong, and I'm assuming the upgrade assistant didn't understand it.

```undefined
<!-- <PackageReference Include="ILLink.Tasks" Version="0.1.4-preview-906439" /> -->
    <PackageReference Include="Microsoft.Extensions.Configuration" Version="2.0.0-preview2-final" />
    <PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="2.0.0-preview2-final" />
    <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.0.0-preview2-final" />
    <PackageReference Include="Microsoft.Extensions.Options.ConfigurationExtensions" Version="2.0.0-preview2-final" />
```

I also note a commented-out reference to ILLink.Tasks which was a preview feature in Mono's Linker to reduce the final size of apps and tree-trim them. Some of that functionality is built into .NET 6 now so I'll use that during the build and packaging process later. The reference is not needed today.

I'm gonna blindly upgrade them to .NET 6 and see what happens. I could do this by just changing the numbers and seeing if it restores and builds, but I can also try [dotnet outdated](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/your-dotnet-outdated-is-outdated-update-and-help-keep-your-net-projects-up-to-date) which remains a lovely tool in the upgrader's toolkit.

![image](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/16297583fa52_12B8A/image_4a71ee64-6bb1-4730-86f8-689475662465.png "image")

This "outdated" tool is nice as it talks to NuGet and confirms that there are newer versions of certain packages.

In my tests - which were just batch files at this early time - I was calling my dotnet app like this:

```undefined
dotnet netcoreapp2.0/TinyOSCore.dll 512 scott13.txt
```

This will change to the modern form with just `TinyOSCore.exe 512 scott13.txt` with an exe and args and no ceremony.

Publishing and trimming my TinyOS turns into just a 15 meg EXE. Nice considering that the .NET I need is in there with no separate install. I could turn this little synthetic OS into a microservice if I wanted to be totally extra.

```undefined
dotnet publish -r win-x64 --self-contained -p:PublishSingleFile=true -p:SuppressTrimAnalysisWarnings=true
```

If I add

```undefined
-p:EnableCompressionInSingleFile=true
```

Then it's even smaller. No code changes. Run all my tests, looks good. My project from university from .NET 1.1 is now .NET 6.0, cross platform, self-contained in 11 megs in a single EXE. Sweet.

---

**Sponsor:** At Rocket Mortgage® the work you do around here will be 100% impactful but won’t take all your free time, giving you the perfect work-life balance. Or as we call it, tech/life balance! [Learn more.](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://hnsl.mn/3qVUu5O)

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/673659136/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/673659136/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/673659136/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/673659136/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/673659136/scotthanselman "Subscribe by RSS")