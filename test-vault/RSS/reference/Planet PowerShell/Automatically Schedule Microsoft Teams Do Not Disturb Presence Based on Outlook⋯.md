---
author: "Brad Wyatt"
published: 2024-01-04T05:30:52.000Z
link: https://www.thelazyadministrator.com/2024/01/03/automatically-schedule-microsoft-teams-do-not-disturb-presence-based-on-outlook-calendar-events/
id: https://www.thelazyadministrator.com/?p=3781
feed: "Planet PowerShell"
tags: [rss/Graph,rss/PowerShell,rss/API,rss/Automation,rss/Azure,rss/Entra,rss/Office_365,rss/Teams,rss/Users]
pinned: false
---
> [!abstract] Automatically Schedule Microsoft Teams Do Not Disturb Presence Based on Outlook Calendar Events by Brad Wyatt - 2024-01-04T05:30:52.000Z
> In this article I will be showing you how you can automatically have Microsoft Teams set its presence to Do Not Disturb, or any other presence, based on events in your Outlook Calendar. I also looked into leveraging Power Automate but it began to require premium connectors and at that cost, going the serverless automation route was much cheaper.
> 
> An overview of this automation is as follows:
> 
> 1. Run on a set schedule.
> 2. Get all users within the tenant, if the user **does not** have a mailbox, p⋯

🔗Read article [online](https://www.thelazyadministrator.com/2024/01/03/automatically-schedule-microsoft-teams-do-not-disturb-presence-based-on-outlook-calendar-events/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Automatically Schedule Microsoft Teams Do Not Disturb Presence Based on Outlook⋯]]
- - -
In this article I will be showing you how you can automatically have Microsoft Teams set its presence to Do Not Disturb, or any other presence, based on events in your Outlook Calendar. I also looked into leveraging Power Automate but it began to require premium connectors and at that cost, going the serverless automation route was much cheaper.

An overview of this automation is as follows:

1. Run on a set schedule.
2. Get all users within the tenant, if the user **does not** have a mailbox, proceed to the next user, if the user **does** have a mailbox proceed to the next step.
3. Get the users events that will occur within the next 1 hour (configurable value)
4. See if there is an event that matches what we are looking for. In my instance, if an event title/subject is “DND” (not case-sensitive) then proceed to the next step, otherwise go to

… [Continue...](https://www.thelazyadministrator.com/2024/01/03/automatically-schedule-microsoft-teams-do-not-disturb-presence-based-on-outlook-calendar-events/)

The post [Automatically Schedule Microsoft Teams Do Not Disturb Presence Based on Outlook Calendar Events](https://www.thelazyadministrator.com/2024/01/03/automatically-schedule-microsoft-teams-do-not-disturb-presence-based-on-outlook-calendar-events/) first appeared on [The Lazy Administrator](https://www.thelazyadministrator.com).
