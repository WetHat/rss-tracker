---
author: "Catalin Cristescu"
published: 2023-10-11T18:45:28.000Z
link: https://powershell.ro/get-ha-events-of-host-restart-from-vcenter/
id: https://powershell.ro/?p=184
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/VMWare,rss/Event_Monitoring,rss/HA_(High_Availability),rss/Infrastructure_Monitoring,rss/powercli,rss/powershell,rss/scripting,rss/vmware]
pinned: false
---
> [!abstract] Get HA events of Host restart from vCenter by Catalin Cristescu - 2023-10-11T18:45:28.000Z
> Part II of this post Get HA events of VM restart from vCenter – PowerShell.ro In part I of getting the HA events we have searched for the VM restart events. Now, I wanted to search for the HA events of Host restart and add it to an object, using this Powershell object later for […]

🔗Read article [online](https://powershell.ro/get-ha-events-of-host-restart-from-vcenter/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Get HA events of Host restart from vCenter]]
- - -
Part II of this post [Get HA events of VM restart from vCenter – PowerShell.ro](https://powershell.ro/get-ha-events-of-vm-restart-from-vcenter/)

In part I of getting the HA events we have searched for the VM restart events. Now, I wanted to search for the HA events of Host restart and add it to an object, using this Powershell object later for other scope.

In this blog post, we’ll explore a PowerShell script designed to monitor Host Availability (HA) events in a VMware environment. The script focuses on detecting instances where a HA host has failed and provides information about the host.

### Script Breakdown

1. **Configuration Settings:**
    - `$HAHostrestart`: A boolean flag indicating whether to check for HA host restarts.
    - `$maxevents`: Maximum number of events to retrieve.
    - `$searchperiod`: Number of days to search for HA events.
    - `$stopevents` and `$startevents`: Define the time range for event retrieval.
2. **Checking HA Host Restart:**
    - The script begins by checking if the HA host restart check is enabled (`$HAHostrestart` is set to `$true`).
    - If enabled, it fetches the relevant HA events within the specified time range using `Get-VIEvent`.
3. **Processing HA Host Events:**
    - If there are events, the script filters them to include only events related to HA host failures.
    - Extracted host names are processed to obtain server names and fully qualified domain names (FQDNs).
    - A custom object is created for each host, containing the server name and FQDN.
4. **Output:**
    - The server names of affected hosts are then displayed.

### Conclusion

This PowerShell script offers a streamlined way to monitor HA host restarts in a VMware environment. By leveraging the VMware PowerCLI module, users can easily customize and integrate this script into their infrastructure monitoring solutions.

Monitoring HA events is crucial for maintaining the reliability and availability of virtualized environments. This script provides a foundation for building more comprehensive monitoring and alerting systems tailored to specific organizational needs.

Feel free to adapt and expand upon this script to suit your environment, and stay tuned for more PowerShell insights!

### Script

# HA VM restart log

$HAHostrestart = $true
$maxevents = 250000
$searchperiod = 1
$stopevents = Get-Date
$startevents = $stopevents - (New-TimeSpan -Days $searchperiod)

# Get Host HA events
if ($HAHostrestart) {
    Write-Host "..Checking HA Host restart"
    
    $HAHostrestartlist = Get-VIEvent -Start $startevents -Finish $stopevents -MaxSamples $maxevents | Where-Object { $_.EventTypeID -eq "com.vmware.vc.HA.DasHostFailedEvent" }

    if ($HAHostrestartlist.Count -gt 0) {
        $vmHosts = $HAHostrestartlist | Where-Object { $_.EventTypeId -eq "com.vmware.vc.HA.DasHostFailedEvent" } | Select-Object ObjectName -ExpandProperty ObjectName

        $outputHost = foreach ($matchhost in $vmHosts) {
            $matchhostname = $matchhost.Split(".")[0]
            [PSCustomObject]@{
                Server = $matchhostname
                FQDN = $matchhost
            }
        }

        $outputHost.Server
    }
}

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
