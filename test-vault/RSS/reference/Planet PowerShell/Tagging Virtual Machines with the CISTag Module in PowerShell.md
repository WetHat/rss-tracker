---
author: "Catalin Cristescu"
published: 2024-02-01T13:15:32.000Z
link: https://powershell.ro/tagging-virtual-machines-with-the-cistag-module-in-powershell/
id: https://powershell.ro/?p=225
feed: "Planet PowerShell"
tags: [rss/Automation,rss/Powershell,rss/VMWare,rss/CISCore,rss/CISTAG,rss/Get-CISTag,rss/modify_vm_tag,rss/New-CISTagAssignment,rss/powercli,rss/vcenter,rss/vm_tag_management,rss/vm_tags]
pinned: false
---
> [!abstract] Tagging Virtual Machines with the CISTag Module in PowerShell by Catalin Cristescu - 2024-02-01T13:15:32.000Z
> In this blog post, we’ll explore the process of assigning tags to multiple VMs using the CIStag module in PowerShell. This becomes necessary when the conventional PowerCLI module for tagging VMs fails, as was the case for me. Discovering a solution in a VMware blog post (https://blogs.vmware.com/PowerCLI/2018/12/new-tag-management-module.html), I learned about the CIStag module for effective […]

🔗Read article [online](https://powershell.ro/tagging-virtual-machines-with-the-cistag-module-in-powershell/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Tagging Virtual Machines with the CISTag Module in PowerShell]]
- - -
In this blog post, we’ll explore the process of assigning tags to multiple VMs using the CIStag module in PowerShell. This becomes necessary when the conventional PowerCLI module for tagging VMs fails, as was the case for me.

Discovering a solution in a VMware blog post (https://blogs.vmware.com/PowerCLI/2018/12/new-tag-management-module.html), I learned about the CIStag module for effective VM tag management. After downloading and installing the module on my Windows server, I proceeded to utilize it for assigning tags to VMs.

The script provided in this post is specifically designed to establish a connection with a vCenter server, extract a list of VMs from the input file, and then assign the appropriate tags.

The VMware.Community.CISTag module enhances vSphere tag management by leveraging the vSphere REST API for improved automation. With functions like tag gathering, assignment, and removal, it addresses challenges in larger environments. Notable performance improvements, such as a 25% speed boost in environments with 400 tags, make it a valuable resource. Downloadable from the PowerCLI Community Repository, the module also exhibits increased reliability, overcoming common issues like timeout errors. Users are encouraged to explore and share their experiences with this powerful tool.

### The script:

The script is designed to connect to a vCenter server, get list of VMs from the input file and assign the tag.

# Import required modules
Import-Module -Name VMware.Community.CISTag
Import-Module -Name VMware.VIMAutomation.Cis.Core

# Get vCenter Server credentials
$VCSACreds = Get-Credential

# Connect to vCenter Server
Connect-CisServer -Server VCSA_FQDN -Credential $VCSACreds

# Read VM names from input file
$vms = Get-Content -Path "input_file.txt"

# Specify the tag to be assigned
$TAGName = "No Job"

# Loop through each VM and assign the tag
foreach ($VM in $vms) {
    Write-Host "Configuring 'No Job' tag for $VM"
    New-CISTagAssignment -Tag (Get-CISTag -Name $TAGName).Name -Entity $VM 
    Write-Host "Configuration completed for $VM"
}

# Disconnect from vCenter Server
Disconnect-CisServer -Server VCSA_FQDN -Confirm:$false

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
