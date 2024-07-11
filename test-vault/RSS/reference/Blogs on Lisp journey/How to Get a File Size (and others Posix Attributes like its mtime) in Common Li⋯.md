---
author: "Blogs on Lisp journey"
published: 2017-06-16T14:26:00.000Z
link: https://localhost/blog/how-to-get-a-file-size-and-posix-file-attributes/
id: /blog/how-to-get-a-file-size-and-posix-file-attributes/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] How to Get a File Size (and others Posix Attributes like its mtime) in Common Lisp - 2017-06-16T14:26:00.000Z
> There is nothing built-in since CL predates the posix standard. After a look at Awesome CL, the Osicat library was my go-to package to look for such functionnality. There is its osicat-posix package indeed, even though it is undocumented (issue)… Now a look at the Cookbook is ok. osicat, osicat-posix osicat-posix is included in osicat. (ql:quickload :osicat) (describe (osicat-posix:stat #rss/P"/tmp/file")) #<OSICAT-POSIX:STAT {1004F20C93}> [standard-object] Slots with :INSTANCE allocation: DEV =⋯

🔗Read article [online](https://localhost/blog/how-to-get-a-file-size-and-posix-file-attributes/). For other items in this feed see [[../Blogs on Lisp journey]].

- [ ] [[How to Get a File Size (and others Posix Attributes like its mtime) in Common Li⋯]]
- - -
There is nothing built-in since CL predates the posix standard. After a look at Awesome CL, the Osicat library was my go-to package to look for such functionnality. There is its osicat-posix package indeed, even though it is undocumented (issue)… Now a look at the Cookbook is ok. osicat, osicat-posix osicat-posix is included in osicat. (ql:quickload :osicat) (describe (osicat-posix:stat #rss/P"/tmp/file")) #<OSICAT-POSIX:STAT {1004F20C93}> [standard-object] Slots with :INSTANCE allocation: DEV = 2065 INO = 7349974 MODE = 33204 NLINK = 1 UID = 1000 GID = 1000 RDEV = 0 SIZE = 4304 BLKSIZE = 4096 BLOCKS = 16 ATIME = 1497626097 MTIME = 1497347216 CTIME = 1497347216 ; No value and so we can access the slots with their related functions:
