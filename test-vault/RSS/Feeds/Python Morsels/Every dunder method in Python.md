---
role: rssitem
author: Unknown
published: 2024-03-19T21:30:00.000Z
link: https://www.pythonmorsels.com/every-dunder-method/
id: https://www.pythonmorsels.com/every-dunder-method/
feed: "[[Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Every dunder method in Python - 2024-03-19T21:30:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> An explanation of all of Python's 100+ dunder methods and 50+ dunder attributes, including a summary of each one.
> 
> **Table of contents**
> 
> 1. [The 3 essential dunder methods 🔑](https://www.pythonmorsels.com/every-dunder-method/#the-3-essential-dunder-methods)
> 2. [Equality and hashability 🟰](https://www.pythonmorsels.com/every-dunder-method/#equality-and-hashability)
> 3. [Orderability ⚖️](https://www.pythonmorsels.com/every-dunder-method/#orderability)
> 4. [Type conversions and string formatting ⚗⋯

🔗Read article [online](https://www.pythonmorsels.com/every-dunder-method/). For other items in this feed see [[Python Morsels]].

- [ ] [[Every dunder method in Python]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Other RSS items are referring to the same article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
An explanation of all of Python's 100+ dunder methods and 50+ dunder attributes, including a summary of each one.

**Table of contents**

1. [The 3 essential dunder methods 🔑](https://www.pythonmorsels.com/every-dunder-method/#the-3-essential-dunder-methods)
2. [Equality and hashability 🟰](https://www.pythonmorsels.com/every-dunder-method/#equality-and-hashability)
3. [Orderability ⚖️](https://www.pythonmorsels.com/every-dunder-method/#orderability)
4. [Type conversions and string formatting ⚗️](https://www.pythonmorsels.com/every-dunder-method/#type-conversions-and-string-formatting)
5. [Context managers 🚪](https://www.pythonmorsels.com/every-dunder-method/#context-managers)
6. [Containers and collections 🗃️](https://www.pythonmorsels.com/every-dunder-method/#containers-and-collections)
7. [Callability ☎️](https://www.pythonmorsels.com/every-dunder-method/#callability)
8. [Arithmetic operators ➗](https://www.pythonmorsels.com/every-dunder-method/#arithmetic-operators)
9. [In-place arithmetic operations ♻️](https://www.pythonmorsels.com/every-dunder-method/#in-place-arithmetic-operations)
10. [Built-in math functions 🧮](https://www.pythonmorsels.com/every-dunder-method/#built-in-math-functions)
11. [Attribute access 📜](https://www.pythonmorsels.com/every-dunder-method/#attribute-access)
12. [Metaprogramming 🪄](https://www.pythonmorsels.com/every-dunder-method/#metaprogramming)
13. [Descriptors 🏷️](https://www.pythonmorsels.com/every-dunder-method/#descriptors)
14. [Buffers 💾](https://www.pythonmorsels.com/every-dunder-method/#buffers)
15. [Asynchronous operations 🤹](https://www.pythonmorsels.com/every-dunder-method/#asynchronous-operations)
16. [Construction and finalizing 🏭](https://www.pythonmorsels.com/every-dunder-method/#construction-and-finalizing)
17. [Library-specific dunder methods 🧰](https://www.pythonmorsels.com/every-dunder-method/#library-specific-dunder-methods)
18. [Dunder attributes 📇](https://www.pythonmorsels.com/every-dunder-method/#dunder-attributes)
19. [Every dunder method: a cheat sheet ⭐](https://www.pythonmorsels.com/every-dunder-method/#cheat-sheet)

## The 3 essential dunder methods 🔑

There are 3 dunder methods that _most_ classes should have: [`__init__`](https://www.pythonmorsels.com/what-is-init/), [`__repr__`](https://www.pythonmorsels.com/customizing-string-representation-your-objects/), and [`__eq__`](https://www.pythonmorsels.com/overloading-equality-in-python/).

|Operation|Dunder Method Call|Returns|
|---|---|---|
|`T(a, b=3)`|`T.__init__(x, a, b=3)`|`None`|
|`repr(x)`|`x.__repr__()`|`str`|
|`x == y`|`x.__eq__(y)`|Typically `bool`|

The [`__init__`](https://www.pythonmorsels.com/what-is-init/) method is the **initializer** (not to be confused with the [constructor](#construction-and-finalizing)), the [`__repr__`](https://www.pythonmorsels.com/customizing-string-representation-your-objects/) method customizes an object's string representation, and the [`__eq__`](https://www.pythonmorsels.com/overloading-equality-in-python/) method customizes what it means for objects to be _equal_ to one another.

The `__repr__` method is particularly helpful at the [the Python REPL](https://www.pythonmorsels.com/using-the-python-repl/) and when debugging.

## Equality and hashability 🟰

In addition to the `__eq__ …`

### [Read the full article: https://www.pythonmorsels.com/every-dunder-method/](https://www.pythonmorsels.com/every-dunder-method/)