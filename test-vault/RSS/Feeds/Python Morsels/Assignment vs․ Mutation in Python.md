---
role: rssitem
author: Unknown
published: 2024-05-18T12:13:21.000Z
link: https://www.pythonmorsels.com/assignment-versus-mutation/
id: https://www.pythonmorsels.com/assignment-versus-mutation/
feed: "[[Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Assignment vs. Mutation in Python - 2024-05-18T12:13:21.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> In Python, "change" can mean two different things. Assignment changes which object a variable points to. Mutation, changes the object itself.
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1854521349-e14ed4db822e6fea015ebfe110262647a82f42a5680adaa7865ff74da2cb4765-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [Remember: variables are pointers](https://www.pythonmorsels.com/assignment-versus-mutatio⋯

🔗Read article [online](https://www.pythonmorsels.com/assignment-versus-mutation/). For other items in this feed see [[Python Morsels]].

- [ ] [[Assignment vs․ Mutation in Python]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Additional RSS Items Referring to This Article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
In Python, "change" can mean two different things. Assignment changes which object a variable points to. Mutation, changes the object itself.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1854521349-e14ed4db822e6fea015ebfe110262647a82f42a5680adaa7865ff74da2cb4765-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [Remember: variables are pointers](https://www.pythonmorsels.com/assignment-versus-mutation/#remember-variables-are-pointers)
2. [Mutating a list](https://www.pythonmorsels.com/assignment-versus-mutation/#mutating-a-list)
3. [Mutation](https://www.pythonmorsels.com/assignment-versus-mutation/#mutation)
4. [Assignment](https://www.pythonmorsels.com/assignment-versus-mutation/#assignment)
5. [Assignments versus mutations](https://www.pythonmorsels.com/assignment-versus-mutation/#assignments-versus-mutations)
6. [Changing variables and changing objects](https://www.pythonmorsels.com/assignment-versus-mutation/#changing-variables-and-changing-objects)

## Remember: variables are pointers

When talking about Python code, if I say **we changed X**, there are two different things that I might mean.

Let's say we have two variables that point to the same value:

```undefined
>>> a =
                                [2,
                                1, 3,
                                4]
                                >>>
                                b = a
                                
```

Remember that [variables in Python are pointers](https://www.pythonmorsels.com/variables-are-pointers/). That means that **two variables _can point_ to the same object**. That's actually what we've done here.

Let's change the object that the variable `b` points to.

## Mutating a list

If we append a number …

### [Read the full article: https://www.pythonmorsels.com/assignment-versus-mutation/](https://www.pythonmorsels.com/assignment-versus-mutation/)