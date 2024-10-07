---
role: rssitem
author: "Scott Hanselman"
published: 2022-12-18T22:16:30.000Z
link: https://feeds.hanselman.com/~/722495722/0/scotthanselman~Use-your-own-user-domain-for-Mastodon-discoverability-with-the-WebFinger-Protocol-without-hosting-a-server
id: https://www.hanselman.com/blog/post/0c9c9a66-f3db-4e58-a1f3-c692b8ad64af
feed: "[[Scott Hanselman's Blog]]"
tags: [rss/Musings]
pinned: false
---

> [!abstract] Use your own user @ domain for Mastodon discoverability with the WebFinger Protocol without hosting a server by Scott Hanselman - 2022-12-18T22:16:30.000Z
> <span class="rss-image">![image|400](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/f76e92f681b3_FC6E/image_cb60bf43-6d0a-41f9-9ff5-246f288adedf.png "Searching for me with Mastodon")</span> Mastodon is a free, open-source social networking service that is decentralized and distributed. It was created in 2016 as an alternative to centralized social media platforms such as Twitter and Facebook.
> 
> One of the key features of Mastodon is the use of the WebFinger protocol, which allows users to discover and access information about other users on the Mastodon network. WebFinger is a simple HTTP-based protocol that enables a user to discover information about other users or resources on th⋯

🔗Read article [online](https://feeds.hanselman.com/~/722495722/0/scotthanselman~Use-your-own-user-domain-for-Mastodon-discoverability-with-the-WebFinger-Protocol-without-hosting-a-server). For other items in this feed see [[Scott Hanselman's Blog]].

- [ ] [[Use your own user @ domain for Mastodon discoverability with the WebFinger Proto⋯]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Other RSS items are referring to the same article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
Mastodon is a free, open-source social networking service that is decentralized and distributed. It was created in 2016 as an alternative to centralized social media platforms such as Twitter and Facebook.

One of the key features of Mastodon is the use of the WebFinger protocol, which allows users to discover and access information about other users on the Mastodon network. WebFinger is a simple HTTP-based protocol that enables a user to discover information about other users or resources on the internet by using their email address or other identifying information. The WebFinger protocol is important for Mastodon because it enables users to find and follow each other on the network, regardless of where they are hosted.

WebFinger uses a "well known" path structure when calling an domain. You may be familiar with the robots.txt convention. We all just agree that robots.txt will sit at the top path of everyone's domain.

The WebFinger protocol is a simple HTTP-based protocol that enables a user or search to discover information about other users or resources on the internet by using their email address or other identifying information. My is first name at last name .com, so...my personal WebFinger API endpoint is here [https://www.hanselman.com/.well-known/webfinger](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/.well-known/webfinger "https://www.hanselman.com/.well-known/webfinger")

The idea is that...

1. A user sends a WebFinger request to a server, using the email address or other identifying information of the user or resource they are trying to discover.
    
2. The server looks up the requested information in its database and returns a JSON object containing the information about the user or resource. This JSON object is called a "resource descriptor."
    
3. The user's client receives the resource descriptor and displays the information to the user.
    

The resource descriptor contains various types of information about the user or resource, such as their name, profile picture, and links to their social media accounts or other online resources. It can also include other types of information, such as the user's public key, which can be used to establish a secure connection with the user.

There's [a great explainer here as well](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://guide.toot.as/guide/use-your-own-domain/). From that page:

> **When someone searches for you on Mastodon, your server will be queried for accounts using an endpoint that looks like this:**
> 
> GET [https://${MASTODON_DOMAIN}/.well-known/webfinger?resource=acct:${MASTODON_USER}@${MASTODON_DOMAIN](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://${MASTODON_DOMAIN}/.well-known/webfinger?resource=acct:${MASTODON_USER}@${MASTODON_DOMAIN)}  

Note that Mastodon user names start with @ so they are @username@someserver.com. Just like twiter would be @shanselman@twitter.com I can be @shanselman@hanselman.com now!

![Searching for me with Mastodon](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/f76e92f681b3_FC6E/image_cb60bf43-6d0a-41f9-9ff5-246f288adedf.png "Searching for me with Mastodon")

So perhaps _https://www.hanselman.com/.well-known/webfinger?resource=acct:FRED@HANSELMAN.COM_

Mine returns

```undefined
{

    "subject":"acct:shanselman@hachyderm.io",

    "aliases":

    [

        "https://hachyderm.io/@shanselman",

        "https://hachyderm.io/users/shanselman"

    ],

    "links":

    [

        {

            "rel":"http://webfinger.net/rel/profile-page",

            "type":"text/html",

            "href":"https://hachyderm.io/@shanselman"

        },

        {

            "rel":"self",

            "type":"application/activity+json",

            "href":"https://hachyderm.io/users/shanselman"

        },

        {

            "rel":"http://ostatus.org/schema/1.0/subscribe",

            "template":"https://hachyderm.io/authorize_interaction?uri={uri}"

        }

    ]

}
```

This file should be returned as a mime type of **application/jrd+json**

My site is an ASP.NET Razor Pages site, so I just did this in Startup.cs to map that well known URL to a page/route that returns the JSON needed.

```undefined
services.AddRazorPages().AddRazorPagesOptions(options =>

{

    options.Conventions.AddPageRoute("/robotstxt", "/Robots.Txt"); //i did this before, not needed

    options.Conventions.AddPageRoute("/webfinger", "/.well-known/webfinger");

    options.Conventions.AddPageRoute("/webfinger", "/.well-known/webfinger/{val?}");

});
```

then I made a webfinger.cshtml like this. Note I have to double escape the @@ sites because it's Razor.

```undefined
@page

@{

    Layout = null;

    this.Response.ContentType = "application/jrd+json";

}

{

    "subject":"acct:shanselman@hachyderm.io",

    "aliases":

    [

        "https://hachyderm.io/@@shanselman",

        "https://hachyderm.io/users/shanselman"

    ],

    "links":

    [

        {

            "rel":"http://webfinger.net/rel/profile-page",

            "type":"text/html",

            "href":"https://hachyderm.io/@@shanselman"

        },

        {

            "rel":"self",

            "type":"application/activity+json",

            "href":"https://hachyderm.io/users/shanselman"

        },

        {

            "rel":"http://ostatus.org/schema/1.0/subscribe",

            "template":"https://hachyderm.io/authorize_interaction?uri={uri}"

        }

    ]

}
```

This is a static response, but if I was hosting pages for more than one person I'd want to take in the url with the user's name, and then map it to their aliases and return those correctly.

Even easier, you can just use the JSON file of your own Mastodon server's webfinger response and SAVE IT as a static json file and copy it to your own server!

As long as your server returns the right JSON from that well known URL then it'll work.

So this is _my_ template [https://hachyderm.io/.well-known/webfinger?resource=acct:shanselman@hachyderm.io](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://hachyderm.io/.well-known/webfinger?resource=acct:shanselman@hachyderm.io "https://hachyderm.io/.well-known/webfinger?resource=acct:shanselman@hachyderm.io") from where I'm hosted now.

If you want to get started with Mastodon, start here. [https://github.com/joyeusenoelle/GuideToMastodon/](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://github.com/joyeusenoelle/GuideToMastodon/ "https://github.com/joyeusenoelle/GuideToMastodon/") it feels like Twitter circa 2007 except it's not owned by anyone and is based on web standards like ActivityPub.

Hope this helps!

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/722495722/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/722495722/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/722495722/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/722495722/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/722495722/scotthanselman "Subscribe by RSS")