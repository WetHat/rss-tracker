---
author: "Christian Ritter"
published: 2023-12-15T10:59:02.000Z
link: https://devdojo.com/hcritter/powershell-technique-powershell-getting-all-string-occurrence-indices
id: https://devdojo.com/11839
feed: "Planet PowerShell"
tags: [rss/powershell,rss/method,rss/indexof,rss/indexofall,rss/string,rss/adventofcode]
pinned: false
---
> [!abstract] PowerShell-Technique: PowerShell: Getting all String occurrence Indices by Christian Ritter - 2023-12-15T10:59:02.000Z
> Recently, I participated in AdventOfCode 2023 and encountered challenges that required finding the precise location of a character in a string, along with all its occurrences. Take, for instance, the string 'Hello, world!'. I needed to identify all positions of the character 'l': 2, 3, and 10.
> 
> The typical method, .IndexOf('l'), provides only the first occurrence (in this case, 2). To obtain all positions, I devised a PowerShell function that iterates through the string using the IndexOf() metho⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-technique-powershell-getting-all-string-occurrence-indices). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[PowerShell-Technique꞉ PowerShell꞉ Getting all String occurrence Indices]]
- - -
Recently, I participated in AdventOfCode 2023 and encountered challenges that required finding the precise location of a character in a string, along with all its occurrences. Take, for instance, the string 'Hello, world!'. I needed to identify all positions of the character 'l': 2, 3, and 10.

The typical method, .IndexOf('l'), provides only the first occurrence (in this case, 2). To obtain all positions, I devised a PowerShell function that iterates through the string using the IndexOf() method with a position parameter. Here's the function:

```
function Get-IndexOfAll {
    param (
        [string]$String,
        [string]$SearchString
    )
    $IndexList = [System.Collections.Generic.List[int]]::new()
    $Index = $String.IndexOf($SearchString)
    while($Index -ne -1){
        $IndexList.Add($Index)
        $Index = $String.IndexOf($SearchString,$Index+1)
    }
    return $IndexList
}
```

Additionally, I demonstrated in a previous post how to extend the TypeData of string objects using Update-TypeData:

```
$IndexOfAll = {
    param(
        $SearchString
    )
    $IndexList = [System.Collections.Generic.List[int]]::new()
    $Index = $this.IndexOf($SearchString)
    while($Index -ne -1){
        $IndexList.Add($Index)
        $Index = $this.IndexOf($SearchString,$Index+1)
    }
return $indexlist
}

$etd = @{
    TypeName = 'string'
    MemberType = 'Scriptmethod'
    MemberName = 'IndexOfAll'
    Value = $IndexOfAll
}
Update-TypeData @etd
```

Now, you can easily find all occurrences of a character in a string using the IndexOfAll method.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards, Christian
