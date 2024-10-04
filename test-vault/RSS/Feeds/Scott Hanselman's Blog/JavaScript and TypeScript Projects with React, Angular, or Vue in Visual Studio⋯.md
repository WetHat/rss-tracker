---
role: rssitem
author: Scott Hanselman
published: 2021-11-25T20:50:00.000Z
link: https://feeds.hanselman.com/~/674283520/0/scotthanselman~JavaScript-and-TypeScript-Projects-with-React-Angular-or-Vue-in-Visual-Studio-with-or-without-NET
id: https://www.hanselman.com/blog/post/0909e949-cd9a-4867-8e02-6e24660b1856
feed: "[[Scott Hanselman's Blog]]"
tags: [rss/ASP_NET,rss/Javascript,rss/Web_Services]
pinned: false
---

> [!abstract] JavaScript and TypeScript Projects with React, Angular, or Vue in Visual Studio 2022 with or without .NET by Scott Hanselman - 2021-11-25T20:50:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|200x200]]{.rss-image}
> I was reading [Gabby's blog post about the new TypeScript/JavaScript project experience in Visual Studio 2022](https://devblogs.microsoft.com/visualstudio/the-new-javascript-typescript-experience-in-vs-2022-preview-3/). You should read the docs on [JavaScript and TypeScript in Visual Studio 2022](https://docs.microsoft.com/en-us/visualstudio/javascript/javascript-in-vs-2022?view=vs-2022).
> 
> If you're used to ASP.NET apps when you think about apps that are JavaScript heavy, "front end apps" or Typ⋯

🔗Read article [online](https://feeds.hanselman.com/~/674283520/0/scotthanselman~JavaScript-and-TypeScript-Projects-with-React-Angular-or-Vue-in-Visual-Studio-with-or-without-NET). For other items in this feed see [[Scott Hanselman's Blog]].

- [ ] [[JavaScript and TypeScript Projects with React, Angular, or Vue in Visual Studio⋯]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Additional RSS Items Referring to This Article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
I was reading [Gabby's blog post about the new TypeScript/JavaScript project experience in Visual Studio 2022](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://devblogs.microsoft.com/visualstudio/the-new-javascript-typescript-experience-in-vs-2022-preview-3/). You should read the docs on [JavaScript and TypeScript in Visual Studio 2022](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://docs.microsoft.com/en-us/visualstudio/javascript/javascript-in-vs-2022?view=vs-2022).

If you're used to ASP.NET apps when you think about apps that are JavaScript heavy, "front end apps" or TypeScript focused, it can be confusing as to "where does .NET fit in?"

You need to consider the responsibilities of your various projects or subsystems and the multiple totally valid ways you can build a web site or web app. Let's consider just a few:

1. [An ASP.NET Web app that renders HTML on the server but uses TS/JS](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://docs.microsoft.com/en-us/visualstudio/javascript/tutorial-aspnet-with-typescript?view=vs-2022)
    - This may have a Web API, Razor Pages, with or without the MVC pattern.
    - You maybe have just added JavaScript via ＜script＞ tags
    - Maybe you added a script minimizer/minifier task
    - Can be confusing because it can feel like your app needs to 'build both the client and the server' from one project
2. A mostly JavaScript/TypeScript frontend app where the HTML could be served from any web server (node, kestrel, static web apps, nginx, etc)
    - This app may use Vue or React or Angular but it's not an "ASP.NET app"
    - It calls backend Web APIs that may be served by ASP.NET, Azure Functions, 3rd party REST APIs, or all of the above
    - This scenario has sometimes been confusing for ASP.NET developers who may get confused about responsibility. Who builds what, where do things end up, how do I build and deploy this?

[VS2022](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://docs.microsoft.com/en-us/visualstudio/javascript/javascript-in-vs-2022?view=vs-2022) brings JavaScript and TypeScript support into VS with a full JavaScript Language Service based on TS. It provides a TypeScript NuGet Package so you can build your whole app with MSBuild and VS will do the right thing.

> **NEW:** Starting in Visual Studio 2022, there is a new JavaScript/TypeScript project type (.esproj) that allows you to create standalone Angular, React, and Vue projects in Visual Studio.

The .esproj concept is great for folks familiar with Visual Studio as we know that a Solution contains one or more Projects. Visual Studio manages files for a single application in a _Project_. The project includes source code, resources, and configuration files. In this case we can have a .csproj for a backend Web API and an .esproj that uses a client side template like Angular, React, or Vue.

Thing is, historically when Visual Studio supported Angular, React, or Vue, it's templates were out of date and not updated enough. VS2022 uses the native CLIs for these front ends, solving that problem with [Angular CLI](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://angular.io/cli), [Create React App](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://github.com/facebook/create-react-app), and [Vue CLI](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://cli.vuejs.org/).

If I am in VS and go "File New Project" there are Standalone templates that solve Example 2 above. I'll pick JavaScript React.

![Standalone JavaScript Templates in VS2022](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/97390fb5b7df_12523/image_8fbe4808-d001-4208-a77c-614f8ed4126d.png "Standalone JavaScript Templates in VS2022")

Then I'll click "Add integration for Empty ASP.NET Web API. This will give me a frontend with javascript ready to call a ASP.NET Web API backend. I'll [follow along here](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://docs.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react?view=vs-2022).

![Standalone JavaScript React Template](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/97390fb5b7df_12523/image_bc274b03-19f1-4f1f-8fb8-f9d2f9dce344.png "Standalone JavaScript React Template")

It then uses the React CLI to make the front end, which again, is cool as it's whatever version I want it to be.

![React Create CLI](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/97390fb5b7df_12523/image_3b618c5d-75cd-4dc3-b9c6-78be33dbe019.png "React Create CLI")

Then I'll add my ASP.NET Web API backend to the same solution, so now I have an esproj and a csproj like this

![frontend and backend](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/97390fb5b7df_12523/image_ecdd0c10-39eb-4eb9-aa87-6d9c712d362f.png "frontend and backend")

Now I have a nice clean two project system - in this case more JavaScript focused than .NET focused. This one uses npm to startup the project using their web development server and proxyMiddleware to proxy localhost:3000 calls over to the ASP.NET Web API project.

Here is a React app served by npm calling over to the Weather service served from Kestrel on ASP.NET.

![npm app running in VS 2022 against an ASP.NET Web API](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/97390fb5b7df_12523/image_5d1af2f4-4754-4aa8-9e24-8ab9fa23a01c.png "npm app running in VS 2022 against an ASP.NET Web API")

This is inverted than most ASP.NET Folks are used to, and that's OK. This shows me that Visual Studio 2022 can support either development style, use the CLI that is installed for whatever Frontend Framework, and allow me to choose what web server and web browser (via Launch.json) I want.

If you want to flip it, and [put ASP.NET Core as the primary and then bring in some TypeScript/JavaScript, follow this tutorial because](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://docs.microsoft.com/en-us/visualstudio/javascript/tutorial-aspnet-with-typescript?view=vs-2022) that's also possible!

---

**Sponsor:** Make login Auth0’s problem. Not yours. Provide the convenient login features your customers want, like social login, multi-factor authentication, single sign-on, passwordless, and more. [Get started for free.](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~pubads.g.doubleclick.net/gampad/clk?id=5840349572&iu=/6839/lqm.scotthanselman.site)

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/674283520/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/674283520/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/674283520/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/674283520/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/674283520/scotthanselman "Subscribe by RSS")