---
author: "Python Morsels"
published: 2023-08-07T15:00:00.000Z
link: https://www.pythonmorsels.com/creating-a-context-manager/
id: https://www.pythonmorsels.com/creating-a-context-manager/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] Creating a context manager in Python - 2023-08-07T15:00:00.000Z
> Objects with `__enter__` and `__exit__` methods can be used as context managers in Python.
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1688735518-f063c9288c1bd9612f1ad0a4e77be3e3d6442067bc6a5ec53f03f072dd24ef5b-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [What is a context manager?](https://www.pythonmorsels.com/creating-a-context-manager/#what-is-a-context-manager)
> 2. [A useful context manage⋯

🔗Read article [online](https://www.pythonmorsels.com/creating-a-context-manager/). For other items in this feed see [[Python Morsels]].

- [ ] [[Creating a context manager in Python]]
- - -
Objects with `__enter__` and `__exit__` methods can be used as context managers in Python.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1688735518-f063c9288c1bd9612f1ad0a4e77be3e3d6442067bc6a5ec53f03f072dd24ef5b-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [What is a context manager?](https://www.pythonmorsels.com/creating-a-context-manager/#what-is-a-context-manager)
2. [A useful context manager](https://www.pythonmorsels.com/creating-a-context-manager/#a-useful-context-manager)
3. [What about that `as` keyword?](https://www.pythonmorsels.com/creating-a-context-manager/#what-about-that-as-keyword)
4. [The return value of `__enter__`](https://www.pythonmorsels.com/creating-a-context-manager/#the-return-value-of-__enter__)
5. [The arguments passed to `__exit__`](https://www.pythonmorsels.com/creating-a-context-manager/#the-arguments-passed-to-__exit__)
6. [The return value of `__exit__`](https://www.pythonmorsels.com/creating-a-context-manager/#the-return-value-of-__exit__)
7. [Aside: what about `contextmanager`?](https://www.pythonmorsels.com/creating-a-context-manager/#aside-what-about-contextmanager)
8. [Make context managers with `__enter__` & `__exit__`](https://www.pythonmorsels.com/creating-a-context-manager/#make-context-managers-with-__enter__-__exit__)

## What is a context manager?

A [context manager](https://www.pythonmorsels.com/what-is-a-context-manager/) is **an object that can be used in a `with` block** to sandwich some code between an entrance action and an exit action.

File objects can be used as context managers to _automatically_ close the file when we're done working with it:

`>>> with open("example.txt", "w")                                 as file:                                 ...  file.write("Hello,                                 world!")                                 ...                                 13                                 >>>                                 file.closed                                 True`
                                

Context managers need a `__enter__` method and a `__exit__` method, and the `__exit__` method should accept three [positional arguments](https://www.pythonmorsels.com/positional-vs-keyword-arguments/):

`class Example:                                 def __enter__(self):                                 print("enter")                                  def __exit__(self,                                 exc_type, exc_val, exc_tb):                                 print("exit")`
                                

This context manager just prints `enter` when the `with` block is entered and `exit` when the `with` block is exited:

`>>> with Example():                                 ...  print("Yay                                 Python!")                                 ...                                 enter                                 Yay Python!                                 exit`
                                

Of course, this is a somewhat silly context manager. Let's look at a context manager that actually does something a little bit useful.

## A useful context manager

This context manager **temporarily changes …**

### [Read the full article: https://www.pythonmorsels.com/creating-a-context-manager/](https://www.pythonmorsels.com/creating-a-context-manager/)
