webpackJsonp([57414648566179],{504:function(n,s){n.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2015-04-03---Configure-Custom-IdentityUser-For-Identity-Framework/index.md absPath of file >>> MarkdownRemark",html:'<h1>Introduction</h1>\n<p>I am getting accustomed to the ASP.NET Identity framework and let me just say that I love it. No more boring hassle with user accounts: all the traditional stuff is already there. However often you’ll find yourself wanting to expand on the default <code class="language-text">IdentityUser</code> and add your own fields to it. This was my use case as well here and since I couldn’t find any clear instructions on how this is done exactly, I decided to dive into it especially for you! Well, maybe a little bit for me as well.</p>\n<hr>\n<p>The example will be straightforward: extend the the default user by adding a property that holds his date of birth and a collection of books. For this there are two simple classes:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Book</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token function">Book</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">Book</span><span class="token punctuation">(</span><span class="token keyword">int</span> id<span class="token punctuation">,</span> <span class="token keyword">string</span> title<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        Id <span class="token operator">=</span> id<span class="token punctuation">;</span>\n        Title <span class="token operator">=</span> title<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">int</span> Id <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n    <span class="token keyword">public</span> <span class="token keyword">string</span> Title <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ApplicationUser</span> <span class="token punctuation">:</span> <span class="token class-name">IdentityUser</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token function">ApplicationUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        Books <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token generic-method"><span class="token function">List</span><span class="token punctuation">&lt;</span><span class="token class-name">Book</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token function">ApplicationUser</span><span class="token punctuation">(</span><span class="token keyword">string</span> username<span class="token punctuation">)</span> <span class="token punctuation">:</span> <span class="token keyword">base</span><span class="token punctuation">(</span>username<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> DateTime<span class="token operator">?</span> DateOfBirth <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n    <span class="token keyword">public</span> <span class="token keyword">virtual</span> ICollection<span class="token operator">&lt;</span>Book<span class="token operator">></span> Books <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>The <code class="language-text">Book</code> class is straightforward. The <code class="language-text">ApplicationUser</code> class isn’t very complex either: inherit from <code class="language-text">IdentityUser</code> to get the default user implementation. Furthermore there is the <code class="language-text">MyContext</code> class which contains two tricky aspects:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyContext</span> <span class="token punctuation">:</span> <span class="token class-name">IdentityDbContext</span><span class="token operator">&lt;</span>ApplicationUser<span class="token operator">></span><span class="token punctuation">;</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token function">MyContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">:</span> <span class="token keyword">base</span><span class="token punctuation">(</span><span class="token string">"MyTestContext"</span><span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        Database<span class="token punctuation">.</span>Log <span class="token operator">=</span> msg <span class="token operator">=</span><span class="token operator">></span> Debug<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> DbSet<span class="token operator">&lt;</span>Book<span class="token operator">></span> Books <span class="token punctuation">{</span> <span class="token keyword">get</span><span class="token punctuation">;</span> <span class="token keyword">set</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>\n\n    <span class="token keyword">protected</span> <span class="token keyword">override</span> <span class="token keyword">void</span> <span class="token function">OnModelCreating</span><span class="token punctuation">(</span><span class="token class-name">DbModelBuilder</span> modelBuilder<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">base</span><span class="token punctuation">.</span><span class="token function">OnModelCreating</span><span class="token punctuation">(</span>modelBuilder<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        modelBuilder<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Entity</span><span class="token punctuation">&lt;</span><span class="token class-name">Book</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ToTable</span><span class="token punctuation">(</span><span class="token string">"Books"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        modelBuilder<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Entity</span><span class="token punctuation">&lt;</span><span class="token class-name">Book</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">HasKey</span><span class="token punctuation">(</span>x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span>Id<span class="token punctuation">)</span><span class="token punctuation">;</span>\n        modelBuilder<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Entity</span><span class="token punctuation">&lt;</span><span class="token class-name">Book</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Property</span><span class="token punctuation">(</span>x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span>Id<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">HasDatabaseGeneratedOption</span><span class="token punctuation">(</span>DatabaseGeneratedOption<span class="token punctuation">.</span>None<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n        modelBuilder<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">Entity</span><span class="token punctuation">&lt;</span><span class="token class-name">ApplicationUser</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">HasMany</span><span class="token punctuation">(</span>x <span class="token operator">=</span><span class="token operator">></span> x<span class="token punctuation">.</span>Books<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">WithMany</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Map</span><span class="token punctuation">(</span>x <span class="token operator">=</span><span class="token operator">></span>\n        <span class="token punctuation">{</span>\n            x<span class="token punctuation">.</span><span class="token function">ToTable</span><span class="token punctuation">(</span><span class="token string">"UserBooks"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            x<span class="token punctuation">.</span><span class="token function">MapLeftKey</span><span class="token punctuation">(</span><span class="token string">"UserId"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n            x<span class="token punctuation">.</span><span class="token function">MapRightKey</span><span class="token punctuation">(</span><span class="token string">"BookId"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>First of all: notice how we inherit from <code class="language-text">IdentityDbContext&lt;ApplicationUser&gt;</code>. The specialized <code class="language-text">DbContext</code> is important because it provides us with all the user-related data from the database and the <code class="language-text">ApplicationUser</code> type parameter is important because it defines what type the <code class="language-text">DbSet&lt;T&gt;</code> Users will be defined as. Before I found out there was a generic variant of the context, I was trying to make it work with the non-generic type and separating user and userinformation: not pretty.</p>\n<p>The second important aspect here is <code class="language-text">base.OnModelCreating(modelbuilder)</code>. If you do not do this, the configuration as defined in <code class="language-text">IdentityDbContext</code> will not be applied. Since this isn’t necessary with a plain old <code class="language-text">DbContext</code>, I figured it worth mentioning since I for one typically omit this call.</p>\n<p>Finally all there is left is demonstrating how this is used exactly. This too is straightforward and requires no special code:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Program</span>\n<span class="token punctuation">{</span>\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">Main</span><span class="token punctuation">(</span><span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        AsyncContext<span class="token punctuation">.</span><span class="token function">Run</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token function">MainAsync</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span><span class="token string">"End of program"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        Console<span class="token punctuation">.</span><span class="token function">Read</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n\n    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">async</span> <span class="token class-name">Task</span> <span class="token function">MainAsync</span><span class="token punctuation">(</span><span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span>\n    <span class="token punctuation">{</span>\n        <span class="token keyword">var</span> books <span class="token operator">=</span> <span class="token keyword">new</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span> <span class="token keyword">new</span> <span class="token class-name">Book</span><span class="token punctuation">(</span><span class="token number">15</span><span class="token punctuation">,</span> <span class="token string">"C# In Depth"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Book</span><span class="token punctuation">(</span><span class="token number">74</span><span class="token punctuation">,</span> <span class="token string">"The Art of Unit Testing"</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">var</span> context <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyContext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">var</span> manager <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token generic-method"><span class="token function">UserManager</span><span class="token punctuation">&lt;</span><span class="token class-name">ApplicationUser</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token generic-method"><span class="token function">UserStore</span><span class="token punctuation">&lt;</span><span class="token class-name">ApplicationUser</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>context<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n        <span class="token keyword">var</span> user <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ApplicationUser</span><span class="token punctuation">(</span><span class="token string">"Jeroen456"</span><span class="token punctuation">)</span>\n        <span class="token punctuation">{</span>\n            DateOfBirth <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DateTime</span><span class="token punctuation">(</span><span class="token number">1992</span><span class="token punctuation">,</span> <span class="token number">11</span><span class="token punctuation">,</span> <span class="token number">02</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n            Books <span class="token operator">=</span> books\n        <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        <span class="token keyword">await</span> manager<span class="token punctuation">.</span><span class="token function">CreateAsync</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>Notice how I use <a href="https://github.com/StephenCleary/AsyncEx">AsyncEx by Stephen Cleary</a> to create an asynchronous context in my console application. After this you simply create a manager around the store which you pass your context to and voilà: your user is now inserted and everything works perfectly.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/db-03ed4f276ada4a0d02ddeb16f41ff025-c0c01.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 20.99609375%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAECAYAAACOXx+WAAAACXBIWXMAAAsSAAALEgHS3X78AAAArklEQVQY042P2wqDMBBE/f/fK9hKUWM190v1wRRMYLqGCrZPDQxZJmdnN9UwCrRtj65nkMpg4gJKaThvYK2Bc45uDikFhJDw3hffGE5vlmpXvGcIqG93VHvgSCFaGwrUMNYS6AlyRYFA7/WpOdAwh3n2iK+IGCPWNSKlhEvdoGKTgtIWy7wg54xt2z5KP3X68lLKhT969nNtWlQTl+W7PXugYwMsbXeG/9E+6Ah8A5+kMHPij7URAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Resulting database"\n        title=""\n        src="/static/db-03ed4f276ada4a0d02ddeb16f41ff025-c83f1.png"\n        srcset="/static/db-03ed4f276ada4a0d02ddeb16f41ff025-569e3.png 240w,\n/static/db-03ed4f276ada4a0d02ddeb16f41ff025-93400.png 480w,\n/static/db-03ed4f276ada4a0d02ddeb16f41ff025-c83f1.png 960w,\n/static/db-03ed4f276ada4a0d02ddeb16f41ff025-c0c01.png 1024w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>You can see the date of birth is in the same table (²AspNetUsers²) as all other user-related data. The second table displays the books and the third the many-to-many table between users and books.</p>\n<hr>\n<p>All things considered it is fairly straightforward as to how it works but there are a few tricky aspects that make you scratch your head if you’re not too familiar with the framework yet.</p>',fields:{tagSlugs:["/tags/c/","/tags/asp-net/","/tags/entity-framework/"]},frontmatter:{title:"How to configure a custom IdentityUser for Entity-Framework",tags:["C#","ASP.NET","Entity-Framework"],date:"2015-04-03T00:00:00.000Z",description:"I am getting accustomed to the ASP.NET Identity framework and let me just say that I love it. No more boring hassle with user accounts: all the traditional stuff is already there. However often you’ll find yourself wanting to expand on the default IdentityUser class and add your own fields to it. This was my use case as well here and since I couldn’t find any clear instructions on how this is done exactly, I decided to dive into it especially for you! Well, maybe a little bit for me as well."}}},pathContext:{slug:"/posts/how-to-configure-a-custom-identityuser-for-entity-framework/"}}}});
//# sourceMappingURL=path---posts-how-to-configure-a-custom-identityuser-for-entity-framework-5a9c25079a6845ec9d8d.js.map