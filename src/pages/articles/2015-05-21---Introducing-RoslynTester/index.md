---
title: "Introducing: RoslynTester"
date: "2015-05-21T00:00:00.000Z"
layout: post
draft: false
path: "/posts/introducing-roslyntester/"
category: "Roslyn"
tags:
  - "C#"
  - "Roslyn"
  - "Unit Testing"
  - "Diagnostics"
description: "NuGet package to help you unit test your Roslyn-based analyzers"
---

When you create a new solution using the “Diagnostics and Code Fix” template, 3 projects will be created:

1. The portable class library which contains your analyzers and code fix providers,
2. A unit test project
3. A Vsix project to install them as an extension
If you look at the 2nd project you will notice that it creates a few files for you from the get-go: classes like `CodeFixVerifier`, `DiagnosticVerifier`, `DiagnosticResult`, etc.
These classes can be used to unit test your analyzers very easily: you pass in your test scenario as a string, specify the resulting diagnostic you expect, optionally provide a transformed code snippet in case of a code fix and that’s it: you’re done.

I was very pleased by what Microsoft provided but it left me with one annoying problem: that testing code will always stay the same unless I change it myself. Often this is an okay scenario but since Roslyn is under active development and the API can still change (and it does), this prevents me from upgrading. When you look at the version of the Roslyn binaries that are provided with that project template, you will notice that they are from Beta-1. At the time of writing, Roslyn has gone past that to Beta-2, RC1 and eventually RC2. Before I realized this, I took to the Roslyn issue tracker with a few issues that apparently couldn’t be reproduced. It was then that I realized that I might have an outdated installation.

When I upgraded from Beta-1 to RC2 (in intermediate stages) I noticed that some breaking changes were introduced: methods being renamed, types being removed, accessibility restricted, etc. This left me the choice between either diving in that code or sticking to an outdated API (with bugs). The choice wasn’t very hard and I managed to get everything working with the RC2 API. However because of the outdated project template I don’t want to have to manually update those files every time (and I wouldn’t want to force you to do it too either)!

Therefore I present to you: **[RoslynTester](https://www.nuget.org/packages/RoslynTester)**!

This small NuGet package is exactly what you think it is: those few classes cleaned up and put inside a NuGet package. Now I (and you) can simply remove the auto-generated test files and instead simply reference this package to get all the testing capabilities. I will try to keep this up-to-date with the most recent Roslyn NuGet package so none of this should be a problem anymore. If I come across scenarios where I can expand on it, I will do that too of course. In case you are interested in contributing something, feel free to take a look at [the Github page](https://github.com/Vannevelj/RoslynTester)!

Sidenote: if the NuGet package doesn’t show up in your NuGet browser, go to your settings and enable the NuGet v2 package feed. I’m still figuring out NuGet and for some reason it only shows up there.