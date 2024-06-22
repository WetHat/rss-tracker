---
author: "Blogs on Lisp journey"
published: 2017-05-02T09:07:01.000Z
link: https://localhost/blog/string-manipulation-was-frustrating/
id: /blog/string-manipulation-was-frustrating/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] String manipulation is frustrating [fixed] - 2017-05-02T09:07:01.000Z
> One of the first things I wanted to do in the REPL was some string manipulation. But it was tedious. To trim whitespace, and I mean all whitespaces, we had to define #\Space #\Newline #\Backspace #\Tab #\Linefeed #\Page #\Return #\Rubout. To concatenate two strings: either giving an unusual 'string argument to concatenate, like this: (concatenate 'string "fo" "o") either we had to use a format construct, which is another source of frustration for (impatient) beginners, and sure isn’t straightfor⋯

🔗Read article [online](https://localhost/blog/string-manipulation-was-frustrating/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[String manipulation is frustrating {fixed}]]
- - -
One of the first things I wanted to do in the REPL was some string manipulation. But it was tedious. To trim whitespace, and I mean all whitespaces, we had to define #\Space #\Newline #\Backspace #\Tab #\Linefeed #\Page #\Return #\Rubout. To concatenate two strings: either giving an unusual 'string argument to concatenate, like this: (concatenate 'string "fo" "o") either we had to use a format construct, which is another source of frustration for (impatient) beginners, and sure isn’t straightforward and self-explanatory.
