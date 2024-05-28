
> [!abstract] System and Regression Test Vault for the rss-tracker Obsidian Addin
> 
> ![[AllSystemsGo.jpg]]

# Reference Data
~~~dataview
TABLE
FROM "reference"
WHERE feedurl
SORT file.name
~~~

 # Current Data
 
~~~dataview
TABLE
FROM "output"
WHERE feedurl
SORT file.name
~~~

# Reports

~~~dataview
TABLE
FROM "reports"
SORT file.name
~~~
