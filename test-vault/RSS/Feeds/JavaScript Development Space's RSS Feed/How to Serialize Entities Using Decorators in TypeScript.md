---
role: rssitem
author: Unknown
published: 2024-09-30T00:00:00.000Z
link: https://jsdev.space/howto/serialize-entities-typescript/
id: https://jsdev.space/howto/serialize-entities-typescript/
feed: "[[JavaScript Development Space's RSS Feed]]"
tags: []
pinned: false
---

> [!abstract] How to Serialize Entities Using Decorators in TypeScript - 2024-09-30T00:00:00.000Z
> <span class="rss-image">![image|400](./images/serialize-entities-typescript.png)</span> Serialization is the process of converting an object into a format that can be easily stored or transmitted and later reconstructed. In…

🔗Read article [online](https://jsdev.space/howto/serialize-entities-typescript/). For other items in this feed see [[JavaScript Development Space's RSS Feed]].

- [ ] [[How to Serialize Entities Using Decorators in TypeScript]]

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
Serialization is the process of converting an object into a format that can be easily stored or
transmitted and later reconstructed. In TypeScript, decorators provide a powerful way to modify or
annotate classes and their members. By combining decorators with serialization, you can streamline
the process of converting complex objects into JSON or other formats. This article will guide you
through the steps to serialize entities using decorators in TypeScript.

![How to Serialize Entities Using Decorators in TypeScript](./images/serialize-entities-typescript.png)

## Step 1: Setting Up TypeScript with Decorators

First, make sure you have TypeScript set up with experimental decorators enabled, as decorators are
still an experimental feature.

- Install TypeScript (if you haven't already):

<div className='code-cmd'>npm install typescript --save-dev</div>

- Enable decorators in your tsconfig.json:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Step 2: Understanding Decorators

Decorators are special functions that can be attached to classes, properties, methods, or
parameters. In the context of serialization, they allow you to control how a class or its properties
are serialized into a specific format (like JSON).

Decorators in TypeScript can be created using the `@` symbol followed by a function that takes
parameters related to the object being decorated.

## Step 3: Creating a Serialization Decorator

Let's start by creating a simple decorator that will mark specific class properties for
serialization.

```ts
function Serializable(target: any, key: string) {
  if (!target.constructor.serializableProperties) {
    target.constructor.serializableProperties = [];
  }
  target.constructor.serializableProperties.push(key);
}
```

Here, the **Serializable** decorator is used to mark properties in a class for serialization. The
target is the class, and key is the property name. We store all serializable properties in an array
attached to the class's constructor.

## Step 4: Applying the Decorator to a Class

Next, we create a class with properties marked for serialization using the **@Serializable**
decorator.

```ts
class User {
  @Serializable
  public firstName: string;

  @Serializable
  public lastName: string;

  public password: string; // We don't want to serialize this

  constructor(firstName: string, lastName: string, password: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }
}
```

In this example, the **firstName** and **lastName** properties are marked for serialization, but the
**password** field is excluded since we don't apply the **@Serializable** decorator to it.

## Step 5: Implementing the Serialization Logic

Now, let's add a function to serialize only the marked properties into JSON format.

```ts
function serialize(instance: any): string {
  const serializedData: any = {};
  const serializableProperties = instance.constructor.serializableProperties || [];

  serializableProperties.forEach((key: string) => {
    serializedData[key] = instance[key];
  });

  return JSON.stringify(serializedData);
}
```

The `serialize` function checks the class for properties that have been marked as serializable,
extracts their values, and converts them into a JSON string.

## Step 6: Serializing the Object

Finally, let’s serialize a **User** object and see how it works:

```ts
const user = new User('John', 'Doe', 'secretPassword');
const serializedUser = serialize(user);

console.log(serializedUser); // Output: {"firstName":"John","lastName":"Doe"}
```

As you can see, the **password** field is not included in the serialized output because it wasn’t
decorated with **@Serializable**.

## Step 7: Extending the Decorator for Advanced Serialization

You can enhance the `Serializable` decorator to handle more advanced cases, such as renaming
properties, setting custom rules, or handling nested objects. For instance, you can modify the
decorator to accept additional metadata:

```ts
function Serializable(alias?: string) {
  return function (target: any, key: string) {
    if (!target.constructor.serializableProperties) {
      target.constructor.serializableProperties = [];
    }
    target.constructor.serializableProperties.push({ key, alias: alias || key });
  };
}
```

This would allow you to rename properties during serialization:

```ts
class User {
  @Serializable('first_name')
  public firstName: string;

  @Serializable('last_name')
  public lastName: string;

  public password: string;
}
```

And the resulting JSON output will now have the renamed properties:

```ts
const user = new User('John', 'Doe', 'secretPassword');
const serializedUser = serialize(user);

console.log(serializedUser); // Output: {"first_name":"John","last_name":"Doe"}
```

## Conclusion

Decorators in TypeScript offer a powerful and flexible way to handle serialization by allowing you
to control which properties of an object should be serialized. With this approach, you can easily
exclude sensitive data, rename properties, and even extend the functionality to handle complex
nested structures.

By combining the power of decorators and serialization, you can ensure that your application's data
is securely and efficiently handled when converting objects to and from formats like JSON.