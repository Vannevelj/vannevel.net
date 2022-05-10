webpackJsonp([0xb92bb14be71],{514:function(n,a){n.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2021-01-07---Translating-React-Native-Apps/index.md absPath of file >>> MarkdownRemark",html:'<p>I built <a href="https://play.google.com/store/apps/details?id=com.zenzizenzi.camhelp">a small Android app</a> for my grandad the other day. It contained a bit of text in the UI so naturally I wrote it in English. Once I got around to releasing it, I decided it would be nicer for him if he could read it in his native language. A quick look around showed some i18n libraries which would do the trick but they all felt rather heavy-handed.\nWe’re talking a very small app with just a few strings and nothing fancy like allowing the user to change. Surely I can write something quick that sorts this out?</p>\n<p>And I did! The below code is all that’s needed to pick the default language and fall back to English if no translation is found for a given key:</p>\n<div class="gatsby-highlight">\n      <pre class="language-typescript"><code class="language-typescript"><span class="token keyword">import</span> translations <span class="token keyword">from</span> <span class="token string">\'./translations.json\'</span><span class="token punctuation">;</span>\n<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> RNLocalize <span class="token keyword">from</span> <span class="token string">\'react-native-localize\'</span><span class="token punctuation">;</span>\n\n<span class="token keyword">type</span> TranslationKeys <span class="token operator">=</span> keyof <span class="token keyword">typeof</span> translations<span class="token punctuation">;</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">class</span> <span class="token class-name">TextHelper</span> <span class="token punctuation">{</span>\n  <span class="token keyword">private</span> <span class="token keyword">static</span> locale<span class="token punctuation">:</span> <span class="token builtin">string</span> <span class="token operator">=</span> <span class="token string">\'en\'</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token function-variable function">init</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> locales <span class="token operator">=</span> RNLocalize<span class="token punctuation">.</span><span class="token function">getLocales</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    TextHelper<span class="token punctuation">.</span>locale <span class="token operator">=</span> locales<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token operator">?</span><span class="token punctuation">.</span>languageCode <span class="token operator">?</span><span class="token operator">?</span> <span class="token string">\'en\'</span><span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n\n  <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token function-variable function">t</span> <span class="token operator">=</span> <span class="token punctuation">(</span>key<span class="token punctuation">:</span> TranslationKeys<span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>\n    <span class="token keyword">const</span> text <span class="token operator">=</span> translations<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>\n\n    <span class="token keyword">const</span> preferredLanguage <span class="token operator">=</span> <span class="token punctuation">(</span>text <span class="token keyword">as</span> <span class="token builtin">any</span><span class="token punctuation">)</span><span class="token punctuation">[</span>TextHelper<span class="token punctuation">.</span>locale<span class="token punctuation">]</span><span class="token punctuation">;</span>\n    <span class="token keyword">return</span> preferredLanguage <span class="token operator">?</span><span class="token operator">?</span> text<span class="token punctuation">.</span>en<span class="token punctuation">;</span>\n  <span class="token punctuation">}</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span></code></pre>\n      </div>\n<p>All that’s needed is a call to <code class="language-text">TextHelper.init()</code> in your <code class="language-text">index.js</code> to load the current locale and you’re set. Of course, you’ll also need <code class="language-text">react-native-localize</code> as a dependency.</p>\n<p>In the same folder I then have a simple json file with translations:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">{\n    &quot;camera.permission.title&quot;: {\n        &quot;en&quot;: &quot;Permission to use camera&quot;,\n        &quot;nl&quot;: &quot;Camera gebruik toelaten&quot;\n    },\n    &quot;camera.permission.message&quot;: {\n        &quot;en&quot;: &quot;We need your permission to use your camera.&quot;,\n        &quot;nl&quot;: &quot;We hebben uw toestemming nodig om de camera te gebruiken.&quot;\n    },\n}</code></pre>\n      </div>\n<p>Note how I’ve opted to group the translations by key rather than language. This can present trade-offs (it might be easier to perform automatic translations if they’re grouped by language) but right now it makes it straightforward to spot if any keys are missing a translation so I’ve gone with that.</p>\n<p>An additional benefit is that I can use Typescript to provide intellisense suggestions:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/intellisense-cbcf27a01be0673559ac631861d703ba-0fe79.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 732px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 44.67213114754098%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAJCAYAAAAywQxIAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABdUlEQVQoz4WSaXKjMBCFOYeNkAAJzCoBwmGxjQmpVM3k/ud5afCQmvK4an58WlrqJ/XieIwhrd/QvH+hGmckdkJiLEpToNA5kiwG930cXRee520w8tnXzzichjjXMJcPJOcO2VuPs7UY+h59Rw+VObJIIpISbBX7D47gHGEUw4wLiQ2ImxqZzlCXCc6JfJAqdHmMRAVgxwM890gcniAb/dwRgkOd0i3M3HY4FRW8EznrArodEOozwrKFojkoWojc4hAb8KyB9weW1mAJ+XGxhswQJBpxVqKpU7RtiTRNwenQjnd077/QTp8Ylt9ob59oKDU+iUoSDwv7Q5DXD8Et5LyAaiqkVIA4llCRghA+5bDDMs+YrlfM04SB9kaXUGH4Ek5aTkgLjz8S6rqMcDfWig3jiGX5wO02wZgKfhBCqmhDPbHaNsGfNnjRCl3X436fcblc0TQWVVVDawNJFZdS/cMm+Kqndtt6YUUIAZ96cefvs53d9xsJRQb9J0CK3wAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Intellisense expanded to show the json keys"\n        title=""\n        src="/static/intellisense-cbcf27a01be0673559ac631861d703ba-0fe79.png"\n        srcset="/static/intellisense-cbcf27a01be0673559ac631861d703ba-e6d71.png 240w,\n/static/intellisense-cbcf27a01be0673559ac631861d703ba-fd106.png 480w,\n/static/intellisense-cbcf27a01be0673559ac631861d703ba-0fe79.png 732w"\n        sizes="(max-width: 732px) 100vw, 732px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Note that you need to have <code class="language-text">resolveJsonModule</code> enabled in your .tsconfig to import .json files like this.</p>',fields:{tagSlugs:["/tags/react-native/","/tags/typescript/"]},frontmatter:{title:"Translating React Native Apps",tags:["React Native","Typescript"],date:"2021-01-07T01:00:00.000Z",description:"Provide translations via a minimal and type-friendly interface"}}},pathContext:{slug:"/posts/translating-react-native-apps"}}}});
//# sourceMappingURL=path---posts-translating-react-native-apps-a208e485b531f700f805.js.map