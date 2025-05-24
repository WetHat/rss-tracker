---
role: rssitem
aliases: []
id: https://www.pythonmorsels.com/multiline-comments/
author: unknown
link: https://www.pythonmorsels.com/multiline-comments/
published: 2024-04-19T23:00:00.000Z
feed: "[[RSS/Feeds/Python Morsels.md | Python Morsels]]"
tags: []
pinned: false
---

> [!abstract] Multiline comments in Python (by unknown)
> ![image|float:right|400](https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F1841759670-0b28dacb1984f308cc6f5f4b2e1ab6c842bffdd8cce9a544b0097584850ccc6a-d_1920x1080&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png) Python does not have multiline comments. But you can use alternatives like docstrings, editor shortcuts, and conventional commenting methods, depending on your requirements.
> 
> **Table of contents**
> 
> 1. [Does Python have multi-line comments?](https://www.pythonmorsels.com/multiline-comments/#does-python-have-multi-line-comments)
> 2. [What about triple quotes?](https://www.pythonmorsels.com/multiline-comments/#what-about-triple-quotes)
> 3. [Docstrings versus comments](https://www.pythonmorsels.com/multiline-comments/#docstrings-versus-comments)
> 4. [What if I want to comment-out a whole block of code?](https://www.pythonmorsels.com/multiline-comments/#what-if-i-want-to-comment-out-a-whole-block-of-code)
> 5. [How to comment multiple lines](https://www.pythonmorsels.com/multiline-comments/#how-to-c⋯

🌐 Read article [online](https://www.pythonmorsels.com/multiline-comments/). ⤴ For other items in this feed see [[RSS/Feeds/Python Morsels.md | Python Morsels]].

- [ ] [[RSS/Feeds/Python Morsels/Multiline comments in Python|Multiline comments in Python]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

Python does not have multiline comments. But you can use alternatives like docstrings, editor shortcuts, and conventional commenting methods, depending on your requirements.

**Table of contents**

1. [Does Python have multi-line comments?](https://www.pythonmorsels.com/multiline-comments/#does-python-have-multi-line-comments)
2. [What about triple quotes?](https://www.pythonmorsels.com/multiline-comments/#what-about-triple-quotes)
3. [Docstrings versus comments](https://www.pythonmorsels.com/multiline-comments/#docstrings-versus-comments)
4. [What if I want to comment-out a whole block of code?](https://www.pythonmorsels.com/multiline-comments/#what-if-i-want-to-comment-out-a-whole-block-of-code)
5. [How to comment multiple lines](https://www.pythonmorsels.com/multiline-comments/#how-to-comment-multiple-lines)
6. [Use docstrings, your code editor, or version control](https://www.pythonmorsels.com/multiline-comments/#use-docstrings-your-code-editor-or-version-control)

## Does Python have multi-line comments?

For single-line comments, Python uses the octothorpe character (`#`), also known as pound, number sign, crunch, and of course, the hashtag character:

```
# This is a comment

                                this = "is not a
                                comment"
```

But what if you want to comment out **a whole block** of code?

Unlike some programming languages, Python does _not_ have multi-line comments.

## What about triple quotes?

You might be thinking, wait, …

### [Read the full article: https://www.pythonmorsels.com/multiline-comments/](https://www.pythonmorsels.com/multiline-comments/)