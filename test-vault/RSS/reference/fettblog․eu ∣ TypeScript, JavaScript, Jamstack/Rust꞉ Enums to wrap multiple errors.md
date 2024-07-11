---
author: "fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
published: 2021-09-09T00:00:00.000Z
link: https://fettblog.eu/rust-enums-wrapping-errors/
id: https://fettblog.eu/rust-enums-wrapping-errors/
feed: "fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
tags: []
pinned: false
---
> [!abstract] Rust: Enums to wrap multiple errors - 2021-09-09T00:00:00.000Z
> This is a follow-up to Error handling in Rust from a couple of days ago. The moment we want to use error propagation for different error types, we have to rely on trait objects with Box, which means we defer a lot of information from compile-time to runtime, for the sake of convenient error handling.

🔗Read article [online](https://fettblog.eu/rust-enums-wrapping-errors/). For other items in this feed see [[../fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[Rust꞉ Enums to wrap multiple errors]]
- - -
This is a follow-up to [Error handling in Rust](/rust-error-handling/) from a couple of days ago. The moment we want to use error propagation for different error types, we have to rely on trait objects with `Box<dyn Error>`, which means we defer a lot of information from compile-time to runtime, for the sake of convenient error handling.
