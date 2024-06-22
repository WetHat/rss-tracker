---
author: "Christian Ritter"
published: 2023-11-23T10:55:27.000Z
link: https://devdojo.com/hcritter/powershell-perfomance-test-get-the-maximum
id: https://devdojo.com/11806
feed: "Planet PowerShell"
tags: [rss/performance,rss/powershell,rss/math,rss/sort-object,rss/max,rss/maximum,rss/measure-object]
pinned: false
---
> [!abstract] PowerShell Perfomance-Test: Get the Maximum by Christian Ritter - 2023-11-23T10:55:27.000Z
> ### Introduction:
> 
> Efficiency is key when working with PowerShell, and maximizing performance is a common goal for script developers. In this post, we'll explore various techniques for retrieving the maximum number from arrays of different sizes, comparing well-known approaches like Measure-Object, Sort-Object and a more mathematical method.
> 
> ### Methods:
> 
> 1. #### Measure-Object:
>     
> 
> To retrieve the maximum number using Measure-Object, the following command is used:
> 
> ```
> (@(1,3,55,69,13,37)| M⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-perfomance-test-get-the-maximum). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell Perfomance-Test꞉ Get the Maximum]]
- - -
### Introduction:

Efficiency is key when working with PowerShell, and maximizing performance is a common goal for script developers. In this post, we'll explore various techniques for retrieving the maximum number from arrays of different sizes, comparing well-known approaches like Measure-Object, Sort-Object and a more mathematical method.

### Methods:

1. #### Measure-Object:
    

To retrieve the maximum number using Measure-Object, the following command is used:

```
(@(1,3,55,69,13,37)| Measure-Object -Maximum).Maximum 
```

2. #### Sort-Object:
    

Another approach involves sorting the array and extracting the highest number from the last index:

```
(@(1,3,55,69,13,37)| Sort-Object)[-1]
```

3. #### Mathematical Approach:
    

Utilizing the [System.Math] class and its Max method requires a loop through the array:

```
$Numbers = (@(1,3,55,69,13,37)
$maxValue = $Numbers[0] #rss/we need to start with an number
foreach($num in $Numbers){
    $maxValue = [System.Math]::Max($Num,$maxValue)
}
```

### Performance Testing:

For a comprehensive performance comparison, three arrays of different sizes were created:

```
$NumbersLarge   = get-random -min 0 -max 1gb -count 20mb
$NumbersMedium  = get-random -min 0 -max 1gb -count 1mb
$NumbersSmall   = get-random -min 0 -max 1gb -count 100kb
```

### Results:

#### Small List:

```
Technique Time            RelativeSpeed Throughput
--------- ----            ------------- ----------
Math      00:00:00.144915 1x            34.5/s
Measure   00:00:00.602446 4.16x         8.3/s
Sort      00:00:02.053357 14.17x        2.44/s
```

#### Medium List:

```
Technique Time            RelativeSpeed Throughput
--------- ----            ------------- ----------
Math      00:00:01.377477 1x            3.63/s
Measure   00:00:11.163644 8.1x          0.45/s
Sort      00:00:31.034414 22.53x        0.16/s
```

#### Large List:

```
Technique Time            RelativeSpeed Throughput
--------- ----            ------------- ----------
Math      00:00:26.392599 1x            0.19/s
Measure   00:01:57.695910 4.46x         0.04/s
Sort      00:18:38.731559 42.39x        0/s
```

### Conclusion:

The [System.Math]::Max() method consistently outperforms Measure-Object and Sort-Object, particularly for larger datasets. Although its implementation may be less intuitive, encapsulating it in a function enhances usability.

### Function Implementation:

```
function Get-MaxNumber {
    param (
        [int[]]Numbers
    )
    $MaxValue = $Numbers[0]
    foreach($num in $Numbers){
        $MaxValue = [System.Math]::Max($MaxValue,$num)
    }
    return $MaxValue
}
```

In scenarios where milliseconds matter and the primary goal is to retrieve the maximum number, the targeted solution using [System.Math]::Max() proves to be a powerful choice.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards, Christian

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)
