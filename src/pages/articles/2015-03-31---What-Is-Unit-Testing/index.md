---
title: "Introduction to Unit Testing: What is Unit Testing?"
date: "2015-03-31T00:00:00.000Z"
layout: post
draft: false
path: "/posts/what-is-unit-testing/"
category: "Testing"
tags:
  - "Unit Testing"
description: "A short introduction to unit testing"
---

# Introduction

Personally I love unit testing: it gives me peace of mind about all the code that I write and there is something very satisfying about seeing test after test succeed before I do a commit. With the continuously growing popularity of unit testing (not to mistake with Test Driven Development) more and more people want to get started with it but often don’t know how. Looking at it from an abstract point of view I can’t really blame them either: suddenly you’re writing snippets of code that are entirely separate from eachother.. but then again they’re not. There are a bunch of attributes and asserts that you typically don’t use, not to mention the way you might have to overhaul your existing codebase. Long story short: let’s introduce you to unit testing!

# What’s the use of unit testing?
One of the main concerns people tend to have is the additional development time: instead of writing tests you could have been implementing nifty feature X or Y. The thing is though that writing tests doesn’t have to take very long at all. Given a somewhat extensible structure of your test project writing a test really doesn’t have to take that long. Even for relatively simple features with many execution paths (like validating the model state in an ASP.NET application) the large amount of tests doesn’t necessarily have to indicate a long developing time.
Personally I find the most time consuming activities to be :

1. Finding out how a particular framework facilitates testing
2. Adapting unit tests to changing requirements

The first aspect you can’t really do anything about except search and hope someone wrote about it (like me!). Luckily the second option gives you more control: these effects can be diminished if you adhere to some guidelines which I will try to layout in this series.

Last but definitely not least: unit testing gives you confidence in your code, allows for comfortable refactoring and will spot bugs that you, your co-worker and your QA department missed but that the user will somehow uncover within 5 minutes.

# What makes a good unit test?
There are multiple aspects to what makes a good unit test and if just one of these is violated, their use lowers drastically. It is very important to keep these characteristics in mind or it will inevitably lead to a discontinuation of your unit test-writing. This can be either because of an increased cost (tests take longer) or it’s just not feasible anymore to execute or write them.

## Repeatable
This applies to location, time and input: if person A executes the test with input X then person B should be able to execute that test with the same input on his own machine and receive the same result. Of course this requires the code to be the same between both executions but if it is then the outcome of the test should stay consistent.

## Simple
Very few people want to write unit-tests when they are complex in nature and maintaining them after a code-change is equally little appealing. In order to protect ourselves from ourselves, you should strive to make the tests compact and adhere to the DRY – Don’t Repeat Yourself – principle, just like you would in normal code. This makes them easy to write and easy to adapt. At the same time you should also keep the tests clear enough so you can quickly discover what was expected, what was returned and where the problem originates.

## Isolated
Isolation is the key aspect of what differentiates a unit test from an integration test: one test can never influence another. This means they shouldn’t manipulate a common resource and that there can never be a requirement of the order in which they are in. This means that things like a static context or a database with persisting data are out of the question. It also indicates that each test should properly setup its prerequisites and not rely on that being done in a previous one.

## Quick
Nobody is going to wait 10 minutes for a single test: it hurts your development process and your continuous integration process. Executing code is in itself very fast (for human norms) so if you notice that your tests are taking a long time, it might indicate something is wrong. Unless you know you are testing intensive behaviour, a likely source of this might be dependencies that aren’t properly stubbed (more on this in a future post of this series).

# What is a unit exactly?
I once defined a unit as this:

> A unit is an extraction of your codebase that may or may not include multiple methods or classes that represents a single piece of functionality.

I place a particular emphasis on the “multiple methods or classes” aspect because many people seem to think that unit-testing means testing one method. This is not how I see it: a unit test can span multiple methods as long as it stays within the boundaries of the current system (otherwise you’re doing integration testing). What you should do however is create a test for each layer that you bridge, making sure that the logic contained in every aspect adds up correctly.

For example: I might have a test that verifies the result of something done in method `A()`. However aside from that, I also have a method `B()` that calls the former method `A()`. Even though the second test will span multiple methods, it is still one unit that will be tested.

## why don’t I just stick to the test on method `B()`? It covers both methods!

Indeed, it does. However if you would do this and the test fails, you won’t know if it happens in method `A()` or `B()`. On the other hand if you have a separate test for both units, you might notice that `A()` succeeds but `B()` doesn’t, indicating that the latter contains the problem. Likewise: if you have a third method `C()` that also calls `A()` then you have more specific knowledge of what might go wrong compared to just testing the “outer” methods.

This is in line with the “Simple” requirement as described above: by looking at two isolated tests their outcome, we are able to determine their common (or exclusive) point of failure.

# Conclusion
In this preliminary part of the series I hope I adequately described what I expect from a unit test and why it is important. In the next installments I will go deeper into actually writing a unit test as well as handling frequent issues like methods with a void return type or dependencies on external systems.