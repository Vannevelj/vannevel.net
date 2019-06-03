---
title: "A few important Roslyn API helpers"
date: "2015-06-07T00:00:00.000Z"
layout: post
draft: false
path: "/posts/a-few-important-roslyn-api-helpers/"
category: "Roslyn"
tags:
  - "NuGet"
  - "MSBuild"
  - "Visual Studio"
description: "The Roslyn API as implemented in RC2 has been out for a few months now and is likely to remain largely unchanged while they’re working on getting it released officially. I think it might be time to do a little write-up and identify the key-components of that API that you likely want to use when building your own diagnostics, syntax writers or anything else possible with the platform."
---

# Introduction
The Roslyn API as implemented in RC2 has been out for a few months now and is likely to remain largely unchanged while they’re working on getting it released officially. I think it might be time to do a little write-up and identify the key-components of that API that you likely want to use when building your own diagnostics, syntax writers or anything else possible with the platform. Do note that I am approaching this with only a background in writing diagnostics so I might be missing out on helpers from a different spectrum of the API.

I, too, still come across a new API which I wasn’t aware of before so if you know of something that’s not here, let me know.

# SyntaxFactory
If you’ve ever tried to create your own syntax node, you’ll have noticed that you can’t just `new()` it up. Instead, we use the `SyntaxFactory` class which provides methods to create just about every kind of node you could imagine. A particularly interesting method here is `SyntaxFactory.Parse*`. This can take away a lot of pain involved in manually creating syntax nodes. For example in one of my diagnostics I wanted to create a condition that checks a certain variable and compares it to `null`. I could either create a `BinaryExpression`, set its operator to `SyntaxFactory.Token(SyntaxKind.ExclamationEqualsToken)`, create an identifier using `SyntaxFactory.Identifier` and eventually add the `null` token using `SyntaxFactory.Token(SyntaxKind.NullKeyword)`.

Or I could just write `SyntaxFactory.ParseExpression($"{identifier} != null");`.

I won’t pretend there aren’t any performance implications of course but sometimes it’s hard to contain myself when I can write something really readable like this. I know, shame on me.

# SyntaxToken
This one is closely related to a `SyntaxNode` but represents certain aspects of it: the `SyntaxNode.Modifiers` property, in the case of – say – a method, will be a list of `SyntaxToken` objects. These, too, are created using `SyntaxFactory.Token()`.

# SyntaxKind
This enum represents certain aspects of the syntax. Think of keywords, carriage returns, semicolons, comments, certain expressions or statements like `a++`, etc. You will also use this to construct certain tokens by passing them as an argument to `SyntaxFactory.Token(SyntaxKind)`. Notice how the API is coming together? Eventually, it will allow you to create a new syntax tree with a fairly fluent API — and which is very readable!

# Formatter
We all like our code properly formatted and thankfully, we can let Roslyn do that for us! There are a few approaches here: if you’re using a Code Fix then all you need to do is tell Roslyn which nodes you want formatted and the Code Fix will call the formatter for you when reconstructing the tree. You can do this by calling `.WithAdditionalAnnotations(Formatter.Annotation)` on any node you want formatted. If you’re in an environment that doesn’t do this for you, simply call `Formatter.FormatAsync()` (or its synchronous sibling). You can choose to use the annotation (which I highly recommend because of its ease-of-use) or you can specify the area to format through `TextSpan` objects (which each node has as a property).

# DocumentEditor
This is one of those helpers that eluded me for a while. So far I have come across two major ways of creating the new syntax tree: either you change the syntax nodes themselves (though technically they return a new node with similar data considering everything is immutable) by calling `.Replace*`, `.Insert*` or `.Remove*` or you use the wonderful `DocumentEditor` class which takes away a lot of the pain from this process.

Certainly when you have multiple transformations to the document, this comes in really handy. If you’re going to change individual syntax nodes then the benefits don’t seem that big but once you start having more than just that one node then you quickly see lines of code decreasing by 50% or more (and the complexity follows a similar line). Another important note: if you want to change multiple syntax nodes on the same level in the tree (for example: two methods in the same class) then adapting one of them will invalidate the other one’s location if you add or remove characters. This will cause problems when you rewrite the tree: if changing method 1 creates a new tree with a few more characters to that method, method 2 will try to replace the tree at the wrong location. This might sound rather vague but if you ever have this problem, you will instantly recognize it. Suffice it to say that `DocumentEditor` takes care of this for you.

# .With*
You’ve already seen `.WithAdditionalAnnotations()` to, well, add additional annotations to your node, token or trivia. Keep an eye on this pattern of `.With*` extension methods, you might find them to be very useful. Certainly when you’re constructing a new statement/expression/member/whatever which consists of multiple aspects, you’ll find these things. For example as part of my diagnostic that turns a single-line return method in an expression-bodied member (aka: `int Method() => 42;`) I had to use the existing method and turn it into a new one with this specific syntax. The code for this became very fluent to read through these statements:

```csharp
root = root.ReplaceNode(method, method.RemoveNode(method.Body, SyntaxRemoveOptions.KeepExteriorTrivia)
                                      .WithExpressionBody(arrowClause)
                                      .WithSemicolonToken(SyntaxFactory.Token(SyntaxKind.SemicolonToken))
                                      .WithTrailingTrivia(trailingTrivia));
```

# RoslynQuoter
This isn’t exactly part of the API but it is so powerful that I can’t omit it. The [RoslynQuoter](http://roslynquoter.azurewebsites.net/) tool developed by [Kirill Osenkov](https://twitter.com/KirillOsenkov) is absolutely amazing to work with. If you ever want to know how the tree for a certain snippet of code looks, simply put it in the tool and you get a detailed view of how it’s built up. Without this, I would have many extra hours of work trying to figure out how a tree looks by using the debugger to look at each node’s `.Parent` property. Luckily, no more!

---

I hope this helps you get started (or expands your knowledge) of important parts of the Roslyn API. If you’re interested in reading through more complete examples, you can always take a look at [VSDiagnostics](https://github.com/Vannevelj/VSDiagnostics).