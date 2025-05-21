---
role: rssitem
aliases:
  - "Common Lisp on the web: enrich your stacktrace with request and session data"
id: /blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/
author: unknown
link: https://localhost/blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/
published: 2023-10-13T14:51:07.000Z
feed: "[[Blogs on Lisp journey]]"
pinned: false
tags: []
---

> [!abstract] Common Lisp on the web: enrich your stacktrace with request and session data (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] A short post to show the usefulness of Hunchentoot-errors and to thank Mariano again. This library adds the current request and session data to your stacktrace, either in the REPL (base case) or in the browser. TLDR; Use it like this: ;; (ql:quickload "hunchentoot-errors) ;; ;; We also use easy-routes: (ql:quickload "easy-routes") (defclass acceptor (easy-routes:easy-routes-acceptor hunchentoot-errors:errors-acceptor) () (:documentation "Our Hunchentoot acceptor that uses easy-routes and hunchentoot-errors, for easier route definition and enhanced stacktraces with request and session data.

🌐 Read article [online](https://localhost/blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[RSS/Feeds/Blogs on Lisp journey/Common Lisp on the web꞉ enrich your stacktrace with request and session data|Common Lisp on the web꞉ enrich your stacktrace with request and session data]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

