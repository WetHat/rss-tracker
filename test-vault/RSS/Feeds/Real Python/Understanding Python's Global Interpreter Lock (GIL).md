---
role: rssitem
author: Unknown
published: 2024-10-22T14:00:00.000Z
link: https://realpython.com/courses/understanding-global-interpreter-lock-gil/
id: https://realpython.com/courses/understanding-global-interpreter-lock-gil/
feed: "[[Real Python]]"
tags: []
pinned: false
---

> [!abstract] Understanding Python's Global Interpreter Lock (GIL) - 2024-10-22T14:00:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Python's Global Interpreter Lock or GIL, in simple words, is a mutex (or a lock) that allows only one thread to hold the control of the Python interpreter at any one time. In this video course you'll learn how the GIL affects the performance of your Python programs.

🌐 Read article [online](https://realpython.com/courses/understanding-global-interpreter-lock-gil/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[Understanding Python's Global Interpreter Lock (GIL)]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
The Python Global Interpreter Lock or [GIL](https://wiki.python.org/moin/GlobalInterpreterLock), in simple words, is a mutex (or a lock) that allows only one [thread](https://realpython.com/intro-to-python-threading/) to hold the control of the Python interpreter.

This means that only one thread can be in a state of execution at any point in time. The impact of the GIL isn’t visible to developers who execute single-threaded programs, but it can be a performance bottleneck in CPU-bound and multi-threaded code.

Since the GIL allows only one thread to execute at a time even in a multi-threaded architecture with more than one CPU core, the GIL has gained a reputation as an “infamous” feature of Python.

**In this video course you’ll learn** how the GIL affects the performance of your Python programs, and how you can mitigate the impact it might have on your code.

---

_［ Improve Your Python With 🐍 Python Tricks 💌 – Get a short & sweet Python Trick delivered to your inbox every couple of days. [＞＞ Click here to learn more and see examples](https://realpython.com/python-tricks/?utm_source=realpython&utm_medium=rss&utm_campaign=footer) ］_