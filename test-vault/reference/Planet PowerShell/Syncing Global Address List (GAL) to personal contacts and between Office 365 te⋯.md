---
author: "Przemyslaw Klys"
published: 2023-12-03T15:32:13.000Z
link: https://evotec.xyz/syncing-global-address-list-gal-to-personal-contacts-and-between-office-365-tenants-with-powershell/
id: https://evotec.xyz/?p=18406
feed: "Planet PowerShell"
tags: [rss/Exchange,rss/Microsoft_Graph,rss/Office_365,rss/PowerShell,rss/api,rss/exchange,rss/microsoft_graph,rss/office_365,rss/powershell]
pinned: false
---
> [!abstract] Syncing Global Address List (GAL) to personal contacts and between Office 365 tenants with PowerShell by Przemyslaw Klys - 2023-12-03T15:32:13.000Z
> Hey there! Today, I wanted to introduce you to one of the small but excellent module I've created called the O365Synchronizer. This module focuses on synchronizing contacts and users. If you've ever been tasked with synchronizing Global Address Lists (GAL) across different Office 365 tenants or just wanted to sync GAL with user mailboxes so they can access contacts directly on their phones, this tool is for you.
> 
> The post [Syncing Global Address List (GAL) to personal contacts and between Office⋯

🔗Read article [online](https://evotec.xyz/syncing-global-address-list-gal-to-personal-contacts-and-between-office-365-tenants-with-powershell/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Syncing Global Address List (GAL) to personal contacts and between Office 365 te⋯]]
- - -
Hey there! Today, I wanted to introduce you to one of the small but excellent module I've created called the [**O365Synchronizer**](https://github.com/EvotecIT/O365Synchronizer). This module focuses on synchronizing contacts and users. If you've ever been tasked with synchronizing Global Address Lists (GAL) across different Office 365 tenants or just wanted to sync GAL with user mailboxes so they can access contacts directly on their phones, this tool is for you.

Think of [**O365Synchronizer**](https://github.com/EvotecIT/O365Synchronizer) as your new best friend in Office 365 synchronization needs. It's like having a magic wand that smoothly aligns your contact lists across various domains and even directly into user inboxes.

While several tools on the market do similar stuff, I was tempted to write my own. I hope you enjoy it!

**O365Synchronizer** aims to close two problems that I've encountered when working with Office 365:

- Synchronizing Users and contacts to personal mailboxes to allow them to be visible on mobile phones without the necessity to go through GAL
- Synchronizing Users as contacts between tenants (**Tenant A** gets users as contacts in **Tenant B**)

Most of the time, when you want to achieve either of those two, you have to resort to paid solutions. While I have nothing against the paid solutions (and I would like to get paid myself), it's a bit expensive for what it's needed for, in my honest opinion.

### Synchronizing members and contacts to user personal contacts using Sync-O365PersonalContact

**O365Synchronizer** utilizes **Microsoft Graph API** to get the users/contacts from **Office 365** tenants and then pushes them using Microsoft Graph API to the user mailbox as contacts. Once **Contacts** are created, when the command is rerun, it compares existing **Contacts** for any changes and updates them if necessary. If the user gets removed from the tenant and is no longer on the source, it will also be removed from the user's mailbox. By default, the **Sync-O365PersonalContact** command uses **GUID** to distinguish contacts created by it from existing user contacts. It uses it to track what contacts it adds and only manages those, leaving existing user contacts untouched.

$ClientID = '9e1b3c'
$TenantID = 'ceb371f6'
$ClientSecret = 'nQF8Q'

# connect to Microsoft Graph API
$Credentials = [pscredential]::new($ClientID, (ConvertTo-SecureString $ClientSecret -AsPlainText -Force))
Connect-MgGraph -ClientSecretCredential $Credentials -TenantId $TenantID -NoWelcome

# synchronize contacts for two users of two types (Member, Contact) using GUID prefix
Sync-O365PersonalContact -UserId 'test@evotec.pl', 'test1@evotec.pl' -Verbose -MemberTypes 'Member', 'Contact' -GuidPrefix 'O365Synchronizer' -WhatIf -PassThru | Format-Table *

As you can see above, to synchronize all users/contacts to two users, all you have to do is run two commands:

- **Connect-MgGraph** to authorize the tenant
- **Sync-O365PersonalContact** and use the **UserId** parameter to provide the UPN of users you want to deliver with synchronization of Members/Contacts.

Once executed, you get

[![](https://evotec.xyz/wp-content/uploads/2023/12/img_656b644cea972-1024x668.png)](https://evotec.xyz/wp-content/uploads/2023/12/img_656b644cea972.png)

Now, if we change the command to **exclude Members** and only synchronize contacts, you will see that it starts removing members and leaving only contacts in place.

[![](https://evotec.xyz/wp-content/uploads/2023/12/img_656b6d54a5694-1024x742.png)](https://evotec.xyz/wp-content/uploads/2023/12/img_656b6d54a5694.png)

Notice that we have a **WhatIf** switch to quickly test it before running wild. Using the **PassThru** parameter allows you to take the output from that command and send it to email or build a report around it.

The following permissions are required to use this functionality:

- **User.Read.All** – to read users
- **OrgContact.Read.All** – to read contacts
- **Contacts.ReadWrite** – to write contacts

### Synchronizing users as contacts between tenants using Sync-O365Contact

The second functionality is doable using the **Sync-O365Contact** command. It's a bit different in what it does, as it uses the **ExchangeOnlineManagement** PowerShell module to synchronize contacts between tenants. The process is a bit different because we need to contact **Tenant A** using **Microsoft Graph API** but then synchronize those users/objects as contacts to **Tenant B**.

Currently, the Source objects to synchronize are objects provided by **Get-MgUser**. Still, providing functionality to synchronize objects from Active Directory, Exchange, or even external systems should be doable if there's a need for that.

# Source tenant (read only)
$ClientID = '9e1b3c36'
$TenantID = 'ceb371f6'
$ClientSecret = 'NDE8Q'

$Credentials = [pscredential]::new($ClientID, (ConvertTo-SecureString $ClientSecret -AsPlainText -Force))
Connect-MgGraph -ClientSecretCredential $Credentials -TenantId $TenantID -NoWelcome

$UsersToSync = Get-MgUser | Select-Object -First 5

# Destination tenant (writeable)
$ClientID = 'edc4302e'
Connect-ExchangeOnline -AppId $ClientID -CertificateThumbprint '2EC710' -Organization 'xxxxx.onmicrosoft.com'
Sync-O365Contact -SourceObjects $UsersToSync -Domains 'evotec.pl', 'gmail.com' -Verbose -WhatIf -LogPath 'C:\Temp\Logs\O365Synchronizer.log' -LogMaximum 5

This command works a bit differently when synchronizing users. You provide users to synchronize but also state from **which domain** those users are. Once the power starts running, it expects to control users from these specific fields. If users created in your **target tenant** are not on the list provided, those contacts will be deleted. If they exist in **source**, they **will get updated**. Essentially the command assumes complete control in **adding, removing or updating contacts** for given domains.

[![](https://evotec.xyz/wp-content/uploads/2023/12/img_656b7266b8d78-1024x423.png)](https://evotec.xyz/wp-content/uploads/2023/12/img_656b7266b8d78.png)

It's essential to reiterate! **Those contacts will be removed if you have contacts in the target tenant that are not on the source lists for given domains**. For the sake of exercise, if I tell it to synchronize the first 15 users but skip the first 5, the output will show that we are adding some new users, but at the same time, we try to remove those that already exist.

$UsersToSync = Get-MgUser | Select-Object -First 15 -Skip 5

[![](https://evotec.xyz/wp-content/uploads/2023/12/img_656b74fe51ba5-1024x681.png)](https://evotec.xyz/wp-content/uploads/2023/12/img_656b74fe51ba5.png)

Of course, I'm **showing one-way sync**, but nothing stops you from reverting commands, getting users from the target tenant, and pushing them to the source tenant. I would expect, however, that this would be done in another script by the admin of the second tenant, but in theory, you could just run it in a single **PowerShell** script.

The following permissions are required on the source tenant to use this functionality:

- **User.Read.All** – to read users

On target tenant, you should use:

- **Exchange.ManageAsApp** – to read/write contacts in Exchange (remember to add application to **Exchange Recipient Administrator** role)

## Installing the module

Installing **O365Synchronizer** (or updating) is as easy as executing a single command

Install-Module O365Synchronizer -Force -Verbose

To review sources or build your version of my module, you can find the project on the O365Synchronize GitHub page.

The post [Syncing Global Address List (GAL) to personal contacts and between Office 365 tenants with PowerShell](https://evotec.xyz/syncing-global-address-list-gal-to-personal-contacts-and-between-office-365-tenants-with-powershell/) appeared first on [Evotec](https://evotec.xyz).
