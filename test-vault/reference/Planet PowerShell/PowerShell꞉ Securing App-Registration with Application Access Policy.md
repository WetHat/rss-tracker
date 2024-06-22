---
author: "Christian Ritter"
published: 2023-11-24T08:59:54.000Z
link: https://devdojo.com/hcritter/powershell-securing-app-registration-with-application-access-policy
id: https://devdojo.com/11811
feed: "Planet PowerShell"
tags: [rss/secure,rss/powershell,rss/microsoft_graph,rss/app_registration,rss/application_access_policy]
pinned: false
---
> [!abstract] PowerShell: Securing App-Registration with Application Access Policy by Christian Ritter - 2023-11-24T08:59:54.000Z
> In the rapidly evolving landscape of Entra ID, the use of App-Registrations has become increasingly prevalent, empowering users to seamlessly leverage PowerShell and the Microsoft Graph API for fundamental tasks in Exchange-Online, Entra ID, Intune, and related domains.
> 
> However, the challenge arises in the potential for App-Registrations to possess expansive access, allowing them to target all objects within a designated scope, such as all mailboxes, when set to "Application Scope" permission.
> ⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-securing-app-registration-with-application-access-policy). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell꞉ Securing App-Registration with Application Access Policy]]
- - -
In the rapidly evolving landscape of Entra ID, the use of App-Registrations has become increasingly prevalent, empowering users to seamlessly leverage PowerShell and the Microsoft Graph API for fundamental tasks in Exchange-Online, Entra ID, Intune, and related domains.

However, the challenge arises in the potential for App-Registrations to possess expansive access, allowing them to target all objects within a designated scope, such as all mailboxes, when set to "Application Scope" permission.

Addressing this concern, organizations can implement Application Access Policies, offering meticulous control over access permissions for specific resources like Calendars, Contacts, Mail, and Mailbox settings. Notably, these policies can only be configured through PowerShell, necessitating the ExchangeOnlineManagement Module for execution.

A crucial step in this process involves designating a mail-enabled security group as the policy target, ensuring a focused approach to access control. Although the policy cannot be applied to an individual mailbox, having a lone member in the security group is acceptable. Creating such a group is straightforward with the provided PowerShell command:

```
$groupParams = @{
    Name = "AAP_AppReg_SG"
    Alias = "AAPAppRegSG"
    Type = "security"
    PrimarySMTPAddress = "AAPAppRegSG@contoso.com"
    Members = @("ironman@contoso.com", "thor@contoso.com", "captainamerica@contoso.com")
}
New-DistributionGroup @groupParams
```

Following this, the next imperative is creating the Application Access Policy using PowerShell:

```
$policyParams = @{
    AppId = $AppID
    PolicyScopeGroupId = "AAPAppRegSG@contoso.com"
    AccessRight = "RestrictAccess"
    Description = "Restrict this app to members of distribution group AAPAppRegSG."
}
New-ApplicationAccessPolicy @policyParams
```

By implementing these measures, App Registrations are refined to exclusively target designated resources—specifically, our superhero mailboxes. Verification of this tailored access can be conducted using the Test-ApplicationAccessPolicy command:

```
Test-ApplicationAccessPolicy -Identity "The.Joker@contoso.com" -AppId $AppID
```

In conclusion, the integration of Application Access Policies serves as a pivotal strategy for organizations aiming to strike a balance between harnessing the capabilities of App-Registrations and maintaining precise control over access to critical resources. This approach not only fortifies security but also ensures a seamless and focused utilization of PowerShell and the Microsoft Graph API within the Entra ID environment.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards, Christian

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)
