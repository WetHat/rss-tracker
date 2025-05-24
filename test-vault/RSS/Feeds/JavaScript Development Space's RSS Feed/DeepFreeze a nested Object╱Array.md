---
role: rssitem
aliases:
  - DeepFreeze a nested Object/Array
id: https://jsdev.space/snippets/deepfreeze-js/
author: unknown
link: https://jsdev.space/snippets/deepfreeze-js/
published: 2024-09-29T00:00:00.000Z
feed: "[[RSS/Feeds/JavaScript Development Space's RSS Feed.md | JavaScript Development Space's RSS Feed]]"
tags: []
pinned: false
---

> [!abstract] DeepFreeze a nested Object/Array (by unknown)
> ![[RSS/assets/RSSdefaultImage.svg|float:right|100x100]] To deeply freeze a nested object or array in JavaScript, you need to freeze not only the outer object but also any nested objects or arrays.…

🌐 Read article [online](https://jsdev.space/snippets/deepfreeze-js/). ⤴ For other items in this feed see [[RSS/Feeds/JavaScript Development Space's RSS Feed.md | JavaScript Development Space's RSS Feed]].

- [ ] [[RSS/Feeds/JavaScript Development Space's RSS Feed/DeepFreeze a nested Object╱Array|DeepFreeze a nested Object╱Array]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -

To deeply freeze a nested object or array in JavaScript, you need to freeze not only the outer
object but also any nested objects or arrays. You can achieve this by creating a recursive function
that applies **Object.freeze()** to all levels of the object.

Here’s an example of how to implement deep freezing:

## DeepFreeze Function

```js
function deepFreeze(obj) {
  // Retrieve the property names defined on the object
  const propNames = Object.getOwnPropertyNames(obj);

  // Freeze properties before freezing the object itself
  for (let name of propNames) {
    let prop = obj[name];

    // If the property is an object, freeze it recursively
    if (typeof prop === 'object' && prop !== null) {
      deepFreeze(prop);
    }
  }

  // Finally, freeze the outer object (non-recursive objects will stop here)
  return Object.freeze(obj);
}
```

**Usage Example**

```js
const person = {
  name: 'John',
  address: {
    city: 'New York',
    zip: 10001,
  },
  hobbies: ['reading', 'gaming'],
};

// Deep freeze the person object
deepFreeze(person);

// Trying to modify properties
person.name = 'Jane'; // Won't work
person.address.city = 'Los Angeles'; // Won't work
person.hobbies.push('cycling'); // Won't work

console.log(person);
// Output: { name: 'John', address: { city: 'New York', zip: 10001 }, hobbies: [ 'reading', 'gaming' ] }
```

### How It Works:

- The **deepFreeze()** function freezes the object itself, and for each property that is an object
  (or array), it recursively freezes those as well.
- The function ensures that all levels of the object/array hierarchy are made immutable, preventing
  any modifications.

This method ensures full immutability for complex objects with nested structures.