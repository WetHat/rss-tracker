---
author: "Przemyslaw Klys"
published: 2023-10-08T14:36:57.000Z
link: https://evotec.xyz/active-directory-health-check-using-microsoft-entra-connect-health-service/
id: https://evotec.xyz/?p=18421
feed: "Planet PowerShell"
tags: [rss/Active_Directory,rss/Azure,rss/Azure_AD,rss/PowerShell,rss/azure_ad,rss/health_checks,rss/microsoft_entra,rss/powershell]
pinned: false
---
> [!abstract] Active Directory Health Check using Microsoft Entra Connect Health Service by Przemyslaw Klys - 2023-10-08T14:36:57.000Z
> Active Directory (AD) is crucial in managing identities and resources within an organization. Ensuring its health is pivotal for the seamless operation of various services. Today, I decided to look at Microsoft Entra Connect Health (Azure AD Connect Health) service, which allows monitoring Azure AD Connect, ADFS, and Active Directory. This means that under a single umbrella, you can have an overview of three services health. But is it worth it?
> 
> The post [Active Directory Health Check using Micr⋯

🔗Read article [online](https://evotec.xyz/active-directory-health-check-using-microsoft-entra-connect-health-service/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Active Directory Health Check using Microsoft Entra Connect Health Service]]
- - -
**Active Directory (AD)** is crucial in managing identities and resources within an organization. Ensuring its health is pivotal for the seamless operation of various services. Today, I decided to look at **Microsoft Entra Connect Health** (**Azure AD Connect Health**) service, which allows monitoring **Azure AD Connect**, **ADFS**, and **Active Directory.** This means that under a single umbrella, you can have an overview of three services health. But is it worth it?

Before we check what this service has to offer, after reading the documentation it's clear Microsoft needs to do some updates, as depending on where you look you will find discrepancies in what the service is for. In the installation document [Install the Microsoft Entra Connect Health agents](https://learn.microsoft.com/en-us/azure/active-directory/hybrid/connect/how-to-connect-health-agent-install) there are references that this service is actually for **Microsoft Entra DS**, which is the new name for **Azure Active Directory DS**, where you explicitly can't install any agents as it's Microsoft-hosted.

> For example, to get data from your Active Directory Federation Services (AD FS) infrastructure, you must install the agent on the AD FS server and on the Web Application Proxy server. Similarly, to get data from your on-premises Microsoft Entra Domain Services (Microsoft Entra DS) infrastructure, you must install the agent on the domain controllers.

Different docs, such as [Using Microsoft Entra Connect Health with AD DS](https://learn.microsoft.com/en-us/azure/active-directory/hybrid/connect/how-to-connect-health-adds) points to support Windows Server 2008 R2, Windows Server 2012, and Windows Server 2016, skipping new versions of servers. On the other hand, the [FAQ for Microsoft Entra Connect Health](https://learn.microsoft.com/en-us/azure/active-directory/hybrid/connect/reference-connect-health-faq) correctly refers to more systems being supported and to Active Directory Domain Services (AD DS). Whether this is just a simple case of going overboard with renaming everything with **Active Directory DS** in its name to **Microsoft Entra DS**, or we are looking for a future rename of **Active Directory**, we will have to wait and see. In the meantime, let's test the **Entra Connect Health agent for AD DS** and see how it works. The FAQ document also points to different systems being supported (Windows 2008 R2 and Windows 21012 aren't up-to-date anymore), and I would trust it a bit more than the first mentioned document.

![](https://evotec.xyz/wp-content/uploads/2023/10/img_65210c6717291-888x1024.png)

### Deploying Microsoft Entra Health Agent

Deployment of agents is pretty straightforward and follows the standard process:

- Download the agent (MSI file)
- Copy it to the Domain Controller
- Run it, and let it ask you for Entra ID (Azure AD) credentials. You will require Global Admin to register a health agent.

That's it; now wait for the data to show in the Dashboard. Of course, if you have plenty of Domain Controllers, Microsoft provides the ability to install it using PowerShell.

### Microsoft Entra Health Dashboard for Active Directory (AD DS)

The dashboard is pretty minimalistic showing essential information about the domain, replication status, alerts, and basic charts for **LDAP**, **NTLM**, and **Kerberos** authentications.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f9a1ee294-974x1024.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f9a1ee294.png)

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f9cf3bd6c-974x1024.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f9cf3bd6c.png)

As you can see on the screenshots above, it also gives you a quick overview of the number of DCs monitored (out of all available) and domains within the forest and sites it sees. According to it I have 2 out of 5 DCs, two domains, and one site.

You can also deep-dive into Performance Monitors Collection where you can select multiple other counters

- ATQ estimated queue delay
- ATQ outstanding queued requests
- ATQ request latency
- ATQ threads LDAP
- ATQ threads other
- ATQ threads total
- Directory replication agent inbound bytes total per second
- Directory replication agent outbound bytes total per second
- Domain services threads in use
- Free disk space
- Kerberos authentications
- LDAP active threads
- LDAP bind time
- LDAP searches per second
- LDAP successful binds per second
- NTLM authentications per second
- Replication queue
- TCP connections established
- Used memory percentage
- Used processor percentage

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_65218e8e660c9-980x1024.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_65218e8e660c9.png)

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_65218e540e84a-980x1024.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_65218e540e84a.png)

For each chart, you can drill down, see details, and filter out data per Domain Controller

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa0e936ef-1024x804.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa0e936ef.png)

### Mix & Match with other Azure Elements

Every chart can also be sent to a global dashboard to create a mix & match with other Azure Services. Unfortunately, after I pinned a few charts to my private dashboard and came back a bit later to it –  I was greeted with **not-found** messages, making this functionality more like a gimmick.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_652191bedf3eb-1024x888.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_652191bedf3eb.png)

Maybe spending enough time fighting the dashboard, saving it multiple times, and fixing the positioning will be helpful. After playing with the dashboard for a few minutes where the data would be gone, or I had to go back to Health Service to add more charts, my patience ran out.

### Domain Controllers overview

Every element is clickable to drill down one or two levels. We can see which Domain Controllers are monitored, their status, and what roles on which DC are available. As you can see below, 2 out of 5 domain controllers are installed, and monitoring is available for them.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa33c3cdf-1024x316.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa33c3cdf.png)

After I left the newly implemented solution running for a whole night, in the morning, it suggested I only have one domain, one site, and two out of two DCs in the forest. I tried refreshing, clicking icons, and going in or out, and the data suggested that my forest suddenly is much smaller than it is.

![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f82ae1794-1024x300.png)

![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f8537f0c9-1024x521.png)

After installing another agent and waiting 5 minutes, it was able to pick up that I have another domain and and another DC.

![](https://evotec.xyz/wp-content/uploads/2023/10/img_652103d2a156b-1024x311.png)

But it still is missing two other DCs, so it left me a bit worried about deployment to production. As part of the same view, you can choose additional columns that show you critical information that is very useful for Domain Admins

- LAST UPLOADED
- LAST BOOT TIME
- PDC REACHABLE
- GC REACHABLE
- SYSVOL STATE
- DC ADVERTISED
- OS NAME

With a simple glance, you can see potential issues in your forest (as long as you condition that this isn't **live view** but monitoring with a delay).

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6521052778b4e-1024x306.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6521052778b4e.png)

As you can see above, the **Last Uploaded** column gave different times: 9:00, 9:05, and 8:55, and when I took this screenshot, it was already 9:20. After waiting a bit more, it seems the actual refresh time is **every 30 minutes**. I am also not sure if this can be adjusted. More up-to-date information would be beneficial, but maybe a bit too performance-intensive. According to FAQ, the actual impact on the given server is:

- **CPU consumption**: ~1-5% increase.
- **Memory consumption**: Up to 10 % of the total system memory.

The agent is also not supported on **Server Core,** which, if you have invested heavily for a more secure version of Windows, you're a bit out of luck on this one.

### Detecting replication failures and reviewing them

To test if the service works, I shutdown one of the **Domain Controllers**, and the service did pick it up and let me know that replication is not working correctly.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa33c3cdf-1024x316.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa33c3cdf.png)

You can also go into **Replication Status** and see what replication is failing.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f975a0e30-1024x621.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f975a0e30.png)

When any health problems are detected, an email is sent, and alerts are generated in the console, giving you a quick overview of its status.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa4ad5a2b-1024x278.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa4ad5a2b.png)

The alerts can't be suppressed or marked as fixed. They are generated automatically on error; if you set them on DC, the service will resolve them automatically. In the dashboard, you can see the history of alerts for the last 6 hours, the past 24 hours, or the past seven days. This is enough to cover day-to-day monitoring, but you can't see a more extended period to see any patterns of problems reoccurring over an extended period.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa7edb6ef-1024x198.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa7edb6ef.png)

By default, only Global Administrators get email notifications about issues with Active Directory, but it can be changed to notify any other email addresses.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa67696ff-1024x269.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520fa67696ff.png)

Once the issue is detected, the email is sent “as soon as possible.” Since I have completely shut down DC, two errors have been detected. One was a **replication issue**; the other was **LDAP ping**.

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520faf576b77-823x1024.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520faf576b77.png)

### Support for Multiple Active Directory Forests

Azure Active Directory Connect Health supports multiple forests so it's possible to register all your domains

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6521c33265665-1024x424.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6521c33265665.png)

### Licensing for Entra Connect Health Agent

While it may seem it's a free service, it requires **Azure AD Premium P1** or **P2** licenses. For every domain controller you want to monitor, you need **25 Azure AD Premium** licenses assigned to your tenant, except for **Azure AD Connect Server**, which requires **only one approval**.

- If you have **1** and **1 Azure AD Connect**, you will need **51** licenses.
- If you have **10** and **1 Azure AD Connect**, you will need **251** licenses.
- If you have **100** controllers and **2 Azure AD Connect**, you will need **2502** licenses.

Most companies who are invested in **Office 365** usually have **P1** and **P2** licenses already, as it brings other benefits to the table, so for them, it's primarily free addition.

### Pros & Cons for Microsoft Entra Connect Health

Microsoft Entra Health Service for ADDS has its pros and cons:

- Supports monitoring multiple Active Directory forests
- Agents communicate every 30 minutes. For 30 minutes, the service doesn't even notice any issues.
- I've shut down one Domain Controller (ADRODC) with no other DC being monitored in the same domain, which would potentially detect problems with replications. It took 4 hours to get a notification that the agent was not responding. For 2 hours, the server was reporting in the console as perfectly fine, and only after 4 hours did the notification come in. The only thing that gave it away that something was wrong was the Last Upload column was not updated.
- For another server, shutting it down triggered a replication error in the console on another server, but the server that was down again was reported as working as expected. It would take 4 hours to get a notification about it being down totally.
- The console started showing the first replication errors about 35 minutes after DC was shut, but it took over 80 minutes to get an email.
- In one case, it took over 2 hours to auto-resolve alerts for broken replication even though Testimo testing showed the replication works fine.
- There were occasional issues with GUI where the service would report that my Forest has only one domain and two domain controllers, and all were onboarded, where I had 2 out of 5 available. This issue fixed itself several hours later, correctly showing several domains and domain controllers.
- Some errors will auto-resolve themselves only after 72 hours from the alert generation if the same error condition doesn't happen again within that timeframe.
- The metrics provided in the console are helpful and can bring benefits if one doesn't have other systems that offer such monitoring.
- The agents upgrade themselves automatically, meaning there is very little maintenance. It either works or it doesn't.
- The agents don't require reboots during installation as long as NET 4.6.2 Framework is installed.

Overall, I believe the health service has potential and is beneficial for monitoring if you already have enough Azure AD Premium P1 or P2 licenses. **Unfortunately, this service is not super helpful if one expects real-time monitoring**.

### List of notifications supported by Microsoft Entra Connect service for ADDS

Here's a list of currently supported notifications/detections. Even without having real-time monitoring for large environments, detecting problems like this is super beneficial. Unless you have specialized software already able to deliver such detection with real-time monitoring, **Microsoft Entra Health service for ADDS** is worth investing in.

|Alert Name|Description|
|---|---|
|Domain controller is unreachable via LDAP ping|Domain Controller isn't reachable via LDAP Ping. This can be caused due to Network issues or machine issues. As a result, LDAP Pings will fail.|
|Active Directory replication error encountered|This domain controller is experiencing replication issues, which can be found by going to the Replication Status Dashboard. Replication errors may be due to improper configuration or other related issues. Untreated replication errors can lead to data inconsistency.|
|Domain controller is unable to find a PDC|A PDC isn't reachable through this domain controller. This will lead to impacted user logons, unapplied group policy changes, and system time synchronization failure.|
|Domain controller is unable to find a Global Catalog server|A global catalog server isn't reachable from this domain controller. It will result in failed authentications attempted through this Domain Controller.|
|Domain controller unable to reach local sysvol share|Sysvol contains important elements from Group Policy Objects and scripts to be distributed within DCs of a domain. The DC won't advertise itself as DC and Group Policies won't be applied.|
|Domain Controller time is out of sync|The time on this Domain Controller is outside of the normal Time Skew range. As a result, Kerberos authentications will fail.|
|Domain controller isn't advertising|This domain controller isn't properly advertising the roles it's capable of performing. This can be caused by problems with replication, DNS misconfiguration, critical services not running, or because of the server not being fully initialized. As a result, domain controllers, domain members, and other devices won't be able to locate this domain controller. Additionally, other domain controllers might not be able to replicate from this domain controller.|
|GPSVC service isn't running|If the service is stopped or disabled, settings configured by the admin won't be applied and applications and components won't be manageable through Group Policy. Any components or applications that depend on the Group Policy component might not be functional if the service is disabled.|
|DFSR and/or NTFRS services aren't running|If both DFSR and NTFRS services are stopped, Domain Controllers won't be able to replicate sysvol data. sysvol Data will be out of consistency.|
|Netlogon service isn't running|Logon requests, registration, authentication, and locating of domain controllers will be unavailable on this DC.|
|W32Time service isn't running|If Windows Time Service is stopped, date and time synchronization will be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.|
|ADWS service isn't running|If Active Directory Web Services service is stopped or disabled, client applications, such as Active Directory PowerShell, won't be able to access or manage any directory service instances that are running locally on this server.|
|Root PDC isn't Syncing from NTP Server|If you do not configure the PDC to synchronize time from an external or internal time source, the PDC emulator uses its internal clock and is itself the reliable time source for the forest. If time isn't accurate on the PDC itself, all computers will have incorrect time settings.|
|Domain controller is quarantined|This Domain Controller isn't connected to any of the other working Domain Controllers. This may be caused due to improper configuration. As a result, this DC isn't being used and won't replicate from/to anyone.|
|Outbound Replication is Disabled|DCs with disabled Outbound Replication, won't be able to distribute any changes originating within itself.|
|Inbound Replication is Disabled|DCs with disabled Inbound Replication, won't have the latest information. This condition can lead to logon failures.|
|LanmanServer service isn't running|If this service is disabled, any services that explicitly depend on it will fail to start.|
|Kerberos Key Distribution Center service isn't running|If KDC Service is stopped, users won't be able to authentication through this DC using the Kerberos v5 authentication protocol.|
|DNS service isn't running|If DNS Service is stopped, computers and users using that server for DNS purposes will fail to find resources.|
|DC had USN Rollback|When USN rollbacks occur, modifications to objects and attributes aren't inbound replicated by destination domain controllers that have previously seen the USN. Because these destination domain controllers believe they are up to date, no replication errors are reported in Directory Service event logs or by monitoring and diagnostic tools. USN rollback may affect the replication of any object or attribute in any partition. The most frequently observed side effect is that user accounts and computer accounts that are created on the rollback domain controller do not exist on one or more replication partners. Or, the password updates that originated on the rollback domain controller do not exist on replication partners.|

### Monitoring Forest Replication with Testimo for ad-hoc verifications

To finalize this blog post, here's an output from **Testimo**, which I use to verify **Forest Replication** to confirm whether it was being reported by the Health Service. Contrary to the **Health Service,** it asks every DC in the forest to deliver information about replication health. This means it can take a while to see results across large environments.

Invoke-Testimo -Sources ForestReplication

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f88309820-1024x511.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f88309820.png)

[![](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f8d00260e-1024x707.png)](https://evotec.xyz/wp-content/uploads/2023/10/img_6520f8d00260e.png)

The post [Active Directory Health Check using Microsoft Entra Connect Health Service](https://evotec.xyz/active-directory-health-check-using-microsoft-entra-connect-health-service/) appeared first on [Evotec](https://evotec.xyz).
