---
role: rssitem
author: "David Pine"
published: 2024-05-08T17:05:00.000Z
link: https://devblogs.microsoft.com/dotnet/refactor-your-code-with-collection-expressions/
id: https://devblogs.microsoft.com/dotnet/?p=51745
feed: "[[․NET Blog]]"
tags: [rss/C＃,rss/_NET,rss/_net_8,rss/c＃_12]
pinned: false
---

> [!abstract] Refactor your code with C# collection expressions by David Pine - 2024-05-08T17:05:00.000Z
> ![image|float:right|400](https://s.w.org/images/core/emoji/15.0.3/72x72/1f3a8.png) Explore various C# 12 refactoring scenarios for a variety of target types using collection expressions, collection initializers, and the spread syntax.
> 
> The post [Refactor your code with C# collection expressions](https://devblogs.microsoft.com/dotnet/refactor-your-code-with-collection-expressions/) appeared first on [.NET Blog](https://devblogs.microsoft.com/dotnet).

🌐 Read article [online](https://devblogs.microsoft.com/dotnet/refactor-your-code-with-collection-expressions/). ⤴ For other items in this feed see `= this.feed`.

- [ ] [[Refactor your code with C＃ collection expressions]]

~~~dataviewjs
const dvjs = dv.app.plugins.plugins["rss-tracker"].getDVJSTools(dv);
dvjs.rssItemHeader(dv.current());
~~~

- - -
This post is the second in a series of posts covering various refactoring scenarios that explore C# 12 features. In this post, we’ll look at how you can refactor your code using collection expressions, we’ll learn about collection initializers, various expression usages, supported collection target types, and the spread syntax. Here’s how the series is shaping up:

1. [Refactor your C# code with primary constructors](https://devblogs.microsoft.com/dotnet/csharp-primary-constructors-refactoring/)
2. Refactor your C# code with collection expressions (this post)
3. Refactor your C# code by aliasing any type
4. Refactor your C# code to use default lambda parameters

These features continue our journey to make our code more readable and maintainable, and these are considered “Everyday C#” features that developers should know.

## Collection Expressions ![🎨](https://s.w.org/images/core/emoji/15.0.3/72x72/1f3a8.png)

C# 12 introduced collection expressions that offer a _simple and consistent syntax_ across many different collection types. When initializing a collection with a collection expression, the compiler generates code that is functionally equivalent to using a collection initializer. The feature emphasizes _consistency_, while allowing for the compiler to optimize the lowered C#. Of course, every team decides what new features to adopt, and you can experiment and introduce this new syntax if you like it, since all of the previous ways to initialize collections will continue to work.

With collections expressions elements appear inlined sequences of elements between an opening `[` and closing `]` bracket. Read on to hear more about how collection expressions work.

### Initialization ![🌱](https://s.w.org/images/core/emoji/15.0.3/72x72/1f331.png)

C# provides many syntaxes for initializing different collections. Collection expressions replace all of these, so let’s start with a look at different ways you can initialize an array of integers like this:

```csharp
var numbers1 = new int[3] { 1, 2, 3 };

var numbers2 = new int[] { 1, 2, 3 };

var numbers3 = new[] { 1, 2, 3 };

int[] numbers4 = { 1, 2, 3 };
```

All four versions are functionally equivalent, and the compiler generates identical code for each version. The last example is similar to the new collection expressions syntax. If you squint your eyes a bit, you could imagine the curly braces as `{` and `}` as square brackets `[` and `]`, then you’d be reading the new collection expression syntax. Collection expressions don’t use curly braces. This is to avoid ambiguity with existing syntax, especially `{ }` to indicate any not-null in patterns.

The last example is the only to declare the type explicitly, instead of relying on `var`. The following example creates a `List<char>`:

```csharp
List<char> david = [ 'D', 'a', 'v', 'i', 'd' ];
```

Again, collection expressions cannot be used with the `var` keyword. You must declare the type because a collection expression doesn’t currently have a _natural_ type and can be converted to a wide variety of [collection types](#supported-collection-types-). Supporting assignment to `var` is still under consideration, but the team has not settled on the what the natural type should be. In other words, the C# compiler errors out with CS9176: There is no target type for the collection expression, when writing the following code:

```csharp
// Error CS9176: There is no target type for the collection expression
var collection = [1, 2, 3];
```

You might be asking yourself, “with all these different approaches to initializing collections, why would I use the new collection expression syntax?” The answer is that with collection expressions, you can use the same syntax to express collections in a consistent way. This can help to make your code more readable and maintainable. We’ll explore more advantages in the coming sections.

### Collection expression variations ![🎭](https://s.w.org/images/core/emoji/15.0.3/72x72/1f3ad.png)

You can express that a collection is _empty_, using the following syntax:

```csharp
int[] emptyCollection = [];
```

The empty collection expression initialization is a great replacement for code that was otherwise using the `new` keyword, as it’s optimized by the compiler to avoid allocating memory for some collection types. For example, when the collection type is an array `T[]`, the compiler generates an `Array.Empty<T>()`, which is more efficient than `new int[] { }`. Another shortcut is to use the number of elements in the collection expression to set the collection size, such as `new List<int>(2)` for `List<T> x = [1, 2];`.

Collection expressions also allow you to assign to interfaces without stating an explicit type. The compiler determines the type to use for types, such as `IEnumerable<T>`, `IReadOnlyList<T>`, and `IReadOnlyCollection<T>`. If the actual type used is important, you’ll want to state it because this may change if more efficient types become available. Likewise, in situations where the compiler cannot generate more efficient code, for example when the collection type is a `List<T>`, the compiler generates a `new List<int>()`, which is then equivalent.

The advantages of using the empty collection expression are threefold:

- It provides a consistent means of initializing all collections, regardless of their target type.
- It allows the compiler to generate efficient code.
- It’s less code to write. For example, instead of writing `Array.Empty<T>()` or `Enumerable.Empty<T>()`, you can simply write `[]`.

A few more details about the efficient generated code: using the `[]` syntax generates known IL. This allows the runtime to optimize by reusing the storage for `Array.Empty<T>` (for each `T`), or even more aggressively inline the code.

Empty collections serve their purpose, but you may need a collection that has some initial values. You can initialize a collection with a single element, using the following syntax:

```csharp
string[] singleElementCollection =
[
    "one value in a collection"
];
```

Initializing a single element collection is similar to initializing a collection with more than a single element. You can initialize a collection with multiple elements by adding other literal values, using the following syntax:

```csharp
int[] multipleElementCollection = [1, 2, 3 /* any number of elements */];
```

**A bit of history**

---

Early proposals of the feature included the phrase “collection literals”—and you’ve probably heard that term in relation to this feature. Which seems obvious and logical, especially considering the previous few examples. All of the elements were expressed as literal values. But you’re not limited to using literals. In fact, you can just as easily initialize a collection with variables, so long as the types correspond (and when they do not, there’s an implicit conversion available).

Let’s look at another code sample, but this uses _spread element_, to include the elements of another collection, using the following syntax:

```csharp
int[] oneTwoThree = [1, 2, 3];
int[] fourFiveSix = [4, 5, 6];

int[] all = [.. fourFiveSix, 100, .. oneTwoThree];

Console.WriteLine(string.Join(", ", all));
Console.WriteLine($"Length: {all.Length}");
// Outputs:
//   4, 5, 6, 100, 1, 2, 3
//   Length: 7
```

The spread element is a powerful feature that allows you to include the elements of another collection in the current collection. The spread element is a great way to combine collections in a concise way. The expression in a spread element must be enumerable (`foreach`-able). For more information, see the [Spread ![✨](https://s.w.org/images/core/emoji/15.0.3/72x72/2728.png)](#spread-) section.

### Supported collection types ![🎯](https://s.w.org/images/core/emoji/15.0.3/72x72/1f3af.png)

There are many target types that collection expressions can be used with. The feature recognizes the “shape” of a type that represents a collection. Therefore, most collections you’re familiar with are supported out-of-the-box. For types that don’t match that “shape” (mostly readonly collections), there are attributes you can apply to describe the builder pattern. The collection types in the BCL that needed the attributes/builder pattern approaches, have already been updated.

It’s unlikely that you’ll ever need to think about how target types are selected, but if you are curious about the rules see the [C# Language Reference: Collection expressions—conversions](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/collection-expressions#conversions).

Collection expressions don’t yet support dictionaries. You can find a proposal to extend the feature [C# Feature Proposal: Dictionary expressions](https://github.com/dotnet/csharplang/issues/7822).

### Refactoring scenarios ![🛠](https://s.w.org/images/core/emoji/15.0.3/72x72/1f6e0.png)

Collection expressions can be useful in many scenarios, such as:

- Initializing empty collections that declare non-nullable collection types:
    - fields.
    - properties.
    - local variables.
    - method parameters.
    - return values.
    - a coalescing expression as the final fallthrough to safely avoid exceptions.
- Passing arguments to methods that expect collection type parameters.

Let’s use this section to explore some sample usage scenarios, and consider potential refactoring opportunities. When you define a `class` or `struct` that contains fields and/or properties with non-nullable collection types, you can initialize them with collection expressions. For example, consider the following example `ResultRegistry` object:

```csharp
namespace Collection.Expressions;

public sealed class ResultRegistry
{
    private readonly HashSet<Result> _results = new HashSet<Result>();

    public Guid RegisterResult(Result result)
    {
        _ = _results.Add(result);

        return result.Id;
    }

    public void RemoveFromRegistry(Guid id)
    {
        _ = _results.RemoveWhere(x => x.Id == id);
    }
}

public record class Result(
    bool IsSuccess,
    string? ErrorMessage)
{
    public Guid Id { get; } = Guid.NewGuid();
}
```

In the preceding code, the result registry class contains a private `_results` field that is initialized with a `new HashSet<Result>()` constructor expression. In your IDE of choice (that supports these refactoring features), right-click on the `new` keyword, select `Quick Actions and Refactorings...` (or press Ctrl + .), and choose `Collection initialization can be simplified`, as shown in the following video:

[https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2024/05/refactor-simplify-collection.mp4](https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2024/05/refactor-simplify-collection.mp4)

The code is updated to use the collection expression syntax, as shown in the following code:

```csharp
private readonly HashSet<Result> _results = [];
```

The previous code, instantiated the `HashSet<Result>` with the `new HashSet<Result>()` constructor expression. However, in this case `[]` is identical.

## Spread ![✨](https://s.w.org/images/core/emoji/15.0.3/72x72/2728.png)

Many popular programming languages such as Python and JavaScript/TypeScript, among others provide their variation of the _spread_ syntax, which serves as a succinct way to work with collections. In C#, the _spread element_ is the syntax used to express the concatenation of various collections into a single collection.

**Proper terminology**

---

The _spread element_ is often confused with the term “spread operator”. In C#, there’s no such thing as a “spread operator”. The `..` expression isn’t an operator, it’s an expression that’s part of the _spread element_ syntax. By definition, this syntax doesn’t align with that of an operator, as it doesn’t perform an operation on its operands. For example, the `..` expression already exists with the _slice pattern_ for ranges and it’s also found in [list patterns](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/patterns#list-patterns).

So what exactly is _spread element_? It takes the individual values from the collection being “spread” and places them in the destination collection at that position. The _spread element_ functionality also comes with a refactoring opportunity. If you have code that calls `.ToList` or `.ToArray`, or you want to use eager evaluation, your IDE might be suggesting to use the _spread element_ syntax instead. For example, consider the following code:

```csharp
namespace Collection.Expressions;

public static class StringExtensions
{
    public static List<Query> QueryStringToList(this string queryString)
    {
        List<Query> queryList = (
            from queryPart in queryString.Split('&')
            let keyValue = queryPart.Split('=')
            where keyValue.Length is 2
            select new Query(keyValue[0], keyValue[1])
        )
        .ToList();

        return queryList;
    }
}

public record class Query(string Name, string Value);
```

The preceding code could be refactored to use the _spread element_ syntax, consider the following code that removes the `.ToList` method call, and uses an expression-bodied method as a bonus refactored version:

```csharp
public static class StringExtensions
{
    public static List<Query> QueryStringToList(this string queryString) =>
    [
        .. from queryPart in queryString.Split('&')
           let keyValue = queryPart.Split('=')
           where keyValue.Length is 2
           select new Query(keyValue[0], keyValue[1])
    ];
}
```

## `Span<T>` and `ReadOnlySpan<T>` support ![📏](https://s.w.org/images/core/emoji/15.0.3/72x72/1f4cf.png)

Collection expressions support `Span<T>` and `ReadOnlySpan<T>` types that are used to represent a contiguous region of arbitrary memory. You benefit from the performance improvements they offer, even if you don’t use them directly in your code. Collection expressions allow the runtime to offer optimizations, especially where overloads using span can be selected when collection expressions are used as arguments.

You can also assign directly to span, if your application uses spans:

```csharp
Span<int> numbers = [1, 2, 3, 4, 5];
ReadOnlySpan<char> name = ['D', 'a', 'v', 'i', 'd'];
```

If you’re using the `stackalloc` keyword, there’s even a provided refactoring to use collection expressions. For example, consider the following code:

```csharp
namespace Collection.Expressions;

internal class Spans
{
    public void Example()
    {
        ReadOnlySpan<byte> span = stackalloc byte[10]
        {
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        };

        UseBuffer(span);
    }

    private static void UseBuffer(ReadOnlySpan<byte> span)
    {
        // TODO:
        //   Use the span...

        throw new NotImplementedException();
    }
}
```

If you right-click on the `stackalloc` keyword, select `Quick Actions and Refactorings...` (or press Ctrl + .), and choose `Collection initialization can be simplified`, as shown in the following video:

[https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2024/05/refactor-collection-ex.mp4](https://devblogs.microsoft.com/dotnet/wp-content/uploads/sites/10/2024/05/refactor-collection-ex.mp4)

The code is updated to use the collection expression syntax, as shown in the following code:

```csharp
namespace Collection.Expressions;

internal class Spans
{
    public void Example()
    {
        ReadOnlySpan<byte> span =
        [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ];

        UseBuffer(span);
    }

    // Omitted for brevity...
}
```

For more information, see [`Memory<T>` and `Span<T>` usage guidelines](https://learn.microsoft.com/dotnet/standard/memory-and-spans/memory-t-usage-guidelines).

## Semantic considerations ![⚙](https://s.w.org/images/core/emoji/15.0.3/72x72/2699.png)

When initializing a collection with a collection expression, the compiler generates code that is functionally equivalent to using a collection initializer. Sometimes the generated code is much more efficient than using a collection initializer. Consider the following example:

```csharp
List<int> someList = new() { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
```

The rules for a collection initializer _require_ that the compiler call the `Add` method for each element in the initializer. However, if you’re to use the collection expression syntax:

```csharp
List<int> someList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
```

The compiler generates code that instead uses `AddRange`, that might be faster or better optimized. The compiler is able to make these optimizations because it knows the target type of the collection expression.

## Next steps ![🚀](https://s.w.org/images/core/emoji/15.0.3/72x72/1f680.png)

Be sure to try this out in your own code! Check back soon for the next post in this series, where we’ll explore how to refactor your C# code by aliasing any type. In the meantime, you can learn more about collection expressions in the following resources:

- [C# Feature Proposal: Collection expressions](https://learn.microsoft.com/dotnet/csharp/language-reference/proposals/csharp-12.0/collection-expressions)
- [C# Language Reference: Collection expressions](https://learn.microsoft.com/dotnet/csharp/language-reference/operators/collection-expressions)
- [C# Docs: Collections](https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/collections)

The post [Refactor your code with C# collection expressions](https://devblogs.microsoft.com/dotnet/refactor-your-code-with-collection-expressions/) appeared first on [.NET Blog](https://devblogs.microsoft.com/dotnet).