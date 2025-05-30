---
role: rssitem
aliases: []
id: https://www.pythonmorsels.com/equality-vs-identity/
author: unknown
link: https://www.pythonmorsels.com/equality-vs-identity/
published: 2024-05-28T23:52:24.000Z
feed: "[[RSS/Feeds/Python Morsels.md|Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Equality versus identity in Python (by unknown)
> ![image|float:right|400](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1859635053-5a5a328c38769260b233cb1fae005603a26ff65e609fba2d15a8af03ad563ba9-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png) Equality checks whether two objects **represent the same value**. Identity checks whether two variables **point to the same object**.
> 
> **Table of contents**
> 
> 1. [The equality operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-equality-operator-in-python)
> 2. [The `is` operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-is-operator-in-python)
> 3. [How equality and identity work differently?](https://www.pythonmorsels.com/equality-vs-identity/#how-equality-and-identity-work-differently)
> 4. [Inequality and non-identity operators](https://www.pythonmorsels.com/equality-vs-identity/#inequality-and-non-identity-operators)
> 5. [Where are identity checks used?](https://www.pythonmorsels.com/equality-vs-identity/#where-are-identity-checks-used)
> 6. [Equa⋯

🌐 Read article [online](https://www.pythonmorsels.com/equality-vs-identity/). ⤴ For other items in this feed see [[RSS/Feeds/Python Morsels.md|Python Morsels]].

- [ ] [[RSS/Feeds/Python Morsels/Equality versus identity in Python|Equality versus identity in Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

Equality checks whether two objects **represent the same value**. Identity checks whether two variables **point to the same object**.

**Table of contents**

1. [The equality operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-equality-operator-in-python)
2. [The `is` operator in Python](https://www.pythonmorsels.com/equality-vs-identity/#the-is-operator-in-python)
3. [How equality and identity work differently?](https://www.pythonmorsels.com/equality-vs-identity/#how-equality-and-identity-work-differently)
4. [Inequality and non-identity operators](https://www.pythonmorsels.com/equality-vs-identity/#inequality-and-non-identity-operators)
5. [Where are identity checks used?](https://www.pythonmorsels.com/equality-vs-identity/#where-are-identity-checks-used)
6. [Equality vs. Identity](https://www.pythonmorsels.com/equality-vs-identity/#equality-vs-identity)

## The equality operator in Python

Let's say we have two variables that point to two lists:

```
>>> a =
                                [2,
                                1, 3]
                                >>>
                                b = [2,
                                1, 3,
                                4]
```

When we use the `==` operator to check whether these lists are equal, we'll see that they are not equal:

```
>>> a ==
                                b
                                False
```

These lists **don't have the same values right now, so they're not equal**.

Let's update the first list so that these two lists do have equivalent values:

```
>>> a.append(4)
                                >>>
                                a
                                [2, 1, 3, 4]
```

If we use `==` again, we'll see that these lists _are_ equal now:

```
>>> a ==
                                b
                                True
```

Python's `==` operator checks for **equality**. Two objects are equal if **they represent the same data**.

## The `is` operator in Python

Python also has an `is …`

### [Read the full article: https://www.pythonmorsels.com/equality-vs-identity/](https://www.pythonmorsels.com/equality-vs-identity/)
