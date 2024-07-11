---
author: "fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
published: 2020-07-17T00:00:00.000Z
link: https://fettblog.eu/typescript-augmenting-global-lib-dom/
id: https://fettblog.eu/typescript-augmenting-global-lib-dom/
feed: "fettblog․eu ∣ TypeScript, JavaScript, Jamstack"
tags: []
pinned: false
---
> [!abstract] TypeScript: Augmenting global and lib.dom.d.ts - 2020-07-17T00:00:00.000Z
> Recently I wanted to use a ResizeObserver in my application. ResizeObserver recently landed in all major browsers, but when you use it in TypeScript — at the time of this writing — ResizeObserver won’t be recognized as a valid object (or constructor). So why is that?

🔗Read article [online](https://fettblog.eu/typescript-augmenting-global-lib-dom/). For other items in this feed see [[../fettblog․eu ∣ TypeScript, JavaScript, Jamstack]].

- [ ] [[TypeScript꞉ Augmenting global and lib․dom․d․ts]]
- - -
Recently I wanted to use a [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) in my application. `ResizeObserver` recently landed in all [major browsers](https://caniuse.com/#search=ResizeObserver), but when you use it in TypeScript — at the time of this writing — `ResizeObserver` won’t be recognized as a valid object (or constructor). So why is that?
