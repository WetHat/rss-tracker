---
author: "Christian Ritter"
published: 2023-09-18T08:06:57.000Z
link: https://devdojo.com/hcritter/powershell-technique-smart-aliases
id: https://devdojo.com/11327
feed: "Planet PowerShell"
tags: [rss/functions,rss/powershell,rss/smart,rss/alias,rss/aliases,rss/dynamic_parameter,rss/psmermaid]
pinned: false
---
> [!abstract] PowerShell-Technique: Smart Aliases by Christian Ritter - 2023-09-18T08:06:57.000Z
> ## PowerShell-Technique: Smart Aliases
> 
> ## Utilizing Non-existent Functions in PowerShell
> 
> ### Introduction
> 
> In a recent project of mine, [PSMermaid](https://github.com/HCRitter/PSMermaid), I had the privilege of exploring a fascinating technique called 'Smart Aliases,' which was introduced to me by the brilliant [James Brundage](https://www.youtube.com/watch?v=6mgQGpQbDjY). By employing this technique in conjunction with Dynamic Parameters, I managed to streamline the process of creating a GitG⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-technique-smart-aliases). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell-Technique꞉ Smart Aliases]]
- - -
## PowerShell-Technique: Smart Aliases

## Utilizing Non-existent Functions in PowerShell

### Introduction

In a recent project of mine, [PSMermaid](https://github.com/HCRitter/PSMermaid), I had the privilege of exploring a fascinating technique called 'Smart Aliases,' which was introduced to me by the brilliant [James Brundage](https://www.youtube.com/watch?v=6mgQGpQbDjY). By employing this technique in conjunction with Dynamic Parameters, I managed to streamline the process of creating a GitGraph in Mermaid to just two single functions, even though users have the option to choose from a total of five different entry types. To fully support the creation of a GitGraph, users need the ability to add five types of entries: 'Commit,' 'Merge,' 'Branch,' 'Cherrypick,' and 'Checkout.'

### Implementation

My journey into the world of 'Smart Aliases' began with the need to determine which entry type the user intended to use. To achieve this, I created multiple aliases within the parent function. These aliases made it easy to identify the desired entry type by analyzing the name of the function called and subtracting the main function's name from it. For example, if a user called 'New-MermaidGitGraphEntryCommit,' I removed 'New-MermaidGitGraphEntry,' leaving me with 'Commit'—indicating that the user wanted to add a Commit to the GitGraph. Alias creation involved using the 'Alias' attribute above the 'Param()' section, as shown below:

```
function New-MermaidGitGraphEntry {
    [CmdletBinding()]
    [alias("New-MermaidGitGraphEntryCommit","New-MermaidGitGraphEntryBranch","New-MermaidGitGraphEntryCheckout","New-MermaidGitGraphEntryMerge")]
    param()
    end {}
}
```

To extract the calling function name, I utilized '$PSCmdlet.MyInvocation.InvocationName' and, as mentioned earlier, removed or replaced the parent function name:

```
function New-MermaidGitGraphEntry {
    [CmdletBinding()]
    [alias("New-MermaidGitGraphEntryCommit","New-MermaidGitGraphEntryBranch","New-MermaidGitGraphEntryCheckout","New-MermaidGitGraphEntryMerge")]
    param()
    end {
        $TypeName = $PSCmdlet.MyInvocation.InvocationName -replace 'New-MermaidGitGraphEntry'
    }
}

```

But why did I put in the effort to determine the type this way? There are two significant reasons:

1. Each entry type has different parameters that needed to be implemented (more on this below).
2. I aimed to maintain a consistent style throughout the project, where each function name adapts to its purpose. For example, when I want a Mermaid Graph, I call out the graph type first, followed by the specific graph type (e.g., section or actor), and then the data entry type.

The next step involved dynamically creating parameters for each entry type. While these parameters were similar, they were not identical. To manage this, I constructed a lookup table using a Hashtable. The keys in this table represented the entry type names, while the values were arrays containing parameter names:

```
    $TypeParameter = [ordered]@{
        "commit"    = @("id","tag","type")
        "Branch"    = @("name")
        "Merge"     = @("name","id","tag","type")
        "Checkout"  = @("name")
        "Cherrypick"= @("id")
    }
```

By performing a lookup on this table using the selected type via '$TypeName,' I obtained the corresponding parameters:

```
$Parameters = $TypeParameter[$TypeName]
```

Now, we come to the somewhat more intricate part—the dynamic creation of parameters:

```
$paramDictionary = [RuntimeDefinedParameterDictionary]::new()
foreach($TypeParameterElement in $Parameters){
    $paramDictionary.add($TypeParameterElement,$([RuntimeDefinedParameter]::new(
        $TypeParameterElement,
        [String],
        [Attribute[]]@(
            [Parameter]::new()
        )
    )))
}
```

In this section, we iterate through all the parameters in the '$Parameters' array. For each parameter, we create a 'ParameterAttribute,' 'RuntimeDefinedParameter,' and 'AttributeCollection' with the utmost efficiency and structural clarity. These objects are then added to the 'RuntimeDefinedParameterDictionary.' After completing these steps, we return this dictionary as the final component of the DynamicParam section in the function, bringing it all together:

```
function New-MermaidGitGraphEntry {
    [CmdletBinding()]
    [alias("New-MermaidGitGraphEntryCommit","New-MermaidGitGraphEntryBranch","New-MermaidGitGraphEntryCheckout","New-MermaidGitGraphEntryMerge")]
    param()
    dynamicparam{
        $TypeParameter = [ordered]@{
            "commit"    = @("id","tag","type")
            "Branch"    = @("name")
            "Merge"     = @("name","id","tag","type")
            "Checkout"  = @("name")
            "Cherrypick"= @("id")
        }
        $TypeName = $PSCmdlet.MyInvocation.InvocationName -replace 'New-MermaidGitGraphEntry'
        $Parameters = $TypeParameter[$TypeName]
        $paramDictionary = [RuntimeDefinedParameterDictionary]::new()
        foreach($TypeParameterElement in $Parameters){
            $paramDictionary.add($TypeParameterElement,$([RuntimeDefinedParameter]::new(
                $TypeParameterElement,
                [String],
                [Attribute[]]@(
                    [Parameter]::new()
                )
            )))
        }
        # Return the collection of dynamic parameters
        $paramDictionary
        
    }
    end {
        
    }
}


```

In the 'end' block, I managed to respond to the different output behaviors for each type. Although a detailed overview and technical insights into using Smart Aliases in combination with dynamic parameters based on a live example exceed the scope of this post, you can explore the function in its entirety in the [PSMermaid-Function](https://github.com/HCRitter/PSMermaid/blob/main/Public/GitGraph/New-MermaidGitGraphEntry.ps1) repository.

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)

### Conclusion

In this blog post, we delved into the intriguing concept of 'Smart Aliases' and how they can be harnessed effectively in PowerShell. By combining these aliases with Dynamic Parameters, I demonstrated how to simplify the process of creating a GitGraph in Mermaid. This technique allowed us to reduce the number of functions required for the task while maintaining a consistent naming style throughout the project.

The key takeaway here is that PowerShell offers powerful features that can be creatively leveraged to streamline complex tasks and improve code maintainability. 'Smart Aliases' are just one example of how you can enhance your PowerShell scripts and functions to make them more versatile and user-friendly. By embracing such techniques, you can become a more efficient and effective PowerShell developer.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards, Christian.
