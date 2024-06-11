---
author: "Blogs on Lisp journey"
published: 2023-10-13T14:51:07.000Z
link: /blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/
id: /blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/
feed: "Blogs on Lisp journey"
tags: []
---
> [!abstract] Common Lisp on the web: enrich your stacktrace with request and session data - 2023-10-13T14:51:07.000Z

🔗Read article [online](/blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Common Lisp on the web꞉ enrich your stacktrace with request and session data]] - 2023-10-13T14:51:07.000Z
- - -
A short post to show the usefulness of Hunchentoot-errors and to thank Mariano again. This library adds the current request and session data to your stacktrace, either in the REPL (base case) or in the browser. TLDR; Use it like this: ;; (ql:quickload "hunchentoot-errors) ;; ;; We also use easy-routes: (ql:quickload "easy-routes") (defclass acceptor (easy-routes:easy-routes-acceptor hunchentoot-errors:errors-acceptor) () (:documentation "Our Hunchentoot acceptor that uses easy-routes and hunchentoot-errors, for easier route definition and enhanced stacktraces with request and session data.
