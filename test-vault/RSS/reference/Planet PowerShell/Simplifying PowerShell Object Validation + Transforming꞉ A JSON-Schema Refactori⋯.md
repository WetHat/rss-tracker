---
author: "Christian Ritter"
published: 2024-01-24T09:06:23.000Z
link: https://devdojo.com/hcritter/simplifying-powershell-object-validation-transforming-a-json-schema-refactoring-journey
id: https://devdojo.com/11900
feed: "Planet PowerShell"
tags: [rss/json,rss/Classes,rss/schema,rss/powershell,rss/argument,rss/transformation,rss/attribute]
pinned: false
---
> [!abstract] Simplifying PowerShell Object Validation &amp; Transforming: A JSON-Schema Refactoring Journey by Christian Ritter - 2024-01-24T09:06:23.000Z
> In a recent scripting endeavor, I developed a PowerShell script with an ArgumentTransformationAttribute. The script's purpose was to convert PSCustomObjects or Hashtables into a JSON format tailored for seamless integration with a BatchRequest destined for the Microsoft Graph API.
> 
> ```
> class JSONTransform : System.Management.Automation.ArgumentTransformationAttribute{
>     [object] Transform([System.Management.Automation.EngineIntrinsics]$EngineIntrinsics,[object]$InputData){
>         $MandatoryKe⋯

🔗Read article [online](https://devdojo.com/hcritter/simplifying-powershell-object-validation-transforming-a-json-schema-refactoring-journey). For other items in this feed see [[../Planet PowerShell]].

- [ ] [[Simplifying PowerShell Object Validation + Transforming꞉ A JSON-Schema Refactori⋯]]
- - -
In a recent scripting endeavor, I developed a PowerShell script with an ArgumentTransformationAttribute. The script's purpose was to convert PSCustomObjects or Hashtables into a JSON format tailored for seamless integration with a BatchRequest destined for the Microsoft Graph API.

```
class JSONTransform : System.Management.Automation.ArgumentTransformationAttribute{
    [object] Transform([System.Management.Automation.EngineIntrinsics]$EngineIntrinsics,[object]$InputData){
        $MandatoryKeys = @("url","id","method")
        $ValidKeys = $MandatoryKeys+@(,"headers","body")
        $ValidMethods = @("Get","Post","Put","Patch","Delete")

        Switch ($InputData){
            {$_ -is [PSObject]}{
                $_.psobject.properties.name.ForEach({
                    if(-Not $ValidKeys.Contains($_)){
                        throw "Invalid psobject keys"
                    }
                })       
                if((Compare-Object -ReferenceObject $MandatoryKeys -DifferenceObject @($_.PSObject.Properties.Name) -IncludeEqual -ExcludeDifferent).Count -ne $MandatoryKeys.Count){
                    throw "Missing mandatory keys"
                }         
                if(-not $ValidMethods -Contains $_.Method){
                    throw "Method need to be: Get, Delete, Patch, Put, Post"
                }
                if($_.URL -notmatch '^\/[a-zA-Z0-9\/$&=?,]+$'){
                    throw "the url is not in a proper pattern"
                }
            }
            {$_ -is [hashtable]}{
                $_.Keys.ForEach({
                    if(-Not $ValidKeys -Contains($_)){
                        throw "Invalid Hashtable keys"
                    }
                })
                if((Compare-Object -ReferenceObject $MandatoryKeys -DifferenceObject @($_.Keys) -IncludeEqual -ExcludeDifferent).Count -ne $MandatoryKeys.Count){
                    throw "Missing mandatory keys"
                }
                if(-not $ValidMethods -Contains $_["Method"]){
                    throw "Method need to be: Get, Delete, Patch, Put, Post"
                }
                if($_['URL'] -notmatch '^\/[a-zA-Z0-9\/$&=?,]+$'){
                    throw "the url is not in a proper pattern"
                }
            }
            Default{
                throw "Wrong Input type"
            }
            
        }
        $ReturnObject = @{
            requests = $InputData
        }
        return $ReturnObject | ConvertTo-Json -Depth 4
    }
}
```

Amidst this coding journey, redundancy surfaced within the class. Seeking a streamlined approach, I explored JSON-Schema validation, an efficient solution. This method allowed me to encapsulate all necessary specifications within a single schema, eliminating the need to differentiate between object types.

```
{
  "properties": {
    "requests": {
      "items": {
        "properties": {
          "body": {
            "type": "object"
          },
          "url": {
            "pattern": "^\\/[a-zA-Z0-9\\/$&=?,]+$",
            "type": "string"
          },
          "id": {
            "type": "string"
          },
          "headers": {
            "type": "object"
          },
          "method": {
            "enum": [
              "GET",
              "PUT",
              "PATCH",
              "POST",
              "DELETE"
            ],
            "type": "string"
          }
        },
        "type": "object",
        "propertyNames": {
          "enum": [
            "id",
            "method",
            "url",
            "headers",
            "body"
          ]
        },
        "required": [
          "id",
          "method",
          "url"
        ]
      },
      "type": "array"
    }
  },
  "type": "object",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "required": [
    "requests"
  ]
}
```

The class underwent a transformation, shedding redundancy in favor of clarity. The code now validates objects against the JSON schema, ensuring adherence to predefined rules.

```
class JSONTransform : System.Management.Automation.ArgumentTransformationAttribute{
    [object] Transform([System.Management.Automation.EngineIntrinsics]$EngineIntrinsics,[object]$InputData){
        $batchGraphRequestSchema = @{
            '$schema' = 'http://json-schema.org/draft-07/schema#'
            'type' = 'object'
            'properties' = @{
                'requests' = @{
                    'type' = 'array'
                    'items' = @{
                        'type' = 'object'
                        'properties' = @{
                            'id' = @{
                                'type' = 'string'
                            }
                            'method' = @{
                                'type' = 'string'
                                'enum' = @('GET', 'PUT', 'PATCH', 'POST', 'DELETE')
                            }
                            'url' = @{
                                'type' = 'string'
                                'pattern' = '^\/[a-zA-Z0-9\/$&=?,]+$'
                            }
                            'headers' = @{
                                'type' = 'object'
                                # Additional properties for headers schema if needed
                            }
                            'body' = @{
                                'type' = 'object'
                                # Additional properties for body schema if needed
                            }
                        }
                        'required' = @('id', 'method', 'url')
                        'propertyNames' = @{
                            'enum' = @('id', 'method', 'url', 'headers', 'body')
                        }
                    }
                }
            }
            'required' = @('requests')
        }
        #rss/Todo spin up multiple batches if number exceed 20.
        $ReturnObject = @{
            requests = $InputData
        } | ConvertTo-Json -Depth 6

        try {
            $ReturnObject | Test-Json -Schema $($batchGraphRequestSchema | Convertto-Json -Depth 6) -ErrorAction Stop
        }
        catch {
            write-host $ReturnObject
            
            Throw "$($_.Exception.Message). JSON Schema did not match"
        }
        return $ReturnObject
    }
}
```

This approach not only improves the transformation for Graph API batch requests but also holds promise for broader applications in parameter validation scenarios. The JSON schema is a versatile tool, ready to enforce rules and ensure data integrity. Stay tuned for more coding adventures!

If you have any thoughts or feedback on this topic, feel free to share them with me on Twitter at [Christian Ritter](https://twitter.com/blackboxcoder/).

Best regards, Christian
