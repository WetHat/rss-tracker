---
role: rssitem
author: Unknown
published: 2023-10-13T14:51:07.000Z
link: https://localhost/blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/
id: /blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/
feed: "[[Blogs on Lisp journey]]"
tags: []
pinned: false
---

> [!abstract] Common Lisp on the web: enrich your stacktrace with request and session data - 2023-10-13T14:51:07.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> A short post to show the usefulness of Hunchentoot-errors and to thank Mariano again.
> This library adds the current request and session data to your stacktrace, either in the REPL (base case) or in the browser.
> TLDR;
> Use it like this:
> ;; (ql:quickload &quot;hunchentoot-errors) ;; ;; We also use easy-routes: (ql:quickload &quot;easy-routes&quot;) (defclass acceptor (easy-routes:easy-routes-acceptor hunchentoot-errors:errors-acceptor) () (:documentation &quot;Our Hunchentoot acceptor that uses eas⋯

🔗Read article [online](https://localhost/blog/common-lisp-on-the-web-enrich-your-stacktrace-with-request-and-session-data/). For other items in this feed see [[Blogs on Lisp journey]].

- [ ] [[Common Lisp on the web꞉ enrich your stacktrace with request and session data]]

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
A short post to show the usefulness of Hunchentoot-errors and to thank Mariano again.
This library adds the current request and session data to your stacktrace, either in the REPL (base case) or in the browser.
TLDR;
Use it like this:
;; (ql:quickload &quot;hunchentoot-errors) ;; ;; We also use easy-routes: (ql:quickload &quot;easy-routes&quot;) (defclass acceptor (easy-routes:easy-routes-acceptor hunchentoot-errors:errors-acceptor) () (:documentation &quot;Our Hunchentoot acceptor that uses easy-routes and hunchentoot-errors, for easier route definition and enhanced stacktraces with request and session data.