---
author: "Brad Wyatt"
published: 2023-12-09T17:58:37.000Z
link: https://www.thelazyadministrator.com/2023/12/09/microsoft-graph-api-endpoint-adds-last-successful-sign-in-date-time/
id: https://www.thelazyadministrator.com/?p=3629
feed: "Planet PowerShell"
tags: [rss/Graph,rss/API,rss/Azure,rss/Office_365,rss/PowerShell]
pinned: false
---
> [!abstract] Microsoft Graph API Endpoint Adds Last Successful Sign-In Date Time by Brad Wyatt - 2023-12-09T17:58:37.000Z
> Previously, if you wanted to find a user’s last successful sign-in to your Microsoft 365 tenant using the Microsoft Graph REST API, you would have to iterate through Entra ID sign-in logs. With new recent additions to the Microsoft Graph API Beta Endpoint, you can now return the UTC value just by parsing the user details and properties. The Microsoft documentation regarding the signInActivity resource type can be found [here](https://learn.microsoft.com/en-au/graph/api/resources/signinactivity?v⋯

🔗Read article [online](https://www.thelazyadministrator.com/2023/12/09/microsoft-graph-api-endpoint-adds-last-successful-sign-in-date-time/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Microsoft Graph API Endpoint Adds Last Successful Sign-In Date Time]]
- - -
Previously, if you wanted to find a user’s last successful sign-in to your Microsoft 365 tenant using the Microsoft Graph REST API, you would have to iterate through Entra ID sign-in logs. With new recent additions to the Microsoft Graph API Beta Endpoint, you can now return the UTC value just by parsing the user details and properties. The Microsoft documentation regarding the signInActivity resource type can be found [here](https://learn.microsoft.com/en-au/graph/api/resources/signinactivity?view=graph-rest-beta).

### LastSignInDateTime vs LastSuccessfulSignInDateTime

The difference between _lastSignInDateTime_ and _lastSuccessfulSignInDateTime_ property is:

- _**lastSignInDateTime**_: The last interactive sign-in date and time for a specific user. You can use this field to calculate the last time a user attempted to sign into the directory the directory with an interactive authentication method. This field can be used to build reports, such as inactive users. The timestamp represents date and time information using ISO 8601 format and is always in UTC time. For

… [Continue...](https://www.thelazyadministrator.com/2023/12/09/microsoft-graph-api-endpoint-adds-last-successful-sign-in-date-time/)

The post [Microsoft Graph API Endpoint Adds Last Successful Sign-In Date Time](https://www.thelazyadministrator.com/2023/12/09/microsoft-graph-api-endpoint-adds-last-successful-sign-in-date-time/) first appeared on [The Lazy Administrator](https://www.thelazyadministrator.com).
