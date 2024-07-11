---
author: "Przemyslaw Klys"
published: 2023-07-20T07:07:41.000Z
link: https://evotec.xyz/connect-mggraph-keyset-does-not-exist/
id: https://evotec.xyz/?p=18223
feed: "Planet PowerShell"
tags: [rss/Microsoft_Graph,rss/PowerShell,rss/connet-mggraph,rss/graph,rss/graph-sdk,rss/microsoft_graph,rss/powershell]
pinned: false
---
> [!abstract] Connect-MgGraph: Keyset does not exist by Przemyslaw Klys - 2023-07-20T07:07:41.000Z
> I had this little issue today when I tried to schedule the Microsoft Graph script to run as a service account on a certificate. To my surprise, even tho I had all permissions required, I was getting this error message: Connect-MgGraph: Keyset does not exist. Something that didn't show up for my user.
> 
> The post [Connect-MgGraph: Keyset does not exist](https://evotec.xyz/connect-mggraph-keyset-does-not-exist/) appeared first on [Evotec](https://evotec.xyz).

🔗Read article [online](https://evotec.xyz/connect-mggraph-keyset-does-not-exist/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Connect-MgGraph꞉ Keyset does not exist]]
- - -
I had this little issue today when I tried to schedule the Microsoft Graph script to run as a service account on a certificate. To my surprise, even tho I had all permissions required, I was getting this error message: **Connect-MgGraph: Keyset does not exist**. Something that didn't show up for my user.

![](https://evotec.xyz/wp-content/uploads/2023/07/img_64b7a2ae8d8dd.png)

The message indicated my process has difficulty reaching the key of my chosen certificate. Trying to run the scheduled task with the highest privileges didn't change anything. Since **Connect-MGGraph** doesn't support PFX files, you must upload the certificate to the **Local Machine store** and refer to it via **Thumbprint**.

## Fixing Connect-MgGraph: Keyset does not exist

When using **certificates as a standard user,** I usually do it in the following way:

Connect-MgGraph -CertificateThumbprint '9135E5CF311C051A' -ClientId 'a7b8a419' -TenantId '5e94ad53'

The problem is – it only works for certificates in the user store. When you switch to **Local Machine Store**, **Connect-MGGraph** no longer sees the certificate, so you need to change to a different connection method.

$Thumbprint = '9135E5CF'
$LocalMachineCert = Get-ChildItem -Path Cert:\LocalMachine -Recurse | Where-Object { $_.Thumbprint -eq $Thumbprint }
Connect-MgGraph -ClientId 'a7b8a419' -TenantId '5e94ad53' -Certificate $LocalMachineCert

This way, we tell **Connect-MgGaph** to use the **LocalMachine** Certificate store, but while it worked for me when testing it using my account, things were not so great when trying it as a service account. Fortunately, there's an easy fix for that. We need to allow that particular service account access to private keys for that specific certificate.

[![](https://evotec.xyz/wp-content/uploads/2023/07/img_64b7b44f1057e.png)](https://evotec.xyz/wp-content/uploads/2023/07/img_64b7b44f1057e.png)

Add a missing service account with proper permissions, and you're ready!

[![](https://evotec.xyz/wp-content/uploads/2023/07/img_64b7b47b6fc39.png)](https://evotec.xyz/wp-content/uploads/2023/07/img_64b7b47b6fc39.png)

Of course, you need to do it on your proper certificate, not the Razer Chroma SDK certificate, as shown in the screenshot.

The post [Connect-MgGraph: Keyset does not exist](https://evotec.xyz/connect-mggraph-keyset-does-not-exist/) appeared first on [Evotec](https://evotec.xyz).
