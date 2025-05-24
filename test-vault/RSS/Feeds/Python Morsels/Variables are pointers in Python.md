---
role: rssitem
aliases: []
id: https://www.pythonmorsels.com/variables-are-pointers/
author: unknown
link: https://www.pythonmorsels.com/variables-are-pointers/
published: 2024-05-02T15:00:00.000Z
feed: "[[RSS/Feeds/Python Morsels.md | Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Variables are pointers in Python (by unknown)
> ![image|float:right|400](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1845329914-b5fa57ff219326904a95bd76a0f43718091a20347606e8c743228177821624c4-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png) Python's variables are not buckets that contain objects; they're pointers. Assignment statements don't copy: they point a variable to a value (and multiple variables can "point" to the same value).
> 
> **Table of contents**
> 
> 1. [Changing two lists at once...?](https://www.pythonmorsels.com/variables-are-pointers/#changing-two-lists-at-once)
> 2. [Variables are _separate_ from objects](https://www.pythonmorsels.com/variables-are-pointers/#variables-are-separate-from-objects)
> 3. [Assignment statements don't copy](https://www.pythonmorsels.com/variables-are-pointers/#assignment-statements-dont-copy)
> 4. [Explicitly copying a list](https://www.pythonmorsels.com/variables-are-pointers/#explicitly-copying-a-list)
> 5. [Variables are like pointers, not buckets](https://www.pythonmorsels.com/variables-are⋯

🌐 Read article [online](https://www.pythonmorsels.com/variables-are-pointers/). ⤴ For other items in this feed see [[RSS/Feeds/Python Morsels.md | Python Morsels]].

- [ ] [[RSS/Feeds/Python Morsels/Variables are pointers in Python|Variables are pointers in Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

Python's variables are not buckets that contain objects; they're pointers. Assignment statements don't copy: they point a variable to a value (and multiple variables can "point" to the same value).

**Table of contents**

1. [Changing two lists at once...?](https://www.pythonmorsels.com/variables-are-pointers/#changing-two-lists-at-once)
2. [Variables are _separate_ from objects](https://www.pythonmorsels.com/variables-are-pointers/#variables-are-separate-from-objects)
3. [Assignment statements don't copy](https://www.pythonmorsels.com/variables-are-pointers/#assignment-statements-dont-copy)
4. [Explicitly copying a list](https://www.pythonmorsels.com/variables-are-pointers/#explicitly-copying-a-list)
5. [Variables are like pointers, not buckets](https://www.pythonmorsels.com/variables-are-pointers/#variables-are-like-pointers-not-buckets)

## Changing two lists at once...?

Here we have a variable `a` that points to a [list](https://www.pythonmorsels.com/what-are-lists/):

```
>>> a =
                                [2,
                                1, 3,
                                4]
```

Let's make a new variable `b` and assign it to `a`:

```
>>> a =
                                [2,
                                1, 3,
                                4]
                                >>>
                                b = a
```

If we append a new item to `b`, what will its length be?

```
>>> b.append(7)
                                >>>
                                len(b)
```

Initially, the `b` list had four items, so now it should have five items. And it does:

```
>>> len(b)
                                5
```

How many items do you think `a` has? What's your guess?

```
>>> len(a)
```

Is it five, the same as `b`? Or is it still four, as it was before?

The `a` list also has five items:

```
>>> len(a)
                                5
```

What's going on here?

Well, the variables `a` and `b`, both point to the same list.

If we look up the unique ID for the object that each of these variables points to, we'll see that **they both point to the same object**:

```
>>> id(a)
                                140534104117312
                                >>>
                                id(b)
                                140534104117312
```

This is possible because variables in Python are **_not_ buckets, but pointers**.

## Variables are _separate_ from objects

Let's say we've made three …

### [Read the full article: https://www.pythonmorsels.com/variables-are-pointers/](https://www.pythonmorsels.com/variables-are-pointers/)