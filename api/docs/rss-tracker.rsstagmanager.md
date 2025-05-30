<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [rss-tracker](./rss-tracker.md) &gt; [RSSTagManager](./rss-tracker.rsstagmanager.md)

## RSSTagManager class

Utility class to orchestrate the mapping of rss tags to tags into the domain of the local knowledge graph.

**Signature:**

```typescript
export declare class RSSTagManager 
```

## Constructors

<table><thead><tr><th>

Constructor


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[(constructor)(app, plugin)](./rss-tracker.rsstagmanager._constructor_.md)


</td><td>


</td><td>

Constructs a new instance of the `RSSTagManager` class


</td></tr>
</tbody></table>

## Properties

<table><thead><tr><th>

Property


</th><th>

Modifiers


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[rssTagPostProcessor](./rss-tracker.rsstagmanager.rsstagpostprocessor.md)


</td><td>

`readonly`


</td><td>

EventRef


</td><td>

Get the event handler to post-process RSS items.

In order fo a RSS item file to be postprocessed it has to be registered with  first.


</td></tr>
</tbody></table>

## Methods

<table><thead><tr><th>

Method


</th><th>

Modifiers


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

[mapHashtag(rssHashtag)](./rss-tracker.rsstagmanager.maphashtag.md)


</td><td>


</td><td>

Map a tag found in an rss item into the domain of the local knowledge graph.

Following rules are applied: - if the tag has already been cached by Obsidian, the hashtag is passed through unchanged - if the tag is new, it is put into the rss domain and a default mapping is aaded to the tag map file located at [RSSTrackerSettings.rssTagmapPath](./rss-tracker.rsstrackersettings.rsstagmappath.md)<!-- -->. - if there is a mapping defined in the map file [RSSTrackerSettings.rssTagmapPath](./rss-tracker.rsstrackersettings.rsstagmappath.md)<!-- -->, the tag is mapped and changed in the text.


</td></tr>
<tr><td>

[registerFileForPostProcessing(path)](./rss-tracker.rsstagmanager.registerfileforpostprocessing.md)


</td><td>


</td><td>

Register a file for post processing hashtags in the note body.

Post processing is performed by the event handler returnd from .


</td></tr>
<tr><td>

[updateTagMap()](./rss-tracker.rsstagmanager.updatetagmap.md)


</td><td>


</td><td>

Update the in-memory tag map.

The map is updated from: - The persisted mapping table at [RSSTrackerSettings.rssTagmapPath](./rss-tracker.rsstrackersettings.rsstagmappath.md) - Hashtags in the rss domain from the Obsidian metadata cache.

All unused mappings are removed


</td></tr>
</tbody></table>
