---
role: rssitem
aliases: []
id: https://effectivetypescript.com/2024/02/27/type-guards/
author: unknown
link: https://effectivetypescript.com/2024/02/27/type-guards/
published: 2024-02-27T15:45:00.000Z
feed: "[[Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] The Hidden Side of Type Predicates (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] Type guards are a powerful tool for improving TypeScript's built-in control flow analysis. This post looks at when it's appropriate to use a type predicate, and in particular what it means when a type predicate returns false.

🌐 Read article [online](https://effectivetypescript.com/2024/02/27/type-guards/). ⤴ For other items in this feed see [[Effective TypeScript]].

- [ ] [[RSS/Feeds/Effective TypeScript/The Hidden Side of Type Predicates|The Hidden Side of Type Predicates]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

For the past two months I've been participating in a batch at the [Recurse Center](https://www.recurse.com/) in Brooklyn, a "writer's retreat for programmers." I've been having lots of fun learning about [Interpreters](https://github.com/danvk/gravlax), [Programming Languages](https://github.com/danvk/Stanford-CS-242-Programming-Languages) and [Neural Nets](https://github.com/karpathy/nn-zero-to-hero), but you apply to RC with a _project_ in mind, and mine was to contribute to the TypeScript open source project. I've used TypeScript and written about it for years, but I've never contributed code to it. Time to change that!

The result is [PR #57465](https://github.com/microsoft/TypeScript/pull/57465), which adds a feature I've always wanted in TypeScript: inference of [type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates). I'll have more to say about that PR in a future post. But for now I'd like to share some of what I've learned about type predicates while implementing it.

## [](#What-are-type-predicates "What are type predicates?")What are type predicates?

What is a type predicate? Whenever a function in TypeScript returns a `boolean`, you can change it to return a "type predicate" instead:

```
function isNumber(x: unknown): x is number {
  return typeof x === 'number';
}
```

Here `x is number` is the type predicate. Any function that returns a type predicate is a "user-defined type guard."

Here's how you use a type guard:

```
let strOrNum = Math.random() < 0.5 ? 123 : 'abc';
//  ^? let strOrNum: number | string
if (isNumber(strOrNum)) {
  strOrNum;
  // ^? let strOrNum: number
}
```

In this case there's little advantage over doing the `typeof` check directly in the `if` statement. But type guards really shine in two specific circumstances:

1. When TypeScript can't infer the type you want on its own.
2. When you pass the type guard as a callback.

The former often comes up with input validation:

```
function isProductReview(input: unknown): input is ProductReview {
  // ... validate input using JSONSchema, etc.
}
```

But in this post we're more interested in the latter. Here's the motivating scenario:

```
const strsAndNums = [123, 'abc', 456, 'def'];
//    ^? const strsAndNums: (number | string)[]
const nums = strsAndNums.filter(x => typeof x === 'number');
//    ^? const nums: (number | string)[]
for (const num of nums) {
  console.log(num.toFixed());
  //              ~~~~~~~
  //    Property 'toFixed' does not exist on type 'string | number'.
}
```

We've filtered the array of strings and numbers down to just the numbers, but TypeScript hasn't been able to follow along. The result is a spurious type error.

Changing from an arrow function to the type guard fixes the problem:

```
const strsAndNums = [123, 'abc', 456, 'def'];
//    ^? const strsAndNums: (number | string)[]
const nums = strsAndNums.filter(isNumber);
//    ^? const nums: number[]
for (const num of nums) {
  console.log(num.toFixed());  // ok
}
```

This works because the declaration of `Array.prototype.filter` [has been overloaded](https://github.com/microsoft/TypeScript/blob/8f531ff3ba221344a93a63312326f9decfdcf458/src/lib/es5.d.ts#L1255-L1260) to work with type predicates. Several built-in `Array` methods work this way, including `find` and `every`:

```
const num = strsAndNums.find(isNumber);
//    ^? const num: number | undefined
if (strsAndNums.every(isNumber)) {
  strsAndNums
  // ^? const strsAndNums: number[]
}
```

## [](#What-if-you-return-false "What if you return false?")What if you return false?

If a function returns `x is T`, then it's clear what it means when it returns `true`: `x` is a `T`! But what does it mean if it returns `false`?

TypeScript's expectation is that type guards return `true` _if and only if_ the predicate is true. To spell it out:

- If the type guard returns `true` then `x` is `T`.
- If the type guard returns `false` then `x` is not `T`.

This often works so intuitively that you don't even think about it. Using our `isNumber` type guard, for example:

```
let strOrNum = Math.random() < 0.5 ? 123 : 'abc';
//  ^? let strOrNum: number | string
if (isNumber(strOrNum)) {
  strOrNum;
  // ^? let strOrNum: number
} else {
  strOrNum;
  // ^? let strOrNum: string
}
```

But it can definitely go wrong! What about this type guard?

```
function isSmallNumber(x: string | number): x is number {
  return typeof x === 'number' && Math.abs(x) < 10;
}
```

If this returns `true` then `x` is definitely a `number`. But if it returns `false`, then `x` could be either a `string` or a large `number`. This is not an "if and only if" relationship. This sort of incorrect type predicate can lead to [unsoundness](https://effectivetypescript.com/2021/05/06/unsoundness/):

```
if (isSmallNumber(strOrNum)) {
  console.log(strOrNum.toFixed());
  //          ^? let strOrNum: number
} else {
  console.log(strOrNum.toUpperCase());
  //          ^? let strOrNum: string
}
```

This passes the type checker but blows up at runtime:

```
console.log(strOrNum.toUpperCase());
                       ^
Cannot read property toUpperCase of 123.
```

This highlights two important facts about type guards:

1. TypeScript does very little to check that they're valid.
2. There are expectations around the `false` case, and getting it right matters!

Generally functions that combine checks with `&&` should not be type guards because the type will come out incorrectly for the `false` case.

Many functions only care about the `true` case. If you're just passing your type guard to `filter` or `find`, then you won't get into trouble. But if you pass it to a function like lodash's [`_.partition`](https://lodash.com/docs/4.17.15#partition) then you will:

```
import _ from 'lodash';
const [smallNums, others] = _.partition(strsOrNums, isSmallNumber);
//                ^? const others: string[]
```

This is an unsound type and it will lead to trouble. It's interesting to compare this with inlining the check into an `if` statement:

```
if (typeof strOrNum === 'number' && Math.abs(strOrNum) < 10) {
  strOrNum
  // ^? let strOrNum: number
} else {
  strOrNum
  // ^? let strOrNum: number | string
}
```

Left to its own devices, TypeScript gets this right. The only reason it went wrong before was because we fed it bad information: `isSmallNumber` should not have been a type predicate!

Because of the strict rules around what `false` means, a type guard cannot, in general, replace an `if` statement. There's a [proposal](https://github.com/microsoft/TypeScript/issues/15048) to fix this by adding "one-sided" or "fine-grained" type guards. If it were adopted, you'd be able to declare something like this:

```
function isSmallNumber(x: string | number): x is number else (string|number);
```

## [](#A-test-for-valid-type-predicates "A test for valid type predicates")A test for valid type predicates

In the last example, we could tell that the type predicate was invalid because inlining it into an `if` statement produced different types in the `else` block than calling the type guard did.

This feels like a good test for type guards! Does it work?

As it turns out, no! There's a subtlety around subtyping that hadn't occurred to me until the [tests failed](https://github.com/microsoft/TypeScript/pull/57465/commits/e2684f128975dac725f4af4f9e6f03d4e765cfbe) on my PR branch. The details and solution are a little too in the weeds for this post. But when I write a post about the making of this PR, we'll cover it in depth. There _is_ a test. Check out the PR if you're curious.

In the meantime, though, we can talk about a few heuristics. If a condition fails the "inlining" test, then it's definitely not a valid type predicate.

## [](#Non-Nullishness-not-Truthiness "Non-Nullishness, not Truthiness")Non-Nullishness, not Truthiness

JavaScript and TypeScript make a distinction between "truthiness" and "non-nullishness":

```
const isTruthy<T>(x: T) => !!x;
const isNonNullish<T>(x: T) => x !== null && x !== undefined;
```

This is important for types like `number` and `string`. Here's why:

```
declare let numOrNull: number | null;
if (numOrNull) {
  numOrNull;
  // ^? const numOrNull: number
} else {
  numOrNull;
  // ^? const numOrNull: number | null
}
```

The interesting part is the `number` in the `else` block. The number `0` is falsy, so `numOrNull` can be a `number` in the false case. (In theory TypeScript could narrow it to `0 | null`, but the TS team has decided this is [not worth it](https://github.com/microsoft/TypeScript/issues/45329).)

This means that if you make `isTruthy` return a type predicate, functions like `partition` will produce unsound types:

```
const numsAndNulls = [1, 2, null, 4, null, 5];
//    ^? const numsAndNulls: (number | null)[]
const isTruthy = (x: number | null): x is number => !!x;  // don't do this!
const [nums, nulls] = _.partition(numsAndNulls, isTruthy);
//           ^? const nulls: null[]
```

TypeScript thinks that `nulls` is an array of `null` values, but it could actually contain numbers (specifically zeroes). This is an [unsound type](https://effectivetypescript.com/2021/05/06/unsoundness/). It's also likely to be a logic error: do you really mean to filter out the zeroes? If you're calculating an average, this will give you an incorrect result.

Better to use `isNonNullish` or the equivalent. This is safe:

```
const [nums, nulls] = _.partition(numsAndNulls, (x): x is number => x !== null);
//           ^? const nulls: null[]
```

You can make the generic `isNonNullish` into a type predicate, too:

```
function isNonNullish<T>(x: T): x is T & {} {
  return x !== null && x !== undefined;
}
```

This relies on the `{}` type, which is TypeScript for "all values except `null` and `undefined`." This is one of the few good uses of this very broad type!

## [](#Composing-predicates "Composing predicates")Composing predicates

In general you can compose type predicates with "or":

```
function isFooOrBar(x: unknown): x is Foo | Bar {
  return isFoo(x) || isBar(x);
}
```

Similarly, you can compose predicates with "and" if their types intersect:

```
function isFooAndBar(x: unknown): x is Foo & Bar {
  return isFoo(x) && isBar(x);
}
```

This could happen if you have a big discriminated union and you have helpers that match different subsets of it.

Be careful about composing conditions that can't be fully represented in the type system, however. You can't define a TypeScript type for "numbers less than 10" or "strings less than ten characters long" or "numbers other than zero." So conditions like these generally don't belong in a type guard:

```
// This should not return a type predicate!
function isShortString(x: unknown) {
  return typeof x === 'string' && x.length < 10;
}
```

## [](#Conclusions "Conclusions")Conclusions

When you write a user-defined type guard, it's easy to only think about the `true` case: if you write `x is string` and you know that `x` must be a `string` when the function returns `true`, then surely you're good to go, right?

As this post has explained, that's only half the battle. In order for a type guard to be completely safe, it's also important to know what the type of the parameter is when it returns `false`. This is the hidden side of type predicates. It's easy to get wrong, and this can lead to unsound types.

Because it might be used in an `if` / `else` statement or with functions like `_.partition`, you want your type guard to be bulletproof! Make sure you provide the "if and only if" semantics that TypeScript expects.