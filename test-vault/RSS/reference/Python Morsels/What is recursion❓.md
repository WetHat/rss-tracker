---
author: "Python Morsels"
published: 2023-09-04T18:15:00.000Z
link: https://www.pythonmorsels.com/what-is-recursion/
id: https://www.pythonmorsels.com/what-is-recursion/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] What is recursion? - 2023-09-04T18:15:00.000Z
> Recursion is when a function calls itself. Loops are usually preferable to recursion, but recursion is excellent for traversing tree-like structures.
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1706362507-e783dfde4957831df8348108e502930de2ffc75a4423989e2a4ac6bf66134a46-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [Recursive functions call themselves](https://www.pythonmorsels.com/what-is-recurs⋯

🔗Read article [online](https://www.pythonmorsels.com/what-is-recursion/). For other items in this feed see [[../Python Morsels]].

- [ ] [[What is recursion❓]]
- - -
Recursion is when a function calls itself. Loops are usually preferable to recursion, but recursion is excellent for traversing tree-like structures.

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1706362507-e783dfde4957831df8348108e502930de2ffc75a4423989e2a4ac6bf66134a46-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [Recursive functions call themselves](https://www.pythonmorsels.com/what-is-recursion/#recursive-functions-call-themselves)
2. [Beware infinite recursion](https://www.pythonmorsels.com/what-is-recursion/#beware-infinite-recursion)
3. [Recursion works thanks to the call stack](https://www.pythonmorsels.com/what-is-recursion/#recursion-works-thanks-to-the-call-stack)
4. [Using `for` loops instead of recursion](https://www.pythonmorsels.com/what-is-recursion/#using-for-loops-instead-of-recursion)
5. [Recursion's most common use case](https://www.pythonmorsels.com/what-is-recursion/#recursions-most-common-use-case)
6. [Loops are great, but recursion does have its uses](https://www.pythonmorsels.com/what-is-recursion/#loops-are-great-but-recursion-does-have-its-uses)

## Recursive functions call themselves

Here's a [Python script](https://www.pythonmorsels.com/module-vs-script/) that counts up to a given number:

`from argparse import ArgumentParser                                  def count_to(number):                                 for n in                                 range(1,                                 number+1):                                 print(n)                                 def parse_args():                                 parser = ArgumentParser()                                 parser.add_argument("stop", type=int)                                 return parser.parse_args()                                  def main():                                 args = parse_args()                                 count_to(args.stop)                                 if __name__ == "__main__":                                 main()`
                                

Note that the [`main` function](https://www.pythonmorsels.com/making-main-function-python/) in that program calls the `parse_args` function as well as the `count_to` function.

Functions can [call _other_ functions](https://www.pythonmorsels.com/calling-a-function/) in Python. But functions can _also_ **call themselves**!

Here's a [function](https://www.pythonmorsels.com/making-a-function/) that calls itself:

`def factorial(n):                                 if n < 0:                                 raise ValueError("Negative numbers                                 not accepted")                                 if n ==                                 0:                                 return 1                                 return n *                                 factorial(n-1)`
                                

A function that calls itself is called a **recursive function**.

It might seem like a bad idea for a function to call itself and it often _is_ a bad idea... but not always.

## Beware infinite recursion

If a function calls itself …

### [Read the full article: https://www.pythonmorsels.com/what-is-recursion/](https://www.pythonmorsels.com/what-is-recursion/)
