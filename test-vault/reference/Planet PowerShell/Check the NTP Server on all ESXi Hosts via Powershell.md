---
author: "Catalin Cristescu"
published: 2023-07-26T18:32:37.000Z
link: https://powershell.ro/check-the-ntp-server-on-all-esxi-hosts-via-powershell/
id: https://powershell.ro/?p=75
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/VMWare,rss/ntp_server,rss/ntp_service,rss/powercli,rss/powershell,rss/script]
pinned: false
---
> [!abstract] Check the NTP Server on all ESXi Hosts via Powershell by Catalin Cristescu - 2023-07-26T18:32:37.000Z
> An effective approach for checking the NTP server and NTP Service on all ESXi hosts from a vCenter server is through a Powershell script. This Powershell script has been developed to perform the following tasks: To automate the process, the script can be configured to run as a Scheduled Task on a Windows server. Furthermore, […]

🔗Read article [online](https://powershell.ro/check-the-ntp-server-on-all-esxi-hosts-via-powershell/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Check the NTP Server on all ESXi Hosts via Powershell]]
- - -
An effective approach for checking the NTP server and NTP Service on all ESXi hosts from a vCenter server is through a Powershell script.

This Powershell script has been developed to perform the following tasks:

1. Establish a connection to a vCenter server.
2. Query all the ESXi hosts to retrieve the configured NTP Server information.
3. Query all the ESXi hosts to obtain the status of the NTP Service.
4. Compile the gathered information into a list and dispatch it via mail to a designated distribution list.

To automate the process, the script can be configured to run as a Scheduled Task on a Windows server.

Furthermore, for scalability, the script can be modified with the option to set up a list of vCenters and iterate through them using a foreach loop in the script.

### Script

#rss/requires -modules VMware.VimAutomation.Core
 
param (
    [CmdletBinding()]
    [Parameter(Mandatory = $true)]
    [string]$VCenter,
      
    [Parameter(Mandatory = $true)]
    [string]$Username,
      
    [Parameter(Mandatory = $true)]
    [string]$Password,
      
    [Parameter(Mandatory = $false)]
    [string]$Email
)
  
Import-Module -Name VMware.VimAutomation.Core -ErrorAction SilentlyContinue
Set-PowerCLIConfiguration -ProxyPolicy NoProxy -DefaultVIServerMode multiple -Scope User -InvalidCertificateAction ignore -Confirm:$false | Out-Null
  
# Connection to vCenter
try {
    Connect-VIServer -Server $VCenter -User $Username -Password $Password -ErrorAction Stop | Out-Null
}
catch [VMware.VimAutomation.ViCore.Types.V1.ErrorHandling.InvalidLogin] {
    Write-Host "Cannot connect to $VCenter with provided credentials" -ForegroundColor Red
    Continue
}
catch [VMware.VimAutomation.Sdk.Types.V1.ErrorHandling.VimException.ViServerConnectionException] {
    Write-Host "Cannot connect to $VCenter - check IP/FQDN" -ForegroundColor Red
    Continue
}
catch {
    Write-Host "Cannot connect to $VCenter - Unknown error" -ForegroundColor Red
    Continue
}

$NTPdetails = Get-VMHost | Sort-Object Name | Select-Object Name, 
           @{Name="NTPServer";Expression={ $_ | Get-VMHostNtpServer }},
           @{Name="ServiceStatus";Expression={(Get-VMHostService -VMHost $_ | Where-Object {$_.key -eq "ntpd" }).Running }}


# Email global variables
    $ReportTime = Get-Date -Format yyyy.M.d
    $MailTitle = "NTP status from $vcenter"

    $SMTPServer = "SMTP_SERVER"
    $From = "noreply@youremail.com"
    $Timeout = "60"
    $Subject = "$MailTitle $((Get-Date).ToShortDateString())"
    $Message = New-Object System.Net.Mail.MailMessage
  
    $Body = $NTPdetails | ConvertTo-Html
    $Message.Subject = $Subject
    $Message.Body = $Body
    $Message.IsBodyHtml = $true
    $Message.To.Add($Email)
    $Message.From = $From
    $Message.Attachments.Add($AttachmentFile)
    $SMTP = New-Object System.Net.Mail.SmtpClient $SMTPServer
    $SMTP.Send($Message)
}

Disconnect-VIServer -Server $vcenter -Confirm:$false

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
