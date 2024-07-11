---
author: "Przemyslaw Klys"
published: 2023-09-03T16:59:27.000Z
link: https://evotec.xyz/unlocking-seamless-html-report-creation-harness-the-power-of-markdown-with-pswritehtml-powershell-module/
id: https://evotec.xyz/?p=18357
feed: "Planet PowerShell"
tags: [rss/PowerShell,rss/css,rss/html,rss/markdown,rss/powershell,rss/powershell_module,rss/pswritehtml]
pinned: false
---
> [!abstract] Seamless HTML Report Creation: Harness the Power of Markdown with PSWriteHTML PowerShell Module by Przemyslaw Klys - 2023-09-03T16:59:27.000Z
> In today's digital age, the ability to create compelling and informative HTML reports and documents is a crucial skill for professionals in various fields. Whether you're a data analyst, a system administrator, a developer, or simply someone who wants to present information in an organized and visually appealing manner, having the right tools at your disposal can make all the difference. That's where the PSWriteHTML PowerShell module steps in, offering an array of possibilities to suit your repo⋯

🔗Read article [online](https://evotec.xyz/unlocking-seamless-html-report-creation-harness-the-power-of-markdown-with-pswritehtml-powershell-module/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Seamless HTML Report Creation꞉ Harness the Power of Markdown with PSWriteHTML Po⋯]]
- - -
In today's digital age, the ability to create compelling and informative **HTML** reports and documents is a crucial skill for professionals in various fields. Whether you're a data analyst, a system administrator, a developer, or simply someone who wants to present information in an organized and visually appealing manner, having the right tools at your disposal can make all the difference. That's where the [PSWriteHTML](https://github.com/EvotecIT/PSWriteHTML) PowerShell module steps in, offering an array of possibilities to suit your reporting needs.

In this blog post, we'll explore the fascinating world of **HTML** report generation using [PSWriteHTML](https://github.com/EvotecIT/PSWriteHTML), a versatile and powerful tool in the **PowerShell** arsenal. What sets [PSWriteHTML](https://github.com/EvotecIT/PSWriteHTML) apart is its flexibility. You can create HTML reports using standard commands or leverage the simplicity and readability of Markdown – the choice is yours. This coexistence of options ensures you can adapt your reporting workflow to your specific requirements.

Join us on this journey as we unlock the potential of the [PSWriteHTML](https://github.com/EvotecIT/PSWriteHTML) PowerShell module, showcasing how you can effortlessly create professional HTML reports, whether you prefer traditional commands or the elegance of Markdown. So, if you're ready to elevate your reporting game and discover a powerful, user-friendly way to craft HTML reports tailored to your needs, let's dive right in!

## Harnessing the Power of Markdown with PSWriteHTML: Three Distinct Approaches

In exploring the **PSWriteHTML** PowerShell module, we've uncovered a versatile tool that empowers us to effortlessly create stunning **HTML** reports and documents. One of its standout features is the `New-HTMLMarkdown` command, which allows us to integrate **Markdown** content into our reports seamlessly. What sets it apart is its flexibility, offering not just one but three distinct ways to incorporate Markdown into your **HTML** creations. Let's dive into each of these approaches.

### Using Direct Markdown as a Scriptblock

he first approach allows you to include Markdown directly within a scriptblock. This method provides fine-grained control over your Markdown content, enabling you to craft your report precisely as you envision it. Here's how it works:

New-HTMLMarkdown {
    '# Hello, Markdown!'
    'This is a sample paragraph.'
    '## Subheading'
    'More Markdown content here.'
}

In this example, the Markdown content is defined within the scriptblock, making it easy to structure and format your report. You can include headings, paragraphs, lists, and more, all while taking advantage of PSWriteHTML's features like table of contents generation (`-EnableTOC`).

### Loading Markdown Content from a File

The second approach simplifies the process of incorporating Markdown by allowing you to load content directly from a Markdown file. This is particularly useful when you have pre-existing Markdown documents that you want to include in your HTML report. Here's how you can achieve this:

New-HTMLMarkdown -FilePath "C:\Path\To\Your\File.md"

By specifying the path to your Markdown file, PSWriteHTML seamlessly incorporates its content into your HTML report. You can use this method to include documentation, README files, or any Markdown content you have readily available.

### Using an Array of Strings

The third approach provides a flexible way to include Markdown content as an array of strings. This approach is ideal for scenarios where you want to construct your Markdown content dynamically within your script. Here's how it looks:

New-HTMLMarkdown -Content '# Hello, Markdown!', '## Subheading', 'This is a test'

With this method, you can assemble your **Markdown** content programmatically, offering great flexibility in customizing your report's content. These three distinct approaches allow you to choose the most suitable method for your reporting needs. Whether you prefer to work directly with Markdown in a ScriptBlock, load content from a file, or construct content dynamically as an array of strings, **PSWriteHTML** has you covered.

## Beyond Markdown: Crafting Comprehensive HTML Documents with PSWriteHTML

While the `New-HTMLMarkdown` command within the **PSWriteHTML** PowerShell module shines as a powerful tool for incorporating Markdown content into your reports; its capabilities extend beyond simple text. **PSWriteHTML** allows you to create rich and comprehensive HTML documents by combining Markdown with a wide array of other commands.

Imagine weaving together Markdown-based documentation with interactive elements like calendars, charts, and tables, all within the same HTML document. This seamless integration is where **PSWriteHTML** truly excels, making it a valuable asset for anyone who needs to present diverse and engaging information. Let's explore how this can be achieved.

New-HTML {
    New-HTMLTabStyle -BorderRadius 0px -TextTransform capitalize -BackgroundColorActive SlateGrey
    New-HTMLSectionStyle -BorderRadius 0px -HeaderBackGroundColor Grey -RemoveShadow
    New-HTMLPanelStyle -BorderRadius 0px
    New-HTMLTableOption -DataStore JavaScript -BoolAsString -ArrayJoinString ', ' -ArrayJoin
    New-HTMLSection {
        # as an array of strings
        New-HTMLMarkdown -Content '# Hello, Markdown!', '## Hello, Markdown!', 'Ok this is a test', '### Hello, Markdown!'
    }
    New-HTMLSection {
        # as a scriptblock
        New-HTMLMarkdown {
            '# Testing Header 1'
            'This is TOC'
            '[TOC]'
            '## Testing Header 2'
            'Ok this is a test'
            '## Testing Header 3'
            'Ok this is a test'
            '## Testing Header 4'
            'Ok this is a test'
            '### Testing Header 5'
        }
    }
    New-HTMLSection -Invisible {
        # as a file
        New-HTMLSection {
            New-HTMLMarkdown -FilePath "$PSScriptRoot\..\..\readme.md"
        }
        New-HTMLSection {
            New-HTMLMarkdown -FilePath "C:\Support\GitHub\ADEssentials\readme.md" -SanitezeHTML
        }

        New-HTMLSection {
            New-HTMLMarkdown -FilePath "C:\Support\GitHub\PSTeams\readme.md" -EnableOpenLinksInNewWindow
        }
        New-HTMLSection {
            New-HTMLMarkdown -FilePath "C:\Support\GitHub\PowerFederatedDirectory\README.MD"
        }
    }
} -ShowHTML:$true -Online -FilePath $PSScriptRoot\Example-Markdown.html

[![](https://evotec.xyz/wp-content/uploads/2023/09/img_64f4af5a2ee7d-962x1024.png)](https://evotec.xyz/wp-content/uploads/2023/09/img_64f4af5a2ee7d.png)

As you see above, I've used all three mentioned methods. I've used markdown by hand, I've loaded four different files, and I have also used them as ScriptBlock.

## Markdown as Part of a Larger Canvas

When you work with PSWriteHTML, you don't have to use `New-HTMLMarkdown` it in isolation. Instead, you can embed Markdown content within a broader canvas created with various other PSWriteHTML commands. For instance, you can:

- Use `New-HTMLCalendar` to incorporate interactive calendars that display essential dates and events.
- Leverage `New-HTMLChart` to visualize data with interactive charts and graphs.
- Employ `New-HTMLTable` to present structured data in a tabular format.
- Add navigation menus, headers, and footers to enhance the document's usability and aesthetics.

Here's a glimpse of what this combination can look like:

$ProcessSmaller = Get-Process | Select-Object -First 5

New-HTML {
    New-HTMLTabStyle -BorderRadius 0px -TextTransform capitalize -BackgroundColorActive SlateGrey
    New-HTMLSectionStyle -BorderRadius 0px -HeaderBackGroundColor Grey -RemoveShadow
    New-HTMLPanelStyle -BorderRadius 0px
    New-HTMLTableOption -DataStore JavaScript -BoolAsString -ArrayJoinString ', ' -ArrayJoin

    New-HTMLHeader {
        New-HTMLSection -Invisible {
            New-HTMLPanel -Invisible {
                New-HTMLImage -Source 'https://evotec.pl/wp-content/uploads/2015/05/Logo-evotec-012.png' -UrlLink 'https://evotec.pl/' -AlternativeText 'My other text' -Class 'otehr' -Width '50%'
            }
            New-HTMLPanel -Invisible {
                New-HTMLImage -Source 'https://evotec.pl/wp-content/uploads/2015/05/Logo-evotec-012.png' -UrlLink 'https://evotec.pl/' -AlternativeText 'My other text' -Width '20%'
            } -AlignContentText right
        }
    }
    New-HTMLSection {
        New-HTMLSection -HeaderText 'Test 1' {
            New-HTMLTable -DataTable $ProcessSmaller
        }
        New-HTMLSection -HeaderText 'Test 2' {
            New-HTMLCalendar {
                New-CalendarEvent -Title 'Active Directory Meeting' -Description 'We will talk about stuff' -StartDate (Get-Date)
                New-CalendarEvent -Title 'Lunch' -StartDate (Get-Date).AddDays(2).AddHours(-3) -EndDate (Get-Date).AddDays(3) -Description 'Very long lunch'
            }
        }
    }
    New-HTMLSection -Invisible {
        New-HTMLTabPanel {
            New-HTMLTab -Name 'PSWriteHTML from File' {
                # as a file
                New-HTMLSection {
                    New-HTMLMarkdown -FilePath "$PSScriptRoot\..\..\readme.md"
                }
            }
            New-HTMLTab -Name 'ADEssentials from File' {
                New-HTMLSection {
                    New-HTMLMarkdown -FilePath "C:\Support\GitHub\ADEssentials\readme.md"
                }
            }
        } -Theme elite
    }

    New-HTMLFooter {
        New-HTMLSection -Invisible {
            New-HTMLPanel -Invisible {
                New-HTMLImage -Source 'https://evotec.pl/wp-content/uploads/2015/05/Logo-evotec-012.png' -UrlLink 'https://evotec.pl/' -AlternativeText 'My other text' -Class 'otehr' -Width '50%'
            }
            New-HTMLPanel -Invisible {
                New-HTMLImage -Source 'https://evotec.pl/wp-content/uploads/2015/05/Logo-evotec-012.png' -UrlLink 'https://evotec.pl/' -AlternativeText 'My other text' -Width '20%'
            } -AlignContentText right
        }
    }
} -ShowHTML:$true -Online -FilePath $PSScriptRoot\Example-Markdown1.html

[![](https://evotec.xyz/wp-content/uploads/2023/09/img_64f4b3fa25c0f-962x1024.png)](https://evotec.xyz/wp-content/uploads/2023/09/img_64f4b3fa25c0f.png)

This example seamlessly blends Markdown sections with interactive elements such as calendars and tables. This approach allows you to create comprehensive and visually appealing reports that cater to various aspects of your project or presentation.

## Tailoring Your Reports to Perfection

**Mixing and matchingMarkdown** with other **PSWriteHTML** commands give you the freedom to tailor your reports to perfection. Whether you're delivering a project update, sharing research findings, or creating interactive documentation, **PSWriteHTML** empowers you to tell your story compellingly and informally.

If you don't know [**PSWriteHTML**](https://github.com/EvotecIT/PSWriteHTML), please read those articles below to understand how you can use its power to fulfill your goals. All the topics described above are just a small part of what [**PSWriteHTML**](https://github.com/EvotecIT/PSWriteHTML) can do.

- [Meet Statusimo – PowerShell generated Status Page](https://evotec.xyz/meet-statusimo-powershell-generated-status-page/)
    
- [Meet Dashimo – PowerShell Generated Dashboard](https://evotec.xyz/meet-dashimo-powershell-generated-dashboard/)
    
- [Dashimo – Easy Table Conditional Formatting and more](https://evotec.xyz/dashimo-easy-table-conditional-formatting-and-more/)
    
- [Out-HtmlView – HTML alternative to Out-GridView](https://evotec.xyz/out-htmlview-html-alternative-to-out-gridview/)
    
- [Meet Emailimo – New way to send pretty emails with PowerShell](https://evotec.xyz/meet-emailimo-new-way-to-send-pretty-emails-with-powershell/)
    
- [All your HTML Tables are belong to us](https://evotec.xyz/all-your-html-tables-are-belong-to-us/)
    
- [Sending HTML emails with PowerShell and zero HTML knowledge required](https://evotec.xyz/sending-html-emails-with-powershell-and-zero-html-knowledge-required/)
    
- [Dashimo (PSWriteHTML) – Charting, Icons, and few other changes](https://evotec.xyz/dashimo-pswritehtml-charting-icons-and-few-other-changes/)
    
- [Working with HTML in PowerShell just got better](https://evotec.xyz/working-with-html-in-powershell-just-got-better/)
    
- [Comparing two or more objects visually in PowerShell (cross-platform)](https://evotec.xyz/comparing-two-or-more-objects-visually-in-powershell-cross-platform/)
    
- [Easy way to create diagrams using PowerShell and PSWriteHTML](https://evotec.xyz/easy-way-to-create-diagrams-using-powershell-and-pswritehtml/)
    
- [Nested Tabs, Diagram Updates, Diagram Events, Calendar Object, and more in PSWriteHTML](https://evotec.xyz/nested-tabs-diagram-updates-diagram-events-calendar-object-and-more-in-pswritehtml/)
    
- [Emailimo merged into PSWriteHTML, IE support, and no dependencies](https://evotec.xyz/emailimo-merged-into-pswritehtml-ie-support-and-no-dependencies/)
    
- [Active Directory DHCP Report to HTML or EMAIL with zero HTML knowledge](https://evotec.xyz/active-directory-dhcp-report-to-html-or-email-with-zero-html-knowledge/)
    
- [Creating Office 365 Migration Diagram with PowerShell](https://evotec.xyz/creating-office-365-migration-diagram-with-powershell/)
    
- [Advanced HTML reporting using PowerShell](https://evotec.xyz/advanced-html-reporting-using-powershell/)
    
- [Solving typo problems with Fuzzy Search in PSWriteHTML](https://evotec.xyz/solving-typo-problems-with-fuzzy-search-in-pswritehtml/)

To get yourself up to speed with **PSWriteHTML,** all you have to do is install the module directly from **PowerShellGallery**.

Install-Module PSWriteHTML -Force -Verbose

I hope you enjoyed this blog post and the new **PSWriteHTML** feature.

The post [Seamless HTML Report Creation: Harness the Power of Markdown with PSWriteHTML PowerShell Module](https://evotec.xyz/unlocking-seamless-html-report-creation-harness-the-power-of-markdown-with-pswritehtml-powershell-module/) appeared first on [Evotec](https://evotec.xyz).
