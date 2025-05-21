---
role: rssitem
---

> [!abstract] {{title}} (by {{author}})
> {{image}} {{description}}

🌐 Read article [online]({{link}}). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[{{filePath}}|{{fileName}}]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

{{content}}