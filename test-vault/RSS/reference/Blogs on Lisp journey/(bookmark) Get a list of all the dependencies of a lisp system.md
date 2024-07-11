---
author: "Blogs on Lisp journey"
published: 2018-01-23T06:51:49.000Z
link: https://localhost/blog/bookmark-get-a-list-of-dependencies-of-a-lisp-system/
id: /blog/bookmark-get-a-list-of-dependencies-of-a-lisp-system/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] (bookmark) Get a list of all the dependencies of a lisp system - 2018-01-23T06:51:49.000Z
> I’ll save here a reddit discussion, which I find interesting but that will be burried quickly down reddit’s history. The goal is to get all the dependencies of a system. You’d better read the OP’s question and the discussion (where the OP is the experimented svetlyak40wt/40ants, at the moment doing a god’s work on Weblocks). His solution is https://gist.github.com/svetlyak40wt/03bc68c820bb3e45bc7871870379c42e (ql:quickload :fset) (defun get-dependencies (system) "Returns a set with all dependenc⋯

🔗Read article [online](https://localhost/blog/bookmark-get-a-list-of-dependencies-of-a-lisp-system/). For other items in this feed see [[../Blogs on Lisp journey]].

- [ ] [[(bookmark) Get a list of all the dependencies of a lisp system]]
- - -
I’ll save here a reddit discussion, which I find interesting but that will be burried quickly down reddit’s history. The goal is to get all the dependencies of a system. You’d better read the OP’s question and the discussion (where the OP is the experimented svetlyak40wt/40ants, at the moment doing a god’s work on Weblocks). His solution is https://gist.github.com/svetlyak40wt/03bc68c820bb3e45bc7871870379c42e (ql:quickload :fset) (defun get-dependencies (system) "Returns a set with all dependencies of a given system.
