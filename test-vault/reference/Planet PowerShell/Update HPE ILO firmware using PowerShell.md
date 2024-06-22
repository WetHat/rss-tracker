---
author: "Catalin Cristescu"
published: 2024-01-02T16:34:41.000Z
link: https://powershell.ro/update-hpe-ilo-firmware-using-powershell/
id: https://powershell.ro/?p=205
feed: "Planet PowerShell"
tags: [rss/Powershell,rss/VMWare,rss/connect-hpeilo,rss/disconnect-hpeilo,rss/firmware,rss/get-hpeilo,rss/HPEiLOCmdlets,rss/hpeilocmdlets〭4〭0〭0,rss/iloaddress,rss/powercli,rss/set-hpeilo]
pinned: false
---
> [!abstract] Update HPE ILO firmware using PowerShell by Catalin Cristescu - 2024-01-02T16:34:41.000Z
> The first script of 2024 is about updating the HPE ILO firmware on physical servers using PowerShell. Firmware updates, including those for iLO, often include bug fixes, security patches, and performance enhancements. Regularly updating iLO firmware ensures that your servers are equipped with the latest features, improvements, and security measures, reducing the risk of vulnerabilities […]

🔗Read article [online](https://powershell.ro/update-hpe-ilo-firmware-using-powershell/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Update HPE ILO firmware using PowerShell]]
- - -
The first script of 2024 is about updating the HPE ILO firmware on physical servers using PowerShell.

Firmware updates, including those for iLO, often include bug fixes, security patches, and performance enhancements. Regularly updating iLO firmware ensures that your servers are equipped with the latest features, improvements, and security measures, reducing the risk of vulnerabilities and enhancing overall system stability.

### The PowerShell Script:

The script is designed to connect to a ILO remote board, iterate through each one, and perform the firmware update as needed.

Just to be noted that it was tested on ILO 5 on more than 200 HPE physical servers.

# 1. Import the HPEiLOCmdlets module
Import-Module -Name "C:\temp\hpeilocmdlets.4.0.0\HPEiLOCmdlets.psd1"

# 2. Declare a variable to use for the connection
$ILOAccount = Get-Credential

# HPE ILO cmdlets connect to iLO
# Reading iLO addresses from a text file
$ILOAddresses = Get-Content -Path "C:\temp\ilotargets.txt"

# Loop through each iLO address
foreach ($ILOAddress in $ILOAddresses) {

    # Establishing a connection to the iLO
    $Connection = Connect-HPEiLO -Address $ILOAddress -Credential $ILOAccount -DisableCertificateAuthentication:$true -Timeout 60 -Verbose

    # 3. Checking the iLO firmware version before updating
    Get-HPEiLOFirmwareVersion -Connection $Connection | Select-Object Hostname, FirmwareVersion 

    # 4. Upgrading the HPE iLO firmware
    $task = Update-HPEiLOFirmware -Connection $Connection -Location "C:\temp\ilo5_300.fwpkg" -UploadTimeout 300 -UpdateRepository:$true -TPMEnabled:$true -confirm:$false

}


 # Loop through each iLO address
foreach ($ILOAddress in $ILOAddresses) {   

    # Reconnect to iLO after the update
    $Connection = Connect-HPEiLO -Address $ILOAddress -Credential $ILOAccount -DisableCertificateAuthentication:$true -Timeout 60

    # 5. Checking the iLO firmware version after updating
    Get-HPEiLOFirmwareVersion -Connection $Connection | Select-Object Hostname, FirmwareVersion

# Disconnect from iLO after completing the updates
Disconnect-HPEiLO -Connection $Connection
}

This script does the following:

1. Imports the HPEiLOCmdlets module.
2. Declares a variable for the iLO account credentials.
3. Reads iLO addresses from a text file.
4. Connects to each iLO using the provided credentials and addresses.
5. Checks the iLO firmware version before updating.
6. Updates the iLO firmware using the specified package.
7. Reconnects to iLO after the update.
8. Checks the iLO firmware version again after updating.
9. Disconnects from iLO after completing the updates.

Feel free to customize this script based on your specific reporting requirements and share your experiences or improvements in the comments below!

It should be noted that the script is not entirely authored by me; certain information and code snippets are sourced from various places, including blogs, GitHub repositories, and community forums.

![Loading](https://powershell.ro/wp-content/plugins/page-views-count/ajax-loader-2x.gif)
