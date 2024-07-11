---
author: "Blogs on Lisp journey"
published: 2017-04-14T14:27:44.000Z
link: https://localhost/blog/why-is-there-no-generic-operators/
id: /blog/why-is-there-no-generic-operators/
feed: "Blogs on Lisp journey"
tags: []
pinned: false
---
> [!abstract] Why is there no generic operators ? - 2017-04-14T14:27:44.000Z
> TLDR; because the object system came afterwards (and it was not the intention to make CL entirely object oriented). As a CL enthousiast coming from Python, I feel the pain not to have generic or polymorphic operators but having to learn about many specialized operators instead. Why is it so and are there solutions ? I asked on SO. In CL, there are many operators to check for equality that depend on the data type: =, string-equal, char=, then equal, eql and whatnot, so on for other data types, an⋯

🔗Read article [online](https://localhost/blog/why-is-there-no-generic-operators/). For other items in this feed see [[../Blogs on Lisp journey]].

- [ ] [[Why is there no generic operators ❓]]
- - -
TLDR; because the object system came afterwards (and it was not the intention to make CL entirely object oriented). As a CL enthousiast coming from Python, I feel the pain not to have generic or polymorphic operators but having to learn about many specialized operators instead. Why is it so and are there solutions ? I asked on SO. In CL, there are many operators to check for equality that depend on the data type: =, string-equal, char=, then equal, eql and whatnot, so on for other data types, and the same for comparison operators.
