---
author: "Catalin Cristescu"
published: 2023-09-14T09:55:41.000Z
link: https://powershell.ro/get-ha-events-of-vm-restart-from-vcenter/
id: https://powershell.ro/?p=169
feed: "Planet PowerShell"
tags: [rss/Powershell,rss/VMWare,rss/HA,rss/High_Availability,rss/vm_restart,rss/vmware]
pinned: false
---
> [!abstract] Get HA events of VM restart from vCenter by Catalin Cristescu - 2023-09-14T09:55:41.000Z
> When the High Availability (HA) feature is active within your vCenter cluster, it provides an automated solution for handling host failures by seamlessly restarting VMs on alternative ESXi hosts within the same cluster. This process generates a detailed event log documenting each restart, and you have the option to utilize a PowerCLI script to extract […]

🔗Read article [online](https://powershell.ro/get-ha-events-of-vm-restart-from-vcenter/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Get HA events of VM restart from vCenter]]
- - -
When the High Availability (HA) feature is active within your vCenter cluster, it provides an automated solution for handling host failures by seamlessly restarting VMs on alternative ESXi hosts within the same cluster.

This process generates a detailed event log documenting each restart, and you have the option to utilize a PowerCLI script to extract a comprehensive list of the restarted VMs.

Despite searching online for scripts that perform this VM list retrieval task, I was unable to locate a suitable solution. Consequently, I took matters into my own hands and developed a custom script for this purpose. While numerous blog posts contain cmdlets for retrieving VM restart events, they does not include the listing of the specific VMs affected by these events.

### Script

# HA VM reset day(s) number
$HAVMresetold = 1
# HA VM restart day(s) number
$HAVMrestartold = (Get-Date).AddDays(-2)

$Date = Get-Date
Write-Host "..Checking HA VM restart"
$HAVMrestartlist = @(Get-VIEvent -MaxSamples 100000 -Start $HAVMrestartold -Type Warning | Where {$_.FullFormattedMessage -match "restarted"} | select CreatedTime,FullFormattedMessage |sort CreatedTime -Descending)
If (($HAVMrestartlist | Measure-Object).count -gt 0) {

                $regexPattern = "virtual machine (\w+) on host"
                $matches = [Regex]::Matches($HAVMrestartlist.FullFormattedMessage, $regexPattern)
                
                $output = @()
                foreach ($match in $matches) {
                    $serverName = $match.Groups[1].Value
                    Write-Host "Server Name: $serverName"

                    $property = @{"Server" = $serverName}
                    $output += New-Object -TypeName psobject -Property $property
      }	
}
$output

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
