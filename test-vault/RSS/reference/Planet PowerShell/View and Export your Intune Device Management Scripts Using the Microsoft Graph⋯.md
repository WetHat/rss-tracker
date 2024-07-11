---
author: "Brad Wyatt"
published: 2024-03-15T12:10:55.000Z
link: https://www.thelazyadministrator.com/2024/03/15/view-and-export-your-intune-device-management-scripts-using-the-microsoft-graph-powershell-sdk/
id: https://www.thelazyadministrator.com/?p=3828
feed: "Planet PowerShell"
tags: [rss/Uncategorized]
pinned: false
---
> [!abstract] View and Export your Intune Device Management Scripts Using the Microsoft Graph PowerShell SDK by Brad Wyatt - 2024-03-15T12:10:55.000Z
> # Introduction
> 
> If you’re familiar with Intune, you’re likely aware of its capability to deploy platform or PowerShell scripts to your endpoint devices. Unfortunately, once you upload your script to the portal, there is (at the time of writing this) no easy way to view the script content or download it.
> 
> # Resolution
> 
> To quickly and easily get Intune scripts, I created a function that allows me to export all the scripts from a tenant en masse and view them in the shell or terminal. Sometimes, I ⋯

🔗Read article [online](https://www.thelazyadministrator.com/2024/03/15/view-and-export-your-intune-device-management-scripts-using-the-microsoft-graph-powershell-sdk/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[View and Export your Intune Device Management Scripts Using the Microsoft Graph⋯]]
- - -
# Introduction

If you’re familiar with Intune, you’re likely aware of its capability to deploy platform or PowerShell scripts to your endpoint devices. Unfortunately, once you upload your script to the portal, there is (at the time of writing this) no easy way to view the script content or download it.

# Resolution

To quickly and easily get Intune scripts, I created a function that allows me to export all the scripts from a tenant en masse and view them in the shell or terminal. Sometimes, I am auditing a new tenant and have no need to download the scripts to my local machine; I need to audit the code behind it to get an idea of what is being performed. Additionally, I added some other quality-of-life features that I did not find in other scripts online.

## Features

### Platform Agnostic

The function will work on PowerShell Core (pwsh) and Windows PowerShell. Allowing … [Continue...](https://www.thelazyadministrator.com/2024/03/15/view-and-export-your-intune-device-management-scripts-using-the-microsoft-graph-powershell-sdk/)

The post [View and Export your Intune Device Management Scripts Using the Microsoft Graph PowerShell SDK](https://www.thelazyadministrator.com/2024/03/15/view-and-export-your-intune-device-management-scripts-using-the-microsoft-graph-powershell-sdk/) first appeared on [The Lazy Administrator](https://www.thelazyadministrator.com).
