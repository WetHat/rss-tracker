---
role: rssitem
author: {{author}}
published: {{publishDate}}
link: {{link}}
id: {{id}}
feed: "[[{{feedFileName}}]]"
tags: [{{tags}}]
pinned: false
---

> [!abstract] {{title}}
> <span class="rss-image">{{image}}</span> {{description}}

🌐 Read article [online]({{link}}). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[{{fileName}}]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
{{content}}