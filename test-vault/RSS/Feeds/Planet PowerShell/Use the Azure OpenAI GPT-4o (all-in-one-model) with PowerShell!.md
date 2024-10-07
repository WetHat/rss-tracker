---
role: rssitem
author: "Matthew Dowst"
published: 2024-05-24T12:23:43.000Z
link: https://alexholmeset.blog/2024/05/22/use-the-azure-openai-gpt-4o-all-in-one-model-with-powershell/
id: https://psweekly.dowst.dev/?post_type=link_library_links&p=6891
feed: "[[Planet PowerShell]]"
tags: []
pinned: false
---

> [!abstract] Use the Azure OpenAI GPT-4o (all-in-one-model) with PowerShell! by Matthew Dowst - 2024-05-24T12:23:43.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> On May 13th GPT-4o was released in preview in the Azure OpenAI Playground. No API access, only
> 
> accessible in the browser. Today I was going into the playground to test something with the GPT-4o model, but could not find it. What had happened? Turnes out it suddenly was in GA and available to choose under ... Continue reading Use the Azure OpenAI GPT-4o (all-in-one-model) with PowerShell!
> 
> (+)(-)

🔗Read article [online](https://alexholmeset.blog/2024/05/22/use-the-azure-openai-gpt-4o-all-in-one-model-with-powershell/). For other items in this feed see [[Planet PowerShell]].

- [ ] [[Use the Azure OpenAI GPT-4o (all-in-one-model) with PowerShell!]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Other RSS items are referring to the same article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
On May 13th GPT-4o was released in preview in the Azure OpenAI Playground. No API access, only

accessible in the browser. Today I was going into the playground to test something with the GPT-4o model, but could not find it. What had happened? Turnes out it suddenly was in GA and available to choose under ... Continue reading Use the Azure OpenAI GPT-4o (all-in-one-model) with PowerShell!

(+)(-)