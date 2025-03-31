---
role: rssitem
author: "unknown"
published: 2024-03-08T22:16:58.000Z
link: https://www.pythonmorsels.com/slicing/
id: "https://www.pythonmorsels.com/slicing/"
feed: "[[Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] List slicing in Python by unknown - 2024-03-08T22:16:58.000Z
> ![image|float:right|400](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1809471197-6ac16458794fea7dbf99e06573578d8c7d78c395f13e143d7c899431706a0715-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png) In Python, slicing looks like indexing with colons (`:`). You can slice a list (or any sequence) to get the first few items, the last few items, or all items in reverse.
> 
> **Table of contents**
> 
> 1. [Getting the first N elements from a list](https://www.pythonmorsels.com/slicing/#getting-the-first-n-elements-from-a-list)
> 2. [Slicing makes a new list](https://www.pythonmorsels.com/slicing/#slicing-makes-a-new-list)
> 3. [The start index is inclusive but the stop index is exclusive](https://www.pythonmorsels.com/slicing/#the-start-index-is-inclusive-but-the-stop-index-is-exclusive)
> 4. [Default slice start/stop values](https://www.pythonmorsels.com/slicing/#default-slice-startstop-values)
> 5. [Why the stop index isn't included in slices](https://www.pythonmorsels.com/slicing/#why-the-stop-index-is⋯

🌐 Read article [online](https://www.pythonmorsels.com/slicing/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[List slicing in Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
In Python, slicing looks like indexing with colons (`:`). You can slice a list (or any sequence) to get the first few items, the last few items, or all items in reverse.

**Table of contents**

1. [Getting the first N elements from a list](https://www.pythonmorsels.com/slicing/#getting-the-first-n-elements-from-a-list)
2. [Slicing makes a new list](https://www.pythonmorsels.com/slicing/#slicing-makes-a-new-list)
3. [The start index is inclusive but the stop index is exclusive](https://www.pythonmorsels.com/slicing/#the-start-index-is-inclusive-but-the-stop-index-is-exclusive)
4. [Default slice start/stop values](https://www.pythonmorsels.com/slicing/#default-slice-startstop-values)
5. [Why the stop index isn't included in slices](https://www.pythonmorsels.com/slicing/#why-the-stop-index-isnt-included-in-slices)
6. [Negative indexes work too](https://www.pythonmorsels.com/slicing/#negative-indexes-work-too)
7. [Out-of-bounds slicing is allowed](https://www.pythonmorsels.com/slicing/#out-of-bounds-slicing-is-allowed)
8. [The slice step value](https://www.pythonmorsels.com/slicing/#the-slice-step-value)
9. [Slicing works on all sequences](https://www.pythonmorsels.com/slicing/#slicing-works-on-all-sequences)
10. [The most common uses for slicing in Python](https://www.pythonmorsels.com/slicing/#the-most-common-uses-for-slicing-in-python)
11. [Use slicing to get "slices" of sequences in Python](https://www.pythonmorsels.com/slicing/#use-slicing-to-get-slices-of-sequences-in-python)

## Getting the first N elements from a list

Let's say we have a `fruits` variable that points to a [list](https://www.pythonmorsels.com/what-are-lists/):

```
>>> fruits = ['watermelon', 'apple', 'lime', 'kiwi', 'pear', 'lemon', 'orange']
                                >>>
                                fruits
                                ['watermelon', 'apple', 'lime', 'kiwi',
                                'pear', 'lemon', 'orange']
```

We can get an item from this list by indexing it:

```
>>> fruits[3]
                                'kiwi'
```

If we put a colon and another number inside the square brackets, we'll slice this list instead of indexing it:

```
>>> fruits[0:3]
                                ['watermelon', 'apple', 'lime']
```

**Slicing a list gives us back a new list.** We're getting a list of the first three items within our original list.

## Slicing makes a new list

Note that the _original_ list …

### [Read the full article: https://www.pythonmorsels.com/slicing/](https://www.pythonmorsels.com/slicing/)