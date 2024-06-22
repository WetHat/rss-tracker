---
author: "Christian Ritter"
published: 2023-08-10T07:41:53.000Z
link: https://devdojo.com/hcritter/powershell-creating-an-empty-pscustomobject
id: https://devdojo.com/11228
feed: "Planet PowerShell"
tags: [rss/powershell,rss/create,rss/pscustomobject,rss/empty,rss/function]
pinned: false
---
> [!abstract] PowerShell: Creating an "empty" PSCustomObject by Christian Ritter - 2023-08-10T07:41:53.000Z
> ## Simplifying Creation of Empty PowerShell PSCustomObjects using Custom Functions
> 
> Creating an empty PSCustomObject in PowerShell is a common task, but the traditional approach can be verbose and repetitive. In this blog post, I'll walk you through a more structured and efficient way to achieve this using functions and property definitions.
> 
> ## The Traditional Approach
> 
> Frequently, developers, including myself, create empty PSCustomObjects like this:
> 
> ```
> [PSCustomObject]@{
>     Name = $null
>    ⋯

🔗Read article [online](https://devdojo.com/hcritter/powershell-creating-an-empty-pscustomobject). For other items in this feed see [[Planet PowerShell]].

- [ ] [[PowerShell꞉ Creating an ″empty″ PSCustomObject]]
- - -
## Simplifying Creation of Empty PowerShell PSCustomObjects using Custom Functions

Creating an empty PSCustomObject in PowerShell is a common task, but the traditional approach can be verbose and repetitive. In this blog post, I'll walk you through a more structured and efficient way to achieve this using functions and property definitions.

## The Traditional Approach

Frequently, developers, including myself, create empty PSCustomObjects like this:

```
[PSCustomObject]@{
    Name = $null
    DisplayName = $null
    Telephone = $null
    EmailAddress = $null
    Gender = $null
    Street = $null
    City = $null
}
```

While this method works, it can become unwieldy, especially when dealing with multiple properties. It consumes screen space and lacks a clear structure.

## A Structured Solution

To address these concerns, I devised a more organized approach using a custom function New-EmptyCustomObject. This function streamlines the process of creating empty PSCustomObjects and allows for greater flexibility.

```
function New-EmptyCustomObject {
    param (
        [string[]]$PropertyNames
    )
    
    $customObject = [PSCustomObject]@{}
    $customObject | Select-Object -Property $PropertyNames
}
```

By utilizing this function, you can now create empty objects in a more organized manner:

```
$propertyDefinitions = @{
    Users = @(
        "FirstName", "LastName", "UserName", "Title", "Department",
        "StreetAddress", "City", "State", "PostalCode", "Country",
        "PhoneNumber", "MobilePhone", "UsageLocation", "License"
    )
    Groups = @(
        "DisplayName", "PrimarySMTP", "Description", "Owner", "Type"
    )
    JobRole = @(
        "DisplayName", "PrimarySMTP", "Description", "Type"
    )
}

$usersObject  = New-EmptyCustomObject -PropertyNames $propertyDefinitions.Users
$groupsObject = New-EmptyCustomObject -PropertyNames $propertyDefinitions.Groups
$RoleObject   = New-EmptyCustomObject -PropertyNames $propertyDefinitions.JobRole

```

With this approach, you effortlessly generate empty PSCustomObjects while maintaining clear property definitions. This ensures that you can easily manage and track the properties of each PSCustomObject.

## Wrapping Up

In conclusion, the streamlined technique I've presented enhances the creation of empty PSCustomObjects by utilizing a custom function and well-defined property definitions. This method is not only efficient but also helps maintain a structured and organized codebase.

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards,

🤩 Our Amazing Sponsors 👇

 [![DigitalOcean](https://cdn.devdojo.com/sponsors/digital-ocean.svg) View Website

DigitalOcean offers a simple and reliable cloud hosting solution that enables developers to get their website or application up and running quickly.](https://m.do.co/c/dc19b9819d06) [![Laravel News](https://cdn.devdojo.com/sponsors/laravel-news.svg?image=laravel-news) View Website

Laravel News keeps you up to date with everything Laravel. Everything from framework news to new community packages, Laravel tutorials, and more.](https://laravel-news.com/?utm_source=devdojo.com) [![Genesis](https://cdn.devdojo.com/sponsors/genesis.svg) View Website

A Laravel Starter Kit that includes Authentication, User Dashboard, Edit Profile, and a set of UI Components.](https://github.com/thedevdojo/genesis) [Learn more about the DevDojo sponsorship program and see your logo here to get your brand in front of thousands of developers.](/sponsorship)

Christian.
