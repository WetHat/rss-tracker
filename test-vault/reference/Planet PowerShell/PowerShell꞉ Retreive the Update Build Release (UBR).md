---
author: "Christian Ritter"
published: 2023-11-22T14:24:59.000Z
link: https://devdojo.com/hcritter/powershell-retreive-the-update-build-release-ubr
id: https://devdojo.com/11803
feed: "Planet PowerShell"
tags: [rss/microsoft,rss/windows,rss/powershell,rss/ubr,rss/update,rss/release,rss/registry,rss/intune,rss/graph]
pinned: false
---
> [!abstract] PowerShell: Retreive the Update Build Release (UBR) by Christian Ritter - 2023-11-22T14:24:59.000Z
> In the realm of PowerShell, determining the version of the operating system is a common task for sysadmins. However, when it comes to reporting, extracting additional details, such as the Update Build Release (UBR), becomes crucial. While the Winver tool is a popular choice for obtaining the build, including the UBR, PowerShell provides a more versatile approach.
> 
> ### Unveiling the UBR: Going Beyond the Basics
> 
> #### Registry Magic
> 
> One way to retrieve the UBR is through the registry:
> 
> ###### Pow⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-retreive-the-update-build-release-ubr). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell꞉ Retreive the Update Build Release (UBR)]]
- - -
In the realm of PowerShell, determining the version of the operating system is a common task for sysadmins. However, when it comes to reporting, extracting additional details, such as the Update Build Release (UBR), becomes crucial. While the Winver tool is a popular choice for obtaining the build, including the UBR, PowerShell provides a more versatile approach.

### Unveiling the UBR: Going Beyond the Basics

#### Registry Magic

One way to retrieve the UBR is through the registry:

###### PowerShell:

```
(Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' –Name UBR).UBR
```

###### Output:

```
3570
```

This straightforward command quickly fetches the UBR, but what if you need more comprehensive information?

#### Exploring Get-ComputerInfo

To delve deeper into the operating system details, the Get-ComputerInfo command is a powerful tool. Specifically, the 'OsHardwareAbstractionLayer' property contains the complete string with the UBR:

###### PowerShell:

```
(Get-ComputerInfo).OsHardwareAbstractionLayer
```

###### Output:

```
10.0.19041.3570
```

##### Harnessing the [System.Version] Class

For a structured representation of the version information, the [System.Version] class proves invaluable. While [System.Environment]::OSVersion.Version provides the basics, including Major, Minor, Build, and Revision, it lacks the UBR. To include the UBR, cast the 'OsHardwareAbstractionLayer' property:

###### PowerShell:

```
[Version](Get-ComputerInfo).OsHardwareAbstractionLayer
```

###### Output:

```
Major  Minor  Build  Revision
-----  -----  -----  --------
10     0      19041  3570
```

Now, the output displays the detailed version information, including the UBR.

### Scaling Up: Managing Multiple Systems

But what if you're dealing with multiple computers? PowerShell offers a solution. Introducing Microsoft Graph, and if you are leveraging Intune, you can seamlessly fetch information from the cloud:

###### PowerShell:

```
import-module microsoft.graph.devicemanagement
[Version](Get-MGDeviceManagementManagedDevice -Filter "deviceName eq 'YouNameIt'").OSVersion
```

###### Output:

```
Major  Minor  Build  Revision
-----  -----  -----  --------
10     0      19041  3570
```

This method enables you to obtain the necessary information from the cloud with a simple Microsoft Graph call, making it especially handy for managing multiple devices efficiently.

#### Building Your PowerShell Toolbelt

In conclusion, by combining registry queries, Get-ComputerInfo, and the [System.Version] class, you've crafted a robust toolkit for extracting detailed operating system information. Whether you're working on a single machine or managing an entire fleet of devices through the cloud, PowerShell equips you with the flexibility to streamline your patching processes.

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards, Christian
