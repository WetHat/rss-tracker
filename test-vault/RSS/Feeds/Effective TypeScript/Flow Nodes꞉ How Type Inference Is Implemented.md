---
role: rssitem
aliases:
  - "Flow Nodes: How Type Inference Is Implemented"
id: https://effectivetypescript.com/2024/03/24/flownodes/
author: unknown
link: https://effectivetypescript.com/2024/03/24/flownodes/
published: 2024-03-25T03:00:00.000Z
feed: "[[RSS/Feeds/Effective TypeScript.md|Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] Flow Nodes: How Type Inference Is Implemented (by unknown)
> ![image|float:right|400](https://effectivetypescript.com/images/dall-e-control-flow.jpg) If a variable gets a type but no one looks at it, does it really get a type at all? This post looks at how type inference is implemented in the TypeScript compiler. It's of some interest to anyone who uses TypeScript and is curious how it works, but it will be most relevant to developers who want to contribute to TypeScript itself.

🌐 Read article [online](https://effectivetypescript.com/2024/03/24/flownodes/). ⤴ For other items in this feed see [[RSS/Feeds/Effective TypeScript.md|Effective TypeScript]].

- [ ] [[RSS/Feeds/Effective TypeScript/Flow Nodes꞉ How Type Inference Is Implemented|Flow Nodes꞉ How Type Inference Is Implemented]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

In most programming languages a variable has a type and that type does not change. But one of the most interesting aspects of TypeScript's type system is that a symbol has a type _at a location_. Various control flow constructs can change this type:

```
function refine(x: string | number) {
  // type of x is string | number here
  if (typeof x === 'number') {
    // type of x is number here.
  } else {
    // type of x is string here.
  }
}
```

![Dall-E's interpretation of TypeScript's control flow graph and type inference algorithm.](https://effectivetypescript.com/images/dall-e-control-flow.jpg) _Dall-E's interpretation of TypeScript's control flow graph and type inference algorithm._

This is known as "refinement" or "narrowing." When I look at TypeScript code, I read it from top to bottom and I think about how the type of `x` changes as execution moves through each conditional. This works well but, as I learned from my recent work [adding a new form of type inference](https://github.com/microsoft/TypeScript/pull/57465) in the TypeScript compiler, it's not at all how type inference is actually implemented!

For users of TypeScript, reading code from top to bottom works just fine. But if you're working in the TypeScript compiler itself, you'll need to know how type inference works "under the hood." The key to this is "Flow Nodes," which are the nodes in the Control Flow Graph. I had a remarkably hard time finding documentation about FlowNodes online. The official Compiler-Notes repo [just has a "TODO"](https://github.com/microsoft/TypeScript-Compiler-Notes/blob/main/codebase/src/compiler/binder.md#control-flow) to document them. Basarat's TypeScript guide makes [no mention](https://basarat.gitbook.io/typescript/overview/checker) of them in the section on the TypeScript Compiler.

I learned a lot about FlowNodes from implementing [#57465](https://github.com/microsoft/TypeScript/pull/57465) and this post is my attempt to write the "missing manual" on them that I wish I'd had a few months back.

## [](#Confusion "Confusion")Confusion

My first clue that type inference didn't work the way I expected came from reading a PR that Anders Hejlsberg wrote in 2021 to [add "aliased conditions" to type inference](https://github.com/microsoft/TypeScript/pull/44730). This let you write something like:

```
function refine(x: string | number) {
  const isNum = typeof x === 'number';
  if (isNum) {
    // type of x is number here.
  } else {
    // type of x is string here.
  }
}
```

In my top-to-bottom way of thinking about type inference, it seemed like there must be some kind of "tag" associated with the `isNum` variable indicating that it refined the parameter `x`. But looking at Anders' PR, this wasn't at all how it worked. He wasn't storing any information whatsoever! Instead, all I saw was a bunch of references to flow nodes. So clearly these were important.

When TypeScript parses your code, it forms an [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST). Any node in the TypeScript AST can have an associated "flow node." The best way to view the TypeScript AST is David Sherret's [TS AST Viewer](https://ts-ast-viewer.com/). When you click on a node, it shows you its FlowNode. This consisted of some flags, a node, and one or more "antecedents." Curiously `node.flowNode.node` was never the same as `node`. It was always some other node in the AST.

![A Flow Node and its antecedent in the TS AST Viewer. I didn't find this view very illuminating.](https://effectivetypescript.com/images/flownode-tree-view.png) _A Flow Node and its antecedent in the TS AST Viewer. I didn't find this view very illuminating._

## [](#Graph-Visualization-and-an-Insight "Graph Visualization and an Insight")Graph Visualization and an Insight

The antecedents were other FlowNodes. These seemed to form some sort of graph structure, so I thought that visualizing them might help. I'd used GraphViz and the dot language to create graph visualizations on a [previous project](https://www.sidewalklabs.com/products/delve), and this seemed like a natural addition to the TS AST Viewer. I learned later that there was already a [TypeScript playground plugin](https://github.com/orta/playground-code-show-flow) that did something similar.

Seeing this graph made it much clearer what was going on. This was the control flow graph in reverse! An `if` statement came out as a [diamond shape](https://ts-ast-viewer.com/#code/GYVwdgxgLglg9mABAJwKbBmVAKAHgLkQGcplMBzRAH0TBAFsAjVZASkQG8AoRRCBEohhEAcg0QBeRFACeAB1RxgiXJIlSA5HSYsNAbh5Dl2YWPrtuvXvzBE4AG1QA6e3HLYNphvg0AaFawGvAC+iKj2RKichtYCDs6u7p5EAMqkFD7+uIGGwYY2do4ubh6MAIYQANbScIjg8EiyCho5vGhQIMhIXvQGwUA):

![Control flow graph showing a diamond shape](https://effectivetypescript.com/images/diamond-refine.png)_Full control flow graph showing a diamond shape for branching code._

I showed this to a [batchmate](https://github.com/sarahmeyer) at [Recurse Center](https://www.recurse.com/) who had the key insight: a Node's Flow Node is the previous statement that executed. With branching constructs, there will be more than one possible previous statement.

With loops, the graph [can even have a cyclic](https://ts-ast-viewer.com/#code/FA1hmCuB2DGAuBLA9tABAG2cgDgCgEo0BvYNTAU3jQA80BeNARgG4y0B3AC0QwrTx0APMwD6ABkkTJRUuXJ0AVIwBMbeWlioAzsj4A6LAHNBBdWgC+7AE5VI19DTYWgA):

![Control flow graph showing a loop](https://effectivetypescript.com/images/loop-graph.png)_Control flow graph showing a cycle for looping code._

I eventually [added this visualization](https://twitter.com/danvdk/status/1762868150800977996) to the TS AST Viewer. You can play around with it yourself to get a sense for how Flow Nodes work.

## [](#Turning-Type-Inference-Upside-Down "Turning Type Inference Upside-Down")Turning Type Inference Upside-Down

With some intuition about Flow Nodes in place, the code I was seeing in the type checker started to make a lot more sense.

TypeScript greedily constructs the control flow graph in the binder (`binder.ts`), then lazily evaluates it as it needs to get types in the checker (`checker.ts`) or for display (`tsserver.ts`). This is backwards from how we think about narrowing in our heads: rather than narrowing types as you read down your code, TypeScript narrows types by traversing back _up_ the control flow graph from the point where symbols are referenced.

Why does TypeScript do type inference this way? There are two reasons I can think of. The first is performance. In the context of the compiler, a symbol's type in a location is called its "flow type." Determining a symbol's flow type can be an expensive operation. It requires traversing the control flow graph all the way back to the root (usually the start of a function) and potentially computing some relationships between types along the way.

But often the flow type isn't needed. If you have an `if` statement like this:

```
function logNum(x: unknown) {
  if (typeof x === 'number') {
    console.log('x is a number');
  }
}
```

Then the type of `x` inside the `if` statement is `number`. But that's not relevant to the type safety of this code in any way. There's no reason for TypeScript to determine the flow type of `x`. And indeed, it doesn't. At least not until you write `x` in the `if` block.

This leads us to a profound realization: until it becomes relevant, TypeScript has no idea what the type of `x` is!

If the type of `x` becomes relevant for type checking, then TypeScript _will_ determine its flow type:

```
function logNum(x: unknown) {
  if (typeof x === 'number') {
    // x is referenced, so TypeScript needs to know its type.
    console.log("it's a number:", x);
  }
}
```

There may be many local variables in scope in your function. By only determining the flow types of the ones that are relevant for type checking, TypeScript potentially saves an enormous amount of work. This results in a more responsive editor and faster compile times. It also reduces TypeScript's memory usage: only the control flow graph needs to be stored permanently. Flow types can potentially be thrown away after they're checked.

The other reason that TypeScript does control flow analysis this way is to separate concerns in their code base. The control flow analysis graph is a standalone structure that's computed once in the binder. (This is the part of the compiler that determines which symbol `x` refers to in any location.) This graph can be constructed without any knowledge of what sort of analysis you'd like to do on it.

That analysis happens in the checker, `checker.ts`. One part of the compiler constructs the graph greedily, the other runs algorithms on it lazily.

This is what I was seeing in [Anders's PR](https://github.com/microsoft/TypeScript/pull/44730). He already had all the information he needed in the control flow graph. His PR just made the algorithm that ran over it a little more elaborate. Very few PRs need to change how the control flow is constructed. It's much more common to change the algorithms that run over it.

## [](#getFlowTypeOfReference "getFlowTypeOfReference")getFlowTypeOfReference

Speaking of algorithms, let's take a look at `getFlowTypeOfReference`, the workhorse of type inference. This is the function that determines the type of a symbol at a location. It's a real beast, clocking in at over 1200 lines of code. I'd link to it in [`checker.ts`](https://github.com/microsoft/TypeScript/blob/main/src/compiler/checker.ts), but GitHub won't even display files this large!

`getFlowTypeOfReference` is so large because it follows the usual TypeScript compiler style of defining helper functions as local functions inside a large, top-level function. It quickly calls `getTypeAtFlowNode`, which is where the flow node graph traversal happens.

This function consists of a `while` loop that looks at the current Flow Node and tries to match it against all the different patterns that can trigger a refinement. If it doesn't find one, it moves up to the node's antecedent:

![The code for traversing up the antecedent graph](https://effectivetypescript.com/images/flow-type-recursion.png) _The code for traversing up the antecedent graph in getTypeAtFlowNode_

All the different patterns of refinement that TypeScript supports are represented by helper functions. Here's a sample:

- narrowTypeByTruthiness
- narrowTypeByBinaryExpression
- narrowTypeByTypeof
- narrowTypeByTypeName
- narrowTypeBySwitchOnDiscriminant
- narrowTypeByInstanceof
- narrowTypeByTypePredicate
- narrowTypeByEquality
- narrowTypeByOptionalChainContainment

It's interesting to think about what sort of code would trigger each of these. `narrowTypeByEquality`, for example, is a special case of `narrowTypeByBinaryExpression`. It would trigger on code like this:

```
function foo(x: string | null) {
  if (x !== null) {
    // x is string in here
  }
}
```

(There's an `assumeTrue` flag that toggles behavior based on `===` vs. `!==`.)

`narrowTypeByEquality` is more subtle than you might expect! Take a look at this code:

```
function foo(x: string | number, y: number | Date) {
  if (x === y) {
    // x is number
    // y is number
  }
}
```

If two values are equal to one another, then their type must be the intersection of their declared types. Very clever, TypeScript!

What about branching constructs? TypeScript traverses up through both branches and unions the result. This should give you a sense for why determining flow types can be expensive! (The code for this is in `getTypeAtFlowBranchLabel`.)

## [](#Conclusion "Conclusion")Conclusion

Hopefully this post has clarified what flow nodes are and how type narrowing is implemented in the TypeScript compiler. While this isn't important to understand for TypeScript users, I'm still amazed that, after having used TypeScript for eight years, it turned out to work completely backwards from how I thought!
