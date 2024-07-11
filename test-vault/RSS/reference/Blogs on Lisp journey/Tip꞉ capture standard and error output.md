---
author: "Blogs on Lisp journey"
published: 2018-03-06T06:51:49.000Z
link: https://localhost/blog/tip-capture-all-standard-output/
id: /blog/tip-capture-all-standard-output/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] Tip: capture standard and error output - 2018-03-06T06:51:49.000Z
> What if we want to capture standard (and/or error) output in order to ignore it or post-process it ? It’s very simple, a little search and we’re good: (let ((*standard-output* (make-string-output-stream)) (*error-output* (make-string-output-stream))) (apply function args) ;; anything (setf standard-output (get-output-stream-string *standard-output*))) (print-results standard-output)) and now in print-results we can print to standard output without being intercepted (and in our case, we’ll highli⋯

🔗Read article [online](https://localhost/blog/tip-capture-all-standard-output/). For other items in this feed see [[../Blogs on Lisp journey]].

- [ ] [[Tip꞉ capture standard and error output]]
- - -
What if we want to capture standard (and/or error) output in order to ignore it or post-process it ? It’s very simple, a little search and we’re good: (let ((*standard-output* (make-string-output-stream)) (*error-output* (make-string-output-stream))) (apply function args) ;; anything (setf standard-output (get-output-stream-string *standard-output*))) (print-results standard-output)) and now in print-results we can print to standard output without being intercepted (and in our case, we’ll highlight some user-defined keywords). Above, just don’t forget to get the output content with (get-output-stream-string *standard-output*).
