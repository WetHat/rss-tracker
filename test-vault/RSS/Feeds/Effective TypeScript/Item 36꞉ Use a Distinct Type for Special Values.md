---
role: rssitem
aliases:
  - "Item 36: Use a Distinct Type for Special Values"
id: https://effectivetypescript.com/2024/06/13/special-values/
author: unknown
link: https://effectivetypescript.com/2024/06/13/special-values/
published: 2024-06-13T17:30:00.000Z
feed: "[[Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] Item 36: Use a Distinct Type for Special Values (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] It's tempting to use "", 0 or -1 as special values: an empty string might represent text that hasn't loaded yet, or -1 could stand in for a missing number. In TypeScript, this is almost always a bad idea. Special values need to be handled specially, and giving them a distinct type, such as null, allows TypeScript to enforce that you do so.

🌐 Read article [online](https://effectivetypescript.com/2024/06/13/special-values/). ⤴ For other items in this feed see [[Effective TypeScript]].

- [ ] [[RSS/Feeds/Effective TypeScript/Item 36꞉ Use a Distinct Type for Special Values|Item 36꞉ Use a Distinct Type for Special Values]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

_This is a sample item from Chapter 4 of the second edition of [Effective TypeScript](https://amzn.to/3UjPrsK), which was [released](https://effectivetypescript.com/2024/05/21/second-edition/) in May of 2024. It discusses a common mistake in TypeScript code: using `""`, `0`, or `-1` to represent special cases like missing data. By modeling these cases with a distinct type, you help TypeScript guide you towards writing more correct code. If you like what you read, consider [buying a copy](https://amzn.to/3UjPrsK) of the book!_

JavaScript's [string `split` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) is a handy way to break a string around a delimiter:

```undefined
> 'abcde'.split('c')[ 'ab', 'de' ]
```

Let's write something like `split`, but for arrays. Here's an attempt:

```
function splitAround<T>(vals: readonly T[], val: T): [T[], T[]] {
  const index = vals.indexOf(val);
  return [vals.slice(0, index), vals.slice(index+1)];
}
```

This works as you'd expect:

```undefined
> splitAround([1, 2, 3, 4, 5], 3)[ [ 1, 2 ], [ 4, 5 ] ]
```

If you try to `splitAround` an element that's not in the list, however, it does something quite unexpected:

```undefined
> splitAround([1, 2, 3, 4, 5], 6)[ [ 1, 2, 3, 4 ], [ 1, 2, 3, 4, 5 ] ]
```

While it's not entirely clear what the function _should_ do in this case, it's definitely not that! How did such simple code result in such strange behavior?

The root issue is that `indexOf` returns `-1` if it can't find the element in the array. This is a special value: it indicates a failure rather than success. But `-1` is just an ordinary `number`. You can pass it to the Array `slice` method and you can do arithmetic on it. When you pass a negative number to `slice`, it interprets it as counting back from the end of the array. And when you add `1` to `-1`, you get `0`. So this evaluates as:

```
[vals.slice(0, -1), vals.slice(0)]
```

The first `slice` returns all but the last element of the array, and the second `slice` returns a complete copy of the array.

This behavior is a bug. Moreover, it's unfortunate that TypeScript wasn't able to help us find this problem. The root issue was that `indexOf` returned `-1` when it couldn't find the element, rather than, say `null`. Why is that?

Without hopping in a time machine and visiting the Netscape offices in 1995, it's hard to know the answer for sure. But we can speculate! JavaScript was heavily influenced by Java, and [its `indexOf` has this same behavior](https://docs.oracle.com/javase/8/docs/api/java/lang/String.html#indexOf-int-). In Java (and C), a function can't return a primitive _or_ null. Only objects (or pointers) are nullable. So this behavior may derive from a technical limitation in Java that JavaScript does not share.

In JavaScript (and TypeScript), there's no problem having a function return a `number` or `null`. So we can wrap `indexOf`:

```
function safeIndexOf<T>(vals: readonly T[], val: T): number | null {
  const index = vals.indexOf(val);
  return index === -1 ? null : index;
}
```

If we plug that into our original definition of `splitAround`, we immediately get two type errors:

```
function splitAround<T>(vals: readonly T[], val: T): [T[], T[]] {
  const index = safeIndexOf(vals, val);
  return [vals.slice(0, index), vals.slice(index+1)];
  //                    ~~~~~              ~~~~~ 'index' is possibly 'null'
}
```

This is exactly what we want! There are always two cases to consider with `indexOf`. With the built-in version, TypeScript can't distinguish them, but with the wrapped version, it can. And it sees here that we've only considered the case where the array contained the value.

The solution is to handle the other case explicitly:

```
function splitAround<T>(vals: readonly T[], val: T): [T[], T[]] {
  const index = safeIndexOf(vals, val);
  if (index === null) {
    return [[...vals], []];
  }
  return [vals.slice(0, index), vals.slice(index+1)];  // ok
}
```

Whether this is the right behavior is debatable, but at least TypeScript has forced us to have that debate!

The root problem with the first implementation was that `indexOf` had two distinct cases, but the return value in the special case (`-1`) had the same type as the return value in the regular case (`number`). This meant that from TypeScript's perspective there was just a single case, and it wasn't able to detect that we didn't check for `-1`.

This situation comes up frequently when you're designing types. Perhaps you have a type for describing merchandise:

```
interface Product {
  title: string;
  priceDollars: number;
}
```

Then you realize that some products have an unknown price. Making this field optional or changing it to `number|null` might require a migration and lots of code changes, so instead you introduce a special value:

```
interface Product {
  title: string;
  /** Price of the product in dollars, or -1 if price is unknown */
  priceDollars: number;
}
```

You ship it to production. A week later your boss is irate and wants to know why you've been crediting money to customer cards. Your team works to roll back the change and you're tasked with writing the postmortem. In retrospect, it would have been much easier to deal with those type errors!

Choosing in-domain special values like `-1`, `0`, or `""` is similar in spirit to turning off `strictNullChecks`. When `strictNullChecks` is off, you can assign `null` or `undefined` to any type:

```
// @strictNullChecks: false
const truck: Product = {
  title: 'Tesla Cybertruck',
  priceDollars: null,  // ok
};
```

This lets a huge class of bugs slip through the type checker because TypeScript doesn't distinguish between `number` and `number|null`. `null` is a valid value in all types. When you enable `strictNullChecks`, TypeScript _does_ distinguish between these types and it's able to detect a whole host of new problems. When you choose an in-domain special value like `-1`, you're effectively carving out a non-strict niche in your types. Expedient, yes, but ultimately not the best choice.

`null` and `undefined` may not always be the right way to represent special cases since their exact meaning may be context dependent. If you're modeling the state of a network request, for example, it would be a bad idea to use `null` to mean an error state and `undefined` to mean a pending state. Better to use a tagged union to represent these special states more explicitly.

### [](#Things-to-Remember "Things to Remember")Things to Remember

- Avoid special values that are assignable to regular values in a type. They will reduce TypeScript's ability to find bugs in your code.
- Prefer `null` or `undefined` as a special value instead of `0`, `-1`, or `""`.
- Consider using a tagged union rather than `null` or `undefined` if the meaning of those values isn't clear.