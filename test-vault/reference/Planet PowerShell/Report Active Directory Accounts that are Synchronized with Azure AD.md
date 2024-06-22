---
author: "Przemyslaw Klys"
published: 2023-08-07T13:21:18.000Z
link: https://evotec.xyz/report-active-directory-accounts-that-are-synchronized-with-azure-ad/
id: https://evotec.xyz/?p=18284
feed: "Planet PowerShell"
tags: [rss/Active_Directory,rss/Azure_AD,rss/PowerShell,rss/active_directory,rss/ad,rss/azure_ad,rss/microsoft_graph,rss/powershell]
pinned: false
---
> [!abstract] Report Active Directory Accounts that are Synchronized with Azure AD by Przemyslaw Klys - 2023-08-07T13:21:18.000Z
> I was scrolling X (aka Twitter) today and saw this blog post, "PowerShell: Report On-Premises Active Directory Accounts that are Synchronized with Azure AD Connect" by Kevin Trent. I like reading blog posts as I tend to learn some new things and see how people tend to solve their problems.
> 
> The post [Report Active Directory Accounts that are Synchronized with Azure AD](https://evotec.xyz/report-active-directory-accounts-that-are-synchronized-with-azure-ad/) appeared first on [Evotec](https://evo⋯

🔗Read article [online](https://evotec.xyz/report-active-directory-accounts-that-are-synchronized-with-azure-ad/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Report Active Directory Accounts that are Synchronized with Azure AD]]
- - -
I was scrolling X (aka Twitter) today and saw this blog post, [PowerShell: Report On-Premises Active Directory Accounts that are Synchronized with Azure AD Connect](https://techbloggingfool.com/2023/07/28/powershell-report-on-premises-active-directory-accounts-that-are-synchronized-with-azure-ad-connect/?utm_source=dlvr.it&utm_medium=twitter), by Kevin Trent. I like reading blog posts as I tend to learn some new things and see how people tend to solve their problems. Upon reading the provided code, two things stood out to me:

- usage of the AzureAD module, which is going to stop working on March 2024 (if Microsoft won't change it again)
- using **Get-AzureADUser** inside the **Select-Object** statement

Here's what that solution looks like:

Import-Module ActiveDirectory
Connect-AzureAD

Get-ADUser -Filter {Enabled -EQ $True} -Properties *  | 
    Select-Object DisplayName, SamAccountName, UserPrincipalName, LastLogonDate,           
    @{N="AzureADSynced"; E={(Get-AzureADUser -ObjectID $_.UserPrincipalName |
    Select-Object -Property DirSyncEnabled).DirsyncEnabled}} | 
Export-Csv $env:userprofile\documents\On-Prem_CloudSynced_Accounts.csv

While this solution will work for the next couple of months and may work for 200 users, Kevin mentioned it would have difficulty querying **1000, 10000, or 50000** users. It will either take hours to finish or never finish at all. Aside from the obvious that for each user, a call will need to be made to **Azure AD** to get just one property, **Active Directory** doesn't like a pipeline. It may work very well most of the time, but as soon as something runs longer, it will start throwing errors.

- [Get-ADObject : The server has returned the following error: invalid enumeration context.](https://evotec.xyz/get-adobject-the-server-has-returned-the-following-error-invalid-enumeration-context/)

It will not happen every time, maybe even never, but if it will, you will spend hours debugging what's wrong and how to fix it. When working with the **ActiveDirectory** module, I wasted lots of time finally dropping the pipeline altogether.

## How to do it right?

So what is the solution to both mentioned problems?

- **Microsoft Graph**, which is the new API to query and work with data associated with **Microsoft Office 365** and similar
- **Hashtables**/**OrderedDictionary** as a way to cache data and do two queries  – one to AD, one to **Azure AD** (aka **Microsoft Entra ID**)

**Microsoft Graph** doesn't have the best marketing in the world but whether you like it or not it's here to stay. With every new technology, there are some bumps that may need to be ironed out, but once you get used to some ideas, it's pretty easy. Discussing Microsoft Graph is quite a big topic in itself so I'll focus on the essential details for this post – replicating precisely what the author achieved but using a bit different way. To get you started – install the module first:

Install-Module Microsoft.Graph.Users

Once we got that out of the way, here's the code that Kevin wrote more than two lines, but probably ten times faster, using Microsoft Graph and achieving the same thing in less time.

Connect-MgGraph -Scopes "User.Read.All"

$AzureUsers = Get-MgUser -All -Property 'OnPremisesSyncEnabled', 'DisplayName', 'UserPrincipalName','Id','Mail'
$Users = Get-ADUser -Filter "Enabled -eq '$True'" -Properties *

$CacheAzure = [ordered] @{}
foreach ($User in $AzureUsers) {
    $CacheAzure[$User.UserPrincipalName] = $User
}
$AllUsers = foreach ($User in $Users) {
    if ($CacheAzure[$User.UserPrincipalName]) {
        if ($CacheAzure[$User.UserPrincipalName].OnPremisesSyncEnabled) {
            $Synchronized = $true
        } else {
            $Synchronized = $false
        }
    } else {
        $Synchronized = $false
    }
    [PSCustomObject] @{
        DisplayName       = $User.DisplayName
        SamAccountName    = $User.SamAccountName
        UserPrincipalName = $User.UserPrincipalName
        LastLogonDate     = $User.LastLogonDate
        AzureADSynced     = $Synchronized
    }
}
$AllUsers | Format-Table -AutoSize

Using **caching with Hashtables** is super fast, and using only two queries instead 201 (1 for AD and 200 per user to Azure AD) will be much quicker and less of a problem for the backend. Using Microsoft Graph on the other end will get you to switch to future Microsoft API instead of relying on deprecated modules. To summarize:

- **Avoid pipeline with Get-ADUser** or similar cmdlets as it will bite you hard sooner or later
- **Don't use the AzureAD** module and switch to Microsoft Graph
- Learn how **Hashtables are great.** You can learn from my mistakes from [How I didn't know how powerful and fast hashtables are](https://evotec.xyz/how-i-didnt-know-how-powerful-and-fast-hashtables-are/)

The post [Report Active Directory Accounts that are Synchronized with Azure AD](https://evotec.xyz/report-active-directory-accounts-that-are-synchronized-with-azure-ad/) appeared first on [Evotec](https://evotec.xyz).
