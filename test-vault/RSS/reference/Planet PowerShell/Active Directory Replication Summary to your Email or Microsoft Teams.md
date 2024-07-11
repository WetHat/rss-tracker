---
author: "Przemyslaw Klys"
published: 2024-04-17T19:25:32.000Z
link: https://evotec.xyz/active-directory-replication-summary-to-your-email/
id: https://evotec.xyz/?p=18630
feed: "Planet PowerShell"
tags: [rss/Active_Directory,rss/PowerShell,rss/active_directory,rss/powershell,rss/replication]
pinned: false
---
> [!abstract] Active Directory Replication Summary to your Email or Microsoft Teams by Przemyslaw Klys - 2024-04-17T19:25:32.000Z
> Active Directory replication is a critical process that ensures the consistent and up-to-date state of directory information across all domain controllers in a domain. Monitoring this process is important as it helps identify any issues that may arise and resolve them quickly. One way to monitor Active Directory replication is by using the Repadmin command-line tool. Repadmin provides a wealth of information about the replication status and health of a domain. However, manually checking the Repa⋯

🔗Read article [online](https://evotec.xyz/active-directory-replication-summary-to-your-email/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Active Directory Replication Summary to your Email or Microsoft Teams]]
- - -
**Active Directory replication** is a critical process that ensures the consistent and up-to-date state of directory information across all domain controllers in a domain. Monitoring this process is important as it helps identify any issues that may arise and resolve them quickly. One way to monitor **Active Directory** replication is by using the Repadmin command-line tool. **Repadmin** provides a wealth of information about the replication status and health of a domain. However, manually checking the **Repadmin** output can be time-consuming and tedious, and running it manually every 30 minutes just to check if everything is great doesn't seem like a great idea. While **PowerShell** has its own commands around replication I've not found something as fast and reliable as **repadmin /replsummary**.

### Replication Summary to an email

So, as part of my advanced **Active Directory** module called [**ADEssentials**](https://github.com/EvotecIT/ADEssentials), I wrote a function that uses repadmin to generate results. Then, I use [**PSWriteHTML**](https://github.com/EvotecIT/PSWriteHTML) to process them and [**Mailozaurr**](https://github.com/EvotecIT/Mailozaurr) to send them to my email. Here's a how I did it:

$ReplicationSummary = Get-WinADForestReplicationSummary -IncludeStatisticsVariable Statistics

$Body = EmailBody {
    EmailImage -Source 'https://evotec.xyz/wp-content/uploads/2021/04/Logo-evotec-bb.png' -UrlLink '' -AlternativeText 'Logo' -Width 181 -Heigh 57 -Inline

    EmailText -Text "Dear ", "AD Team," -LineBreak
    EmailText -Text "Upon reviewing the resuls of replication I've found: "
    EmailList {
        EmailListItem -Text "Servers with good replication: ", $($Statistics.Good) -Color Black, SpringGreen -FontWeight normal, bold
        EmailListItem -Text "Servers with replication failures: ", $($Statistics.Failures) -Color Black, Red -FontWeight normal, bold
        EmailListItem -Text "Servers with replication delta over 24 hours: ", $($Statistics.DeltaOver24Hours) -Color Black, Red -FontWeight normal, bold
        EmailListItem -Text "Servers with replication delta over 12 hours: ", $($Statistics.DeltaOver12Hours) -Color Black, Red -FontWeight normal, bold
        EmailListItem -Text "Servers with replication delta over 6 hours: ", $($Statistics.DeltaOver6Hours) -Color Black, Red -FontWeight normal, bold
        EmailListItem -Text "Servers with replication delta over 3 hours: ", $($Statistics.DeltaOver3Hours) -Color Black, Red -FontWeight normal, bold
        EmailListItem -Text "Servers with replication delta over 1 hour: ", $($Statistics.DeltaOver1Hours) -Color Black, Red -FontWeight normal, bold
        EmailListItem -Text "Unique replication errors: ", $($Statistics.UniqueErrors.Count) -Color Black, Red -FontWeight normal, bold
    }

    if ($Statistics.UniqueErrors.Count -gt 0) {
        EmailText -Text "Unique replication errors:"
        EmailList {
            foreach ($ErrorText in $Statistics.UniqueErrors) {
                EmailListItem -Text $ErrorText
            }
        }
    } else {
        EmailText -Text "It seems you're doing a great job! Keep it up! ![😊](https://s.w.org/images/core/emoji/15.0.3/72x72/1f60a.png)" -LineBreak
    }

    EmailText -Text "For more details please check the table below:"

    EmailTable -DataTable $ReplicationSummary {
        EmailTableCondition -Inline -Name "Fail" -HighlightHeaders 'Fails', 'Total', 'PercentageError' -ComparisonType number -Operator gt 0 -BackgroundColor Salmon -FailBackgroundColor SpringGreen
    } -HideFooter

    EmailText -LineBreak
    EmailText -Text "Kind regards,"
    EmailText -Text "Your automation friend"
}


$EmailSplat = @{
    From           = 'przemyslaw.klys@evotec.pl'
    To             = 'przemyslaw.klys@evotec.pl'
    Body           = $Body
    Priority       = if ($Statistics.Failures -gt 0) { 'High' } else { 'Low' }
    Subject        = 'Replication Results ![💖](https://s.w.org/images/core/emoji/15.0.3/72x72/1f496.png)'
    Verbose        = $true
    WhatIf         = $false
    MgGraph        = $true
}

Connect-MgGraph
Send-EmailMessage @EmailSplat

What is the result of those 50 lines of code?

[![](https://evotec.xyz/wp-content/uploads/2024/04/img_662014103d259-1024x1021.png)](https://evotec.xyz/wp-content/uploads/2024/04/img_662014103d259.png)

The **Get-WinADForestReplicationSummary** function joins over 100 functions available for **Active Directory** admins in the [**ADEssentials**](https://github.com/EvotecIT/ADEssentials) module. It's doing the heavy lifting of reading repadmin data and converting it to PowerShell objects. Then, we use the PSWriteHTML **EmailBody** function, which allows for the accessible building of emails without knowing **HTML** and **CSS**. Finally, since I wanted to send an email with **Microsoft Graph**, I've used [**Mailozaurr's**](https://github.com/EvotecIT/Mailozaurr) amazing **Send-EmailMessage** to send an email.

What if you don't like emails? How about **Microsoft Teams**?

New-AdaptiveCard -Uri $TeamsUri {
    New-AdaptiveColumnSet {
        New-AdaptiveColumn -Width auto {
            New-AdaptiveImage -Url "https://evotec.xyz/wp-content/uploads/2021/04/Logo-evotec-bb.png" -Size Large -Style default
        }
        New-AdaptiveColumn -Width stretch {
            New-AdaptiveTextBlock -Text "Replication Summary" -Weight Bolder -Wrap
            if ($Statistics.Failures -gt 0) {
                $Summary = "There are $($Statistics.Failures) servers with replication issues. Please take a look and fix ASAP."
            } else {
                $Summary = "All servers are in good shape. Keep up the good work!"
            }
            New-AdaptiveTextBlock -Text $Summary -Subtle -Spacing None -Wrap
        }
    }
    New-AdaptiveContainer {
        New-AdaptiveTextBlock -Text "ad.evotec.pl" -Size Medium -Wrap
        New-AdaptiveTextBlock -Text "" -Subtle -Spacing None -Wrap
        New-AdaptiveTextBlock -Text (Get-Date)
    }
    New-AdaptiveContainer {
        New-AdaptiveColumnSet {
            New-AdaptiveColumn {
                New-AdaptiveTextBlock -Text "▲ $($Statistics.Good) servers with good replication" -Color Good -Spacing None
                New-AdaptiveTextBlock -Text "▼ $($Statistics.Failures) servers with failing replication" -Color Attention -Spacing None
            } -Width Stretch
            New-AdaptiveColumn {
                New-AdaptiveFactSet {
                    foreach ($Entry in $Statistics.GetEnumerator() | Select-Object -Skip 1 -Last 5) {
                        New-AdaptiveFact -Title $Entry.Key -Value $Entry.Value
                    }
                }
            } -Width Auto
        }
    } -Spacing None
} -FullWidth

And what do you get? Nice and fancy replication summary in Teams ![😊](https://s.w.org/images/core/emoji/15.0.3/72x72/1f60a.png)

![](https://evotec.xyz/wp-content/uploads/2024/04/img_66201fcd4dbcc-1024x461.png)

### What do I need?

To get it up and running you just need to:

Install-Module PSWriteHTML -Force -Verbose
Install-Module ADEssentials -Force -Verbose
# if you like emails
Install-Module Mailozaurr -Force -Verbose

# if you like teams
Install-Module PSTeams -Force -Verbose

Once modules are installed, you only modify the email body to suit your needs and send an email splat with the proper parameters, as your email provider requires. Alternatively, you can change the team's template or use it as is via **Teams Incoming Webhooks**. If you need more details on how to configure [**PSTeams**](https://github.com/EvotecIT/PSTeams), [**Mailozaurr**](https://github.com/EvotecIT/Mailozaurr), or use email-building functionality with [**PSWriteHTML**](https://github.com/EvotecIT/PSWriteHTML), I invite you to search via multiple blogs that cover this functionality.

The post [Active Directory Replication Summary to your Email or Microsoft Teams](https://evotec.xyz/active-directory-replication-summary-to-your-email/) appeared first on [Evotec](https://evotec.xyz).
