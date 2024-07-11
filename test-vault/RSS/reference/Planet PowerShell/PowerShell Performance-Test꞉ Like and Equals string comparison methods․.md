---
author: "Christian Ritter"
published: 2023-05-30T09:18:16.000Z
link: https://devdojo.com/hcritter/powershell-performance-test-like-and-equals-string-comparison-methods
id: https://devdojo.com/10976
feed: "Planet PowerShell"
tags: [rss/performance,rss/powershell,rss/where,rss/equals,rss/eq,rss/like]
pinned: false
---
> [!abstract] PowerShell Performance-Test: Like and Equals string comparison methods. by Christian Ritter - 2023-05-30T09:18:16.000Z
> #### When using PowerShell, many users often rely on the like comparison in a where statement for querying data.
> 
> However, there is an alternative method that can be faster, especially when searching for strings that start with specific letters. This method involves using the 'equals' comparison instead.
> 
> To begin, let's create some data to query. I have generated a list of '1048576' words, each consisting of 20 characters:
> 
> ```
> $BunchOfWords = $(
>     (1..1mb).ForEach({
>         $(Get-Random -Min⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-performance-test-like-and-equals-string-comparison-methods). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[PowerShell Performance-Test꞉ Like and Equals string comparison methods․]]
- - -
#### When using PowerShell, many users often rely on the like comparison in a where statement for querying data.

However, there is an alternative method that can be faster, especially when searching for strings that start with specific letters. This method involves using the 'equals' comparison instead.

To begin, let's create some data to query. I have generated a list of '1048576' words, each consisting of 20 characters:

```
$BunchOfWords = $(
    (1..1mb).ForEach({
        $(Get-Random -Minimum 65 -Maximum 90 -Count 20).ForEach({
            [char]$PSItem
        }) -join ''
    })
)
```

Next, we will perform queries on this list to find words that start with the letter 'w', using both the like and equals methods. We can use the first element in the string array, '$PSItem[0]', to achieve this:

```
#rss/Where method with -eq
$W2 = $BunchOfWords | where-Object{$psitem[0] -eq "W"}
#rss/Where method with -like
$W = $BunchOfWords | Where-Object{$_ -like "W*"}
```

To query words with multiple specific characters, we can utilize the 'Substring()' method on '$PSItem':

```
#rss/Where method with -eq (Substring)
$WED2 = $BunchOfWords | where-Object{$psitem.Substring(0,3) -eq "WED"}
#rss/Where method with -like
$WED = $BunchOfWords | Where-Object{$_ -like "WED*"}
```

Finally, let's examine the results:

|Method|RuntimeMS|
|:--|:--|
|SingeLetter EQ StringArray pos 0|13350|
|SingeLetter like Query|16739|
|MultipleLetter EQ Substring|14713|
|MultipleLetter like Query|17835|

As you can observe, the 'equals' comparison method is consistently around 3 seconds faster when dealing with our large list of words. This holds true even when utilizing a substring in the multiple letter test.

That concludes our performance test.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards,

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)

Christian.
