webpackJsonp([0xe9e1ab4c693a],{516:function(n,s){n.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/Users/jeroenvannevel/Documents/source/vannevel.net/src/pages/articles/2015-03-08---Unit-Testing-Web-Api-Routes-And-Parameter-Validation/index.md absPath of file >>> MarkdownRemark",html:'<h1>Introduction</h1>\n<p>Let’s talk about routing. If you’ve ever developed a web application then you know the hassle you have with the constant “Resource not found” or “Multiple actions match the request” errors. What if I told you you could fix all this without ever having to open a browser?</p>\n<p>That’s right: we’ll unit-test our routes! As an added bonus I’ll also show how you can unit-test parameter validation since that’s probably one of the most important things to do when creating a (public) API.</p>\n<h1>Setting up the environment</h1>\n<h2>Create a new Web API project</h2>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/create-project-6529a9f91a9b77cf4e5fbf36e2b691eb-6ab3c.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 771px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 74.8378728923476%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACcElEQVQ4y41U2W7aUBTknys1olHzCX3qS5/6Je1bKkVZypZibAzed1/b2BiSkEznXkwgah9ypeEcXVtzlhnT+/DbwPkfC/3JktHeY+qgP9Dx8WqEs6sxzq4nxL3K+8zPRyYuZh4+ay4uNAefzAhfflzi+9dv6P2yPHiug6XjIBUCoiqRlxIFRFmpXFQVCiKMY9iuC8fzuuir3HJc5KLATZqjd+MG0O7HvMhhWxaKUiCKQsRxhHa9xkyfQZ7dbgdrsYAxm2Gu65hNNeb6HvM5YjY0cDz07oIEceBjVdfIskzFh+0DttstHh8fURTlK6EXs2hcolzVqOsjqtUK26bGMIjQG8YZLHOOddvCdmwkaYL/HUmYZjnBtXC8ojhCjttyJYrwLogRsl3ZiexQ5EIRvLy8vEKep6cdCu644o7Lco8DoSDaVUc4SvI9wUk3p2RHwidkeY6ckFF2WVUronpLOE4F3nOen5+RRBE8qhoEARxOJWOaphSyPBLeeCHWrFJKdKOsqe5ms2Fs0bYdeGe4PjSqbFJVwzAwZ5QFcq6iYZcDP6QPFzZMTYPOF0zThK7vo+8H+/1IbxIl86kb0kYGxqMxlsulKi5HloRKFEl4TR8mbN11WYmCSAsoEhKoxXeQeei59OoSOcVLaHL53j+iXNkenIWpzBmFEYldjuEjDEK19KZZEw1qFrKDFFMrge6k8GMW75RWhKpDEt7yp6EVxMFT7FKhqy7tJCFVlfeCufTdYYLDFBsWHCljR4kS5TBWdYLyDQq1x9PnsmAmzU4bNYXAwAvYYZioBzGrJ+L9kH8kLj/F26mJielgNBzi572Gv9dPXLX1Xr0pAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Create Web API project"\n        title=""\n        src="/static/create-project-6529a9f91a9b77cf4e5fbf36e2b691eb-6ab3c.png"\n        srcset="/static/create-project-6529a9f91a9b77cf4e5fbf36e2b691eb-dd353.png 240w,\n/static/create-project-6529a9f91a9b77cf4e5fbf36e2b691eb-6bd9d.png 480w,\n/static/create-project-6529a9f91a9b77cf4e5fbf36e2b691eb-6ab3c.png 771w"\n        sizes="(max-width: 771px) 100vw, 771px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>We don’t need any sort of hosting so you can just leave Azure unchecked. We’ll use ASP.NET MVC in our test project but not in the Web API itself so you can just use an empty project with Web API checked.</p>\n<h2>Create a model and backing repository</h2>\n<p>I will not go into deeper detail about a proper repository implementation but if you’re interested, you can always check my post about unit-testing Entity-Framework for more information about that layer of your project.</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Book</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token function">Book</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">Book</span><span class="token punctuation">(</span><span class="token keyword">int</span> id<span class="token punctuation">,</span> <span class="token keyword">string</span> title<span class="token punctuation">,</span> <span class="token keyword">string</span> author<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        Id <span class="token operator">=</span> id<span class="token punctuation">;</span>\n        Title <span class="token operator">=</span> title<span class="token punctuation">;</span>\n        Author <span class="token operator">=</span> author<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">Required</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token keyword">int</span> Id <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">Required</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token keyword">string</span> Title <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">Required</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token keyword">string</span> Author <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BookRepository</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token keyword">readonly</span> IList<span class="token operator">&lt;</span>Book<span class="token operator">></span> _books <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token generic-method"><span class="token function">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Book</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">public</span> <span class="token function">BookRepository</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        _books<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Book</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">"American Psycho"</span><span class="token punctuation">,</span> <span class="token string">"Bret Easton Ellis"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        _books<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Book</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span> <span class="token string">"The Lord of the Rings"</span><span class="token punctuation">,</span> <span class="token string">"J.R.R. Tolkien"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        _books<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Book</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token string">"Le Petit Prince"</span><span class="token punctuation">,</span> <span class="token string">"Antoine de Saint-Exupéry"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token class-name">Book</span> <span class="token function">Get</span><span class="token punctuation">(</span><span class="token keyword">int</span> id<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">return</span> _books<span class="token punctuation">.</span><span class="token function">SingleOrDefault</span><span class="token punctuation">(</span>x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span>Id <span class="token operator">==</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">Insert</span><span class="token punctuation">(</span><span class="token class-name">Book</span> book<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        _books<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span>book<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<h2>Implement a basic controller</h2>\n<p>Now that we’ve got that out of the way, let’s create our controller with a few API endpoints.</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token punctuation">[</span><span class="token class-name">RoutePrefix</span><span class="token punctuation">(</span><span class="token string">"api/books"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BookController</span> <span class="token punctuation">:</span> <span class="token class-name">ApiController</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token keyword">readonly</span> <span class="token class-name">BookRepository</span> _bookRepository <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BookRepository</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">Route</span><span class="token punctuation">(</span><span class="token string">"{id:int}"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n    <span class="token punctuation">[</span><span class="token class-name">HttpGet</span><span class="token punctuation">]</span>\n    <span class="token punctuation">[</span><span class="token class-name">ResponseType</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token punctuation">(</span>Book<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token class-name">IHttpActionResult</span> <span class="token function">GetBook</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token class-name">FromUri</span><span class="token punctuation">]</span> <span class="token keyword">int</span> id<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">var</span> book <span class="token operator">=</span> _bookRepository<span class="token punctuation">.</span><span class="token function">Get</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>book <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span>\n        <span class="token punctuation">{</span>\n            <span class="token keyword">return</span> <span class="token function">NotFound</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n\n        <span class="token keyword">return</span> <span class="token function">Ok</span><span class="token punctuation">(</span>book<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">Route</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n    <span class="token punctuation">[</span><span class="token class-name">HttpPost</span><span class="token punctuation">]</span>\n    <span class="token punctuation">[</span><span class="token class-name">ResponseType</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token class-name">IHttpActionResult</span> <span class="token function">InsertBook</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token class-name">FromBody</span><span class="token punctuation">]</span> <span class="token class-name">Book</span> book<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>ModelState<span class="token punctuation">.</span>IsValid<span class="token punctuation">)</span>\n        <span class="token punctuation">{</span>\n            _bookRepository<span class="token punctuation">.</span><span class="token function">Insert</span><span class="token punctuation">(</span>book<span class="token punctuation">)</span><span class="token punctuation">;</span>\n            <span class="token keyword">return</span> <span class="token function">Ok</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span>\n\n        <span class="token keyword">var</span> errors <span class="token operator">=</span> <span class="token keyword">string</span><span class="token punctuation">.</span><span class="token function">Join</span><span class="token punctuation">(</span><span class="token string">"\\n"</span><span class="token punctuation">,</span> ModelState<span class="token punctuation">.</span>Values<span class="token punctuation">.</span><span class="token function">SelectMany</span><span class="token punctuation">(</span>x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span>Errors<span class="token punctuation">.</span><span class="token function">Select</span><span class="token punctuation">(</span>y <span class="token operator">=</span><span class="token operator">></span> y<span class="token punctuation">.</span>ErrorMessage<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">return</span> <span class="token function">BadRequest</span><span class="token punctuation">(</span>errors<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>By specifying the <code class="language-text">[RoutePrefix]</code> attribute on class level, we essentially end up with “<code class="language-text">api/books/{id}</code>” and “<code class="language-text">api/books</code>” as API endpoints. The <code class="language-text">[ResponseType]</code> attribute has no functional difference but is used when generating documentation. Personally I prefer to always add it considering the actual return type is hidden behind the <code class="language-text">IHttpActionResult</code>.</p>\n<h1>Set up the test environment</h1>\n<p>I like to use MVC Route Tester for this. As the name implies it is focused on ASP.NET MVC but works just fine for ASP.NET Web Api as well. Use NuGet to add <code class="language-text">MvcRouteTester.Mvc5.2</code>, <code class="language-text">FluentAssertions</code> and Microsoft ASP.NET MVC to your test project.</p>\n<h2>Creating our first tests</h2>\n<p>Now that the entire environment is setup, let’s take a look at a basic test. What we’ll do here is verify that our routing configuration has a route configured that corresponds with what we expect AND calls the method we expect it to. Let’s take a look at the code:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token punctuation">[</span><span class="token class-name">TestClass</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UnitTests</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">private</span> <span class="token class-name">HttpConfiguration</span> _configuration<span class="token punctuation">;</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">TestInitialize</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">Initialize</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        _configuration <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HttpConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        WebApiConfig<span class="token punctuation">.</span><span class="token function">Register</span><span class="token punctuation">(</span>_configuration<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        _configuration<span class="token punctuation">.</span><span class="token function">EnsureInitialized</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">TestMethod</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">GetBook_WithCorrectRoute_CallsAppropriateMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> <span class="token keyword">string</span> route <span class="token operator">=</span> <span class="token string">"/api/books/5"</span><span class="token punctuation">;</span>\n        RouteAssert<span class="token punctuation">.</span><span class="token function">HasApiRoute</span><span class="token punctuation">(</span>_configuration<span class="token punctuation">,</span> route<span class="token punctuation">,</span> HttpMethod<span class="token punctuation">.</span>Get<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        _configuration<span class="token punctuation">.</span><span class="token function">ShouldMap</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token generic-method"><span class="token function">To</span><span class="token punctuation">&lt;</span><span class="token class-name">BookController</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>HttpMethod<span class="token punctuation">.</span>Get<span class="token punctuation">,</span> x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span><span class="token function">GetBook</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token punctuation">[</span><span class="token class-name">TestMethod</span><span class="token punctuation">]</span>\n    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">InsertBook_WithCorrectRoute_CallsAppropriateMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">const</span> <span class="token keyword">string</span> route <span class="token operator">=</span> <span class="token string">"/api/books"</span><span class="token punctuation">;</span>\n        RouteAssert<span class="token punctuation">.</span><span class="token function">HasApiRoute</span><span class="token punctuation">(</span>_configuration<span class="token punctuation">,</span> route<span class="token punctuation">,</span> HttpMethod<span class="token punctuation">.</span>Post<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        _configuration<span class="token punctuation">.</span><span class="token function">ShouldMap</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token generic-method"><span class="token function">To</span><span class="token punctuation">&lt;</span><span class="token class-name">BookController</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>HttpMethod<span class="token punctuation">.</span>Post<span class="token punctuation">,</span> x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span><span class="token function">InsertBook</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>You’ll notice that we have to create a new <code class="language-text">HttpConfiguration</code> object. This type’s name already conveys what it’s about: it contains the configuration of your HTTP server. The only aspect we care about is its routing purposes so we can just create an empty config without setting any properties. Once that is done, we inject it into our WebApi project by calling <code class="language-text">WebApiConfig.Register(HttpConfiguration)</code> which you can find under the <code class="language-text">App_Start</code> folder. Since it’s just a basic project it will generate the routes by mapping the attributes and the default route.</p>\n<p>The contents of the tests are straightforward: first we test whether such a route exists and after that whether it is mapped to the correct method. Notice how it doesn’t matter what argument you pass in to <code class="language-text">BookController.InsertBook(Book)</code>: whether it’s <code class="language-text">null</code> or <code class="language-text">new Book()</code> won’t make a difference although you should be more wary about this when you have a scenario involving method overloading.</p>\n<h2>What about constraints?</h2>\n<p>New in Web Api 2 are Route constraints. You’ve already seen one of them in the form of <code class="language-text">{id:int}</code> which indicates that only requests routing to that URL form and where the id can be parsed as an integer should be handled by that method.\nAs a way of showcasing this behaviour and proving that it can be tested, I will add two additional endpoints which take care of respectively the ids above 15 and below 15.</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token punctuation">[</span><span class="token class-name">Route</span><span class="token punctuation">(</span><span class="token string">"myaction/{someInteger:int:min(15)}"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n<span class="token punctuation">[</span><span class="token class-name">HttpGet</span><span class="token punctuation">]</span>\n<span class="token punctuation">[</span><span class="token class-name">ResponseType</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token class-name">IHttpActionResult</span> <span class="token function">SomeSensibleConstraint</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token class-name">FromUri</span><span class="token punctuation">]</span> <span class="token keyword">int</span> someInteger<span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token function">Ok</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token punctuation">[</span><span class="token class-name">Route</span><span class="token punctuation">(</span><span class="token string">"myaction/{someInteger:int:max(15)}"</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n<span class="token punctuation">[</span><span class="token class-name">HttpGet</span><span class="token punctuation">]</span>\n<span class="token punctuation">[</span><span class="token class-name">ResponseType</span><span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token class-name">IHttpActionResult</span> <span class="token function">AnotherSensibleConstraint</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token class-name">FromUri</span><span class="token punctuation">]</span> <span class="token keyword">int</span> someInteger<span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token function">BadRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Testing is as easy as ever:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token punctuation">[</span><span class="token class-name">TestMethod</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">SomeSensibleConstraint_WithValidCriteria_CallsAppropriateMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token keyword">string</span> route <span class="token operator">=</span> <span class="token string">"/api/books/myaction/25"</span><span class="token punctuation">;</span>\n    RouteAssert<span class="token punctuation">.</span><span class="token function">HasApiRoute</span><span class="token punctuation">(</span>_configuration<span class="token punctuation">,</span> route<span class="token punctuation">,</span> HttpMethod<span class="token punctuation">.</span>Get<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    _configuration<span class="token punctuation">.</span><span class="token function">ShouldMap</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token generic-method"><span class="token function">To</span><span class="token punctuation">&lt;</span><span class="token class-name">BookController</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>HttpMethod<span class="token punctuation">.</span>Get<span class="token punctuation">,</span> x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span><span class="token function">SomeSensibleConstraint</span><span class="token punctuation">(</span><span class="token number">25</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token punctuation">[</span><span class="token class-name">TestMethod</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">SomeSensibleConstraint_WithInvalidCriteria_CallsAppropriateMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">const</span> <span class="token keyword">string</span> route <span class="token operator">=</span> <span class="token string">"/api/books/myaction/10"</span><span class="token punctuation">;</span>\n    RouteAssert<span class="token punctuation">.</span><span class="token function">HasApiRoute</span><span class="token punctuation">(</span>_configuration<span class="token punctuation">,</span> route<span class="token punctuation">,</span> HttpMethod<span class="token punctuation">.</span>Get<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    _configuration<span class="token punctuation">.</span><span class="token function">ShouldMap</span><span class="token punctuation">(</span>route<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token generic-method"><span class="token function">To</span><span class="token punctuation">&lt;</span><span class="token class-name">BookController</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>HttpMethod<span class="token punctuation">.</span>Get<span class="token punctuation">,</span> x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span><span class="token function">AnotherSensibleConstraint</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<h2>What about parameter validation testing?</h2>\n<p>One last important aspect to testing your API is verifying user input. One thing to realize here is that the ASP.NET framework does a lot for us when we deploy our website. You’ve already noticed that we explicitly have to create the <code class="language-text">HttpConfiguration</code> object and inject that in our <code class="language-text">WebApiConfig</code>. Now we’ll drop that aspect since we’ll not be testing what ASP.NET does but we still have to use some of its functions, more specifically the ability to validate the incoming object.</p>\n<p>Luckily this can be done extremely easy by calling <code class="language-text">ApiController.Validate(object)</code> which will look at each field and its attributes to determine validity.</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token punctuation">[</span><span class="token class-name">TestMethod</span><span class="token punctuation">]</span>\n<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">InsertBook_WithoutTitle_ReturnsBadRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n    <span class="token comment">// Arrange</span>\n    <span class="token keyword">var</span> controller <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BookController</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">var</span> book <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Book</span>\n    <span class="token punctuation">{</span>\n        Id <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">,</span>\n        Author <span class="token operator">=</span> <span class="token string">"J. K. Rowling"</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n    <span class="token comment">// Act</span>\n    controller<span class="token punctuation">.</span>Configuration <span class="token operator">=</span> _configuration<span class="token punctuation">;</span>\n    controller<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>book<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">var</span> response <span class="token operator">=</span> controller<span class="token punctuation">.</span><span class="token function">InsertBook</span><span class="token punctuation">(</span>book<span class="token punctuation">)</span> <span class="token keyword">as</span> BadRequestErrorMessageResult<span class="token punctuation">;</span>\n\n    <span class="token comment">// Assert</span>\n    response<span class="token punctuation">.</span><span class="token function">Should</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">NotBeNull</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<h1>Conclusion</h1>\n<p>That concludes this short overview on how to unit-test your public API. While some might argue the use of testing your routes I like the fact that I can be certain all of that works without even having to fire up my browser once. Certainly when you start with conditional routing this can be a very convenient way to make sure everything works as intended. The tests are executed very fast and take very little time to write which makes it all the more worth it.</p>',
fields:{tagSlugs:["/tags/unit-testing/","/tags/asp-net/","/tags/routing/","/tags/c/"]},frontmatter:{title:"Unit testing Web API routes and parameter validation",tags:["Unit Testing","ASP.NET","Routing","C#"],date:"2015-03-08T00:00:00.000Z",description:"Let’s talk about routing. If you’ve ever developed a web application then you know the hassle you have with the constant “Resource not found” or “Multiple actions match the request” errors. What if I told you you could fix all this without ever having to open a browser?\nThat’s right: we’ll unit test our routes! As an added bonus I’ll also show how you can unit test parameter validation since that’s probably one of the most important things to do when creating a (public) API."}}},pathContext:{slug:"/posts/unit-testing-web-api-routes-and-parameter-validation/"}}}});
//# sourceMappingURL=path---posts-unit-testing-web-api-routes-and-parameter-validation-5719e8df824d49249abc.js.map