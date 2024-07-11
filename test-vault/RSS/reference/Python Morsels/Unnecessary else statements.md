---
author: "Python Morsels"
published: 2024-03-22T22:00:00.000Z
link: https://www.pythonmorsels.com/unnecessary-else-statements/
id: https://www.pythonmorsels.com/unnecessary-else-statements/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] Unnecessary else statements - 2024-03-22T22:00:00.000Z
> When your function ends in an `else` block with a `return` statement in it, should you remove that `else`?
> 
> ![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1819454470-59789a86671b414679eb978d1af70942df16e8d2ea5ca46c1f4eab3ae5e2e0eb-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)
> 
> **Table of contents**
> 
> 1. [A function where both `if` and `else` return](https://www.pythonmorsels.com/unnecessary-else-statements/#a-function-where-bo⋯

🔗Read article [online](https://www.pythonmorsels.com/unnecessary-else-statements/). For other items in this feed see [[../Python Morsels]].

- [ ] [[Unnecessary else statements]]
- - -
When your function ends in an `else` block with a `return` statement in it, should you remove that `else`?

![](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1819454470-59789a86671b414679eb978d1af70942df16e8d2ea5ca46c1f4eab3ae5e2e0eb-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png)

**Table of contents**

1. [A function where both `if` and `else` return](https://www.pythonmorsels.com/unnecessary-else-statements/#a-function-where-both-if-and-else-return)
2. [Is that `else` statement unnecessary?](https://www.pythonmorsels.com/unnecessary-else-statements/#is-that-else-statement-unnecessary)
3. [Sometimes `else` improves readability](https://www.pythonmorsels.com/unnecessary-else-statements/#sometimes-else-improves-readability)
4. [When should you remove an `else` statement?](https://www.pythonmorsels.com/unnecessary-else-statements/#when-should-you-remove-an-else-statement)
5. [Considering readability with `if`-`else` statements](https://www.pythonmorsels.com/unnecessary-else-statements/#considering-readability-with-if-else-statements)

## A function where both `if` and `else` return

This `earliest_date` function uses the [python-dateutil](https://pypi.org/project/python-dateutil/) third-party library to parse two strings as dates:

`from dateutil.parser import parse                                  def earliest_date(date1,                                 date2):                                 """Return the string representing the                                 earliest date."""                                 if parse(date1,                                 fuzzy=True)                                 < parse(date2,                                 fuzzy=True):                                 return date1                                 else:                                 return date2`
                                

This function returns the string which represents the earliest given date:

`>>> earliest_date("May 3                                 2024", "June 5 2025")                                 'May 3 2024'                                 >>>                                 earliest_date("Feb 3                                 2026", "June 5 2025")                                 'June 5 2025'`
                                

Note that this function uses an [if statement](https://www.pythonmorsels.com/if-statements/) that returns, and an `else` that also returns.

## Is that `else` statement unnecessary?

We don't necessarily _need_ that …

### [Read the full article: https://www.pythonmorsels.com/unnecessary-else-statements/](https://www.pythonmorsels.com/unnecessary-else-statements/)
