---
role: rssitem
author: Unknown
published: 2024-08-30T13:00:00.000Z
link: https://effectivetypescript.com/2024/08/30/keyof-puzzle/
id: https://effectivetypescript.com/2024/08/30/keyof-puzzle/
feed: "[[Effective TypeScript]]"
tags: []
pinned: false
---

> [!abstract] A keyof puzzle - 2024-08-30T13:00:00.000Z
> <span class="rss-image">![[RSS/assets/RSSdefaultImage.svg|200x200]]</span> Effective TypeScript is nearly 400 pages long, but I've received the most feedback by far on just one passage. It comes in Item 7: Think of Types as Sets of Values: keyof (A&B) = (keyof A) | (keyof B)keyof (A|B) = (keyof A) & (keyof B) If you can build an intuition for why these equations hold, you'll have come a long way toward understanding TypeScript's type system! I'll explain these equations in a moment. But before I do, head over to the TypeScript Playground and test them out with a few ty⋯

🔗Read article [online](https://effectivetypescript.com/2024/08/30/keyof-puzzle/). For other items in this feed see [[Effective TypeScript]].

- [ ] [[A keyof puzzle]]

~~~dataviewjs
const
    current = dv.current(),
	dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv),
	tasks = await dvjs.rssDuplicateItemsTasks(current);
if (tasks.length > 0) {
	dv.header(1,"⚠ Other RSS items are referring to the same article");
    dv.taskList(tasks,false);
}
const tags = current.file.etags.join(" ");
if (current) {
	dv.span(tags);
}
~~~

- - -
_Effective TypeScript_ is nearly 400 pages long, but I've received the most feedback by far on just one passage. It comes in [Item 7: Think of Types as Sets of Values](https://github.com/danvk/effective-typescript/blob/main/samples/ch-types/types-as-sets.md):

> ```
> keyof (A&B) = (keyof A) | (keyof B)
> keyof (A|B) = (keyof A) & (keyof B)
> ```
> 
> If you can build an intuition for why these equations hold, you'll have come a long way toward understanding TypeScript's type system!

I'll explain these equations in a moment. But before I do, head over to the [TypeScript Playground](https://www.typescriptlang.org/play/?#code/JYOwLgpgTgZghgYwgAgHJwLYQCYAUD2oYyA3gFDLIiYQBcyAzmFKAOYDcFyAHvSAK4YARtE6UAnn0EionAL5ki0eEmQEiAZgAipLryrTRXSQeFHKALylnZZBWQT4QTKjWwANAJoAtZAF5dSmosegByVAgAd2RPfCgAa1CAGj16AFoAdg0UiXoAFgAGHOQrZCK7TkdnYhBxBFR6dCw8QnB-V2avb3ZkAHpe5Hx4gEIHJxdahG96dXBtduCcLp7+wZGyMjBxAAcUAGlUdpI5ZAAyZHiIcXwYNDdZsE5VygA9AH5Nnf2NI5Pzy+utwe2ieA1eH0+u2QewAku0ATdkAAKJo4B5nNStMDaACUoMoyHekP2AFV2kiEbdUS0iDjkAAfZGUzGaLQ4sjPQkfIA) and test them out with a few types. See if you can build that intuition for why they hold.

I first saw these equations in Anders Hejlsberg's [keynote at TSConf 2018](https://youtu.be/wpgKd-rwnMw?si=szTbEWSFGCF8xp2x&t=1576) ("Higher order type equivalences" at 26m15s):

Anders' explanation at the talk was helpful, but I still had to stare at them for a long time before they clicked. But when they did, I felt like I'd had a real insight about how TypeScript types work.

The feedback on these equations in the book is typically that I need to explain them more. Some readers have even claimed they're wrong. (They're not!) By presenting them a bit cryptically, I wanted to give readers a chance to think through them and have an insight of their own.

With that out of the way, let's dig into why these equations hold, and why they're interesting.

We can start by plugging in concrete types for `A` and `B`:

```
interface NamedPoint {
  name: string;
  x: number;
  y: number;
}
interface Point3D {
  x: number;
  y: number;
  z: number;
}
```

What's `NamedPoint & Point3D`, the intersection of these two types? It's easy to think that it's an `interface` with just the common fields:

```
// This is _not_ the same as NamedPoint & Point3D!
interface CommonFields {
  x: number;
  y: number;
}
```

That's not what it is, though. To understand the intersection of these types, we need to think a little more about what values are assignable to each type. A `NamedPoint` is an object with three properties, `name`, `x`, and `y`, with the expected types:

```
const nyc: NamedPoint = {
  name: 'New York',
  x: -73,
  y: 40,
};
```

But a `NamedPoint` could have other properties, too. In particular it could have a `z` property:

```
const namedXYZ = {
  name: 'New York',
  x: -73,
  y: 40,
  z: 0,
};
const nycN: NamedPoint = namedXYZ; // ok!
```

(We have to go through an intermediate object to avoid [excess property checking](https://observablehq.com/@koop/excess-property-checking-in-typescript) errors here. If you have a copy of [_Effective TypeScript_](https://amzn.to/3UjPrsK), check out [Item 11: Distinguish Excess Property Checking from Type Checking](https://github.com/danvk/effective-typescript/blob/main/samples/ch-types/excess-property-checking.md).)

There's nothing special about `z`. It could have other properties, too, and still be assignable to `NamedPoint`. For this reason, we sometimes say that TypeScript types are "open."

Of course, `Point3D` is open, too. It could also have other fields, including a `name` field:

```
const nycZ: Point3D = namedXYZ; // ok!
```

So `namedXYZ` is assignable to both `NamedPoint` and `Point3D`. And that is the very definition of an intersection. Sure enough, `namedXYZ` is assignable to the intersection of these types, too:

```
const nycZ: Point3D & NamedPoint = namedXYZ; // ok!
```

This gives us a hint about what the intersection looks like:

```
interface NamedPoint3D {
  name: string;
  x: number;
  y: number;
  z: number;
}
```

This type is _also_ "open:" a `NamedPoint3D` might have more than these four fields. But it has to have at least these four.

To _intersect_ these two types, we _unioned_ their properties. We can see this in code using `keyof`:

```
type KN = {} & keyof NamedPoint;
//   ^? type KN = "name" | "x" | "y"
type K3 = {} & keyof Point3D;
//   ^? type K3 = "x" | "y" | "z"

type KI = keyof (NamedPoint & Point3D);
//   ^? type KI = "name" | "x" | "y" | "z"
type KU = (keyof NamedPoint) | (keyof Point3D)
//   ^? type KU = "name" | "x" | "y" | "z"
```

So `keyof (A&B) = (keyof A) | (keyof B)`!

(The weird `{} &` forces TypeScript to print out the results of `keyof`. I [wish](https://www.effectivetypescript.com/2022/02/25/gentips-4-display/#Exclude-lt-keyof-T-never-gt) this weren't necessary.)

What about the other relationship, `keyof (A|B)`? `keyof T` will only include a property if TypeScript can be sure that it will be present on values assignable to `T` (with a caveat, see below).

Again, let's make this more concrete with some examples:

```
const nyc: NamedPoint = {
  name: 'New York',
  x: -73,
  y: 40,
};
const pythagoras: Point3D = {
  x: 3,
  y: 4,
  z: 5,
};
```

To be assignable to `A|B`, a value must be assignable to either `A` or `B` (or both!). So these values are both assignable to `NamedPoint | Point3D`:

```
const u1: NamedPoint | Point3D = nyc; // ok
const u2: NamedPoint | Point3D = pythagoras; // ok
```

Thinking about `keyof`, which properties belong to both those objects? It's just `"x"` and `"y"`. And that's `keyof` for the union type:

```
type KU = keyof (NamedPoint | Point3D)
//   ^? type KU = "x" | "y"
type IK = (keyof NamedPoint) & (keyof Point3D)
//   ^? type IK = "x" | "y"
```

So `keyof (A|B) = (keyof A) & (keyof B)` and the equation holds.

Hopefully working through these examples with some concrete types makes the equations clearer. I really like them because they're concise but still manage to say a lot about how types work in TypeScript.

I mentioned one caveat, and it has to do with optional fields:

```
interface PartialPoint {
  x: number;
  y?: number;
}
type KP = {} & keyof PartialPoint;
//   ^? type KP = "x" | "y"
const justX: PartialPoint = { x: 10 };
```

`justX` is assignable to `PartialPoint`, but it doesn't have a `y` property, which you'd expect given the `keyof`.

Optional fields are a little strange when you think about types in a set-theoretic way. On the one hand, it's surprising that `keyof PartialPoint` includes `"y"` because values needn't have that property. On the other hand, it would be incredibly annoying if it didn't because `keyof` is so often used with [mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), and you'd really like to map over all the fields, not just the required ones.

At the end of the day, what's the difference between these two types?

```
interface JustX {
  x: number;
}
interface XMaybeY {
  x: number;
  y?: unknown;
}
```

I'll cryptically say "not much!" and leave it at that!