---
role: rssitem
author: Unknown
published: 2024-07-02T17:00:00.000Z
link: https://effectivetypescript.com/2024/07/02/ts-55/
id: https://effectivetypescript.com/2024/07/02/ts-55/
feed: "[[Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] TypeScript 5.5: A Blockbuster Release - 2024-07-02T17:00:00.000Z
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] We TypeScript developers are a lucky bunch. While some languages (Python, JavaScript) are released annually, every three years (C++) or even less, we get four new versions of TypeScript every year. TypeScript 5.5 was released on June 20th, 2024, and it was a real blockbuster. Let's take a look.

🌐 Read article [online](https://effectivetypescript.com/2024/07/02/ts-55/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[TypeScript 5․5꞉ A Blockbuster Release]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
We TypeScript developers are a lucky bunch. While some languages ([Python](https://en.wikipedia.org/wiki/History_of_Python), [JavaScript](https://en.wikipedia.org/wiki/ECMAScript_version_history)) are released annually, every three years ([C++](https://en.wikipedia.org/wiki/C%2B%2B#Standardization)) or even less, we get _four_ new versions of TypeScript every year. TypeScript 5.5 was [released](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/) on June 20th, 2024, and it was a real blockbuster. Let's take a look.

TypeScript's [motto](https://www.typescriptlang.org/) is "JavaScript with syntax for types." New versions of TypeScript don't add new runtime features (that's JavaScript's responsibility). Rather, they make changes within the type system. These tend to take a few forms:

1. New ways of expressing and relating types (e.g., [template literal types](https://effectivetypescript.com/2020/11/05/template-literal-types/) in TypeScript 4.1)
2. Increased precision in type checking and inference
3. Improvements to language services (e.g., a new quick fix)
4. Support for new ECMAScript standards
5. Performance improvements.

TypeScript 5.5 doesn't introduce any new type syntax, but it does include all the other kinds of changes. The [official release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/) have complete explanations and examples. What follows is my quick take on each of the major changes. After that we'll look at new errors and test some of the performance wins.

## [](#New-Features "New Features")New Features

### [](#Inferred-Type-Predicates "Inferred Type Predicates")Inferred Type Predicates

This was my contribution to TypeScript, and I'm very happy that it's made it into an official release! I've written about it extensively on this blog before, so I won't go into too much more detail here:

- [The Making of a TypeScript Feature: Inferring Type Predicates](https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/)
- [Flow Nodes: How Type Inference Is Implemented](https://effectivetypescript.com/2024/03/24/flownodes/)
- [The Hidden Side of Type Predicates](https://effectivetypescript.com/2024/02/27/type-guards/)

Dimitri from [Michigan TypeScript](https://mobile.x.com/MiTypeScript/status/1806674859201540568) even recorded a [video](https://youtu.be/LTuzl2r2HjA) of me explaining the story of the feature to him and [Josh Goldberg](https://www.joshuakgoldberg.com/).

TypeScript will infer type predicates for any function where it's appropriate, but I think this will be most useful for arrow functions, the [original motivator](https://github.com/microsoft/TypeScript/issues/16069) for this change:

```
const nums = [1, 2, 3, null];
//    ^? const nums: (number | null)[]
const onlyNums = nums.filter(n => n !== null);
//    ^? const onlyNums: number[]
//    Was (number | null)[] before TS 5.5!
```

I have two follow-on PRs to expand this feature to functions with [multiple return statements](https://github.com/microsoft/TypeScript/pull/58154) and to [infer assertion predicates](https://github.com/microsoft/TypeScript/pull/58495) (e.g., `(x: string): asserts x is string`). I think these would both be nice wins, but it's unclear whether they have a future since the pain points they address are much less common.

### [](#Control-Flow-Narrowing-for-Constant-Indexed-Accesses "Control Flow Narrowing for Constant Indexed Accesses")Control Flow Narrowing for Constant Indexed Accesses

This is a nice example of improved precision in type checking. Here's the [motivating example](https://github.com/microsoft/TypeScript/issues/16069):

```
function f1(obj: Record<string, unknown>, key: string) {
  if (typeof obj[key] === "string") {
    // Now okay, previously was error
    obj[key].toUpperCase();
  }
}
```

Previously this would only work for constant property accesses like `obj.prop`. It's undeniable that this is a win in terms of precision in type checking, but I think I'll keep using the standard workaround: factoring out a variable.

```
function f1(obj: Record<string, unknown>, key: string) {
  const val = obj[key];
  if (typeof val === "string") {
    val.toUpperCase();  // this has always worked!
  }
}
```

This reduces duplication in the code and avoids a double lookup at runtime. It also gives you an opportunity to give the variable a meaningful name, which will make your code easier to read.

Where I _can_ see myself appreciating this is in single expression arrow functions, where you can't introduce a variable:

```
keys.map(k => typeof obj[k] === 'string' ? Number(obj[k]) : obj[k])
```

### [](#Regular-Expression-Syntax-Checking "Regular Expression Syntax Checking")Regular Expression Syntax Checking

[Regular Expressions](https://en.wikipedia.org/wiki/Regular_expression) may be the most common [domain-specific language](https://en.wikipedia.org/wiki/Domain-specific_language) in computing. Previous versions of TypeScript ignored everything inside a `/regex/` literal, but now they'll be checked for a few types of errors:

- syntax errors
- invalid backreferences to invalid named and numbered captures
- Using features that aren't available in your target ECMAScript version.

Regexes are [notoriously cryptic](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454) and hard to debug (this [online playground](https://regex101.com/) is handy), so anything TypeScript can do to improve the experience of writing them is appreciated.

Since the regular expressions in existing code bases have presumably been tested, you're most likely to run into the third error when you upgrade to TS 5.5. ES2018 added a [bunch of new regex features](https://exploringjs.com/js/book/ch_new-javascript-features.html#new-in-es2018) like the `/s` modifier. If you're using them, but don't have your target set to ES2018 or later, you'll get an error. The fix is most likely to [increase your target](https://www.learningtypescript.com/articles/why-increase-your-tsconfig-target). The `/s` ([dotAll](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll)) flag, in particular, is [widely supported in browsers](https://caniuse.com/?search=dotall) and has been [available since Node.js](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/dotAll) since version 8 (2018). The general rule here is to create an accurate model of your environment, as described in [Item 76](https://github.com/danvk/effective-typescript/blob/main/samples/ch-write-run/model-env.md) of [Effective TypeScript](https://amzn.to/3UjPrsK).

Regex type checking is a welcome new frontier for TypeScript. I'm intrigued by the possibility that is a small step towards accurately typing the callback form of [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter), JavaScript's most [notoriously](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter) un-type friendly function:

```
"str".replace(/foo(bar)baz/, (match, capture) => capture);
//                                   ^?  (parameter) capture: any
```

### [](#Support-for-New-ECMAScript-Set-Methods "Support for New ECMAScript Set Methods")Support for New ECMAScript Set Methods

When you have two sets, it's pretty natural to want to find the intersection, union and difference between them. It's always been surprising to me that JavaScript `Set`s didn't have this ability built in. [Now they do!](https://github.com/tc39/ecma262/pull/3306)

While these new methods are stage 4, they haven't been included in any official ECMAScript release yet. (They'll probably be in ES2025.) That means that, to use them in TypeScript, you'll either need to set your target or lib to ESNext. Support for these methods is at [around 80%](https://caniuse.com/mdn-javascript_builtins_set_union) in browsers at the moment, and [requires Node.js 22](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union) on the server, so use with caution or include a polyfill.

### [](#Isolated-Declarations "Isolated Declarations")Isolated Declarations

The `isolatedDeclarations` setting opens a new front in the [should you annotate your return types?](https://effectivetypescript.com/2020/04/28/avoid-inferable/) debate. The primary motivator here is build speed for very large TypeScript projects. Adopting this feature _won't_ give you a faster build, at least not yet. But it's a foundation for more things to come. If you'd like to understand this feature, I'd highly recommend watching Titian's TS Congress 2023 talk: [Faster TypeScript builds with --isolatedDeclarations](https://portal.gitnation.org/contents/faster-typescript-builds-with-isolateddeclarations).

Should you enable this feature? Probably not, at least not yet. An exception might be if you use the [explicit-function-return-type](https://typescript-eslint.io/rules/explicit-function-return-type/) rule from typescript-eslint. In that case, switching to `isolatedDeclarations` will require explicit return type annotations only for your public API, where it's a clearer win.

I expect there will be lots more development around this feature in subsequent versions of TypeScript. I'll also just note that isolatedDeclarations had a [funny merge conflict](https://github.com/microsoft/TypeScript/pull/58958) with inferred type predicates. All these new feature are developed independently, which makes it hard to anticipate the ways they'll interact together.

### [](#Performance-and-Size-Optimizations "Performance and Size Optimizations")Performance and Size Optimizations

I [sometimes like to ask](https://effectivetypescript.com/2023/06/27/ts-51/): would you rather have a new feature or a performance win? In this case we get both!

Inferring type predicates _does_ incur a performance hit. In some [extreme cases](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1974921974) it can be a significant one, but it's typically a [1-2% slowdown](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1965552516). The TypeScript team decided that this was a price they were willing to pay for the feature.

TypeScript 5.5 also includes a whole host of other performance improvements, though, so the net effect is a positive one. You get your feature and your performance, too.

[Monomorphization](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html) has been an ongoing saga in TypeScript. This is a "death by a thousand cuts" sort of performance problem, which is hard to diagnose because it doesn't show up clearly in profiles. Monomorphization makes all property accesses on objects faster. Because there are so many of these, the net effect can be large.

One of the things we like about objects in JavaScript and TypeScript is that they don't have to fit into neat hierarchies like in Java or C#. But monomorphization is a push towards exactly these sorts of strict hierarchies. It's interesting to see this motivated by performance, rather than design considerations. If anyone tries to [translate tsc](https://twitter.com/danvdk/status/1801252274947158175) to the JVM, say, this will help.

I was particularly happy with [control flow graph simplifications](https://github.com/microsoft/TypeScript/pull/58013), since the PR included a screenshot of the [TS AST Viewer graph](https://effectivetypescript.com/2024/03/24/flownodes/) that I built!

These optimizations affect build times, the language service, and TypeScript API consumers. The TS team uses a [set of benchmarks](https://github.com/microsoft/typescript-benchmarking/) based on real projects, including TypeScript itself, to measure performance. I compared TypeScript 5.4 and 5.5 on a few of my own projects in a less scientifically rigorous way:

- Verifying the 934 code samples in the second edition of [Effective TypeScript](https://amzn.to/3UjPrsK) using [literate-ts](https://effectivetypescript.com/2020/06/30/literate-ts/), which uses the TypeScript API, went from 347→352s. So minimal change, or maybe a slight degradation.
- Type checking times (`tsc --noEmit`) were unaffected across all the projects I checked.
- The time to run `webpack` on a project that uses ts-loader went from ~43→42s, which is a ~2% speedup.

So no dramatic changes for my projects, but your mileage may vary. If you're seeing big improvements (or regressions), let me know! (If you're seeing regressions, you should probably file a bug against TypeScript.)

### [](#Miscellaneous "Miscellaneous")Miscellaneous

- Editor and Watch-Mode Reliability Improvements: These are grungy quality of life improvements, and we should be grateful that the TypeScript team pays attention to them.
- Easier API Consumption from ECMAScript Modules: I'd always wondered why you couldn't `import "typescript"` like other modules. Now you can!
- Simplified Reference Directive Declaration Emit: A weird, dusty corner that no longer exists. Yay!

## [](#New-Errors "New Errors")New Errors

Most of my TypeScript projects had no new errors after I updated to TS 5.5. The only exception was needing to update my target to ES2018 to get the `/s` regular expression flag, as described above.

Both [Bloomberg](https://github.com/microsoft/TypeScript/issues/58587) and [Google](https://github.com/microsoft/TypeScript/issues/58685) have posted GitHub issues describing the new errors they ran into while upgrading to TS 5.5. Neither of them ran into major issues.

## [](#Conclusions "Conclusions")Conclusions

Every new release of TypeScript is exciting, but the combination of new forms of type inference, `isolatedDeclarations`, and potential performance wins make this a particularly good one.

It's [sometimes said](https://matklad.github.io/2024/03/22/basic-things.html#Releases) that software dependencies obey a "reverse [triangle inequality](https://en.wikipedia.org/wiki/Triangle_inequality):" it's easier to go from v1→v2→v3 than it is to go from v1→v3 directly. The idea is that you can fix a smaller set of issues at a time. There's not much reason to hold off on adopting TypeScript 5.5. Doing so now will make upgrading to 5.6 easier in a few months.