webpackJsonp([0x9050acc3d68b],{519:function(n,s){n.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2020-07-05---Unit-Testing-Redux-Persist-Migrations-With-Typescript/index.md absPath of file >>> MarkdownRemark",html:'<p><code class="language-text">redux-persist</code> is <a href="https://github.com/rt2zz/redux-persist">a popular library</a> which allows you to persist your Redux store to several different storage methods. When you change the structure of your data, ideally you’d like that to be invisible to the user. In order to avoid losing data when the structure changes, redux-persist provides the ability to <a href="https://github.com/rt2zz/redux-persist/blob/master/docs/migrations.md">define your own migrations</a>. In a world of Javascript this poses no problem but as soon as you add Typescript into the mix, things get a little bit hairier. Typescript allows us to define types and reference them, but how do we do that in a scenario where one type is - by definition - removed from the code base?</p>\n<p>Consider the hypothetical redux store which corresponds to the following type <code class="language-text">StoreState</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token punctuation">{</span>\n    user<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        id<span class="token punctuation">:</span> string<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    videoPlayer<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        ui<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n            currentVideoId<span class="token punctuation">:</span> string<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        allVideos<span class="token punctuation">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>I don’t quite like the structure here and want to make some changes to the structure and naming, i.e. I want this instead:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token punctuation">{</span>\n    user<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        id<span class="token punctuation">:</span> string<span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    videoPlayer<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        currentVideoId<span class="token punctuation">:</span> string<span class="token punctuation">;</span>\n        videos<span class="token punctuation">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>In order to write a strongly-typed migration, I can now write a migration that looks like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">import</span> <span class="token punctuation">{</span> StoreState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'./StoreState\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> type V0StoreState <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token punctuation">[</span><span class="token constant">P</span> <span class="token keyword">in</span> keyof Omit<span class="token operator">&lt;</span>StoreState<span class="token punctuation">,</span> <span class="token string">\'videoPlayer\'</span><span class="token operator">></span><span class="token punctuation">]</span><span class="token punctuation">:</span> StoreState<span class="token punctuation">[</span><span class="token constant">P</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> <span class="token operator">&amp;</span> <span class="token punctuation">{</span>\n  videoPlayer<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n        ui<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n            currentVideoId<span class="token punctuation">:</span> string<span class="token punctuation">;</span>\n        <span class="token punctuation">}</span><span class="token punctuation">;</span>\n        allVideos<span class="token punctuation">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">v1</span><span class="token punctuation">(</span>state<span class="token punctuation">:</span> V0StoreState<span class="token punctuation">)</span><span class="token punctuation">:</span> StoreState <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token punctuation">{</span>\n    <span class="token operator">...</span>state<span class="token punctuation">,</span>\n    videoPlayer<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n      currentVideoId<span class="token punctuation">:</span> state<span class="token punctuation">.</span>videoPlayer<span class="token punctuation">.</span>ui<span class="token punctuation">.</span>currentVideoId<span class="token punctuation">,</span>\n      videos<span class="token punctuation">:</span> state<span class="token punctuation">.</span>videoPlayer<span class="token punctuation">.</span>allVideos\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>What’s key here is that we define the old version of our state as exactly the current one, minus the part that we’ve changed. We then extend it with the structure of that property in the prior version. An alternative approach here would be to just copy the entire <code class="language-text">StoreState</code> and keep multiple versions of it around, that’s up to your own discretion.</p>\n<p>At this point your migration between redux-persist versions will be strongly typed but we’re still missing some useful goodies: how would we unit test this?\nThe slightly tricky bit here will be to make the differnet <code class="language-text">StoreState</code> versions play nice. In the below example, <code class="language-text">createMockState()</code> returns a default state of type <code class="language-text">StoreState</code>. We then augment that with the old state — the type of which we can directly reference using <code class="language-text">V0StoreState[&#39;videoPlayer&#39;]</code>. Typescript’s type interference can then correctly guarantee that the types are compatible with both the new and the old version of the state at any point in the code.</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">import</span> <span class="token punctuation">{</span> v1<span class="token punctuation">,</span> V0StoreState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">\'../reduxMigrations\'</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> createMockState <span class="token keyword">from</span> <span class="token string">\'./createMockState\'</span><span class="token punctuation">;</span>\n\n<span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">\'reduxMigrations\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n  <span class="token function">describe</span><span class="token punctuation">(</span><span class="token string">\'v1\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token function">it</span><span class="token punctuation">(</span><span class="token string">\'converts the currentVideoId\'</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n      <span class="token keyword">const</span> oldVideoPlayerState<span class="token punctuation">:</span> V0StoreState<span class="token punctuation">[</span><span class="token string">\'videoPlayer\'</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n        ui<span class="token punctuation">:</span> <span class="token punctuation">{</span>\n          currentVideoId<span class="token punctuation">:</span> <span class="token string">\'video1\'</span><span class="token punctuation">,</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span>\n        allVideos<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">\'video1\'</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n      <span class="token keyword">const</span> oldState<span class="token punctuation">:</span> V0StoreState <span class="token operator">=</span> <span class="token punctuation">{</span>\n        <span class="token operator">...</span><span class="token function">createMockState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n        videoPlayer<span class="token punctuation">:</span> oldVideoPlayerState<span class="token punctuation">,</span>\n      <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n      <span class="token keyword">const</span> newState <span class="token operator">=</span> <span class="token function">v1</span><span class="token punctuation">(</span>oldState<span class="token punctuation">)</span><span class="token punctuation">;</span>\n\n      <span class="token function">expect</span><span class="token punctuation">(</span>newState<span class="token punctuation">.</span>videoPlayer<span class="token punctuation">.</span>currentVideoId<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toBe</span><span class="token punctuation">(</span><span class="token string">\'video1\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>That’s it. From this point on you can define new versions of your store whenever you make a change to its structure and write strongly typed code against both the migration as well as its tests.</p>',fields:{tagSlugs:["/tags/unit-testing/","/tags/typescript/","/tags/react/"]},frontmatter:{title:"Unit Testing redux-persist migrations with Typescript",tags:["Unit Testing","Typescript","React"],date:"2020-07-05T17:00:00.000Z",description:"redux-persist allows you to specify a migration path between versions, but how can you do that in a strongly-typed way through Typescript?"}}},pathContext:{slug:"/posts/unit-testing-redux-persist-migrations-with-typescript"}}}});
//# sourceMappingURL=path---posts-unit-testing-redux-persist-migrations-with-typescript-99ff70b2313c18c0f1b2.js.map