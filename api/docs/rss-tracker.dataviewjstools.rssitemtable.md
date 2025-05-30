<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rss-tracker](./rss-tracker.md) &gt; [DataViewJSTools](./rss-tracker.dataviewjstools.md) &gt; [rssItemTable](./rss-tracker.dataviewjstools.rssitemtable.md)

## DataViewJSTools.rssItemTable() method

Render a table of RSS items.

**Signature:**

```typescript
rssItemTable(items: TPageRecords, expand?: TExpandState, label?: string): Promise<void>;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

items


</td><td>

[TPageRecords](./rss-tracker.tpagerecords.md)


</td><td>

A collection of RSS items.


</td></tr>
<tr><td>

expand


</td><td>

[TExpandState](./rss-tracker.texpandstate.md)


</td><td>

_(Optional)_ `undefined` render immediately using a generic dataview table; `true` render table immediately and expand the table by default; `false` to collapse the table by default and render the table on-demand.


</td></tr>
<tr><td>

label


</td><td>

string


</td><td>

_(Optional)_ The label for the expander control.


</td></tr>
</tbody></table>
**Returns:**

Promise&lt;void&gt;

