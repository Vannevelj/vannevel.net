---
title: "RoslynTester"
date: "2015-05-21T00:00:00.000Z"
layout: project
draft: false
path: "/projects/roslyntester/"
category: "DevTools"
tags:
  - "C#"
  - "Roslyn"
  - "Unit Testing"
description: "NuGet package to help you unit test your Roslyn-based analyzers"
url: https://github.com/Vannevelj/RoslynTester
---

# RoslynTester

A library that will help you unit test your Roslyn analyzers. This package contains the default test helpers provided with the Diagnostics + CodeFix solution template but updated for the latest version of Roslyn and with a few enhancements.

**NuGet**

https://www.nuget.org/packages/RoslynTester/

[![Build status](https://ci.appveyor.com/api/projects/status/3x918k5jre5imjjn?svg=true)](https://ci.appveyor.com/project/Vannevelj/roslyntester)
[![Test status](https://teststatusbadge.azurewebsites.net/api/status/Vannevelj/roslyntester)](https://ci.appveyor.com/project/Vannevelj/roslyntester)


## Why should I use this?

The CodeFix + Diagnostics solution template is not updated at the same speed as Roslyn is. This means that if you want to test your analyzers, you are stuck with the older version of Roslyn which might (will?) contain bugs that have been fixed in later versions.

By providing these classes as a NuGet package I achieve two solutions:

* When you have an existing analyzer and want to update to a new version of Roslyn, you don't have to worry about backwards-compatibility issues introduced by a newer version.
* When you start a new project you can get started right away with the latest version of Roslyn by removing the default test files and including this package.