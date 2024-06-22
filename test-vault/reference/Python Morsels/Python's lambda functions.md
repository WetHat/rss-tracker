---
author: "Python Morsels"
published: 2023-10-25T12:30:00.000Z
link: https://www.pythonmorsels.com/lambda-expressions/
id: https://www.pythonmorsels.com/lambda-expressions/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] Python's lambda functions - 2023-10-25T12:30:00.000Z
> What are lambda expressions and how are they used in Python?
> 
> **Table of contents**
> 
> 1. [Lambda expressions define functions](https://www.pythonmorsels.com/lambda-expressions/#lambda-expressions-define-functions)
> 2. [Lambda expressions can be defined on the same line they're used](https://www.pythonmorsels.com/lambda-expressions/#lambda-expressions-can-be-defined-on-the-same-line-theyre-used)
> 3. [The limitations of lambda expressions](https://www.pythonmorsels.com/lambda-expressions/#the-limitat⋯

🔗Read article [online](https://www.pythonmorsels.com/lambda-expressions/). For other items in this feed see [[Python Morsels]].

- [ ] [[Python's lambda functions]]
- - -
What are lambda expressions and how are they used in Python?

**Table of contents**

1. [Lambda expressions define functions](https://www.pythonmorsels.com/lambda-expressions/#lambda-expressions-define-functions)
2. [Lambda expressions can be defined on the same line they're used](https://www.pythonmorsels.com/lambda-expressions/#lambda-expressions-can-be-defined-on-the-same-line-theyre-used)
3. [The limitations of lambda expressions](https://www.pythonmorsels.com/lambda-expressions/#the-limitations-of-lambda-expressions)
4. [When should you avoid lambda expressions?](https://www.pythonmorsels.com/lambda-expressions/#when-should-you-avoid-lambda-expressions)
5. [Where is lambda often used?](https://www.pythonmorsels.com/lambda-expressions/#where-is-lambda-often-used)
6. [Pass functions around, but use lambda conservatively](https://www.pythonmorsels.com/lambda-expressions/#pass-functions-around-but-use-lambda-conservatively)

## Lambda expressions define functions

A lambda expression looks like this:

`>>> square = lambda n:                                 n**2`
                                

This `square` variable [points](https://www.pythonmorsels.com/pointers/) to some object now. What do you think its _type_ might be?

`>>> type(square)                                 <class 'function'>`
                                

It's a function!

We could [call this function](https://www.pythonmorsels.com/calling-a-function/) just like any other function in Python:

`>>> square(3)                                 9`
                                

A lambda expression is a way of making a function. And a lambda function is the object we get back from a lambda expression:

`>>> square                                 <function <lambda> at                                 0x7f7f221eaca0>`
                                

But wait... don't we already have a syntax for making functions in Python?

We do and you've probably seen it many times before:

`def square(n):                                 return n**2`
                                

We can use this `def` syntax for [defining a new function](https://www.pythonmorsels.com/making-a-function/).

So why do lambda expressions exist?

## Lambda expressions can be defined on the same line they're used

Let's say we'd like to …

### [Read the full article: https://www.pythonmorsels.com/lambda-expressions/](https://www.pythonmorsels.com/lambda-expressions/)
