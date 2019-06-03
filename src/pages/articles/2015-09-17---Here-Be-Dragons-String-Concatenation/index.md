---
title: "Here be dragons: string concatenation"
date: "2015-09-17T00:00:00.000Z"
layout: post
draft: false
path: "/posts/here-be-dragons-string-concatenation/"
category: "Performance"
tags:
  - "C#"
  - "Performance"
description: "String concatenation can be done in several ways, each with their own advantages and usecases. In this blogpost I will take a closer look at 4 different ways of concatenating strings and how these are implemented internally. At the end of this post I hope I will have made clear when they are useful, when they are not and how they compare to eachother implementation-wise."
---

# Introduction
String concatenation can be done in several ways, each with their own advantages and usecases. In this blogpost I will take a closer look at 4 different ways of concatenating strings and how these are implemented internally. At the end of this post I hope I will have made clear when they are useful, when they are not and how they compare to eachother implementation-wise.

The approaches discussed are:

* Simple concatenation
* `string.Concat()`
* `StringBuilder`
* `string.Join()`


# Simple concatenation

```csharp
string a = "Hello" + "World";
```

String concatenation is commonly done using the `+` operator and passing one or two strings as its operands. Notice that something like `string a = "abc" + new FileLoadException();` is perfectly legal: you’ll see in a bit why this is.

You might have been wondering what happens exactly when you use this form of concatenation. In order to find out, we have to look at the generated IL code. Now, if you simply look at the generated IL given the string above you will notice that it looks like this:

```
IL_0000: nop
IL_0001: ldstr "HelloWorld"
IL_0006: stloc.0 // a
IL_0007: ret
```

Because our string concatenation is considered a so-called “compile-time constant expression” the compiler turns it into a single string for us already.

We can bypass this optimization by defining it as two separate variables and concatenating these:

```csharp
string x = "Hello";
string y = "World";
string a = x + y;
```

Looking at the IL again we now see this:

```
IL_0000: nop
IL_0001: ldstr "Hello"
IL_0006: stloc.0 // x
IL_0007: ldstr "World"
IL_000C: stloc.1 // y
IL_000D: ldloc.0 // x
IL_000E: ldloc.1 // y
IL_000F: call System.String.Concat
IL_0014: stloc.2 // a
IL_0015: ret
```

That’s more like it! We can tell from this that first the two strings are loaded into memory (separately!) and, more interestingly, they are put together using the `string.Concat()` method.


# string.Concat()
We’ve seen now that simple string concatenation results in a call to `string.Concat()`. Depending on the types passed in it will choose between `string.Concat(string, string)` (in the case of two strings) or `string.Concat(object, object)` (in the case of only one string). If you’ll replace the simple concatenation with a call to `string.Format()` you’ll notice that you receive the exact same IL.

At this point we can take a look at the internals and what goes on exactly. Looking at [the source code](https://github.com/dotnet/coreclr/blob/d176041723f366c35fd71ee4b176253fefddfee1/src/mscorlib/src/System/String.cs#L3011) of `string.Concat(object, object)` we can see it is a pass-through to `string.Concat(string, string)` by calling `ToString()` on both operands — even if one of these was already a string.

[Our next step](https://github.com/dotnet/coreclr/blob/d176041723f366c35fd71ee4b176253fefddfee1/src/mscorlib/src/System/String.cs#L3141) is more interesting: after the usual validation handling and fast tracks, we see a few very interesting methods being called:

```csharp
String result = FastAllocateString(str0Length + str1.Length);
FillStringChecked(result, 0, str0);
FillStringChecked(result, str0Length, str1);
```

`FastAllocateString(int)` is an external method that will allocate the space needed to concatenate both strings which is evidently the sum of their lengths. Afterwards, `FillStringChecked(string, int, string)` will copy the contents from the given string (third parameter) at a certain index into the aggregate one we just allocated. At this point the aggregate string is filled and can be returned to the caller. You might have noticed that `FastAllocateString` returns a string and not a `char` array. This is important because it changes the way we have to fill it: with a char array we would be able to simply access each entry directly and insert the correct value. However since it is a string we can (have to?) use an unsafe context and pull out some C to copy the contents into the correct memory location. This has as benefit that you don’t have to loop (explicitly) to move the string around.

## What about more concatenations?
If you look at the overloads you’ll notice that there are overloads with 2, 3 and 4 parameters and afer that you have to use the one with only one: a collection. We can see this in action when we try to concatenate 5 strings:

```csharp
string v = "Strings";
string w = "Are";
string x = "Fun";
string y = "Hello";
string z = "World";
string a = v + w + x + y + z;
```

generates as IL:

```
IL_0000:  nop
IL_0001:  ldstr       "Strings"
IL_0006:  stloc.0     // v
IL_0007:  ldstr       "Are"
IL_000C:  stloc.1     // w
IL_000D:  ldstr       "Fun"
IL_0012:  stloc.2     // x
IL_0013:  ldstr       "Hello"
IL_0018:  stloc.3     // y
IL_0019:  ldstr       "World"
IL_001E:  stloc.s     04 // z
IL_0020:  ldc.i4.5
IL_0021:  newarr      System.String
IL_0026:  dup
IL_0027:  ldc.i4.0
IL_0028:  ldloc.0     // v
IL_0029:  stelem.ref
IL_002A:  dup
IL_002B:  ldc.i4.1
IL_002C:  ldloc.1     // w
IL_002D:  stelem.ref
IL_002E:  dup
IL_002F:  ldc.i4.2
IL_0030:  ldloc.2     // x
IL_0031:  stelem.ref
IL_0032:  dup
IL_0033:  ldc.i4.3
IL_0034:  ldloc.3     // y
IL_0035:  stelem.ref
IL_0036:  dup
IL_0037:  ldc.i4.4
IL_0038:  ldloc.s     04 // z
IL_003A:  stelem.ref
IL_003B:  call        System.String.Concat
IL_0040:  stloc.s     05 // a
IL_0042:  ret
```

This clearly shows us a new array is created (see instruction `IL_0021`) which is then passed to the `string.Concat()` call.
The reason there are these specific overloads for 3 and 4 arguments is performance: the most common scenarios of concatenating values include 2, 3 or 4 operands and as such these are treated separatedly to get performance gains in the majority of cases.

For this implementation we have to take a look at the `string.Concat(params string[])` method. The implementation here is fairly straightforward: just as in the previous methods we calculate the total length of the resulting string and afterwards fill that up with the `string.ConcatArray(string[], int)` method. Also interesting to notice is the threading consideration by deep-copying the array of strings to a new, local one!

# StringBuilder
It’s time to add the notorious `StringBuilder` to the mix. We’ll work with a very simple scenario:

```csharp
StringBuilder sb = new StringBuilder();
sb.Append("Hello");
sb.Append("World");
string a = sb.ToString();
```

A `StringBuilder` is in essence a wrapper class around an array of chars and each time you append something to it, it inserts the given string’s content (aka: the chars) in the next available space in the `StringBuilder` array. This follows a similar idea to `string.Concat` but the big benefit here is that the resulting array is maintained over multiple calls instead of a single call. You might see where I’m going with this: `string.Concat()` creates a new string object for each call. A `StringBuilder` however only does this when its `ToString()` method is called regardless of how often you call `StringBuilder.Append()`. The more objects you allocate, the more you strain the garbage collector and the sooner you trigger a garbage collection. Nobody likes collecting garbage if it could have been prevented altogether.

The obvious real-life scenario is when you use a loop.

# string.Join()
Last but not least: `string.Join()`. Admittedly, this probably isn’t the usecase most people have in mind for this method but since it still fits, I thought it to be interesting to include in this overview. When we look at [the code](https://github.com/dotnet/coreclr/blob/d176041723f366c35fd71ee4b176253fefddfee1/src/mscorlib/src/System/String.cs#L156) we notice something interesting: it uses a `StringBuilder` internally!

I believe you’ll find this to be a common sight: many methods that have to concatenate strings use a StringBuilder internally.

# Conclusion
Reflecting on these four approaches we can group them under two actually different ones: `string.Concat()` and `StringBuilder`. We’ve also seen that `string.Concat()` creates a new string each time you concatenate it whereas `StringBuilder` delays this until the very end and only does it once. On the other hand: constructing a `StringBuilder` object, adding to it and then retrieving the result is much more verbose than a simple + operator.

You will have to decide for yourself what you consider acceptable but I personally only use `StringBuilder` when I loop over something. If I can do concatenating “manually” and it remains readable then it must mean there are so little strings that it would barely make a difference anyway (don’t forget that the `StringBuilder` is an object that needs to be allocated as well!).
