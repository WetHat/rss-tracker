---
author: "Catalin Cristescu"
published: 2023-12-06T19:39:53.000Z
link: https://powershell.ro/powercli-script-to-check-cluster-overcommitment-ratio/
id: https://powershell.ro/?p=201
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/VMWare,rss/cpu_ratio,rss/overcommit,rss/pCPU,rss/powercli,rss/vCPU,rss/vexpert]
pinned: false
---
> [!abstract] PowerCLI script to check Cluster Overcommitment ratio by Catalin Cristescu - 2023-12-06T19:39:53.000Z
> Efficient resource utilization is a key factor in maintaining a healthy VMware vSphere environment. As virtualization environments grow, it becomes crucial to monitor and optimize resource allocation to prevent overcommitment, ensuring the smooth operation of virtual machines. In this blog post, we’ll explore a PowerCLI script designed to check the Cluster Overcommitment Ratio, providing valuable […]

🔗Read article [online](https://powershell.ro/powercli-script-to-check-cluster-overcommitment-ratio/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[PowerCLI script to check Cluster Overcommitment ratio]]
- - -
Efficient resource utilization is a key factor in maintaining a healthy VMware vSphere environment. As virtualization environments grow, it becomes crucial to monitor and optimize resource allocation to prevent overcommitment, ensuring the smooth operation of virtual machines. In this blog post, we’ll explore a PowerCLI script designed to check the Cluster Overcommitment Ratio, providing valuable insights into the CPU and RAM usage across your vSphere clusters.

### Understanding Cluster Overcommitment:

Cluster Overcommitment is a metric that reflects how efficiently your cluster utilizes its available resources, specifically focusing on CPU and RAM. By calculating the ratio of powered-on virtual CPUs (vCPUs) or RAM to the total physical resources, administrators can identify potential bottlenecks and optimize their infrastructure.

### The PowerCLI Script:

The script is designed to connect to a vCenter server, iterate through each cluster, and generate a detailed report containing key metrics.

param(
    [String]$vcenter,
    [String]$userName,
    [String]$password
)

# Import required modules
Import-Module -Name VMware.VimAutomation.Core -ErrorAction SilentlyContinue
Import-Module -Name "C:\temp\importexcel.7.8.4\importexcel.psd1" -ErrorAction SilentlyContinue

# Set PowerCLI configuration
Set-PowerCLIConfiguration -ProxyPolicy NoProxy -DefaultVIServerMode multiple -Scope User -InvalidCertificateAction ignore -Confirm:$false | Out-Null

# Connect to vCenter
try {
    Connect-VIServer -Server $vcenter -User $userName -Password $password -ErrorAction Stop | Out-Null
} catch [VMware.VimAutomation.ViCore.Types.V1.ErrorHandling.InvalidLogin] {
    Write-Host "Cannot connect to $vcenter with provided credentials" -ForegroundColor Red
    return
} catch [VMware.VimAutomation.Sdk.Types.V1.ErrorHandling.VimException.ViServerConnectionException] {
    Write-Host "Cannot connect to $vcenter - check IP/FQDN" -ForegroundColor Red
    return
} catch {
    Write-Host "Cannot connect to $vcenter - Unknown error" -ForegroundColor Red
    return
}

# Get all the clusters
$clusters = Get-Cluster
$data = @()

# Loop through the clusters and extract the required data
foreach ($cluster in $clusters) {
    $vmhosts = Get-VMHost -Location $cluster
    $num_esxis = $vmhosts.Count
    
    # Calculate cluster metrics
    $ClusterPoweredOnvCPUs = (Get-VM -Location $cluster | Where-Object {$_.PowerState -eq "PoweredOn" }).NumCpu | Measure-Object -Sum
    $ClusterCPUCores = ($vmhosts.NumCpu | Measure-Object -Sum).Sum

    $ClusterPoweredOnvRAM = (Get-VM -Location $cluster | Where-Object {$_.PowerState -eq "PoweredOn" }).MemoryGB | Measure-Object -Sum
    $ClusterPhysRAM = ($vmhosts.MemoryTotalGB | Measure-Object -Sum).Sum

    $oneesxi = if ($num_esxis) { $num_esxis - 1 } else { $null }
    $coresPerESXi = if ($num_esxis) { $ClusterCPUCores / $num_esxis } else { $null }
    $coresPerClusterMinusOne = $coresPerESXi * $oneesxi
    $TotalCoresPerClusterMinusOne = [Math]::Round($coresPerClusterMinusOne)

    $ramPerESXi = $ClusterPhysRAM / $num_esxis
    $ramPerClusterMinusOne = $ramPerESXi * $oneesxi
    $TotalRAMPerClusterMinusOne = [Math]::Round($ramPerClusterMinusOne)

    # Create an ordered hashtable for each cluster
    $property = [ordered]@{
        "vCenter" = $vcenter
        "Cluster Name" = $cluster.Name
        "Number of ESXi servers" = $num_esxis
        "pCPU" = $ClusterCPUCores
        "vCPU" = (Get-VM -Location $cluster | Measure-Object NumCpu -Sum).Sum
        "PoweredOn vCPUs" = $ClusterPoweredOnvCPUs.Sum
        "vCPU:pCPU Ratio" = [Math]::Round($ClusterPoweredOnvCPUs.Sum / $ClusterCPUCores, 3)
        "vCPU:pCPU Ratio with one ESXi failed" = [Math]::Round($ClusterPoweredOnvCPUs.Sum / $TotalCoresPerClusterMinusOne, 3)
        "CPU Overcommit (%)" = [Math]::Round(100 * ($ClusterPoweredOnvCPUs.Sum / $ClusterCPUCores), 3)
        'pRAM(GB)' = $ClusterPhysRAM
        'vRAM(GB)' = [Math]::Round((Get-VM -Location $cluster | Measure-Object MemoryGB -Sum).Sum, 2)
        'PoweredOn vRAM (GB)' = $ClusterPoweredOnvRAM.Sum
        'vRAM:pRAM Ratio' = [Math]::Round($ClusterPoweredOnvRAM.Sum / $ClusterPhysRAM, 3)
        "vRAM:pRAM Ratio with one ESXi failed" = [Math]::Round($ClusterPoweredOnvRAM.Sum / $TotalRAMPerClusterMinusOne, 3)
        'RAM Overcommit (%)' = [Math]::Round(100 * ($ClusterPoweredOnvRAM.Sum / $ClusterPhysRAM), 2)
    }

    # Add the hashtable to the data array
    $data += New-Object -TypeName psobject -Property $property
}

# Export the data to an Excel file
$filePath = "C:\temp\$($vcenter).xlsx"
$data | Export-Excel -Path $filePath -AutoSize -TableName "Data"

# Disconnect from vCenter
Disconnect-VIserver -Server $vcenter -Confirm:$false

Feel free to customize this script based on your specific reporting requirements and share your experiences or improvements in the comments below!

It should be noted that the script is not entirely authored by me; certain information and code snippets are sourced from various places, including blogs, GitHub repositories, and community forums.

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
