---
author: "fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
published: 2024-03-05T00:00:00.000Z
link: https://fettblog.eu/typescript-never-and-error-handling/
id: https://fettblog.eu/typescript-never-and-error-handling/
feed: "fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
tags: []
---
> [!abstract] The `never` type and error handling in TypeScript - 2024-03-05T00:00:00.000Z
> One thing that I see more often recently is that folks find out about the never type, and start using it more often, especially trying to model error handling. But more often than not, they don’t use it properly or overlook some fundamental...

🔗Read article [online](https://fettblog.eu/typescript-never-and-error-handling/). For other items in this feed see [[fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[The `never` type and error handling in TypeScript]] - 2024-03-05T00:00:00.000Z
- - -
One thing that I see more often recently is that folks find out about the `never` type, and start using it more often, especially trying to model error handling. But more often than not, they don’t use it properly or overlook some fundamental features of `never`. This can lead to faulty code that might act up in production, so I want to clear doubts and misconceptions, and show you what you can really do with `never`.
