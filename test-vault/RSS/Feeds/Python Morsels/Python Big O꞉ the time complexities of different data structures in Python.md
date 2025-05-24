---
role: rssitem
aliases:
  - "Python Big O: the time complexities of different data structures in Python"
id: https://www.pythonmorsels.com/time-complexities/
author: unknown
link: https://www.pythonmorsels.com/time-complexities/
published: 2024-04-16T15:00:00.000Z
feed: "[[RSS/Feeds/Python Morsels.md | Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Python Big O: the time complexities of different data structures in Python (by unknown)
> ![image|float:right|400](https://pythonmorsels.s3.amazonaws.com/medialibrary/2024/03/time_complexity.png) The time complexity of common operations on Python's many data structures.
> 
> **Table of contents**
> 
> 1. [Time Complexity ⏱️](https://www.pythonmorsels.com/time-complexities/#time-complexity)
> 2. [List 📋](https://www.pythonmorsels.com/time-complexities/#list)
> 3. [Double-Ended Queue ↔️](https://www.pythonmorsels.com/time-complexities/#double-ended-queue)
> 4. [Dictionary 🗝️](https://www.pythonmorsels.com/time-complexities/#dictionary)
> 5. [Set 🎨](https://www.pythonmorsels.com/time-complexities/#set)
> 6. [Counter 🧮](https://www.pythonmorsels.com/time-complexities/#counter)
> 7. [Heap / Priority Queue ⛰️](https://www.pythonmorsels.com/time-complexities/#heap-priority-queue)
> 8. [Sorted List 🔤](https://www.pythonmorsels.com/time-complexities/#sorted-list)
> 9. [Traversal Techniques 🔍](https://www.pyt⋯

🌐 Read article [online](https://www.pythonmorsels.com/time-complexities/). ⤴ For other items in this feed see [[RSS/Feeds/Python Morsels.md | Python Morsels]].

- [ ] [[RSS/Feeds/Python Morsels/Python Big O꞉ the time complexities of different data structures in Python|Python Big O꞉ the time complexities of different data structures in Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

The time complexity of common operations on Python's many data structures.

**Table of contents**

1. [Time Complexity ⏱️](https://www.pythonmorsels.com/time-complexities/#time-complexity)
2. [List 📋](https://www.pythonmorsels.com/time-complexities/#list)
3. [Double-Ended Queue ↔️](https://www.pythonmorsels.com/time-complexities/#double-ended-queue)
4. [Dictionary 🗝️](https://www.pythonmorsels.com/time-complexities/#dictionary)
5. [Set 🎨](https://www.pythonmorsels.com/time-complexities/#set)
6. [Counter 🧮](https://www.pythonmorsels.com/time-complexities/#counter)
7. [Heap / Priority Queue ⛰️](https://www.pythonmorsels.com/time-complexities/#heap-priority-queue)
8. [Sorted List 🔤](https://www.pythonmorsels.com/time-complexities/#sorted-list)
9. [Traversal Techniques 🔍](https://www.pythonmorsels.com/time-complexities/#traversal-techniques)
10. [Other Data Structures? 📚](https://www.pythonmorsels.com/time-complexities/#other-data-structures)
11. [Beware of Loops-in-Loops! 🤯](https://www.pythonmorsels.com/time-complexities/#beware-of-loops-in-loops)
12. [Mind Your Data Structures 🗃️](https://www.pythonmorsels.com/time-complexities/#mind-your-data-structures)

## Time Complexity ⏱️

Time complexity is one of those Computer Science concepts that's scary in its purest form, but often fairly practical as a rough "_am I doing this right_" measurement.

In the words of [Ned Batchelder](https://nedbatchelder.com/text/bigo.html), time complexity is all about "how your code slows as your data grows".

Time complexity is usually discussed in terms of "Big O" notation. This is basically a way to discuss the **order of magnitude** for a given operation while ignoring the _exact_ number of computations it needs. In "Big O" land, we don't care if something is twice as slow, but we do care whether it's `n` times slower where `n` is the length of our list/set/slice/etc.

Here's a graph of the common time complexity curves:

Remember that these lines are simply about **orders of magnitude**. If an operation is on the order of `n`, that means 100 times more data will slow things down about 100 times. If an operation is on the order of `n²` (that's `n*n`), that means 100 times more data will slow things down `100*100` times.

I usually think about those curves in terms of what would happen if we suddenly had 1,000 times more data to work with:

- `O(1)`: no change in time (_constant_ time!)
- `O(log n)`: ~10 times slow down
- `O(n)`: 1,000 times slow down
- `O(n log n)`: 10,000 times slow down
- `O(n²)`: 1,000,000 times slow down! 😲

With that _very_ quick recap behind us, let's take a look at the relative speeds of all common operations on each of Python's data structures.

## List 📋

Python's **lists** are similar to …

### [Read the full article: https://www.pythonmorsels.com/time-complexities/](https://www.pythonmorsels.com/time-complexities/)