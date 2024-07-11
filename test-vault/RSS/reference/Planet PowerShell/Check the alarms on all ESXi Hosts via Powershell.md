---
author: "Catalin Cristescu"
published: 2023-07-29T04:51:37.000Z
link: https://powershell.ro/check-the-alarms-on-all-esxi-hosts-via-powershell/
id: https://powershell.ro/?p=82
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/VMWare,rss/alarms,rss/esxi,rss/powercli,rss/powershell,rss/vcenter,rss/vmware]
pinned: false
---
> [!abstract] Check the alarms on all ESXi Hosts via Powershell by Catalin Cristescu - 2023-07-29T04:51:37.000Z
> Recently, I had a fascinating coding experience with a script that checks alarms on all ESXi hosts from vCenters. You might wonder why I needed such a script. Well, many of us use monitoring tools, and sometimes, to avoid constant alerts while working, we disable alarms on objects in vCenter. The problem is that we […]

🔗Read article [online](https://powershell.ro/check-the-alarms-on-all-esxi-hosts-via-powershell/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Check the alarms on all ESXi Hosts via Powershell]]
- - -
Recently, I had a fascinating coding experience with a script that checks alarms on all ESXi hosts from vCenters. You might wonder why I needed such a script. Well, many of us use monitoring tools, and sometimes, to avoid constant alerts while working, we disable alarms on objects in vCenter. The problem is that we often forget to turn them back on once we’re done.

To address this issue, I designed a script with several parts. First, it imports the essential PowerCLI module. Then, it connects to each vCenter from a list. After that, it cleverly retrieves the alarm status for each host and cluster. This way, we can stay focused on our work without getting overwhelmed by alerts and avoid missing critical alarms once our tasks are completed. It’s a simple yet practical script that can significantly improve our workflow!

---

## Prerequisites

#### PowerCLI module

To install the PowerCLI module, use the following command.

    Install-Module -Name VMware.PowerCLI -Force -AllowClobber -Confirm:$false

Afterward, run the following command to avoid SSL connection issues with vCenter.

Set-PowerCLIConfiguration -ProxyPolicy NoProxy -DefaultVIServerMode Multiple -Scope User -InvalidCertificateAction Ignore -Confirm:$false | Out-Null

The primary two properties which we are querying it are:

- The first property, “ExtensionData.AlarmActionsEnabled,” helps us determine whether the Alarm on the object is set to TRUE or FALSE. This means we can check if the Alarm is active or not, giving us valuable insights into its current state.
- The second property, “ConnectionState,” serves a different purpose. It allows us to check whether the Host is in maintenance mode or not. Specifically, we are interested in the “Connected” state, which tells us that the Host is up and running smoothly.

## Script functionality:

- Import the PowerCLI module
- Connects to each vCenter defined into the $vCenters array.
- For each ESXI host and Cluster found in the vCenter, it retrieves the value of the “ExtensionData.AlarmActionsEnabled” property.
- The script will export the results to a CSV file, making it super easy to analyze the data later. Specifically, it will focus on the objects where Alarms are Disabled or the ConnectionState is not Connected.

### Script

# Ensure PowerCLI module is installed
if (-not (Get-Module -Name VMware.VimAutomation.Core -ErrorAction SilentlyContinue)) {
    Install-Module -Name VMware.PowerCLI -Force -AllowClobber -Confirm:$false
}

# Import the PowerCLI module
Import-Module -Name VMware.PowerCLI -ErrorAction SilentlyContinue

# Set PowerCLI Configuration
Set-PowerCLIConfiguration -ProxyPolicy NoProxy -DefaultVIServerMode Multiple -Scope User -InvalidCertificateAction Ignore -Confirm:$false | Out-Null

# Get credentials from command line arguments
$Username = ""
$Password = ""

# Get the current date in yyyy.M.d format
$CurrentDate = Get-Date -Format 'yyyy.M.d'

# List of vCenters to connect to
$VCenters = @(
    "VCSA1",
    "VCSA2"
)

foreach ($VCU in $VCenters) {
    # Connect to vCenter
    try {
        Connect-VIServer -Server $VCU -User $Username -Password $Password -ErrorAction Stop | Out-Null
    } catch [VMware.VimAutomation.ViCore.Types.V1.ErrorHandling.InvalidLogin] {
        Write-Host "Cannot connect to $VCU with provided credentials" -ForegroundColor Red
        Continue
    } catch [VMware.VimAutomation.Sdk.Types.V1.ErrorHandling.VimException.ViServerConnectionException] {
        Write-Host "Cannot connect to $VCU - check IP/FQDN" -ForegroundColor Red
        Continue
    } catch {
        Write-Host "Cannot connect to $VCU - Unknown error" -ForegroundColor Red
        Continue
    }

    $output = @()
    $hosts = Get-VMHost

    # Loop through each ESX host
    foreach ($ESXHost in $hosts) {
        $cluster = Get-Cluster -VMHost $ESXHost
        $alarms = $ESXHost.ExtensionData.AlarmActionsEnabled
        $alarma = if ($alarms -eq "True") { "Enabled" } else { "Disabled" }

        $property = [ordered]@{
            "vCenter" = $VCU
            "Host" = $ESXHost.Name
            "Cluster" = $cluster
            "Alarms" = $alarma
            "ConnectionState" = $ESXHost.ConnectionState
        }
        $output += New-Object -TypeName PSObject -Property $property
    }

    # Loop through each cluster
    $clusters = Get-Cluster
    foreach ($ClusterClu in $clusters) {
        $alarmsClu = $ClusterClu.ExtensionData.AlarmActionsEnabled
        $alarmaClu = if ($alarmsClu -eq "True") { "Enabled" } else { "Disabled" }

        $property = [ordered]@{
            "vCenter" = $VCU
            "Host" = "N/A"
            "Cluster" = $ClusterClu
            "Alarms" = $alarmaClu
            "ConnectionState" = "N/A"
        }
        $output += New-Object -TypeName PSObject -Property $property
    }

    # Export to CSV where Alarms are Disabled or ConnectionState is not Connected
    $output | Where-Object { $_.Alarms -eq "Disabled" -or $_.ConnectionState -ne "Connected" } |
        Export-Csv "C:\temp\MailReport\MailReport_$($CurrentDate)_SAM.csv" -NoTypeInformation -Append

    # Disconnect from vCenter
    Disconnect-VIServer -Server $VCU -Confirm:$false
}

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
