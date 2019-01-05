webpackJsonp([0xccdcaba54582],{429:function(e,t){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"C:/Source/vannevelj.github.io/lumen/src/pages/articles/2015-06-07---A-Few-Important-Roslyn-Api-Helpers/index.md absPath of file >>> MarkdownRemark",html:'<h1>Introduction</h1>\n<p>The Roslyn API as implemented in RC2 has been out for a few months now and is likely to remain largely unchanged while they’re working on getting it released officially. I think it might be time to do a little write-up and identify the key-components of that API that you likely want to use when building your own diagnostics, syntax writers or anything else possible with the platform. Do note that I am approaching this with only a background in writing diagnostics so I might be missing out on helpers from a different spectrum of the API.</p>\n<p>I, too, still come across a new API which I wasn’t aware of before so if you know of something that’s not here, let me know.</p>\n<h1>SyntaxFactory</h1>\n<p>If you’ve ever tried to create your own syntax node, you’ll have noticed that you can’t just <code class="language-text">new()</code> it up. Instead, we use the <code class="language-text">SyntaxFactory</code> class which provides methods to create just about every kind of node you could imagine. A particularly interesting method here is <code class="language-text">SyntaxFactory.Parse*</code>. This can take away a lot of pain involved in manually creating syntax nodes. For example in one of my diagnostics I wanted to create a condition that checks a certain variable and compares it to <code class="language-text">null</code>. I could either create a <code class="language-text">BinaryExpression</code>, set its operator to <code class="language-text">SyntaxFactory.Token(SyntaxKind.ExclamationEqualsToken)</code>, create an identifier using <code class="language-text">SyntaxFactory.Identifier</code> and eventually add the <code class="language-text">null</code> token using <code class="language-text">SyntaxFactory.Token(SyntaxKind.NullKeyword)</code>.</p>\n<p>Or I could just write <code class="language-text">SyntaxFactory.ParseExpression($&quot;{identifier} != null&quot;);</code>.</p>\n<p>I won’t pretend there aren’t any performance implications of course but sometimes it’s hard to contain myself when I can write something really readable like this. I know, shame on me.</p>\n<h1>SyntaxToken</h1>\n<p>This one is closely related to a <code class="language-text">SyntaxNode</code> but represents certain aspects of it: the <code class="language-text">SyntaxNode.Modifiers</code> property, in the case of – say – a method, will be a list of <code class="language-text">SyntaxToken</code> objects. These, too, are created using <code class="language-text">SyntaxFactory.Token()</code>.</p>\n<h1>SyntaxKind</h1>\n<p>This enum represents certain aspects of the syntax. Think of keywords, carriage returns, semicolons, comments, certain expressions or statements like <code class="language-text">a++</code>, etc. You will also use this to construct certain tokens by passing them as an argument to <code class="language-text">SyntaxFactory.Token(SyntaxKind)</code>. Notice how the API is coming together? Eventually, it will allow you to create a new syntax tree with a fairly fluent API — and which is very readable!</p>\n<h1>Formatter</h1>\n<p>We all like our code properly formatted and thankfully, we can let Roslyn do that for us! There are a few approaches here: if you’re using a Code Fix then all you need to do is tell Roslyn which nodes you want formatted and the Code Fix will call the formatter for you when reconstructing the tree. You can do this by calling <code class="language-text">.WithAdditionalAnnotations(Formatter.Annotation)</code> on any node you want formatted. If you’re in an environment that doesn’t do this for you, simply call <code class="language-text">Formatter.FormatAsync()</code> (or its synchronous sibling). You can choose to use the annotation (which I highly recommend because of its ease-of-use) or you can specify the area to format through <code class="language-text">TextSpan</code> objects (which each node has as a property).</p>\n<h1>DocumentEditor</h1>\n<p>This is one of those helpers that eluded me for a while. So far I have come across two major ways of creating the new syntax tree: either you change the syntax nodes themselves (though technically they return a new node with similar data considering everything is immutable) by calling <code class="language-text">.Replace*</code>, <code class="language-text">.Insert*</code> or <code class="language-text">.Remove*</code> or you use the wonderful <code class="language-text">DocumentEditor</code> class which takes away a lot of the pain from this process.</p>\n<p>Certainly when you have multiple transformations to the document, this comes in really handy. If you’re going to change individual syntax nodes then the benefits don’t seem that big but once you start having more than just that one node then you quickly see lines of code decreasing by 50% or more (and the complexity follows a similar line). Another important note: if you want to change multiple syntax nodes on the same level in the tree (for example: two methods in the same class) then adapting one of them will invalidate the other one’s location if you add or remove characters. This will cause problems when you rewrite the tree: if changing method 1 creates a new tree with a few more characters to that method, method 2 will try to replace the tree at the wrong location. This might sound rather vague but if you ever have this problem, you will instantly recognize it. Suffice it to say that <code class="language-text">DocumentEditor</code> takes care of this for you.</p>\n<h1>.With*</h1>\n<p>You’ve already seen <code class="language-text">.WithAdditionalAnnotations()</code> to, well, add additional annotations to your node, token or trivia. Keep an eye on this pattern of <code class="language-text">.With*</code> extension methods, you might find them to be very useful. Certainly when you’re constructing a new statement/expression/member/whatever which consists of multiple aspects, you’ll find these things. For example as part of my diagnostic that turns a single-line return method in an expression-bodied member (aka: <code class="language-text">int Method() =&gt; 42;</code>) I had to use the existing method and turn it into a new one with this specific syntax. The code for this became very fluent to read through these statements:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp">root <span class="token operator">=</span> root<span class="token punctuation">.</span><span class="token function">ReplaceNode</span><span class="token punctuation">(</span>method<span class="token punctuation">,</span> method<span class="token punctuation">.</span><span class="token function">RemoveNode</span><span class="token punctuation">(</span>method<span class="token punctuation">.</span>Body<span class="token punctuation">,</span> SyntaxRemoveOptions<span class="token punctuation">.</span>KeepExteriorTrivia<span class="token punctuation">)</span>\n                                      <span class="token punctuation">.</span><span class="token function">WithExpressionBody</span><span class="token punctuation">(</span>arrowClause<span class="token punctuation">)</span>\n                                      <span class="token punctuation">.</span><span class="token function">WithSemicolonToken</span><span class="token punctuation">(</span>SyntaxFactory<span class="token punctuation">.</span><span class="token function">Token</span><span class="token punctuation">(</span>SyntaxKind<span class="token punctuation">.</span>SemicolonToken<span class="token punctuation">)</span><span class="token punctuation">)</span>\n                                      <span class="token punctuation">.</span><span class="token function">WithTrailingTrivia</span><span class="token punctuation">(</span>trailingTrivia<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<h1>RoslynQuoter</h1>\n<p>This isn’t exactly part of the API but it is so powerful that I can’t omit it. The <a href="http://roslynquoter.azurewebsites.net/">RoslynQuoter</a> tool developed by <a href="https://twitter.com/KirillOsenkov">Kirill Osenkov</a> is absolutely amazing to work with. If you ever want to know how the tree for a certain snippet of code looks, simply put it in the tool and you get a detailed view of how it’s built up. Without this, I would have many extra hours of work trying to figure out how a tree looks by using the debugger to look at each node’s <code class="language-text">.Parent</code> property. Luckily, no more!</p>\n<hr>\n<p>I hope this helps you get started (or expands your knowledge) of important parts of the Roslyn API. If you’re interested in reading through more complete examples, you can always take a look at <a href="https://github.com/Vannevelj/VSDiagnostics">VSDiagnostics</a>.</p>',fields:{tagSlugs:["/tags/nu-get/","/tags/ms-build/","/tags/visual-studio/"]},frontmatter:{title:"A few important Roslyn API helpers",tags:["NuGet","MSBuild","Visual Studio"],date:"2015-06-07T00:00:00.000Z",description:"The Roslyn API as implemented in RC2 has been out for a few months now and is likely to remain largely unchanged while they’re working on getting it released officially. I think it might be time to do a little write-up and identify the key-components of that API that you likely want to use when building your own diagnostics, syntax writers or anything else possible with the platform."}}},pathContext:{slug:"/posts/a-few-important-roslyn-api-helpers/"}}}});
//# sourceMappingURL=path---posts-a-few-important-roslyn-api-helpers-d63d457cb4423d8b80c3.js.map