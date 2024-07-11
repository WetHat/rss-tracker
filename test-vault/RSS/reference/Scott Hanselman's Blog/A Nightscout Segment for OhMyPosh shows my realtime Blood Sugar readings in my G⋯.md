---
author: "Scott Hanselman"
published: 2021-11-23T20:02:00.000Z
link: https://feeds.hanselman.com/~/673947624/0/scotthanselman~A-Nightscout-Segment-for-OhMyPosh-shows-my-realtime-Blood-Sugar-readings-in-my-Git-Prompt
id: https://www.hanselman.com/blog/post/495513ca-ca88-421f-8ade-50e4cf17d747
feed: "Scott Hanselman's Blog"
tags: [rss/Diabetes,rss/Open_Source]
pinned: false
---
> [!abstract] A Nightscout Segment for OhMyPosh shows my realtime Blood Sugar readings in my Git Prompt by Scott Hanselman - 2021-11-23T20:02:00.000Z
> I've talked about [how I love a nice pretty prompt in my Windows Terminal](https://www.hanselman.com/blog/my-ultimate-powershell-prompt-with-oh-my-posh-and-the-windows-terminal) and [made videos showing in detail how to do it](https://www.youtube.com/watch?v=VT2L1SXFq9U). I've also worked with my buddy [TooTallNate to put my real-time blood sugar into a bash or PowerShell prompt](https://www.hanselman.com/blog/visualizing-your-realtime-blood-sugar-values-and-a-git-prompt-on-windows-powershell-an⋯

🔗Read article [online](https://feeds.hanselman.com/~/673947624/0/scotthanselman~A-Nightscout-Segment-for-OhMyPosh-shows-my-realtime-Blood-Sugar-readings-in-my-Git-Prompt). For other items in this feed see [[../Scott Hanselman's Blog]].

- [ ] [[A Nightscout Segment for OhMyPosh shows my realtime Blood Sugar readings in my G⋯]]
- - -
I've talked about [how I love a nice pretty prompt in my Windows Terminal](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/my-ultimate-powershell-prompt-with-oh-my-posh-and-the-windows-terminal) and [made videos showing in detail how to do it](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.youtube.com/watch?v=VT2L1SXFq9U). I've also worked with my buddy [TooTallNate to put my real-time blood sugar into a bash or PowerShell prompt](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/visualizing-your-realtime-blood-sugar-values-and-a-git-prompt-on-windows-powershell-and-linux-bash), but this was back in 2017.

Now that I'm "Team [OhMyPosh](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://ohmyposh.dev/)" I have been meaning to write a Nightscout "segment" for my prompt. [Nightscout](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.nightscoutfoundation.org/how-you-can-help) is an open source self-hosted (there are [commercial hosts also like T1Pal](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.t1pal.com/)) website and API for remote display of real-time and near-real-time glucose readings for Diabetics like myself.

Since my body has an active REST API where I can just do an HTTP GET (via curl or whatever) and see my blood sugar, it clearly belongs in a place of honor, just like my current Git Branch!

![My blood sugar in my Prompt!](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/a1ea1c6a57b0_119D3/image_d14e0906-8932-44e0-a493-86eeac62c1ae.png "My blood sugar in my Prompt!")

[Oh My Posh supports configurable "segments"](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://ohmyposh.dev/docs/) and now there's a beta (still needs mmol and stale readings support) [Nightscout segment](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://ohmyposh.dev/docs/nightscout) that you can setup in just a few minutes!

This prompt works in ANY shell on ANY os! You can do this in zsh, PowerShell, Bash, whatever makes you happy.

Here is a YouTube of Jan from OhMyPosh and I coding the segment LIVE in Go.

If you have an existing OhMyPosh json config, you can just add another segment like this. Make sure your Nightscout URL includes a secure Token or is public (up to you). Note also that I setup "if/then" rules in my background_templates. These are optional and up to you to change to your taste. I set my background colors to red, yellow, green depending on sugar numbers. I also have a foreground template that is not really used, as you can see it always evaluates to black #000, but it shows you how you could set it to white text on a darker background if you wanted.

{
  
  "type": "nightscout",
  
  "style": "diamond",
  
  "foreground": "#ffffff",
  
  "background": "#ff0000",
  
  "background_templates": [
  
    "{{ if gt .Sgv 150 }}#FFFF00{{ end }}",
  
    "{{ if lt .Sgv 60 }}#FF0000{{ end }}",
  
    "#00FF00"
  
  ],
  
  "foreground_templates": [
  
    "{{ if gt .Sgv 150 }}#000000{{ end }}",
  
    "{{ if lt .Sgv 60 }}#000000{{ end }}",
  
    "#000000"
  
  ],
  
  
  "leading_diamond": "",
  
  "trailing_diamond": "\uE0B0",
  
  "properties": {
  
    "url": "https://YOURNIGHTSCOUTAPP.herokuapp.com/api/v1/entries.json?count=1&token=APITOKENFROMYOURADMIN",
  
    "http_timeout": 1500,
  
    "template": " {{.Sgv}}{{.TrendIcon}}"
  
  }
  
},

By default we will only go out and hit your Nightscout instance every 5 min, only when the prompt is repainted, and we'll only wait 1500ms before giving up. You can set that "http_timeout" (how long before we give up) if you feel this slows you down. It'll be cached for 5 min so it's unlikely  to b something you'll notice. The benefit of this new OhMyPosh segment over the previous solution is that it requires no additional services/chron jobs and can be setup extremely quickly. Note also that you can customize your template with [NerdFonts](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.hanselman.com/blog/how-to-make-a-pretty-prompt-in-windows-terminal-with-powerline-nerd-fonts-cascadia-code-wsl-and-ohmyposh). I've included a tiny syringe!

![What a lovely prompt with Blood Sugar!](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/a1ea1c6a57b0_119D3/image_84db877d-82c9-4d16-8788-e2692ce7a7e9.png "What a lovely prompt with Blood Sugar!")

Next I'll hope to improve the segment with mmol support as well as strikeout style for "stale" (over 15 min old) results. You're also welcome to help out by watching [our YouTube](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://www.youtube.com/watch?v=_meKUIm9NwA) and submitting a PR!

---

**Sponsor:** Make login Auth0’s problem. Not yours. Provide the convenient login features your customers want, like social login, multi-factor authentication, single sign-on, passwordless, and more. [Get started for free.](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~pubads.g.doubleclick.net/gampad/clk?id=5840349572&iu=/6839/lqm.scotthanselman.site)

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/673947624/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/673947624/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/673947624/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/673947624/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/673947624/scotthanselman "Subscribe by RSS")
