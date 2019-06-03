---
title: "Introducing: VSDiagnostics"
date: "2015-05-24T00:00:00.000Z"
layout: post
draft: false
path: "/posts/introducing-vsdiagnostics/"
category: "Roslyn"
tags:
  - "C#"
  - "Roslyn"
  - "Visual Studio"
  - "Diagnostics"
description: "I am happy to announce the first release of VSDiagnostics! This project is a group of diagnostics meant for Visual Studio 2015 and up which will help the developer adhere to best practices and avoid common pitfalls."
---

I am happy to announce the first release of [VSDiagnostics](https://github.com/Vannevelj/VSDiagnostics)! This project is a group of diagnostics meant for Visual Studio 2015 and up which will help the developer adhere to best practices and avoid common pitfalls.

These are a few examples of the scenarios currently supported:

## `if` statements without braces

![If statements without braces](./if-without-braces.gif)

##  `String.Empty` instead of an empty string
![String.Empty instead of an empty string](./string-dot-empty.gif)

##  `ArgumentException` that can use `nameof()`
![ArgumentException that can use nameof()](./argumentexception-without-nameof.gif)

##  A `catch` clause that catches a `NullReferenceException`
![A catch clause that catches a NullReferenceException](./catch-clause-catching-nullreferenceexception.gif)

##  Throwing an empty `ArgumentException`
![Throwing an empty ArgumentException](./throwing-empty-argumentexception.gif)

##  Catching `Exception` without other `catch` clauses
![Catching Exception without other catch clauses](./catching-exception-without-other-clauses.gif)

And many more!

For the full list, take a look at [the Github page](https://github.com/Vannevelj/VSDiagnostics). If you have a suggestion in mind or you are interested in contributing, let me know: I want this to be a community powered project. I hope this first release already proves helpful to you and I’m eager to hear your feedback and criticism.

# How do I use this?
Simply create a new project using Visual Studio 2015 RC and add [the NuGet package](https://www.nuget.org/packages/VSDiagnostics/0! If you don’t find it: make sure you’re also looking in the NuGet V2 package source.