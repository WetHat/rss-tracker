---
role: rssitem
aliases:
  - Notes on TypeScript 5.6
id: https://effectivetypescript.com/2024/09/30/ts-56/
author: unknown
link: https://effectivetypescript.com/2024/09/30/ts-56/
published: 2024-09-30T16:15:00.000Z
feed: "[[RSS/Feeds/Effective TypeScript.md | Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] Notes on TypeScript 5.6 (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] We TypeScript developers are a lucky bunch. While some languages (Python, JavaScript) are released annually, every three years (C++) or even less, we get four new versions of TypeScript every year. TypeScript 5.6 was released on September 9th, 2024. Let's take a look.

🌐 Read article [online](https://effectivetypescript.com/2024/09/30/ts-56/). ⤴ For other items in this feed see [[RSS/Feeds/Effective TypeScript.md | Effective TypeScript]].

- [ ] [[RSS/Feeds/Effective TypeScript/Notes on TypeScript 5․6|Notes on TypeScript 5․6]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

We TypeScript developers are a lucky bunch. While some languages ([Python](https://en.wikipedia.org/wiki/History_of_Python), [JavaScript](https://en.wikipedia.org/wiki/ECMAScript_version_history)) are released annually, every three years ([C++](https://en.wikipedia.org/wiki/C%2B%2B#Standardization)) or even less, we get _four_ new versions of TypeScript every year. TypeScript 5.6 was [released](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/) on September 9th, 2024. Let's take a look.

## [](#New-Features "New Features")New Features

### [](#Disallowed-Nullish-and-Truthy-Checks "Disallowed Nullish and Truthy Checks")Disallowed Nullish and Truthy Checks

TypeScript will now alert you to certain conditionals that are always true or false:

```
const value = {} || 'unreachable';
```

Because `{}` is truthy, the right-hand side of the `||` is dead code. It should either be removed or investigated, since it might indicate a logic error.

If your project is large and has been around for a while, this check is likely to turn up some strange-looking code. For example, I got a "this expression is always truthy" error on code that looked like this:

```
const val = { ...obj, prop: value } || {};
```

What's that `|| {}` doing there? Running [git blame](https://git-scm.com/docs/git-blame) revealed the story. The code originally looked like this:

```
const val = obj || {};
```

Then a subsequent change added `prop: value` to the object and didn't remove the fallback. In this case, it's fine to remove the `|| {}` since using [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) on a `null`/`undefined` value is OK.

This new check is the single best reason to update to TS 5.6. I haven't seen a single false positive, and I've found lots of strange-looking code. This matches the TypeScript team's [findings](https://github.com/microsoft/TypeScript/pull/59217#issuecomment-2222103311).

### [](#Iterator-Helper-Methods "Iterator Helper Methods")Iterator Helper Methods

In addition to finding new errors in your code, new TypeScript releases continue the ongoing process of implementing all stage 3 ECMAScript features.

TypeScript 5.6 now supports [Iterator Helper methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator#iterator_helpers) like `map` and `take`. If you've ever used Python's [`itertools` package](https://docs.python.org/3/library/itertools.html), this will be familiar. The appeal of iterators is that you can apply a series of operations to an array, for example, without constructing all the intermediate arrays. This reduces memory usage and should improve cache efficiency and performance.

Because these are JavaScript runtime methods, you'll need to use a runtime that supports them. At the moment that's Node.js 22 (which should enter long-term support in October) and around [67% of browsers](https://caniuse.com/mdn-javascript_builtins_iterator_take). Unless you can guarantee support in your environment, you may want to wait on these for a bit.

### [](#Strict-Builtin-Iterator-Checks-and-strictBuiltinIteratorReturn "Strict Builtin Iterator Checks (and --strictBuiltinIteratorReturn)")Strict Builtin Iterator Checks (and --strictBuiltinIteratorReturn)

TypeScript's `any` type is dangerous: not only does it disable type checking, it can also silently spread through your program. [Chapter 5](https://effectivetypescript.com/#Chapter-5-Unsoundness-and-the-any-Type) of [_Effective TypeScript_](https://amzn.to/3UjPrsK) is all about taming the `any` type.

Perhaps the scariest source of `any` types is type declaration files (`.d.ts`). If you call a function and it's declared to return `any`, then `any` is what you get, even if the word "any" never appears in your source code. `JSON.parse` is a famous example of this:

```
const obj = JSON.parse('{"a": 2}');  // whoops, any type!
const b = obj.b;  // no error!
```

(Matt Pocock's [ts-reset](https://github.com/mattpocock/ts-reset) fixes this and a few other well known issues.)

One subtle source of `any` came from direct use of an iterator's `.next()` method:

```
const letters = new Set(['a', 'b', 'c']);
const oneLetter = letters.values().next().value;
//    ^? const oneLetter: any (TS 5.5)
//                        string | undefined (TS 5.6)
```

The type in TS 5.6 makes a lot of sense! If the Set were empty, `oneLetter` would be `undefined`. Otherwise it would be a `string`. (You can also check the `done` property to narrow the type.) While directly working with an iterator is rare (you should typically use `for-of` loops or the new iterator helpers), this is a welcome improvement because it eliminates a surprising source of `any` types.

So the real question is… why was this an `any` type in older versions of TypeScript? To understand why, the TypeScript blog gives [this example](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#strict-builtin-iterator-checks-\(and---strictbuiltiniteratorreturn\)):

```
function* abc123() {
    yield "a";
    yield "b";
    yield "c";
    return 123;
}
const iter = abc123();
iter.next(); // { value: "a", done: false }
iter.next(); // { value: "b", done: false }
iter.next(); // { value: "c", done: false }
iter.next(); // { value: 123, done: true }
```

A generator function (which returns an iterator) can both `yield` and `return` values. When it returns a value, that goes into the `value` property of the iterator's value.

TypeScript models this with two type parameters: `Iterator<T, TReturn>`. Most iterators don't return a special value when they're done, so `TReturn` is typically `void` (the return type of a function without a `return` statement).

When TypeScript [first added support for iterators](https://github.com/microsoft/TypeScript/pull/12346) in 2016, they didn't distinguish `T` and `TReturn`. When they did split these types in 2019, they had to default `TReturn` to `any` to [maintain backwards compatibility](https://github.com/microsoft/TypeScript/pull/30790#:~:text=boolean%2C%20A%20%26%20B%3E%27-,Notes,-For%20these%20definitions). The [kicked the can down the road](https://github.com/microsoft/TypeScript/issues/33353#issuecomment-532574516) for years until this release, when they [added a new flag](https://github.com/microsoft/TypeScript/pull/58243), `strictBuiltinIteratorReturn`, to fix it. This is enabled with `--strict`, so you should get it right away.

A few more quick notes on this:

- The types around iterators, generators and async iterators are all pretty confusing. I hope to write a blog post about them at some point in the future.
- If you don't have `strictNullChecks` enabled, you may see some strange errors around `value` having a type of `string | void`. The fix is to enable `strictNullChecks`!
- This was a surprising source of `any` types that could spread in your code. To limit the damage from these sorts of `any`s, consider using typescript-eslint's [`no-unsafe-assignment`](https://typescript-eslint.io/rules/no-unsafe-assignment/), York Yao's [type-coverage](https://github.com/plantain-00/type-coverage) tool, or my brand-new [Any X-Ray Vision](https://marketplace.visualstudio.com/items?itemName=danvk.any-xray) VS Code extension.

### [](#The-noUncheckedSideEffectImports-Option "The --noUncheckedSideEffectImports Option")The --noUncheckedSideEffectImports Option

I first noticed this issue when I was working on the second edition of [_Effective TypeScript_](https://amzn.to/3UjPrsK). I claimed that this would be an error:

```
import 'non-existent-file.css';
```

… but it wasn't! This is a pretty strange TypeScript behavior. For these "side-effect imports," where you don't import any symbols, TypeScript will try to resolve the path to the module. If it can, it will type check the file that you import. But if it can't, it will just ignore the import entirely.

Now you can change this behavior with `noUncheckedSideEffectImports`. If you use CSS imports, you're likely to get tons of errors when you first enable this, one for every import. The solution that the release notes [suggest](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#the---nouncheckedsideeffectimports-option) is to add this line to a `.d.ts` file:

```
declare module '*.css' {}
```

But this feels a bit too lenient. It will catch a typo if you get the extension wrong (`.cs` instead of `.css`). But it won't check that you're importing a file that exists. I experimented with listing all my CSS files in a `.d.ts` file:

```
declare module 'css/file1.css' {}
declare module 'css/file2.css' {}
```

But this didn't seem to work at all. Relative imports of these files still produced type errors. So I think this feature still needs some work to be useful.

### [](#Region-Prioritized-Diagnostics-in-Editors "Region-Prioritized Diagnostics in Editors")Region-Prioritized Diagnostics in Editors

Like most compilers, TypeScript is [self-hosting](https://en.wikipedia.org/wiki/Self-hosting_\(compilers\)): `tsc` is written in TypeScript. This is a good idea because it's a form of [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food). The idea is that, since the TS team works in TypeScript every day, they'll be acutely aware of all the same issues that face other TypeScript developers.

Sometimes, though, this can have strange consequences. I suspect that most developers who contribute to TypeScript had a chuckle when they saw [Region-Prioritized Diagnostics in Editors](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#region-prioritized-diagnostics-in-editors) in the TS 5.6 release notes. The idea is that, for very large TypeScript files, the editor can focus on just the part that you're editing, rather than checking the whole file.

Sounds like a nice performance win. So why did I find this funny? It's because it's so clearly targeted at just one file, TypeScript's 50,000+ line `checker.ts`. It's incredible to me that the TS team implemented this feature rather than breaking up that file, but there you go!

## [](#New-Errors "New Errors")New Errors

Whenever a new version of TypeScript comes out, I like to run it over all my projects and the code samples in [_Effective TypeScript_](https://amzn.to/3UjPrsK) using [literate-ts](https://github.com/danvk/literate-ts) to look for new errors. There were a few of them, including some surprises.

Several errors came from the new checks I discussed earlier in this post, "this expression is always truthy" and `.next()` calls having stricter types. These were all true positives: they flagged code that was suspicious.

There were also two types of errors that came as surprises.

One was a change in circularity detection for a code sample in Effective TypeScript, in [Item 33: Push Null Values to the Perimeter of Your Types](https://github.com/danvk/effective-typescript/blob/main/samples/ch-design/null-values-to-perimeter.md):

```
function extent(nums: Iterable<number>) {
  let minMax: [number, number] | null = null;
  for (const num of nums) {
    if (!minMax) {
      minMax = [num, num];
    } else {
      const [oldMin, oldMax] = minMax;
      //     ~~~~~~  ~~~~~~
      // 'oldMin' / 'oldMax' implicitly has type 'any' because it does not have a
      // type annotation and is referenced directly or indirectly in its own
      // initializer.
      // (Error before TS 5.4, OK in TS 5.4, 5.5, error again in TS 5.6)
      minMax = [Math.min(num, oldMin), Math.max(num, oldMax)];
    }
  }
  return minMax;
}
```

In the first edition of _Effective TypeScript_, the same snippet avoided destructuring assignment in the `else` clause due to the circularity error:

```
result = [Math.min(num, result[0]), Math.max(num, result[1])];
```

I [filed an issue](https://github.com/microsoft/TypeScript/issues/33191) about this in 2019 and was excited to see that it was [fixed](https://github.com/microsoft/TypeScript/pull/56753) with TS 5.4, just in time for the book release. Unfortunately, the fix got reverted and we're [back to the circularity error](https://github.com/microsoft/TypeScript/issues/33191#issuecomment-2218027441). So I'll need to update the book.

I also ran into an [issue](https://github.com/microsoft/TypeScript/issues/60077) where the inferred type parameters for a generic function call changed. It boiled down to something like this:

```
declare const f: <P>(
  fn: (props: P) => void,
  init?: P,
) => P;
interface Props {
  req: string;
  opt?: string;
}
const props = f(
  (p: Props) => '',
  { req: "" },
);
props.opt
// Error in TS 5.6, OK in earlier versions
```

I used [every-ts](https://github.com/jakebailey/every-ts) to bisect this to [#57909](https://github.com/microsoft/TypeScript/pull/57909). This PR changed how type inference worked between covariant and contravariant parameters. If you see a surprising type change like this after updating to TS 5.6, this change might be the reason.

After [reading](https://github.com/microsoft/TypeScript/issues/59764#issuecomment-2311067288) some [comments](https://github.com/microsoft/TypeScript/issues/59764#issuecomment-2311543160), this all seems pretty [murky](https://github.com/microsoft/TypeScript/pull/59772#discussion_r1733190826). There's often no clearly correct inference, just tradeoffs. Given that, I'm a bit surprised that TypeScript changed the existing behavior. Be on the lookout for this one!

## [](#Performance-changes "Performance changes")Performance changes

New TypeScript releases have the potential to speed up or slow down compile times, but I was unable to measure any significant changes with this release.

## [](#Conclusions "Conclusions")Conclusions

While TS 5.6 isn't quite the [blockbuster](https://effectivetypescript.com/2024/07/02/ts-55/) that TS 5.5 was, the new "this expression is always truthy" checks and the more precise iterator types make it a worthwhile upgrade.

It's [sometimes said](https://matklad.github.io/2024/03/22/basic-things.html#Releases) that software dependencies obey a "reverse [triangle inequality](https://en.wikipedia.org/wiki/Triangle_inequality):" it's easier to go from v1→v2→v3 than it is to go from v1→v3 directly. The idea is that you can fix a smaller set of issues at a time. There's not much reason to hold off on adopting TypeScript 5.6. Doing so now will make upgrading to 5.7 easier in a few months.

Speaking of which, keep an eye on that release! I'm hoping that it will include the proposed [`enforceReadonly` flag](https://github.com/microsoft/TypeScript/pull/58296).