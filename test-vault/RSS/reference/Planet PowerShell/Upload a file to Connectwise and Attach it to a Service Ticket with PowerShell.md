---
author: "Brad Wyatt"
published: 2024-05-09T19:27:53.000Z
link: https://www.thelazyadministrator.com/2024/05/09/upload-a-file-to-connectwise-and-attach-it-to-a-service-ticket-with-powershell/
id: https://www.thelazyadministrator.com/?p=3893
feed: "Planet PowerShell"
tags: [rss/Connectwise,rss/PowerShell,rss/API,rss/Automation,rss/REST]
pinned: false
---
> [!abstract] Upload a file to Connectwise and Attach it to a Service Ticket with PowerShell by Brad Wyatt - 2024-05-09T19:27:53.000Z
> I have recently been automating a lot within Connectwise PSA. One of the items I set out to do is to upload a file and attach it to a service ticket. This led me to the [following article,](https://www.techcolumnist.com/2019/01/09/powershell-connectwise-documents-api-uploading-a-document-or-attachment-to-a-ticket/) but after doing some testing, I found that some file types were not properly rendering on the Connectwise side, making me believe there was something wrong with the encoding.
> 
> I could⋯

🔗Read article [online](https://www.thelazyadministrator.com/2024/05/09/upload-a-file-to-connectwise-and-attach-it-to-a-service-ticket-with-powershell/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Upload a file to Connectwise and Attach it to a Service Ticket with PowerShell]]
- - -
I have recently been automating a lot within Connectwise PSA. One of the items I set out to do is to upload a file and attach it to a service ticket. This led me to the [following article,](https://www.techcolumnist.com/2019/01/09/powershell-connectwise-documents-api-uploading-a-document-or-attachment-to-a-ticket/) but after doing some testing, I found that some file types were not properly rendering on the Connectwise side, making me believe there was something wrong with the encoding.

I could upload a `.txt` file without issues, but I also tried with a `.docx` and a `.pdf`, and the file would be corrupted or blank.

The process to upload a file and then link it to a service ticket is first to upload the file to the endpoint `/system/documents` and then, from there, link the uploaded document to an existing service ticket.

## Multipart/Form-Data

The first thing to know about how Connectwise wants a document uploaded is that it uses what is … [Continue...](https://www.thelazyadministrator.com/2024/05/09/upload-a-file-to-connectwise-and-attach-it-to-a-service-ticket-with-powershell/)

The post [Upload a file to Connectwise and Attach it to a Service Ticket with PowerShell](https://www.thelazyadministrator.com/2024/05/09/upload-a-file-to-connectwise-and-attach-it-to-a-service-ticket-with-powershell/) first appeared on [The Lazy Administrator](https://www.thelazyadministrator.com).
