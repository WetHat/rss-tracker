---
author: "Przemyslaw Klys"
published: 2023-08-01T06:22:34.000Z
link: https://evotec.xyz/function-cannot-be-created-because-function-capacity-4096-has-been-exceeded-for-this-scope/
id: https://evotec.xyz/?p=18256
feed: "Planet PowerShell"
tags: [rss/PowerShell,rss/aliases,rss/errors,rss/functions,rss/limits,rss/powershell,rss/windows_powershell]
pinned: false
---
> [!abstract] Function cannot be created because function capacity 4096 has been exceeded for this scope by Przemyslaw Klys - 2023-08-01T06:22:34.000Z
> I had a long day today when my long-running script (10 hours) gave me weird errors with Microsoft Graph for Teams. Finally, I solved my mistakes and reran the hand to see if the report would be complete this time. Surprisingly, it gave me an error I'd never seen before. "Function cannot be created because function capacity 4096 has been exceeded for this scope". The error is at least weird because it's shown on a production server where I've just a handful of PowerShell modules installed, and I'⋯

🔗Read article [online](https://evotec.xyz/function-cannot-be-created-because-function-capacity-4096-has-been-exceeded-for-this-scope/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Function cannot be created because function capacity 4096 has been exceeded for⋯]]
- - -
I had a long day today when my long-running script (10 hours) gave me weird errors with **Microsoft Graph for Teams**. Finally, I solved my mistakes and reran the hand to see if the report would be complete this time. Surprisingly, it gave me an error I'd never seen before. “Function cannot be created because function capacity 4096 has been exceeded for this scope“. The error is at least weird because it's shown on a production server where I've just a handful of PowerShell modules installed, and I've never seen it on my development machine where I've over 200 modules.

![](https://evotec.xyz/wp-content/uploads/2023/07/img_64c7f9eecc525-e1690870897736.png)

The error means I've loaded more than 4096 functions within my scope, and the script was ruined after running for 4 hours. In my particular case, the ExchangeOnlineManagement module broke my script. Still, it can happen anytime if too many variables, functions, or aliases are used.

## Fixing Function cannot be created because function capacity 4096 has been exceeded

It seems **Windows PowerShell** has few built-in variables that define how many functions, aliases, and variables you can have before stopping you from using more. You can verify this with handy command `Get-Variable Max*Count`.

[![](https://evotec.xyz/wp-content/uploads/2023/07/img_64c7fd681e335.png)](https://evotec.xyz/wp-content/uploads/2023/07/img_64c7fd681e335.png)

As you can see above, **Aliases**, **Drives**, **Errors**, **Functions**, **History**, and **Variables** all have their maximum values set. After so many years I've spent using PowerShell, I've never exceeded those values. I guess it's the first time for everything. Fortunately, it's an easy fix. We need to change maximum values to something sane.

$MaximumFunctionCount = 8192
$MaximumVariableCount = 8192

After using those two lines of code before running my time-consuming report – my problems were **NOT** solved! After investigation, I realized that I was connecting to Exchange which triggers imports of commands inside the module scope and not as part of the Global scope. This means I need to change it as part of the module and make sure to target the Script scope.

if ($PSVersionTable.PSEdition -eq 'Desktop') {
    $Script:MaximumFunctionCount = 18000
    $Script:MaximumVariableCount = 18000
}

Remember that this fix only applies to Windows PowerShell and not PowerShell 7. PowerShell 7 is unaffected by this as those values were sometimes removed in 2016 in PR – [Remove most Maximum* capacity variables #2363](https://github.com/PowerShell/PowerShell/pull/2363).

## How many functions module have?

While my problem was solved, I was curious about what module has the highest number of functions and how it was even possible that I could reach this limit. After a simple query as below – it seems the biggest offenders are the newest **Microsoft. Graph** PowerShell modules that have even 800 functions in one module. Just using a few of those can quickly get you in trouble. Fortunately, I usually use PowerShell 7 as my daily driver unless there's a specific reason not to. Unfortunately, I have other issues with PS 7 that sometimes force me back to PowerShell 5.1, like incompatibility between modules and DLL conflicts. But that's a story for another time.

$Modules = Get-Module -ListAvailable
$ListModules = foreach ($Module in $Modules) {
    [PScustomObject] @{
        Name          = $Module.Name
        Version       = $Module.Version
        FunctionCount = ($Module.ExportedFunctions).Count
    }
}
$ListModules | Sort-Object -Property FunctionCount -Descending | Format-Table -AutoSize

[![](https://evotec.xyz/wp-content/uploads/2023/07/img_64c8068f684ec.png)](https://evotec.xyz/wp-content/uploads/2023/07/img_64c8068f684ec.png)

The post [Function cannot be created because function capacity 4096 has been exceeded for this scope](https://evotec.xyz/function-cannot-be-created-because-function-capacity-4096-has-been-exceeded-for-this-scope/) appeared first on [Evotec](https://evotec.xyz).
