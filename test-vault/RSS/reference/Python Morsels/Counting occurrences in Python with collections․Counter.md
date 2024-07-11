---
author: "Python Morsels"
published: 2023-06-27T15:00:00.000Z
link: https://www.pythonmorsels.com/using-counter/
id: https://www.pythonmorsels.com/using-counter/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] Counting occurrences in Python with collections.Counter - 2023-06-27T15:00:00.000Z
> Python's `collections.Counter` class is extremely handy, especially when paired with generator expressions.
> 
> **Table of contents**
> 
> 1. [What is a `Counter`?](https://www.pythonmorsels.com/using-counter/#what-is-a-counter)
> 2. [Creating a `Counter` object](https://www.pythonmorsels.com/using-counter/#creating-a-counter-object)
> 3. [Getting the N most common items](https://www.pythonmorsels.com/using-counter/#getting-the-n-most-common-items)
> 4. [Examples of getting the most common items](https://www⋯

🔗Read article [online](https://www.pythonmorsels.com/using-counter/). For other items in this feed see [[../Python Morsels]].

- [ ] [[Counting occurrences in Python with collections․Counter]]
- - -
Python's `collections.Counter` class is extremely handy, especially when paired with generator expressions.

**Table of contents**

1. [What is a `Counter`?](https://www.pythonmorsels.com/using-counter/#what-is-a-counter)
2. [Creating a `Counter` object](https://www.pythonmorsels.com/using-counter/#creating-a-counter-object)
3. [Getting the N most common items](https://www.pythonmorsels.com/using-counter/#getting-the-n-most-common-items)
4. [Examples of getting the most common items](https://www.pythonmorsels.com/using-counter/#examples-of-getting-the-most-common-items)
5. [Adding items to a `Counter`](https://www.pythonmorsels.com/using-counter/#adding-items-to-a-counter)
6. [Subtracting items from a `Counter`](https://www.pythonmorsels.com/using-counter/#subtracting-items-from-a-counter)
7. [Removing negative counts](https://www.pythonmorsels.com/using-counter/#removing-negative-counts)
8. [Arithmetic with `Counter` objects](https://www.pythonmorsels.com/using-counter/#arithmetic-with-counter-objects)
9. [`Counter` comprehensions](https://www.pythonmorsels.com/using-counter/#counter-comprehensions)
10. [Use `Counter` for counting occurrences of many items](https://www.pythonmorsels.com/using-counter/#use-counter-for-counting-occurrences-of-many-items)

## What is a `Counter`?

Python's [`collections.Counter`](https://docs.python.org/3/library/collections.html#collections.Counter) objects are similar to [dictionaries](https://www.pythonmorsels.com/using-dictionaries-in-python/) but they have a few extra features that can simplify item tallying.

`>>> from collections import Counter                                 >>>                                 colors = ["purple", "pink", "green", "yellow", "yellow", "purple", "purple", "black"]                                 >>>                                 color_counts                                 = Counter(colors)                                 >>>                                 color_counts                                 Counter({'purple': 3, 'yellow': 2, 'pink': 1,                                 'green': 1, 'black': 1})                                 >>>                                 color_counts['purple']                                 3`
                                

## Creating a `Counter` object

There are **two ways** you'll …

### [Read the full article: https://www.pythonmorsels.com/using-counter/](https://www.pythonmorsels.com/using-counter/)
