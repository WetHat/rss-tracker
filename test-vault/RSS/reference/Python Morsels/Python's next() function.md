---
author: "Python Morsels"
published: 2023-07-17T15:00:00.000Z
link: https://www.pythonmorsels.com/next/
id: https://www.pythonmorsels.com/next/
feed: "Python Morsels"
tags: []
pinned: false
---
> [!abstract] Python's next() function - 2023-07-17T15:00:00.000Z
> Python's built-in `next` function will consume the next item from a given iterator.
> 
> **Table of contents**
> 
> 1. [Getting the next line from a file](https://www.pythonmorsels.com/next/#getting-the-next-line-from-a-file)
> 2. [You can't use `next` on most iterables](https://www.pythonmorsels.com/next/#you-cant-use-next-on-most-iterables)
> 3. [Iterators work with `next`](https://www.pythonmorsels.com/next/#iterators-work-with-next)
> 4. [Using the `next` function with any iterable](https://www.pythonmors⋯

🔗Read article [online](https://www.pythonmorsels.com/next/). For other items in this feed see [[../Python Morsels]].

- [ ] [[Python's next() function]]
- - -
Python's built-in `next` function will consume the next item from a given iterator.

**Table of contents**

1. [Getting the next line from a file](https://www.pythonmorsels.com/next/#getting-the-next-line-from-a-file)
2. [You can't use `next` on most iterables](https://www.pythonmorsels.com/next/#you-cant-use-next-on-most-iterables)
3. [Iterators work with `next`](https://www.pythonmorsels.com/next/#iterators-work-with-next)
4. [Using the `next` function with any iterable](https://www.pythonmorsels.com/next/#using-the-next-function-with-any-iterable)
5. [The default value](https://www.pythonmorsels.com/next/#the-default-value)
6. [Prefer `for` loops over repeated `next` calls](https://www.pythonmorsels.com/next/#prefer-for-loops-over-repeated-next-calls)
7. [When to use the `next` function](https://www.pythonmorsels.com/next/#when-to-use-the-next-function)
8. [Looping helpers often use `next`](https://www.pythonmorsels.com/next/#looping-helpers-often-use-next)
9. [Use `next` for consuming a single iterator item](https://www.pythonmorsels.com/next/#use-next-for-consuming-a-single-iterator-item)

## Getting the next line from a file

You can use Python's `next` function to get the next line from a file:

`>>> with open("poems/harlem.txt", mode="rt")                                 as file:                                 ...  first_line = next(file)                                 ...                                 >>>                                 first_line                                 'What happens to a dream                                 deferred?\n'`
                                

The `next` function doesn't just work on [file objects](https://www.pythonmorsels.com/terms/#file-object) though. For example, it also works on `csv.reader` objects:

`>>> import csv                                 >>>                                 with open("penguins_small.csv", mode="rt",                                 newline="")                                 as penguins_file:                                 ...  reader = csv.reader(penguins_file)                                 ...  headers = next(reader)                                 ...                                 >>>                                 headers                                 ['species', 'island', 'bill_length_mm',                                 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g',                                 'sex']`
                                

We just used `next` to pop off the header row just before we start [reading a CSV file](https://www.pythonmorsels.com/csv-reading/).

Besides file objects and `csv.reader` objects, what else does the `next` function work with?

## You can't use `next` on most iterables

If you pass a list …

### [Read the full article: https://www.pythonmorsels.com/next/](https://www.pythonmorsels.com/next/)
