---
author: "Python Morsels"
published: 2023-07-10T15:00:00.000Z
link: https://www.pythonmorsels.com/print-vs-return/
id: https://www.pythonmorsels.com/print-vs-return/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] The difference between return and print in Python - 2023-07-10T15:00:00.000Z
> Both `return` and `print` "output" something, but one shows output to an end user and the other doesn't.
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1830720410-07e28d2d73deb8541494e80d0e481caa67d4c43543a0dbf800580e141febe64c-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [Both `print` and `return` _output_ something](https://www.pythonmorsels.com/print-vs-return/#both-print-and-return-output-some⋯

🔗Read article [online](https://www.pythonmorsels.com/print-vs-return/). For other items in this feed see [[../Python Morsels]].

- [ ] [[The difference between return and print in Python]]
- - -
Both `return` and `print` "output" something, but one shows output to an end user and the other doesn't.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1830720410-07e28d2d73deb8541494e80d0e481caa67d4c43543a0dbf800580e141febe64c-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [Both `print` and `return` _output_ something](https://www.pythonmorsels.com/print-vs-return/#both-print-and-return-output-something)
2. [The difference between `print` and `return`](https://www.pythonmorsels.com/print-vs-return/#the-difference-between-print-and-return)
3. [The Python REPL prints automatically](https://www.pythonmorsels.com/print-vs-return/#the-python-repl-prints-automatically)
4. [Python scripts don't print automatically](https://www.pythonmorsels.com/print-vs-return/#python-scripts-dont-print-automatically)
5. [When to `print` and when to `return`?](https://www.pythonmorsels.com/print-vs-return/#when-to-print-and-when-to-return)
6. [Most Python functions return, but some print](https://www.pythonmorsels.com/print-vs-return/#most-python-functions-return-but-some-print)

## Both `print` and `return` _output_ something

Here's a [function](https://www.pythonmorsels.com/making-a-function/) called `nth_fibonacci` that calculates the nth [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_sequence) and prints out the result:

`from math import sqrt                                  root5 = sqrt(5)                                 phi = (1                                 + root5)/2                                 # The golden ratio                                  def nth_fibonacci(n):                                 print(round(phi**n                                 / root5))`
                                

If we give it the number `20`, we'll see the 20th Fibonacci number:

`>>> nth_fibonacci(20)                                 6765`
                                

Here's a function that does nearly the same thing, except it uses `return` instead of [`print`](https://www.pythonmorsels.com/built-in-functions-in-python/#print):

`from math import sqrt                                  root5 = sqrt(5)                                 phi = (1                                 + root5)/2                                 # The golden ratio                                  def nth_fibonacci(n):                                 print(round(phi**n                                 / root5))                                 def nth_fibonacci2(n):                                 return round(phi**n                                 / root5)`
                                

When we call this second function, it seems like it does _exactly_ the same thing:

`>>> nth_fibonacci2(20)                                 6765                                 >>>                                 nth_fibonacci(20)                                 6765`
                                

What's going on here?

## The difference between `print` and `return`

One of these functions prints …

### [Read the full article: https://www.pythonmorsels.com/print-vs-return/](https://www.pythonmorsels.com/print-vs-return/)
