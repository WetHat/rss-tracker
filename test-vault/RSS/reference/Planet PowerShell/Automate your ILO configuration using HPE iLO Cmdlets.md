---
author: "Catalin Cristescu"
published: 2023-08-04T19:22:12.000Z
link: https://powershell.ro/automate-your-ilo-configuration-using-hpe-ilo-cmdlets/
id: https://powershell.ro/?p=138
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/gen10_servers,rss/HPEiLOCmdlets,rss/ilo,rss/powershell,rss/proliant,rss/vmware]
pinned: false
---
> [!abstract] Automate your ILO configuration using HPE iLO Cmdlets by Catalin Cristescu - 2023-08-04T19:22:12.000Z
> Automation, automation, automation – this is the key, once again! Why waste 15-20 minutes configuring the ILO boards manually when we have the HPE iLO Cmdlets to automate the process? In this article, I will introduce some PowerShell cmdlets for ILO configuration. Additionally, I will continue updating the post with new ones. Prerequisites We need […]

🔗Read article [online](https://powershell.ro/automate-your-ilo-configuration-using-hpe-ilo-cmdlets/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Automate your ILO configuration using HPE iLO Cmdlets]]
- - -
Automation, automation, automation – this is the key, once again!

Why waste 15-20 minutes configuring the ILO boards manually when we have the HPE iLO Cmdlets to automate the process?

In this article, I will introduce some PowerShell cmdlets for ILO configuration. Additionally, I will continue updating the post with new ones.

#### Prerequisites

We need the HPEiLOCmdlets module, which you can get from Powershell Gallery. To install the PowerCLI module, use the following command.

    Install-Module -Name HPEiLOCmdlets -Confirm:$false

HPE ILO Cmdlets from Powershell Gallery link is : https://www.powershellgallery.com/packages/HPEiLOCmdlets/4.2.0.0

### Script

First we need to declare some variables and connect to our HPE ILO remote board.

$ILOname = "your_Ilo_Name"
$Creds = Get-Credential
$hostname = ""
$domain = ""
$ntpserver = ""
$dnsserver1 = ""
$dnsserver2 = ""

$connection = Connect-HPEiLO -Address $ILOname -Credential $Creds -DisableCertificateAuthentication:$true -Timeout 60 -Verbose

Below you can find some usefull cmdlets and what they are doing:

###### Power-Off the server

Set-HPeiLOServerPower -Connection $connection -Power Off -Force -ErrorAction Continue

#rss/to get the status use the following cmdlet
(Get-HPEiLOServerPower -Connection $Connection ).Power

###### IPv6 Network settings

#rss/this cmdlet will disable IPV6 on the Dedicated interface

Set-HPEiLOIPv6NetworkSetting -Connection $connection -InterfaceType Dedicated -RegisterDDNSServer Disabled -DHCPv6StatefulMode Disabled -DHCPv6DNSServer Disabled -DHCPv6RapidCommit Disabled -DHCPv6StatelessMode Disabled -DHCPv6SNTPSetting Disabled -DHCPv6DomainName Disabled -StatelessAddressAutoConfiguration Disabled

###### IPv4 Network Settings

#rss/this cmdlet will set the DNS servers on the IPv4 dedicated interface and ILO hostname, domain and enable the PingGateway
$dnstype = ,@("Primary","Secondary")
$dnsserver = ,@("$dnsserver1","$dnsserver2")
Set-HPEiLOIPv4NetworkSetting -Connection $connection -InterfaceType Dedicated -DNSName $hostname -DomainName $Domain -RegisterDDNSServer Disabled -DNSServerType $dnstype -DNSServer $dnsserver -PingGateway Enabled

###### NTP Settings

# set the NTP server and the timezone to CET
Set-HPEiLOSNTPSetting -Connection $connection -InterfaceType Dedicated -Timezone "CET" -SNTPServer "$ntpserver"

###### Create ILO user

#add a local user and set the login priviledges
Add-HPEiLOUser -connection $connection -LoginName "ILOnewUser" -Username "ILOnewUser" -Password "ilopassword" -LoginPrivilege Yes -RemoteConsolePrivilege Yes -VirtualMediaPrivilege Yes -VirtualPowerAndResetPrivilege Yes -IloConfigPrivilege Yes

###### Disconnect ILO session

#rss/use this cmdlet to disconnect your powershell session
Disconnect-HPEiLO -Connection $connection 

What tasks did we covered :

1. Shutting down the server.
2. Configuring the IPv4 network settings for the Dedicated interface.
3. “Disabling the IPv6 network settings for the Dedicated interface.
4. Configuring the SNTP
5. Adding a local user.
6. Disconnecting the current session.

Keep you posted !

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
