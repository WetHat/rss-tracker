---
role: rssitem
aliases:
  - "The Making of a TypeScript Feature: Inferring Type Predicates"
id: https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/
author: unknown
link: https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/
published: 2024-04-16T17:30:00.000Z
feed: "[[RSS/Feeds/Effective TypeScript.md | Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] The Making of a TypeScript Feature: Inferring Type Predicates (by unknown)
> ![image|float:right|400](https://effectivetypescript.com/images/inferred-predicate.png) Over the past few months I became a TypeScript contributor and implemented a new feature, type predicate inference, that should be one of the headliners for TypeScript 5.5. This post tells the story of how that happened: why I wanted to contribute to TypeScript, the journey to implementing the feature and getting the PR merged, and what I've learned along the way. This is not a short read, but it will give you a good sense of what it's like to become a TypeScript contributor and develop a new feature.

🌐 Read article [online](https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/). ⤴ For other items in this feed see [[RSS/Feeds/Effective TypeScript.md | Effective TypeScript]].

- [ ] [[RSS/Feeds/Effective TypeScript/The Making of a TypeScript Feature꞉ Inferring Type Predicates|The Making of a TypeScript Feature꞉ Inferring Type Predicates]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

Over the past few months I became a TypeScript contributor and implemented a new feature, [type predicate inference](https://github.com/microsoft/TypeScript/pull/57465), that should be one of the headliners for TypeScript 5.5. This post tells the story of how that happened: why I wanted to contribute to TypeScript, the journey to implementing the feature and getting [the PR](https://github.com/microsoft/TypeScript/pull/57465) merged, and what I've learned along the way.

This is not a short read, but it will give you a good sense of what it's like to become a TypeScript contributor and develop a new feature.

If you're new to the _Effective TypeScript_ blog, consider [subscribing](https://effectivetypescript.com/mail/) or buying a copy of [the book](https://amzn.to/3UjPrsK). You can find a list of all the posts on this blog [here](https://effectivetypescript.com/all-posts/).

If you prefer videos, Dimitri from [Michigan TypeScript](https://twitter.com/MiTypeScript) recorded an interview where we talk through the making of this feature. It's about 70 minutes, and it's a fun watch if I say so myself!

## [](#What-is-Type-Predicate-Inference "What is Type Predicate Inference?")What is Type Predicate Inference?

Before we dive into the backstory, let's take a quick look at the feature I added. If you write code like this:

```
function isNumber(data: unknown) {
  return typeof data === 'number';
}
```

TypeScript will now infer that the function is a [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates):

![TypeScript inferring a type predicate](https://effectivetypescript.com/images/inferred-predicate.png)

Previously, TypeScript would have inferred a `boolean` return type. This also works for arrow functions, which means code that filters arrays becomes much more ergonomic:

```
const nums = [1, 2, null, 3, 4].filter(x => x !== null);
//    ^? const nums: number[]
console.log(nums[0].toFixed()); // ok
```

Previously, this type would have been `(number | null)[]` and the last line would have been a type error.

## [](#Why-contribute-to-TypeScript "Why contribute to TypeScript?")Why contribute to TypeScript?

![Soviet-style propaganda poster encouraging you to contribute to TypeScript](https://effectivetypescript.com/images/soviet-contribute.png)

I've been using TypeScript since 2016. I've been [writing about it](https://danvdk.medium.com/a-typed-pluck-exploring-typescript-2-1s-mapped-types-c15f72bf4ca8) [almost as long](https://danvdk.medium.com/a-typed-chain-exploring-the-limits-of-typescript-b50153be53d8). But I'd never contributed code to it. This felt like a gap in my understanding of TypeScript and its ecosystem. Like most TS users, I have a [long list](https://effectivetypescript.com/2022/12/25/christmas/) of features I'd like to see added to the language, and I thought learning about compiler internals would help me understand which of those features were feasible and which weren't.

At the start of this year, I signed up for a 12-week batch at [Recurse Center](https://www.recurse.com/), a "writer's retreat for programmers." You apply with a project in mind, and mine was to contribute to TypeScript. RC provided an encouraging structure and the space for me to make this leap.

## [](#Hopes-and-Fears "Hopes and Fears")Hopes and Fears

I hoped that I'd build a stronger intuition for how TypeScript works internally and maybe have some insights along the way. If I was lucky, maybe I'd be able to say I was a TypeScript contributor and make some improvements to the language.

My biggest fear was that I'd put a lot of work into a PR only to see it stall. There are some [notorious examples](https://github.com/microsoft/TypeScript/pull/38839#issuecomment-1160929515) of this, most famously the [cake-driven development incident](https://twitter.com/JoshuaKGoldberg/status/1481654056422567944?lang=en). I knew the real goal was to learn more about TypeScript. But I did hope to get a change accepted.

## [](#Finding-a-first-issue "Finding a first issue")Finding a first issue

_Mid- to Late-January 2024_

Before trying to implement something substantial, I thought I'd start by fixing a trivial bug. This would help me get familiar with the compiler and the development process. This is exactly how the TypeScript docs suggest you get started as a contributor.

Finding a "good first issue" proved harder than I'd expected. Most of the small, newly-filed issues get fixed quickly by one or two experienced community members. From a community perspective, this is great: if you file a bug and it's accepted, it's likely to get fixed. But for a new contributor this isn't good: I was unlikely to win any races to fix an issue.

There's a [good first issue](https://github.com/microsoft/TypeScript/labels/Good%20First%20Issue) label, but this proved to be a bit of a joke. My [favorite issue](https://github.com/microsoft/TypeScript/issues/29707) in this category was discussed by three of the top contributors to TypeScript, who decided it was impossible or not worth doing. But it's still got that "good first issue" label!

Eventually I found [#53182](https://github.com/microsoft/TypeScript/issues/53182), which involved numeric separators (`1_234`) not getting preserved in JS emit. This seemed low stakes and, as an added bonus, I'm a fan of the [developer](https://macwright.com/) who filed it.

The [fix](https://github.com/microsoft/TypeScript/pull/57144) was a one-liner, just like you'd expect, but I learned a lot about how TypeScript works along the way. TypeScript's code structure defies many best practices. All the code for type checking is in a single file, `checker.ts`, that's over 50,000 lines of code. And these are meaty lines since there's no set line width and relatively few comments. It also makes extensive use of numeric enums, a feature I discourage in [Effective TypeScript](https://amzn.to/3UjPrsK).

That being said, there are some impressive parts of the tooling. Visual debugging (F5) works great in VS Code and is an excellent way to learn what the compiler is doing. There are relatively few unit tests, but there's an enormous collection of "baselines," a sort of end-to-end test that snapshots the types and errors for a code sample. There are over 18,000 of these, but TypeScript is able to run all of them on my laptop in just a few minutes.

After a few weeks, my PR was merged and released as part of TypeScript 5.4. I was officially a TypeScript contributor!

## [](#A-meatier-second-issue "A meatier second issue")A meatier second issue

_January 26, 2024_

Fixing a small bug was a good start, but my bigger goal was to implement a new feature. Of all the issues I'd filed on TypeScript, [#16069](https://github.com/microsoft/TypeScript/issues/16069) stood out with over 500 👍s. This issue requested that TypeScript infer [type predicates](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards) for functions like `x => x !== null`. Clearly I wasn't the only one who wanted this!

I also had reason to think that this issue might be solvable. In [TypeScript 4.4](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/) (2021), Anders added support for [aliased conditions and discriminants](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html#control-flow-analysis-of-aliased-conditions-and-discriminants). This let you write code like this:

```
function foo(x: string | null) {
  const ok = x !== null;
  if (ok) {
    x  // type is string
  }
  return ok;
}
```

Surely the `ok` symbol had to have information stored on it saying that its value was tied to a refinement on `x`. If I looked at Anders' PR, I'd find where this was stored. This felt at least adjacent to my issue. And it was a good story: the feature only became feasible after another seemingly-unrelated feature was added. There were even [some comments](https://github.com/microsoft/TypeScript/issues/16069#issuecomment-893914922) suggesting as much.

As it turned out, this was totally wrong! Nothing was stored on the `ok` symbol and I totally misunderstood how type inference worked. This was a big insight for me, and I wrote about it in my last blog post, [Flow Nodes: How Type Inference Is Implemented](https://effectivetypescript.com/2024/03/24/flownodes/). Head over there to learn all about this epiphany.

As part of my efforts to understand how control-flow analysis worked, I wrote some code to visualize TypeScript's control flow graph. I [contributed this](https://twitter.com/danvdk/status/1762868150800977996) as a new feature to the [TS AST Viewer](https://ts-ast-viewer.com/). This was a nice, concrete win: even if my work on type predicate inference went nowhere, at least I'd contributed something of value to the ecosystem.

## [](#quot-OK-maybe-this-isn’t-hopeless…-quot "\"OK, maybe this isn’t hopeless…\"")"OK, maybe this isn’t hopeless…"

_Week of February 2, 2024_

Having built a stronger understanding of how type inference worked, I came back to the original problem. Did this make implementing my feature easier or harder?

Whenever I explained this feature, I'd demo how you could put the return expression in an `if` statement to see the narrowed type of the parameter:

```
function isNonNull(x: number | null) {
  return x !== null;
}
// ->
function isNonNullRewrite(x: number | null) {
  if (x !== null) {
    x  // type is number
  }
}
```

The key insight was to realize that I could do the exact same thing with the control flow graph. I'd just have to synthesize a `FlowCondition` node, plug it into wherever the `return` statement was, and check the type of the parameter in that branch if the condition was `true`. If it was different than the declared type, then I had a type predicate!

I could check the type of a parameter at a location using the `getFlowTypeOfReference` function. But where to put this check? This was also a challenge, but eventually I found a place in `getTypePredicateOfSignature` to slot it in. I added a new function, `getTypePredicateFromBody`, that this would call for boolean-returning functions.

This was all a bit of a struggle since it was my first time really working with the type checker. Even simple things felt quite hard. What's the difference between a `Declaration`, a `Symbol` and an `Identifier`? How should I go from one to the other? Often I found a [very roundabout way](https://github.com/danvk/TypeScript/commit/a6a34c1523f3e70cda676cd75879ce53b6bcff51) that let me keep making progress before I later found a more canonical path. For example, if `param` is a `ParameterDeclaration`, then you can use `param.name` to get a `BindingName`, and `isIdentifier(param.name)` to make sure it's an `Identifier`.

Running the tests was easy, but it took me a bit longer to realize how to test them in an interactive setting. So far as I can tell, building your own version of the TypeScript Playground isn't possible. But if you run `hereby local`, it will build `tsc.js`, and you can point any VS Code workspace at that version of TypeScript. You can even do this for the TypeScript repo itself.

While learning my way around the codebase, I found it incredibly helpful to take notes. Which function did what? What questions did I have? What was I struggling with? What did I have left to do? This helped to keep me oriented and also gave me a sense of progress. In particular, it was satisfying to read questions I'd had weeks earlier that I now knew the answer to. Clearly I was learning! By the time my PR was merged, my Notion doc ran to 70+ pages of notes.

Eventually I was able to fit all the pieces together, though, and this let me infer type predicates for the first time, which was hugely encouraging!

## [](#43-failures "43 failures")43 failures

_Week of February 9, 2024_

This let me run the 18,000+ TypeScript "baselines." This was an exciting moment: the first time I'd see how my inference algorithm behaved on unfamiliar code! My initial implementation produced 43 test failures. I went through and categorized these:

- 32 were "Maximum call stack size exceeded" errors
- 5 were the identify function on booleans
- 1 involved my mishandling a function with multiple returns
- The other 5 were wins!

This change was pretty funny:

```
// function identity(b: boolean): b is true
function identity(b: boolean) {
  return b;
}
```

The identity function on booleans _is_ a type predicate! But that didn't seem very useful. I added a special case to skip boolean parameters.

The maximum call stack errors turned out to be an infinite loop. I added some code to block this. Then I changed my code to only run on functions with a single `return` statement. This left me with just the wins.

One of these wins got me particularly excited:

```
declare function guard1(x: string|number): x is string;
function guard2(x: string | number) {
  return guard1(x);
}
```

I was inferring that `guard2` was a type guard because `guard1` was. This meant that type predicates could flow! There was another [long-standing issue](https://github.com/microsoft/TypeScript/issues/10734) requesting just this behavior. Anders has said that you never want to fix just a single issue, you always want to fix a whole category of problems. This was an encouraging sign that I was doing just that. I hadn't set out to make type predicates flow, it just followed naturally from my change and TypeScript's control flow analysis.

## [](#More-Predicates-in-More-Places "More Predicates in More Places")More Predicates in More Places

_Week of February 16, 2024_

To keep things simple, I'd only been considering function statements, not function expressions or arrow functions. Now that I'd validated the basic approach, I wanted to support these, too.

Standalone function expressions and arrow functions weren't difficult to add, but I had a lot of trouble with functions whose parameter types are determined by context. For example:

```
const xs = [1, 2, 3, null];
const nums = xs.filter(x => x !== null);
```

The type of `x` is `number | null`, but TypeScript only determines this from a complex sequence of type inferences. I kept getting `any` types.

This problem didn't turn out to be deep. It just required finding the right function to call. `getTypeForVariableLikeDeclaration` did not work, but eventually I discovered `getNarrowedTypeOfSymbol`, which did. For the final PR I switched over to `getSymbolLinks`.

This was another really exciting moment! My commit message nicely captures my feelings:

![commit message reading OMG IT WORKS](https://effectivetypescript.com/images/omg-it-works.png)

Nearly seven years after I'd filed the [original issue](https://github.com/microsoft/TypeScript/issues/16069), I was able to make it pass the type checker:

![code sample passing type checker.](https://effectivetypescript.com/images/even-squares.png)

Success would be fleeting for this code sample, though, as I was about to find out.

## [](#Pathological-Cases-and-an-Insight "Pathological Cases and an Insight")Pathological Cases and an Insight

As I was developing the feature, I started collecting a set of "pathological" functions, ones that I thought might trip up my algorithm. The goal here is to think of everything that could possibly go wrong. That's impossible, of course, but the more bugs you work out on your own, the better.

This one turned out to be particularly interesting:

```
function flakyIsString(x: string | null) {
  return typeof x === 'string' && Math.random() > 0.5;
}
```

Should this be a type predicate? If it returns `true`, then you know that `x` is a `string`. But what if it returns `false`? In that case, `x` could be either `string` or `null`.

TypeScript infers correct types on both sides if we rewrite this as an `if` statement:

```
function flakyIsStringRewrite(x: string | null) {
  if (typeof x === 'string' && Math.random() > 0.5) {
    x; // type is string
  } else {
    x; // type is string | null
  }
}
```

But if you make this a type predicate, that nuance is lost:

```
function flakyIsString(x: string | null): x is string {
  return typeof x === 'string' && Math.random() > 0.5;
}
declare let sOrN: string | null;
if (flakyIsString(sOrN)) {
  sOrN  // type is string
} else {
  sOrN  // type is null 😱
}
```

In other words, `flakyIsString` should _not_ be a type predicate. This forced me to reformulate my criterion for inferring type predicates to consider the `false` case. If you rewrite a function that returns `expr` like this:

```
function foo(x: InitType) {
  if (expr) {
    x  // TrueType
  } else {
    x  // FalseType
  }
}
```

Then I required that `FalseType = Exclude<InitType, TrueType>`. This was the criterion I used when I first posted the PR, but it turned out to be subtly incorrect.

I hadn't realized that type predicates had these "if and only if" semantics before working on this PR. This was a genuine insight, and I wrote about in another post on this blog: [The Hidden Side of Type Predicates](https://effectivetypescript.com/2024/02/27/type-guards/).

## [](#Plot-Twist-Truthiness-and-Nullishness "Plot Twist: Truthiness and Nullishness")Plot Twist: Truthiness and Nullishness

Here's the example code from the original feature request in 2017:

```
const evenSquares: number[] =
    [1, 2, 3, 4]
        .map(x => x % 2 === 0 ? x * x : null)
        .filter(x => !!x);  // errors, but should not
```

With my new criterion came a real [plot twist](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1959570195): I stopped inferring a type guard in this case! The reason is that "truthiness" doesn't cleanly separate `number|null`:

```
declare let x: number | null;
if (!!x) {
  x;  // number
} else {
  x;  // number | null
}
```

`number` is possible in the `else` case because `0` is falsy. (A type of `0|null` [would be more precise](https://github.com/microsoft/TypeScript/issues/45329)).

I saw this as a mixed bag. While it meant that I didn't truly "fix" the original issue, I also think it's a good behavior. Checking for "truthiness" is usually a bad idea with primitive types. You typically want to exclude just `null` or `undefined`, not `0` or `""`. Filtering out `0` when you mean to filter out `null` is a common source of bugs.

To infer a type predicate for `x => !!x`, TypeScript would either need [negated types](https://github.com/microsoft/TypeScript/issues/4196) (so that you could represent "numbers other than 0") or [one-sided type predicates](https://github.com/microsoft/TypeScript/issues/15048). Both are beyond the scope of my PR.

My change _will_ infer a type predicate from `x => !!x` for object types, where there's no ambiguity.

## [](#Putting-up-the-PR "Putting up the PR")Putting up the PR

_February 20–21, 2024_

I showed my PR to [Josh Goldberg](https://www.joshuakgoldberg.com/) around this time. I was a bit nervous to post the PR—I'd put a lot of work into it at this point!—but he was excited and gave me the pep talk that I needed. So I wrote up a detailed PR description and [posted](https://github.com/microsoft/TypeScript/pull/57465) my code the next day.

There was a _lot_ of excitement! It was fun and encouraging to see all the positive feedback on Twitter. In particular Brad Zacher [introduced](https://twitter.com/bradzacher/status/1760414631548653729) me to [`%checks`](https://flow.org/en/docs/types/functions/#predicate-functions), which was a similar feature in Flow. His experience using this [proved helpful later](https://github.com/microsoft/TypeScript/pull/57552#issuecomment-1965983413) in keeping the scope of my PR large.

I'd run all the TypeScript unit tests on my laptop, so I knew that those passed. But there was a new test that failed in a really interesting way…

## [](#A-Scary-Self-Check-Error "A Scary Self-Check Error")A Scary Self-Check Error

_February 21, 2024_

TypeScript is written in… TypeScript! This is a bit of a headscratcher at first, but it's actually a common practice in programming languages known as [bootstrapping](https://stackoverflow.com/questions/1254542/what-is-bootstrapping). As such, it's important that TypeScript be able to compile itself with every change.

My PR was unable to compile TypeScript, and for a very interesting reason. It boiled down to whether this function should be a type predicate:

```
function flakyIsStringUnknown(x: unknown) {
  return typeof x === 'string' && Math.random() > 0.5;
}
```

This is the same as `flakyIsString`, but with a broader parameter type. We can convert this to an `if` statement as usual:

```
function flakyIsStringUnknown(x: unknown) {
  if (typeof x === 'string' && Math.random() > 0.5) {
    x  // TrueType: string
  } else {
    x  // FalseType: unknown
  }
}
```

Since `Exclude<unknown, string> = unknown`, my PR inferred a type predicate for this function. And that _is_ valid if you call it with a symbol whose type is `unknown`. But there's no reason you have to do that! As with any function in TypeScript, you can call it with a subtype of the declared type. And if we infer a type predicate, that's trouble:

```
function flakyIsStringUnknown(x: unknown): x is string {
  return typeof x === 'string' && Math.random() > 0.5;
}
declare const sOrN: string | number;
if (flakyIsStringUnknown(sOrN)) {
  sOrN  // type is string
} else {
  sOrN  // type is number 😱
}
```

The type in the `else` case is wrong. It could still be a `string`. So something was wrong with my criterion. I [feared](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1957751656) that this might be a fundamental problem with my approach.

I decided to step away from the problem and go for a walk.

## [](#Saving-the-PR-A-New-Criterion "Saving the PR: A New Criterion")Saving the PR: A New Criterion

Recall that this was the criterion I was using:

```
FalseType = Exclude<InitType, TrueType>
```

`InitType` is the declared parameter type. Really I needed that relationship to hold not just for `InitType` but _for all subtypes_ of `InitType`. But how on earth to test that?

Intuitively, it seemed to me like there was just one subtype of `InitType` that was worth testing: `TrueType`. If I set `InitType=TrueType`, I could run the same inference algorithm again to get `TrueSubType` and `FalseSubType`. Then I could check a secondary criterion:

```
FalseSubType = Exclude<TrueType, TrueSubtype>
```

Here's what this would look like for `flakyIsStringUnknown`:

```
function flakyIsStringUnknown(x: unknown) {  // InitType: unknown
  if (typeof x === 'string' && Math.random() > 0.5) {
    x  // TrueType: string
  } else {
    x  // FalseType: unknown
  }
}
// ✅ unknown = Exclude<unknown, string>
function flakyIsStringUnknownSub(x: string) {  // TrueType: string
  if (typeof x === 'string' && Math.random() > 0.5) {
    x  // TrueSubType: string
  } else {
    x  // FalseSubType: string
  }
}
// ❌ string != Exclude<string, string>
```

This seemed to work, at the expense of making four calls to `getFlowTypeOfReference` rather than two. But correctness first, performance second. The PR was working again!

## [](#A-Surprising-Circularity-Error "A Surprising Circularity Error")A Surprising Circularity Error

_February 23, 2024_

With the tests passing, I got my first glimpse of the performance impact of my changes, as well as the new errors on TypeScript's broader test suite of popular repos.

The performance wasn't great: +5% on one of their standard benchmarks.

There were [six failures](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1960271216). Four were sensible consequences of my change. [This one](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1960328566) from VS Code was particularly interesting:

```
const responseItems = items.filter(i => isResponseVM(i));
```

`isResponseVM` is a type guard. The author of this code wrapped it in an arrow function to avoid applying it as a refinement to the `items` array. But with my PR TypeScript wasn't so easily fooled! The type guard flowed through and the type of `responseItems` changed.

The only really problematic failure came from [Prisma](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1961723998). This was a new "circular reference" error. I spent quite a while setting up a [minimal reproduction](https://github.com/microsoft/TypeScript/blob/main/tests/cases/compiler/circularConstructorWithReturn.ts) of this before I realized what was going on: my code was running on constructor functions!

But not just any constructor function. Only constructor functions with exactly one `return` statement. Did you know that a constructor function in JS could have a `return` statement? I didn't. [It's allowed](https://www.mgaudet.ca/technical/2020/7/24/investigating-the-return-behaviour-of-js-constructors), but exceedingly rare. Regardless, constructors can't be type predicates, so I excluded them and this fixed the test.

One insight here is that lots of valid TypeScript code is teetering on the edge of triggering a circularity error. Just by checking a type in a different sequence in `checker.ts`, you might cause enough of a change to tip some over.

## [](#Performance-and-the-Final-Criterion "Performance and the Final Criterion")Performance and the Final Criterion

_February 25, 2024_

With the changes in the test suite well-characterized, I started to think about performance. Were those four calls to `getFlowTypeOfReference` all necessary? The `TrueSubtype` was irrelevant. It should just be the same as `TrueType`. Maybe I could also ditch `FalseType` and go directly to the `FalseSubtype` test.

Moreover, if `TrueType == TrueSubtype`, and

```
FalseSubType = Exclude<TrueType, TrueSubtype>
```

then really what I need to test is `FalseSubtype == never`. This was a nice win because it got me back to two calls to `getFlowTypeOfReference` _and_ let me drop potentially-expensive `Exclude` calculations.

This wound up being the [final version of the criterion](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1964355842). Let's walk through how it works for this function:

```
function isStringFromUnknown(x: unknown) {
  return typeof x === 'string';
}
```

First we rewrite this to an `if` statement to get the `TrueType`:

```
function isStringFromUnknown(x: unknown) {
  if (typeof x === 'string') {
    x  // TrueType = string
  }
}
```

Next we pass this through as the parameter type and look at the `else` case:

```
function isStringFromUnknown(x: string) {
  if (typeof x === 'string') {
  } else {
    x  // type is never
  }
}
```

If this type is `never` then we have a bulletproof type predicate. Otherwise we don't. This makes good intuitive sense: if the function returns true for every value in a type, then there should be nothing left in the `else` case, where it returns false.

With fewer calls to `getFlowTypeOfReference` and a simple `never` check, the performance hit dropped from 5% down to 1-2%.

## [](#More-performance "More performance")More performance

_February 27–March 6, 2024_

At this point my PR started to get [discussed](https://github.com/microsoft/TypeScript/issues/57568) at the [weekly design meetings](https://github.com/microsoft/TypeScript/issues/57599). They were generally supportive but wanted to track down that performance hit.

This set off a flurry of optimizations. Ryan [experimented](https://github.com/microsoft/TypeScript/pull/57552) with narrowing the scope of the PR. Anders [reordered](https://github.com/microsoft/TypeScript/pull/57612) some of the checks. I profiled my change and [thought I found a big win](https://github.com/microsoft/TypeScript/pull/57465#issuecomment-1964355842) that didn't hold up.

An insight from profiling was that `getTypePredicateFromBody` was usually quite fast, but there were a few pathological cases where it could be very slow. This was the worst of the worst:

```
function hasBindableName(node: Declaration) {
    return !hasDynamicName(node) || hasLateBindableName(node);
}
```

Both `hasDynamicName` and `hasLateBindableName` are explicit type predicates. So should this be a type predicate? Here's how the types come out:

```
InitType = Declaration
TrueType = NumericLiteral | StringLiteral | NoSubstitutionTemplateLiteral | Identifier | TypeParameterDeclaration | ... 106 more ... | LateBoundBinaryExpressionDeclaration
FalseSubtype = (PropertySignature & DynamicNamedDeclarationBase) | (PropertyDeclaration & DynamicNamedDeclarationBase) | ... 17 more ... | DynamicNamedBinaryExpression
```

That's a big union! Calculating these types, particularly the `FalseSubtype`, winds up being very expensive. This one call took 300ms on my laptop and accounted for 80% of the slowdown on one benchmark.

I tried adding a [few more optimizations](https://github.com/microsoft/TypeScript/pull/57660) but unfortunately they didn't change the perf numbers much. So a 1-2% slowdown is where it was going to be.

A highlight here was getting a very positive [code review](https://github.com/microsoft/TypeScript/pull/57465#pullrequestreview-1909849513) from Anders. This is definitely going on my resume!

![Positive Code Review from Anders Hejlsberg](https://effectivetypescript.com/images/anders-code-review.png)

## [](#A-productive-prod "A productive prod")A productive prod

_March 12, 2024_

At this point the PR stalled for around a week. I wanted to keep things moving along, but I also didn't want to be that person posting "any updates?" comments. I've been on both sides of this. Those comments are rarely helpful. Presumably everyone wants the PR to make progress, there are just other priorities.

But in this case, there was an opportunity for a more constructive nudge. I had a draft of the [second edition](https://amzn.to/3UjPrsK) of _Effective TypeScript_ due on March 15th. One of the new items was "Know how to filter null values from lists." If my PR went in, that item would be completely unsalvageable, and the best course of action would be to delete it completely.

Ryan Cavanaugh was a reviewer for the book, so I asked him what he thought the odds of my PR being merged were. If they were greater than 50/50, I should just delete the item.

Ryan said that Anders was "super stoked" on the PR and he thought it would go in for 5.5. Wow! Even better, he took the hint and reassigned the PR to Anders, who immediately approved it. Amazing! Ryan said he'd ping the team for a last round of reviews.

## [](#The-final-review "The final review")The final review

_March 13–15, 2024_

During that final round of reviews, Wes Wigham found [two more issues](https://github.com/microsoft/TypeScript/pull/57465#pullrequestreview-1935559962):

1. I needed to avoid inferring type predicates for [rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) (a pathological case I'd missed!)
2. I needed to make sure that inferred type predicates showed up in emitted declaration files (`.d.ts`), just like inferred return types do.

Adding `.d.ts` emit would have been a daunting change at the start of this process, but by now I was comfortable enough navigating the TypeScript codebase that it didn't prove too difficult.

The most confusing part here was that the tests all started failing on TypeScript's CI. I couldn't reproduce the failures on my laptop. This was quite frustrating until I figured out what was going on: the TypeScript CI does a `git merge main` before running your tests. There are differing opinions on whether this is a good idea, and I usually don't set up my repos to do it. But once I realized what was going on, the fix was easy: I just needed to merge the upstream changes myself.

There was one funny bug that came up here. My generated `.d.ts` files initially contained code that looked like this:

```
export declare function syntaxRequiresTrailingSemicolonOrASI(
  kind: SyntaxKind
): kind is SyntaxKind.PropertyDeclaration |
   SyntaxKind.VariableStatement |
   SyntaxKind.ExpressionStatement |
   SyntaxKind.DoStatement |
   SyntaxKind.ContinueStatement |
   SyntaxKind.BreakStatement |
   SyntaxKind.ReturnStatement |
   ... 7 more ... |
   SyntaxKind.ExportDeclaration;
```

That "... 7 more ..." isn't valid TypeScript syntax! It turns out I needed to set an emit flag to prevent truncation.

Wes requested that I do some minor refactoring and then approved the PR.

After a last round of tests, Ryan merged my PR. This was happening!

## [](#Aftermath "Aftermath")Aftermath

Once my PR went in, there was [even more excitement](https://twitter.com/GabrielVergnaud/status/1769392854156095565) on TypeScript Twitter. [Andarist](https://twitter.com/AndaristRake/status/1768722035369181466) and [Matt Pocock](https://twitter.com/mattpocockuk/status/1768809254733951424) both tweeted about it, and Matt even wrote a [blog post](https://www.totaltypescript.com/type-predicate-inference). Jake Bailey put up a [very satisfying PR](https://github.com/microsoft/TypeScript/pull/57830) that removed newly-superfluous type assertions from the TypeScript code base. There was one [bug filed](https://github.com/microsoft/TypeScript/issues/57947) about inferring type predicates for tagged unions, which Andarist [quickly fixed](https://github.com/microsoft/TypeScript/pull/57952).

I explored a two followup changes:

1. Lots of the Twitter reaction [asked](https://twitter.com/MiTypeScript/status/1768741478199697806) whether `filter(Boolean)` would work now. The answer is no, but I explored how we could make this work (for object types) and found it [harder than expected](https://github.com/microsoft/TypeScript/issues/50387#issuecomment-2037968462).
2. I also looked into supporting type predicate inference for [functions with multiple `return` statements](https://github.com/microsoft/TypeScript/pull/58154). This isn't a major change to the existing logic and it has minimal performance impact. But there aren't many functions like this in the wild, so it may not be worth the effort.

## [](#Conclusions "Conclusions")Conclusions

Stepping back, creating this PR was a great experience that worked out far better than I had any right to expect. My goal was to get a better sense for how TypeScript worked internally, and I certainly did that! But fixing a seven year-old bug and seeing the wildly positive response was even better.

I filed this issue in 2017 when TypeScript 2.3 was the latest and greatest. I'd initially been drawn to work on it because I thought that an unrelated change in TypeScript 4.4 (2021) might have made it more tractable. That change turned out to be irrelevant. All of the machinery I wound up using to infer type predicates was already in place way back in 2017. It's just that no one had thought to put the pieces together in quite this way.

This is a great example of how bringing fresh eyes into an ecosystem can be beneficial. I don't think there are any other places where the type checker synthesizes a flow node. But I didn't know that, so I just did it. And it worked great!

TypeScript 5.5 should come out for beta testing in the next few weeks, and a final version should be out in the next few months. It's exciting to think that my experimental code from January will soon be running on every TypeScript function in the world!
