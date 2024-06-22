---
author: "Kieran Jacobsen"
published: 2023-06-17T04:15:00.000Z
link: http://poshsecurity.com/blog/installing-powershell-on-orange-pi-one
id: 4ff94561c4aaf2f6d6ca85ec:54265bcbe4b09ad45b272dbf:648be1d85ad34e0ff498a507
feed: "Planet PowerShell"
tags: [rss/PowerShell]
pinned: false
---
> [!abstract] Installing PowerShell on Orange PI One by Kieran Jacobsen - 2023-06-17T04:15:00.000Z
> Hi Everyone,
> 
> I was a long-term user of [Monitor-io](https://www.monitor-io.com/), and I was saddened to hear that had planned to shutdown their services on April 15, 2023. I was excited to hear that unlike many IoT vendors, Monitor-io had made the decision to provide an option for their customers to continue to use their devices in a standalone manner.
> 
> ![](https://images.squarespace-cdn.com/content/v1/4ff94561c4aaf2f6d6ca85ec/1ac64dd7-6ca5-4010-b74a-6a3bf2df4b2e/monitor-io-e1534697753892.png?f⋯

🔗Read article [online](http://poshsecurity.com/blog/installing-powershell-on-orange-pi-one). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Installing PowerShell on Orange PI One]]
- - -
Hi Everyone,

I was a long-term user of [Monitor-io](https://www.monitor-io.com/), and I was saddened to hear that had planned to shutdown their services on April 15, 2023. I was excited to hear that unlike many IoT vendors, Monitor-io had made the decision to provide an option for their customers to continue to use their devices in a standalone manner.

![](https://images.squarespace-cdn.com/content/v1/4ff94561c4aaf2f6d6ca85ec/1ac64dd7-6ca5-4010-b74a-6a3bf2df4b2e/monitor-io-e1534697753892.png?format=1000w)

A Monitor-io showing its local IP address

The Monitor-io unit consists of an [Orange PI One](http://www.orangepi.org/html/hardWare/computerAndMicrocontrollers/details/Orange-Pi-One.html) and an LCD screen. The Orange Pi One is features an ARM processor – H3 Quad-core Cortex-A7, 512mb of DDR, 10/100mpbs Ethernet, and supports up to 32Gb of storage via micro-SD card. The Cortex-A7 is based off the 32bit ARMv7 instruction set, for those familiar with the Raspberry Pi, this is the same instruction set as the Pi 2 Model B.

Monitor-io provided an image based upon [Armbian](https://www.armbian.com/orange-pi-one/), and a shell script (`netmonitor.sh`) that provides basic ping checks to a list of targets listed in the `targets.conf` file using `fping`. The script updates the LCD display based upon the results from `fping`.

Before I started, I wanted to get PowerShell running. PowerShell doesn’t officially support the Orange Pi One, but there is a shared architecture, so I hopped for the best managed to get PowerShell 7.3.4 up and running.

The process was very similar to [Installing on Raspberry Pi OS](https://learn.microsoft.com/en-au/powershell/scripting/install/install-raspbian?view=powershell-7.3), use the following shell commands to download, and install the package. You will need to change the URL to match the right PowerShell version that you want to install.

```
###################################
# Prerequisites

# Update package lists
sudo apt-get update

###################################
# Download and extract PowerShell

# Grab the latest tar.gz
wget https://github.com/PowerShell/PowerShell/releases/download/v7.3.4/powershell-7.3.4-linux-arm32.tar.gz

# Make folder to put powershell
mkdir ~/powershell

# Unpack the tar.gz file
tar -xvf ./powershell-7.3.4-linux-arm32.tar.gz -C ~/powershell

###################################
# Optional - Create a symbolic link to start PowerShell without specifing path to pwsh bindar
sudo ln -s ~/powershell/pwsh /usr/bin/pwsh
```

I haven't fully tested and validated that everything is working, however items like `Invoke-WebRequest`, and `Invoke-RestMethod` both appear to function correctly. Most other basic commands also seem to be running without any issues.
