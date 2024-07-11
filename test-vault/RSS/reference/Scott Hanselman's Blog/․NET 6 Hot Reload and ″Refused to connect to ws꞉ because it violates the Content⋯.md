---
author: "Scott Hanselman"
published: 2021-11-16T19:37:00.000Z
link: https://feeds.hanselman.com/~/673288256/0/scotthanselman~NET-Hot-Reload-and-Refused-to-connect-to-ws-because-it-violates-the-Content-Security-Policy-directive-because-Web-Sockets
id: https://www.hanselman.com/blog/post/d9e0f2ec-d7fd-484e-9b60-35cc70ab1398
feed: "Scott Hanselman's Blog"
tags: [rss/DotNetCore]
pinned: false
---
> [!abstract] .NET 6 Hot Reload and "Refused to connect to ws: because it violates the Content Security Policy directive" because Web Sockets by Scott Hanselman - 2021-11-16T19:37:00.000Z
> If you're excited about [Hot Reload](https://www.youtube.com/watch?v=4S3vPzawnoQ) like me AND you also [want an "A" grade](https://www.hanselman.com/blog/easily-adding-security-headers-to-your-aspnet-core-web-app-and-getting-an-a-grade) from [SecurityHeaders.com](http://securityheaders.com) (really, go try this now) then you will learn very quickly about [Content-Security-Policy](https://content-security-policy.com/) headers. You need to spend some time reading and you may end up with a somewhat⋯

🔗Read article [online](https://feeds.hanselman.com/~/673288256/0/scotthanselman~NET-Hot-Reload-and-Refused-to-connect-to-ws-because-it-violates-the-Content-Security-Policy-directive-because-Web-Sockets). For other items in this feed see [[../Scott Hanselman's Blog]].

- [ ] [[․NET 6 Hot Reload and ″Refused to connect to ws꞉ because it violates the Content⋯]]
- - -
If you're excited about [Hot Reload](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.youtube.com/watch?v=4S3vPzawnoQ) like me AND you also [want an "A" grade](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/easily-adding-security-headers-to-your-aspnet-core-web-app-and-getting-an-a-grade) from [SecurityHeaders.com](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~securityheaders.com) (really, go try this now) then you will learn very quickly about [Content-Security-Policy](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://content-security-policy.com/) headers. You need to spend some time reading and you may end up with a somewhat sophisticated list of allowed things, scripts, stylesheets, etc.

In [DasBlog Core](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://github.com/poppastring/dasblog-core) (the cross platform blog engine that runs this blog) Mark Downie makes these configurable and uses the NWebSpec ASP.NET Middleware library to add the needed headers.

if (SecurityStyleSources != null && SecurityScriptSources != null && DefaultSources != null)
  
{
  
    app.UseCsp(options => options
  
        .DefaultSources(s => s.Self()
  
            .CustomSources(DefaultSources)
  
            )
  
        .StyleSources(s => s.Self()
  
            .CustomSources(SecurityStyleSources)
  
            .UnsafeInline()
  
        )
  
        .ScriptSources(s => s.Self()
  
               .CustomSources(SecurityScriptSources)
  
            .UnsafeInline()
  
            .UnsafeEval()
  
        )
  
    );
  
}

Each of those variables comes out of a config file. Yes, it would be more security if they came out of a vault or were even hard coded.

DasBlog is a pretty large and cool app and we noticed immediately upon Mark upgrading it to .NET 6 that we were unable to use Hot Reload (via dotnet watch or from VS 2022). We can complain about it, or we can learn about how it works and why it's not working for us!

> Remember: [Nothing in your computer is hidden from you](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/the-internet-is-not-a-black-box-look-inside).

Starting with a simple "View Source" we can see a JavaScript include at the very bottom that is definitely not mine!

<script src="https://www.hanselman.com/_framework/aspnetcore-browser-refresh.js"></script>

Ok, this makes sense as we know not only does HotReload support C# (code behinds) but also Markup via Razor Pages and changing CSS! It would definitely need to communicate "back home" to the runner which is either "dotnet watch" or VS2022.

If I change the ASPNETCORE_ENVIRONMENT to "Production" (either via launch.json, launchsettings, or an environment variable like this, I can see that extra HotReload helper script isn't there:

C:\github\wshotreloadtest>dotnet run --environment="Production"
  
Building...
  
info: Microsoft.Hosting.Lifetime[14]
  
      Now listening on: https://localhost:7216
  
info: Microsoft.Hosting.Lifetime[14]
  
      Now listening on: [http://localhost:5216](http://localhost:5216)

> **Remember:** You never want to use dotnet run in production! It's an SDK building command! You'll want to use dotnet exec your.dll, dotnet your.dll, or best of all, in .NET 6 just call the EXE directly! .\bin\Debug\net6.0\wshotreloadtest.exe in my example. Why? dotnet run will always assume it's in Development (you literally tell it to restore, build, and exec in one run command) if you run it. You'll note that running the actual EXE is always WAY faster as well! Don't ship your .NET SDK to your webserver and don't recompile the whole thing on startup in production!

We can see that that aspnnetcore-browser-refresh.js is the client side of Development-time HotReload. Looking at our browser console we see :

![Refused to Connect because it violates a CSP Directive](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/72550dc07007_14F70/image_1f22b882-9a3f-4fad-b201-fb0f26c86db6.png "Refused to Connect because it violates a CSP Directive")

Refused to connect to 'wss://localhost:62486/' 
  
because it violates the following Content Security Policy 
  
directive: "default-src 'self'". 
  
Note that 'connect-src' was not explicitly set, 
  
so 'default-src' is used as a fallback.

That's a lot to think about. I started out my ASP.NET Web App's middle ware saying it was OK to talk "back to myself" but nowhere else.

app.UseCsp(options => options.DefaultSources(s => s.Self())); 

Hm, self seems reasonable, why can't the browser connect BACK to the dotnet run'ed Kestrel Web Server? It's all localhost, right? Well, specifically it's http://localhost not ws://localhost, or even wss://localhost (that extra s is for secure) so I need to explicitly allow ws: or wss: or both, but only in Development.

Maybe like this (again, I'm using NWebSpec, but these are just HTTP Headers so you can literally just add them if you want, hardcoded.)

app.UseCsp(options => options.DefaultSources(s => s.Self())
  
            .ConnectSources(s => s.CustomSources("wss://localhost:62895")));

But port numbers change, right? Let's do just wss:, only in Development. Now, if I'm using both CSPs and WebSockets (ws:, wss:) in Production, I'll need to be intentional about this.

What's the moral?

**If you start using CSP Headers to tighten things up, be conscious and aware of the headers you need for conveniences like Hot Reload in Development versus whatever things you may need in Production.**

Hope this helps save you some time!

---

**Sponsor:** At Rocket Mortgage® the work you do around here will be 100% impactful but won’t take all your free time, giving you the perfect work-life balance. Or as we call it, tech/life balance! [Learn more.](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://hnsl.mn/3qVUu5O)

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/673288256/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/673288256/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/673288256/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/673288256/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/673288256/scotthanselman "Subscribe by RSS")
