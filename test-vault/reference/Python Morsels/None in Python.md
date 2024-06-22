---
author: "Python Morsels"
published: 2024-01-22T23:00:00.000Z
link: https://www.pythonmorsels.com/none/
id: https://www.pythonmorsels.com/none/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] None in Python - 2024-01-22T23:00:00.000Z
> Python's `None` value is used to represent nothingness. `None` is the default function return value.
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1757373892-970b540ce5ca85a45c973bc7b3009662cff0ca6fdcf6d5554cc64c3f6e0978ea-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [Python's `None` value](https://www.pythonmorsels.com/none/#pythons-none-value)
> 2. [`None` is falsey](https://www.pythonmorsels.com⋯

🔗Read article [online](https://www.pythonmorsels.com/none/). For other items in this feed see [[Python Morsels]].

- [ ] [[None in Python]]
- - -
Python's `None` value is used to represent nothingness. `None` is the default function return value.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1757373892-970b540ce5ca85a45c973bc7b3009662cff0ca6fdcf6d5554cc64c3f6e0978ea-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [Python's `None` value](https://www.pythonmorsels.com/none/#pythons-none-value)
2. [`None` is falsey](https://www.pythonmorsels.com/none/#none-is-falsey)
3. [`None` represents nothingness](https://www.pythonmorsels.com/none/#none-represents-nothingness)
4. [The default function return value is `None`](https://www.pythonmorsels.com/none/#the-default-function-return-value-is-none)
5. [`None` is like NULL in other programming languages](https://www.pythonmorsels.com/none/#none-is-like-null-in-other-programming-languages)

## Python's `None` value

Python has a special object that's typically **used for representing nothingness**. It's called `None`.

If we look at `None` from [the Python REPL](https://www.pythonmorsels.com/using-the-python-repl/), we'll see nothing at all:

`>>> name =                                 None                                 >>>`
                                

Though if we print it, we'll see `None`:

`>>> name =                                 None                                 >>>                                 name                                 >>>                                 print(name)                                 None`
                                

When checking for `None` values, you'll usually see Python's `is` operator used (for [identity](https://www.pythonmorsels.com/equality-vs-identity/)) instead of the equality operator (`==`):

`>>> name is None                                 True                                 >>>                                 name == None                                 True`
                                

Why is that?

Well, **`None` has its own special type**, the `NoneType`, and it's **the only object of that type**:

`>>> type(None)                                 <class 'NoneType'>`
                                

In fact, if we got a reference to that `NoneType` [class](https://www.pythonmorsels.com/classes-are-everywhere/), and then we called that class to make a new instance of it, we'll actually get back the same exact instance, always, every time we call it:

`>>> NoneType = type(None)                                 >>>                                 NoneType() is                                 None                                 True`
                                

The `NoneType` class is a **[singleton class](https://www.pythonmorsels.com/making-singletons/)**. So comparing to `None` with `is` works because there's only one `None` value. No object should compare as equal to None unless it is `None`.

## `None` is falsey

We often rely on the …

### [Read the full article: https://www.pythonmorsels.com/none/](https://www.pythonmorsels.com/none/)
