---
role: rssitem
author: Unknown
published: 2024-05-28T23:52:24.000Z
link: https://www.pythonmorsels.com/equality-vs-identity/
id: https://www.pythonmorsels.com/equality-vs-identity/
feed: "[[Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Equality versus identity in Python - 2024-05-28T23:52:24.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span>
> Equality checks whether two objects **represent the same value**. Identity checks whether two variables **point to the same object**.
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1859635053-5a5a328c38769260b233cb1fae005603a26ff65e609fba2d15a8af03ad563ba9-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [The equality operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-equality⋯

🔗Read article [online](https://www.pythonmorsels.com/equality-vs-identity/). For other items in this feed see [[Python Morsels]].

- [ ] [[Equality versus identity in Python]]

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
Equality checks whether two objects **represent the same value**. Identity checks whether two variables **point to the same object**.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1859635053-5a5a328c38769260b233cb1fae005603a26ff65e609fba2d15a8af03ad563ba9-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [The equality operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-equality-operator-in-python)
2. [The `is` operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-is-operator-in-python)
3. [How equality and identity work differently?](https://www.pythonmorsels.com/equality-vs-identity/#how-equality-and-identity-work-differently)
4. [Inequality and non-identity operators](https://www.pythonmorsels.com/equality-vs-identity/#inequality-and-non-identity-operators)
5. [Where are identity checks used?](https://www.pythonmorsels.com/equality-vs-identity/#where-are-identity-checks-used)
6. [Equality vs. Identity](https://www.pythonmorsels.com/equality-vs-identity/#equality-vs-identity)

## The equality operator in Python

Let's say we have two variables that point to two lists:

```undefined
>>> a =
                                [2,
                                1, 3]
                                >>>
                                b = [2,
                                1, 3,
                                4]
                                
```

When we use the `==` operator to check whether these lists are equal, we'll see that they are not equal:

```undefined
>>> a ==
                                b
                                False
                                
```

These lists **don't have the same values right now, so they're not equal**.

Let's update the first list so that these two lists do have equivalent values:

```undefined
>>> a.append(4)
                                >>>
                                a
                                [2, 1, 3, 4]
                                
```

If we use `==` again, we'll see that these lists _are_ equal now:

```undefined
>>> a ==
                                b
                                True
                                
```

Python's `==` operator checks for **equality**. Two objects are equal if **they represent the same data**.

## The `is` operator in Python

Python also has an `is …`

### [Read the full article: https://www.pythonmorsels.com/equality-vs-identity/](https://www.pythonmorsels.com/equality-vs-identity/)