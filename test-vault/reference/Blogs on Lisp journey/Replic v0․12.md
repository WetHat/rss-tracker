---
author: "Blogs on Lisp journey"
published: 2019-10-29T17:40:07.000Z
link: https://localhost/blog/replic-v0.12-readline-applications-with-custom-completion/
id: /blog/replic-v0.12-readline-applications-with-custom-completion/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] Replic v0.12 - 2019-10-29T17:40:07.000Z
> We recently pushed our replic library version 0.12, adding a couple of expected features, thanks to the input of our users user: we can TAB-complete sentences (strings inside quotes) we can define a different completion method for each arguments of a command. we added a declarative way to automatically print a function’s result. The default function can be overriden by users (in order too, for example, color output). So we can do something like this: we create a function (that will become a comm⋯

🔗Read article [online](https://localhost/blog/replic-v0.12-readline-applications-with-custom-completion/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Replic v0․12]]
- - -
We recently pushed our replic library version 0.12, adding a couple of expected features, thanks to the input of our users user: we can TAB-complete sentences (strings inside quotes) we can define a different completion method for each arguments of a command. we added a declarative way to automatically print a function’s result. The default function can be overriden by users (in order too, for example, color output). So we can do something like this: we create a function (that will become a command on the readline command line):
