---
author: "Przemyslaw Klys"
published: 2023-05-28T14:40:25.000Z
link: https://evotec.xyz/strengthening-password-security-in-active-directory-a-powershell-powered-approach/
id: https://evotec.xyz/?p=18093
feed: "Planet PowerShell"
tags: [rss/Active_Directory,rss/PowerShell,rss/Windows,rss/active_directory,rss/ad,rss/dsinternals,rss/html,rss/password_quality,rss/passwordsolution,rss/powershell,rss/scan,rss/security]
pinned: false
---
> [!abstract] Strengthening Password Security in Active Directory: A PowerShell-Powered Approach by Przemyslaw Klys - 2023-05-28T14:40:25.000Z
> PasswordSolution uses the DSInternals PowerShell module to gather Active Directory hashes and then combines that data into a prettified report. If you have ever used DSInternals, you know that while very powerful, it comes with raw data that is hard to process and requires some skills to get it into a state that can be shown to management or security.
> 
> The post [Strengthening Password Security in Active Directory: A PowerShell-Powered Approach](https://evotec.xyz/strengthening-password-security-⋯

🔗Read article [online](https://evotec.xyz/strengthening-password-security-in-active-directory-a-powershell-powered-approach/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Strengthening Password Security in Active Directory꞉ A PowerShell-Powered Approa⋯]]
- - -
**Active Directory** plays a central role for many organizations: those with twenty users and those with thousands of them. While everyone is looking at **Azure AD** as a replacement, it will not happen for most organizations for a very long time, and most organizations will stay in a hybrid environment. Over recent years there was a push to split the roles in Active Directory so that Administrators don't use their standard account to manage **Active Directory** but have their particular account for different Tier to enhance security. Users were also pushed to make sure they use more complicated passwords, changed less often. Suppose your organization is lucky enough to implement this correctly and has users and administrators who care. In that case, you now have **Active Directory** with **unique**, **complex passwords** or an even better password-less environment. If you're less lucky, your **Admins** use the same passwords for all their **AD** accounts, whether this is to open an email or update Active Directory Schema. On the other hand, your users don't care at all and often use the same password you gave them the first day, and once it expires, they ask for another reset and continue using what is provided to them. [**PasswordSolution**](https://github.com/EvotecIT/PasswordSolution) module can help you find those people and try to reason with them to enhance your company's security posture.

Today I would like to offer you an easy way to verify whether your environment password posture is good enough or requires some work. I wrote a PowerShell module called [PasswordSolution](https://github.com/EvotecIT/PasswordSolution), which has two main features:

- Enterprise ready, password notifications to users, service account owners, and administrators when their password expires (**not part of this blog post**)
- Analyze password quality by providing information on the usage of **Duplicate Passwords**, **Weak Passwords**, **Empty Passwords**, **Clear Text Passwords**, **LMHashes**, and other data.

[**PasswordSolution**](https://github.com/EvotecIT/PasswordSolution) uses the [**DSInternals**](https://github.com/MichaelGrafnetter/DSInternals) PowerShell module to gather **Active Directory** hashes and then combines that data into a prettified report. If you have ever used **DSInternals**, you know that while very powerful, it comes with raw data that is hard to process and requires some skills to get it into a state that can be shown to management or security.

## TL;DR - Too long; didn't read summary

Here's an **HTML-based** report from my test Active Directory to give you a taste of what **PasswordSolution** can offer. The report is split into five sections:

- Summary for detected issues by **DSInternals** along with chart with distinct information on enabled vs. disabled accounts
- A list of all users in **Active Directory** and preliminary information about the account such as whether the user is enabled, last login date, last password date change, password never expires, all the detections around weak passwords, duplicate password groups, **AES Keys** missing, **DES Encryption**, **LMHash** usage, **Kerberoastable** detection, who's the manager of the user, and whether that manager is active or not. The table is fully exportable to **Excel** and **CSV** and can sort and filter.
- Summary for **Duplicate Password Groups** where each group is a separate line in a table with information on whether that password is also a weak password, which users are in that group, and from which country.
- The fourth section provides country/continent maps/tables for increased analysis of Duplicate Password Groups or Weak Passwords.
- The final section is just a log output from a given run. The same that you would see while the script runs in a console.

Here's what the output looks like:

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fb1e87508-1024x802.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fb1e87508.png)

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fb6585667-1024x668.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fb6585667.png)

Please NOTE that **Duplicate Password Groups** are essentially two or more accounts with the same passwords. **Weak passwords** are in their clear text form that is usually handed over to your users by your Service Desk or any other process you have in your company. Those can also be passwords used over the years as solid passwords that users adopted for their needs thinking they will be safe.

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fba62510c-1024x658.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fba62510c.png)

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fc4a3c34f-1024x387.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fc4a3c34f.png)

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6473107390e16-1024x593.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6473107390e16.png)

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fcad19095-1024x699.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6472fcad19095.png)

Please consult your **security department** before running this tool for approval. It's playing with user password hashes which may be against your company rules. Before running it on production, please test it in your test environment to understand what it's doing!

**DSInternals** lights up your security tools like a Christmas tree. Before installing and running the modules below, please understand what it's doing, review sources, and contact your internal security department before running this on production. All the heavy lifting done by **DSInternals** (exporting of hashes and first analysis) requires special rights in Active Directory:

- **Replicating Directory Changes All**
- Alternatively, you can use **Domain Admin/Enterprise Admin**, which is unnecessary and discouraged.

**PasswordSolution** only queries AD as a standard user to fill the holes that DSInternals doesn't care about. Password solution goes thru multiple steps, but simplified way to understand what it's doing behind the curtains:

- Use **Get-ADForest** (ActiveDirectory module) to get forest information
- Use **Get-ADDomain** (ActiveDirectory module) to obtain domain information
- Use **Get-ADUser** (ActiveDirectory module) from all domains in a forest
- Use **Get-ADObject** (ActiveDirectory module) to get contacts for managers
- Use **Get-ADReplAccount -All** (DSInternals module) to get replication data from AD
- Use **Test-PasswordQuality** (DSInternals module) on that data to get details about what's wrong
- Keep in mind that while, at this stage, hashes of the accounts are available in the module, we are not doing anything to them and use **Test-PasswordQuality** data output instead.
- Merge data from all the above commands and mash them into a pretty HTML report using **PSWriteHTML**.

That's it. It also means to run this tool; you will need the **RSAT Active Directory** module. It's advised to run it on a Tier 0 server, not a Domain Controller, with just enough permissions to get it up and running. The machine doesn't require internet, and there's no data transfer anywhere. The online switch below is only for **CSS/JS** code and nothing else.

Please consult your **security department** before running this tool for approval. It's playing with user password hashes which may be against your company rules. Before running it on production, please test it in your test environment to understand what it's doing!

### Installing PasswordSolution and DSIntenals

**PasswordSolution** is very simple to use and get it up and running in your environment. All you have to do is installed two **PowerShell** modules and run a single command.

Install-Module PasswordSolution -Verbose
Install-Module DSInternals -Verbose

Alternatively, if you don't have internet access on the machine you will be running it on, you can save the modules to a local folder and then move them to another device.

mkdir C:\DownloadModules
Save-Module PasswordSolution -Path C:\DownloadModules -Verbose
Save-Module DSInternals -Path C:\DownloadModules -Verbose

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_647306d13af3d-1024x288.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_647306d13af3d.png)

Remember that while you download [PasswordSolution](https://github.com/EvotecIT/PasswordSolution), actually two more **PowerShell** modules will download. One is [PSWriteHTML](https://github.com/EvotecIT/PSWriteHTML), responsible for the pretty **HTML** output you see above. It's effortless to build HTML reports with it, just in case you would like to use it for your purpose. The other one is [Mailozaurr](https://github.com/EvotecIT/Mailozaurr), which replaces the built-in **Send-MailMessage** with a modern approach supporting **oAuth2**, **Microsoft Graph**, **SendGrid**, and other features. While it's not used during the **Password Quality** scan, it's used by the password notification option, so it's an integral part of this module. Once you have downloaded all required modules, copy them to **C:\Program Files\WindowsPowerShell\Modules** on your target server for easy usage.

### Running Password Quality Scan in Active Directory

Once you have the required modules installed, using **PasswordSolution** is super easy. It's just one command with multiple parameters that enable or disable functionality. While you could type **Show-PasswordQuality** in the console and just let it run, adding additional parameters to control this process is advised.

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_64730a2e3991d-1024x441.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_64730a2e3991d.png)

Show-PasswordQuality -FilePath $PSScriptRoot\Reporting\PasswordQuality.html -Online -WeakPasswords "Test1", "Test2", "Test3" -Verbose -SeparateDuplicateGroups -AddWorldMap

Or, if you prefer, a more readable method using SPLAT.

$showPasswordQualitySplat = @{
    FilePath                = "$PSScriptRoot\Reporting\PasswordQuality_$(Get-Date -f yyyy-MM-dd_HHmmss).html"
    WeakPasswords           = "Test1", "Test2", "Test3", 'February2023!#!@ok', $Passwords | ForEach-Object { $_ }
    SeparateDuplicateGroups = $true
    PassThru                = $true
    AddWorldMap             = $true
    LogPath                 = "$PSScriptRoot\Logs\PasswordQuality_$(Get-Date -f yyyy-MM-dd_HHmmss).log"
    Online                  = $true
    LogMaximum              = 5
}

Show-PasswordQuality @showPasswordQualitySplat

Additional parameters allow you to **specify weak passwords**, whether to enable **separate duplicate groups** or **add a world map** (if you happen to have an organization spread over multiple countries). You can also use **Verbose** and **PassThru** parameters to see more of what is happening while the scan is in progress and get raw data you can automate.

Show-PasswordQuality -FilePath C:\Temp\PasswordQuality.html -Online -WeakPasswords "Test1", "Test2", "Test3" -Verbose -SeparateDuplicateGroups -AddWorldMap -PassThru

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_647312726723e-1024x288.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_647312726723e.png)

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_6473128d4c8fe.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_6473128d4c8fe.png)

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_647312b7da967.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_647312b7da967.png)

Please note that the **ONLINE** switch you see in the examples has nothing to do with the requirement of being **online** to run the password quality scan. It simply instructs **PSWriteHTML** to use **CDN** for **JS** and **CSS** libraries. If the **ONLINE** switch is skipped, it bundles all required **CSS/JS** code into a single **HTML**, making the report about **3MB bigger**. This means instead of **CDN** links:

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_647313a5e74f0-1024x514.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_647313a5e74f0.png)

You get unreadable HTML source:

[![](https://evotec.xyz/wp-content/uploads/2023/05/img_647313c88f4a0-1024x420.png)](https://evotec.xyz/wp-content/uploads/2023/05/img_647313c88f4a0.png)

### Generating a list of weak passwords

If you are struggling to provide weak passwords that your users may use, here's a sample weak password generator that will generate passwords such as **January2023!** Or **February2020@**, that would pass the **complexity check built-in in Active Directory**. It generates about **180k** passwords that will be verified against your user's passwords.

$Months = @(
    # english
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    # polish
    "Styczen", "Luty", "Marzec", "Kwiecien", "Maj", "Czerwiec", "Lipiec", "Sierpien", "Wrzesien", "Pazdziernik", "Listopad", "Grudzien"
    # spanish
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
    # german
    "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"
    # russian
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    # french
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'
) | Sort-Object -Unique
$Numbers = 0..9
$Years = 2020..2023
$SpecialChar = @("!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "[", "]", "{", "}", "|", "\")

$Passwords = foreach ($Year in $Years) {
    Write-Color -Text "Year: ", $Year -Color Yellow, White
    $YearPasswords = foreach ($month in $months) {
        foreach ($number in $numbers) {
            foreach ($special in $SpecialChar) {
                $month + $Year.ToString() + $number.ToString() + $special
                $Year.ToString() + $month + $number.ToString() + $special
                $month + $Year.ToString() + $special
            }
        }
    }
    Write-Color -Text "Year: ", $Year, " passwords created: ", $YearPasswords.Count -Color Yellow, White
    $YearPasswords
}
$Passwords.Count

Once generated, you can use the **$Passwords** variable to pass as weak passwords to the **Show-PasswordQuality** command.

## Installing / Updating PasswordSolution

PasswordSolution is available from [PowerShellGallery](https://www.powershellgallery.com/packages/PasswordSolution) or a download from [GitHub](https://github.com/EvotecIT/PasswordSolution). I recommend **PowerShellGallery** as the source for daily work and GitHub if you wish to play with sources or expand what is already there. Also, any issues, feature requests, and discussions should be pushed to **GitHub**, as it's the proper way to get support.

Install-Module PasswordSolution -Force -Verbose

When you use **Force**, the module will be installed, but when you rerun the command, it will redownload it repeatedly. If there's a new version, it will download the more recent version and leave the old one in place. This makes sure your module is always up to date. Of course, you shouldn't blindly update modules in production. Please test every version before doing the Install-module/Update-module in production.

Install-Module PasswordSolution -Scope CurrentUser -Verbose

This module doesn't require Administrative rights on the machine, so you can use the **CurrentUser** scope, as shown above, to install it as a standard user. However, this module requires proper permissions on **Active Directory** to run it.

The post [Strengthening Password Security in Active Directory: A PowerShell-Powered Approach](https://evotec.xyz/strengthening-password-security-in-active-directory-a-powershell-powered-approach/) appeared first on [Evotec](https://evotec.xyz).
