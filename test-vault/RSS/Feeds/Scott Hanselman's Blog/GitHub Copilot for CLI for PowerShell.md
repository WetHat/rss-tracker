---
role: rssitem
aliases: []
id: https://www.hanselman.com/blog/post/aa1cc05f-3910-471d-8686-68c749ec90ff
author: Scott Hanselman
link: https://feeds.hanselman.com/~/737271731/0/scotthanselman~GitHub-Copilot-for-CLI-for-PowerShell
published: 2023-04-25T15:31:49.000Z
feed: "[[RSS/Feeds/Scott Hanselman's Blog.md|Scott Hanselman's Blog]]"
tags:
  - rss/AI
  - rss/PowerShell
pinned: false
---

> [!abstract] GitHub Copilot for CLI for PowerShell (by Scott Hanselman)
> ![image|float:right|400](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/GitHub-Copilot-for-CLI-for-PowerShell_B0E3/image_f39afdbf-04bf-4c95-a913-2404f46dc308.png "image") GitHub Next has this cool project that is basically Copilot for the CLI (command line interface). You can sign up for their waitlist at the [Copilot for CLI site](https://githubnext.com/projects/copilot-cli/).
> 
> > Copilot for CLI provides three shell commands: `??`, `git?` and `gh?`
> 
> This is cool and all, but I use PowerShell. Turns out these ?? commands are just router commands to a larger EXE called github-copilot-cli. So if you go "?? something" you're really going "github-copilot-cli what-the-shell something."
> 
> So this means I should be able to to do the same/similar aliases for my PowerShell prompt AND change the injected prompt (look at me I'm a prompt engineer) to add 'use powershell to.'
> 
> Now it's not perfect, but hopefully it will make the point to the Copilot CLI team that PowerSh⋯

🌐 Read article [online](https://feeds.hanselman.com/~/737271731/0/scotthanselman~GitHub-Copilot-for-CLI-for-PowerShell). ⤴ For other items in this feed see [[RSS/Feeds/Scott Hanselman's Blog.md|Scott Hanselman's Blog]].

- [ ] [[RSS/Feeds/Scott Hanselman's Blog/GitHub Copilot for CLI for PowerShell|GitHub Copilot for CLI for PowerShell]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

GitHub Next has this cool project that is basically Copilot for the CLI (command line interface). You can sign up for their waitlist at the [Copilot for CLI site](https://feeds.hanselman.com/~/t/0/0/scotthanselman/~https://githubnext.com/projects/copilot-cli/).

> Copilot for CLI provides three shell commands: `??`, `git?` and `gh?`

This is cool and all, but I use PowerShell. Turns out these ?? commands are just router commands to a larger EXE called github-copilot-cli. So if you go "?? something" you're really going "github-copilot-cli what-the-shell something."

So this means I should be able to to do the same/similar aliases for my PowerShell prompt AND change the injected prompt (look at me I'm a prompt engineer) to add 'use powershell to.'

Now it's not perfect, but hopefully it will make the point to the Copilot CLI team that PowerShell needs love also.

Here are my aliases. Feel free to suggest if these suck. Note the addition of "user powershell to" for the ?? one. I may make a ?? and a p? where one does bash and one does PowerShell. I could also have it use wsl.exe and shell out to bash. Lots of possibilities.

```undefined
function ?? { 
    $TmpFile = New-TemporaryFile 
    github-copilot-cli what-the-shell ('use powershell to ' + $args) --shellout $TmpFile 
    if ([System.IO.File]::Exists($TmpFile)) { 
        $TmpFileContents = Get-Content $TmpFile 
            if ($TmpFileContents -ne $nill) {
            Invoke-Expression $TmpFileContents 
            Remove-Item $TmpFile 
        }
    }
}
function git? {
    $TmpFile = New-TemporaryFile
    github-copilot-cli git-assist $args --shellout $TmpFile
    if ([System.IO.File]::Exists($TmpFile)) {
        $TmpFileContents = Get-Content $TmpFile 
            if ($TmpFileContents -ne $nill) {
            Invoke-Expression $TmpFileContents 
            Remove-Item $TmpFile 
        }
    }
}
function gh? {
    $TmpFile = New-TemporaryFile
    github-copilot-cli gh-assist $args --shellout $TmpFile
    if ([System.IO.File]::Exists($TmpFile)) {
        $TmpFileContents = Get-Content $TmpFile 
            if ($TmpFileContents -ne $nill) {
            Invoke-Expression $TmpFileContents 
            Remove-Item $TmpFile 
        }
    }
}
```

It also then offers to run the command. Very smooth.

![image](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/GitHub-Copilot-for-CLI-for-PowerShell_B0E3/image_f39afdbf-04bf-4c95-a913-2404f46dc308.png "image")

Hope you like it. Lots of fun stuff happening in this space.

  

---

© 2021 Scott Hanselman. All rights reserved.  

![](https://feeds.hanselman.com/~/i/737271731/0/scotthanselman)

[![](https://assets.feedblitz.com/i/fblike20.png)](https://feeds.hanselman.com/_/28/737271731/scotthanselman "Like on Facebook") [![](https://assets.feedblitz.com/i/x.png)](https://feeds.hanselman.com/_/24/737271731/scotthanselman "Post to X.com") [![](https://assets.feedblitz.com/i/email20.png)](https://feeds.hanselman.com/_/19/737271731/scotthanselman "Subscribe by email") [![](https://assets.feedblitz.com/i/rss20.png)](https://feeds.hanselman.com/_/20/737271731/scotthanselman "Subscribe by RSS")
