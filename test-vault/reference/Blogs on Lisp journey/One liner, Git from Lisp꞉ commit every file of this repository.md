---
author: "Blogs on Lisp journey"
published: 2018-12-04T20:49:06.000Z
link: https://localhost/blog/one-liner-git-commit-files/
id: /blog/one-liner-git-commit-files/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] One liner, Git from Lisp: commit every file of this repository - 2018-12-04T20:49:06.000Z
> Hey, pardon this very short post, it’s just for the pleasure of blogging, and to balance the usual lengthy ones. I wanted to commit, one by one, every file of the current directory (it’s useless, don’t ask). I use legit as the interface to Git, and this one-liner: (dolist (file (uiop:directory-files "./")) (legit:git-add :paths (pathname file)) (legit:git-commit :files (pathname file) :message (format nil "add ~a" (file-namestring file)))) I guessed the :paths and :files arguments with Slime’s c⋯

🔗Read article [online](https://localhost/blog/one-liner-git-commit-files/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[One liner, Git from Lisp꞉ commit every file of this repository]]
- - -
Hey, pardon this very short post, it’s just for the pleasure of blogging, and to balance the usual lengthy ones. I wanted to commit, one by one, every file of the current directory (it’s useless, don’t ask). I use legit as the interface to Git, and this one-liner: (dolist (file (uiop:directory-files "./")) (legit:git-add :paths (pathname file)) (legit:git-commit :files (pathname file) :message (format nil "add ~a" (file-namestring file)))) I guessed the :paths and :files arguments with Slime’s command argument list which appears in the modline, I wanted a function to convert a /full/path/file.
