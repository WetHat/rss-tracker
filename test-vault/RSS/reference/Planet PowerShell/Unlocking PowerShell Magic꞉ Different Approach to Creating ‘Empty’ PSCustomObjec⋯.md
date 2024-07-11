---
author: "Przemyslaw Klys"
published: 2023-08-10T09:27:32.000Z
link: https://evotec.xyz/unlocking-powershell-magic-different-approach-to-creating-empty-pscustomobjects/
id: https://evotec.xyz/?p=18300
feed: "Planet PowerShell"
tags: [rss/PowerShell,rss/conversion,rss/hashtable,rss/ordereddictionary,rss/powershell,rss/pscustomobject]
pinned: false
---
> [!abstract] Unlocking PowerShell Magic: Different Approach to Creating ‘Empty’ PSCustomObjects by Przemyslaw Klys - 2023-08-10T09:27:32.000Z
> Today I saw an article from Christian Ritter, "PowerShell: Creating an "empty" PSCustomObject" on X that got me curious. Do people create empty objects like Christian proposes? I want to offer an alternative to Christian's article, which uses OrderedDictionary and converts to PSCustomObject.
> 
> The post [Unlocking PowerShell Magic: Different Approach to Creating ‘Empty’ PSCustomObjects](https://evotec.xyz/unlocking-powershell-magic-different-approach-to-creating-empty-pscustomobjects/) appeared fi⋯

🔗Read article [online](https://evotec.xyz/unlocking-powershell-magic-different-approach-to-creating-empty-pscustomobjects/). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Unlocking PowerShell Magic꞉ Different Approach to Creating ‘Empty’ PSCustomObjec⋯]]
- - -
Today I saw an article from Christian Ritter, [“PowerShell: Creating an “empty” PSCustomObject”](https://hcritter.devdojo.com/powershell-creating-an-empty-pscustomobject) on X that got me curious. Do people create empty objects like Christian proposes? I want to offer an alternative to Christian's article, which uses **OrderedDictionary** and converts to **PSCustomObject**.

## Converting OrderedDictionary to PSCustomObject

Here's a snippet code that shows how to create a custom object using OrderedDictionary and conversion process

$CustomObject = [ordered] @{}
$CustomObject['FirstName'] = 'John'
$CustomObject['LastName'] = 'Doe'
$CustomObject['UserName'] = 'John.Doe'
[pscustomobject] $CustomObject

You can also create custom objects **dynamically** using a similar approach to what Christian proposed.

$propertyDefinitions = @{
    Users   = @(
        "FirstName", "LastName", "UserName", "Title", "Department",
        "StreetAddress", "City", "State", "PostalCode", "Country",
        "PhoneNumber", "MobilePhone", "UsageLocation", "License"
    )
    Groups  = @(
        "DisplayName", "PrimarySMTP", "Description", "Owner", "Type"
    )
    JobRole = @(
        "DisplayName", "PrimarySMTP", "Description", "Type"
    )
}


$CustomObject2 = [ordered] @{}
foreach ($P in $propertyDefinitions.Users) {
    $CustomObject2[$P] = $null
}
[PSCustomObject] $CustomObject2

$CustomObject3 = [ordered] @{}
foreach ($P in $propertyDefinitions.Groups) {
    $CustomObject3[$P] = $null
}
[PSCustomObject] $CustomObject3

$CustomObject4 = [ordered] @{}
foreach ($P in $propertyDefinitions.JobRole) {
    $CustomObject4[$P] = $null
}
[PSCustomObject] $CustomObject4

**OrderedDictionary** additionally offers the ability to create an object with some data and then append data on the fly in your script. This means, for example, you could create a dictionary first at the beginning of the script, and during the whole run of the script, you could append data to it without ever pre-creating it in the first place, to finally convert it to a custom object.

$Properties = 'Title', 'Department', 'State'
$CustomObject1 = [ordered] @{
    Name = 'John'
    Age  = 30
    City = 'New York'
}
foreach ($P in $Properties) {
    $CustomObject1[$P] = $null
}
[pscustomobject] $CustomObject1

In a long script you could do

$CustomObject1 = [ordered] @{
    Name = 'John'
    Age  = 30
    City = 'New York'
}
<#
Do lots of code here
#>
$CustomObject1['Address'] = 'New Value'
<#
More code here
#>
$CustomObject1['State'] = 'New Value 2'
# Convert to PSCustomObject
[pscustomobject] $CustomObject1

Another benefit of using **OrderedDictionary** is that you can add to it inside other functions without ever having to destroy the object, overwrite it, or even knowing beforehand what it will look like.

function Add-Values {
    [CmdletBinding()]
    param(
        [System.Collections.IDictionary] $Dictionary,
        [string] $Key,
        [object] $Value
    )
    $Dictionary[$Key] = $Value
}

$CustomObject1 = [ordered] @{
    Name = 'John'
    Age  = 30
    City = 'New York'
}
<#
Do lots of code here
#>
$CustomObject1['Address'] = 'New Value'
<#
More code here
#>
$CustomObject1['State'] = 'New Value 2'
Add-Values -Dictionary $CustomObject1 -Key 'ZipCode' -Value 'New Value 3'
<#
Even more code
#>
Add-Values -Dictionary $CustomObject1 -Key 'EmployeeID' -Value 'New Value 4'

# Convert to PSCustomObject
[pscustomobject] $CustomObject1

I hope this short blog post will help you decide between my and Christian solutions. Both solutions have their own strengths, and depending on who likes what, you may end up using one or the other. Christian solution is based on **PowerShell 2.0** when it was the only way to create PSCustomObject.

# what Christian proposes
$customObject1 = [PSCustomObject]@{} # this line is actually not needed
$customObject1 | Select-Object -Property $PropertyNames

# Idential, with just one line of code, as Select-Object creates new object on the fly
'' | Select-Object -Property $PropertyNames

I was curious if there's any performance difference between those two solutions. Using a simple **Measure-Command** gives us the answer.

$PropertyNames = @(
    "FirstName", "LastName", "UserName", "Title", "Department",
    "StreetAddress", "City", "State", "PostalCode", "Country",
    "PhoneNumber", "MobilePhone", "UsageLocation", "License"
)

Measure-Command {
    for ($i = 0; $i -lt 100000; $i++) {
        $CustomObject1 = [ordered] @{}
        foreach ($P in $PropertyNames) {
            $CustomObject1[$P] = $null
        }
        $T = [pscustomobject] $CustomObject1
    }
}

Measure-Command {
    for ($i = 0; $i -lt 100000; $i++) {
       $T2 = '' | Select-Object -Property $PropertyNames
    }
}

In PowerShell 5.1, over 100k iterations, it takes about 1 second less for my approach than using Select-Object.

![](https://evotec.xyz/wp-content/uploads/2023/08/img_64d4a85ba0208.png)

In PowerShell 7, the difference is about 500ms which is not noticeable.

![](https://evotec.xyz/wp-content/uploads/2023/08/img_64d4a8802adb3.png)

To summarize, both solutions work; I believe **OrderedDictionary** conversion has more pros and, at least for me, is easier to read and understand how everything happens. Just a thing of note – you could also use Hashtable instead of **OrderedDictionary**, but then the order of properties is not guaranteed, which may or may not matter to you. In the end, the choice is always yours. Enjoy

The post [Unlocking PowerShell Magic: Different Approach to Creating ‘Empty’ PSCustomObjects](https://evotec.xyz/unlocking-powershell-magic-different-approach-to-creating-empty-pscustomobjects/) appeared first on [Evotec](https://evotec.xyz).
