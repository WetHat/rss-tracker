---
role: rssitem
aliases: []
id: https://www.pythonmorsels.com/TextIOWrapper/
author: unknown
link: https://www.pythonmorsels.com/TextIOWrapper/
published: 2024-02-05T16:00:00.000Z
feed: "[[RSS/Feeds/Python Morsels.md | Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] TextIOWrapper‽ converting files to strings in Python (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100]] Ever encountered an `_io.TextIOWrapper` object when you wished you had a string? That's Python's version of a "text file" object!
> 
> **Table of contents**
> 
> 1. [`TextIOWrapper` objects are files](https://www.pythonmorsels.com/TextIOWrapper/#textiowrapper-objects-are-files)
> 2. [`_io.TextIOWrapper` aren't the _only_ "files"](https://www.pythonmorsels.com/TextIOWrapper/#_iotextiowrapper-arent-the-only-files)
> 3. [Don't try to pass a file to `str`](https://www.pythonmorsels.com/TextIOWrapper/#dont-try-to-pass-a-file-to-str)
> 4. [You can also read line-by-line](https://www.pythonmorsels.com/TextIOWrapper/#you-can-also-read-line-by-line)
> 5. [Use `read` to convert `_io.TextIOWrapper` objects to strings](https://www.pythonmorsels.com/TextIOWrapper/#use-read-to-convert-_iotextiowrapper-objects-to-string⋯

🌐 Read article [online](https://www.pythonmorsels.com/TextIOWrapper/). ⤴ For other items in this feed see [[RSS/Feeds/Python Morsels.md | Python Morsels]].

- [ ] [[RSS/Feeds/Python Morsels/TextIOWrapper‽ converting files to strings in Python|TextIOWrapper‽ converting files to strings in Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

Ever encountered an `_io.TextIOWrapper` object when you wished you had a string? That's Python's version of a "text file" object!

**Table of contents**

1. [`TextIOWrapper` objects are files](https://www.pythonmorsels.com/TextIOWrapper/#textiowrapper-objects-are-files)
2. [`_io.TextIOWrapper` aren't the _only_ "files"](https://www.pythonmorsels.com/TextIOWrapper/#_iotextiowrapper-arent-the-only-files)
3. [Don't try to pass a file to `str`](https://www.pythonmorsels.com/TextIOWrapper/#dont-try-to-pass-a-file-to-str)
4. [You can also read line-by-line](https://www.pythonmorsels.com/TextIOWrapper/#you-can-also-read-line-by-line)
5. [Use `read` to convert `_io.TextIOWrapper` objects to strings](https://www.pythonmorsels.com/TextIOWrapper/#use-read-to-convert-_iotextiowrapper-objects-to-strings)

## `TextIOWrapper` objects are files

If you use Python's built-in `open` function to read from a file, you'll end up with a `_io.TextIOWrapper` object. You can think of this as **a file object**.

```
>>> file =
                                open("example.txt", mode="rt")
                                >>>
                                type(file)
                                <class
                                '_io.TextIOWrapper'>
```

If you open a file in **read mode** (the default mode), you should be able to call the `read` method on your file object to read your file into a string:

```
>>> contents = file.read()
                                >>>
                                contents
                                'This is an example text-based file.\nIt
                                existed before we read it.\n'
```

More on reading text files in [reading files in Python](https://www.pythonmorsels.com/how-read-text-file/).

## `_io.TextIOWrapper` aren't the _only_ "files"

Due to [duck typing](https://www.pythonmorsels.com/duck-typing/), …

### [Read the full article: https://www.pythonmorsels.com/TextIOWrapper/](https://www.pythonmorsels.com/TextIOWrapper/)
