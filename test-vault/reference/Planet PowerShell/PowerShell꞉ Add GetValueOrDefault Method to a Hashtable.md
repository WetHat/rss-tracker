---
author: "Christian Ritter"
published: 2023-10-26T09:51:01.000Z
link: https://devdojo.com/hcritter/powershell-add-getvalueordefault-method-to-a-hashtable
id: https://devdojo.com/11762
feed: "Planet PowerShell"
tags: [rss/powershell,rss/function,rss/method,rss/hashtable,rss/getvalueordefault]
pinned: false
---
> [!abstract] PowerShell: Add GetValueOrDefault Method to a Hashtable by Christian Ritter - 2023-10-26T09:51:01.000Z
> ## Enhancing PowerShell with GetValueOrDefault: A Neat Solution for Streamlined Hashtables
> 
> Have you ever wondered why the Hashtable in .NET lacks a GetValueOrDefault method, a feature readily available in basic Dictionaries? In my quest to streamline my PowerShell experience, I decided to address this by creating a simple function and extending it to all my Hashtables. This handy method can prove invaluable in various scenarios, making your code cleaner and more concise.
> 
> First, let's define th⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-add-getvalueordefault-method-to-a-hashtable). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell꞉ Add GetValueOrDefault Method to a Hashtable]]
- - -
## Enhancing PowerShell with GetValueOrDefault: A Neat Solution for Streamlined Hashtables

Have you ever wondered why the Hashtable in .NET lacks a GetValueOrDefault method, a feature readily available in basic Dictionaries? In my quest to streamline my PowerShell experience, I decided to address this by creating a simple function and extending it to all my Hashtables. This handy method can prove invaluable in various scenarios, making your code cleaner and more concise.

First, let's define the GetValueOrDefault function for Hashtables:

```
$GetValueOrDefault = {
    param(
        $key,
        $defaultValue
    )
    $this.ContainsKey($key) ? $this[$key] : $defaultValue
}

$etd = @{
    TypeName = 'System.Collections.Hashtable'
    MemberType = 'Scriptmethod'
    MemberName = 'GetValueOrDefault'
    Value = $GetValueOrDefault
}
Update-TypeData @etd
```

With this function now at your disposal, you might wonder how to best utilize it. One excellent use case is as a replacement for the traditional switch command. Let's consider an example where you need to translate a number into a language, defaulting to English for unknown inputs.

Without the GetValueOrDefault method, you might use a switch statement like this:

```
$number = 1
$language = switch ($number) {
    1 { "German" }
    2 { "French" }
    3 { "Spanish" }
    4 { "Italian" }
    5 { "Russian" }
    Default {"English"}
}
```

Or its more verbose if-elseif-else counterpart:

```
$number = 1
$language = ''
if ($number -eq 1) {
    $language = "German"
}
elseif ($number -eq 2) {
    $language = "French"
}
elseif ($number -eq 3) {
    $language = "Spanish"
}
elseif ($number -eq 4) {
    $language = "Italian"
}
elseif ($number -eq 5) {
    $language = "Russian"
}
else {
    $language = "English"
}
```

Or its more verbose if-elseif-else counterpart:

```
$Number=1
$LanguageTable = @{
    1 = "German"
    2 = "French"
    3 = "Spanish"
    4 = "Italian"
    5 = "Russian"
}
$LanguageTable.GetValueOrDefault($Number,'English')
```

As you can see, the code is not only more concise but also easier to read. It's important to note that this method doesn't aim to replace complex switch statements involving regular expressions or multiple conditions; instead, it excels at providing a clean and efficient solution for basic replacements of switch or if/elseif/else constructs.

In conclusion, the GetValueOrDefault method for Hashtables can be a valuable addition to your PowerShell toolkit, offering a simpler and more elegant way to handle basic switch-like scenarios, making your code more readable and maintainable.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)

Best regards, Christian
