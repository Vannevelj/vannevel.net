webpackJsonp([32744716682477],{507:function(n,a){n.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2015-08-28---Launching-Your-First-Webapp-In-Visual-Studio-Code-Through-Gulp/index.md absPath of file >>> MarkdownRemark",html:'<h1>Introduction</h1>\n<p>I figured it’s about time I get a little more experienced with AngularJS. I want to create a website for my project <a href="https://github.com/Vannevelj/VSDiagnostics">VSDiagnostics</a> and I plan on working with this technology at my internship, so it’s time to jump on the hype train.</p>\n<p>What you’ll read here is just a quick overview of setting up gulp and Visual Studio Code to get your first AngularJS app working.</p>\n<h1>Download Visual Studio Code</h1>\n<p>This is our editor of choice. If you prefer to use something else then that’s fine — anything that can write plain text files is fine, really. I would suggest <a href="https://notepad-plus-plus.org/">Notepad++</a> or <a href="http://www.sublimetext.com/">Sublime Text</a> as an alternative.</p>\n<p><a href="https://code.visualstudio.com/">Visual Studio Code</a></p>\n<h1>Install NodeJS</h1>\n<p>The Node Package Manager (npm) will help us retrieve all the dependencies we’re interested in. Likewise, if you ever want to add a NodeJS backend — this will be needed.</p>\n<h1>Create a directory structure</h1>\n<p>I created my folder structure like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">|-- Examples\n      |------- app\n                |---- js\n                      |---- app.js\n                |---- html\n                      |---- app.html</code></pre>\n      </div>\n<h1>Write code</h1>\n<p>I’m working through a book on AngularJS myself so the little bit of AngularJS code here is just the first two examples shown in that book. It’s a simple demonstration of model-binding — a powerful feature of the AngularJS framework.</p>\n<div class="gatsby-highlight">\n      <pre class="language-html"><code class="language-html"><span class="token doctype">&lt;!DOCTYPE html></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">ng-app</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Hello world<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>https://ajax.googleapis.com/ajax/libs/angularjs/1.2.6/angular.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script language-javascript"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">ng-controller</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>MyController<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">ng-model</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>name<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>text<span class="token punctuation">"</span></span> <span class="token attr-name">placeholder</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>Your name<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Hello {{ name }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Hello {{ clock }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>text/javascript<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation">=</span><span class="token punctuation">"</span>../js/app.js<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token script language-javascript">\n\n    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span></code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">function</span> <span class="token function">MyController</span><span class="token punctuation">(</span>$scope<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    $scope<span class="token punctuation">.</span>clock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token keyword">var</span> <span class="token function-variable function">updateClock</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        $scope<span class="token punctuation">.</span>clock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">;</span>\n    <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        $scope<span class="token punctuation">.</span><span class="token function">$apply</span><span class="token punctuation">(</span>updateClock<span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n    <span class="token function">updateClock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>Once all this is done, I bet you’re interested to see what we just created. However if you’ll look around in the Visual Studio Code IDE, you’ll notice that there is no ‘run’ button or anything similar to it.</p>\n<p>What there is, however, is a possibility to run a ‘task’. It might be best explained on the official documentation:</p>\n<blockquote>\n<p>Lots of tools exist to automate tasks like building, packaging, testing or deploying software systems. Examples include Make, Ant, Gulp, Jake, Rake and MSBuild. These tools are mostly run from the command line and automate jobs outside the inner software development loop (edit, compile, test and debug). Given their importance in the development lifecycle, it is very helpful to be able run them and analyze their results from within VS Code.</p>\n</blockquote>\n<p>Here you can use whichever you like most (and is appropriate). I personally decided on Gulp for no particular reason: it’s a funny word and I vaguely recall using it in a class some time ago.</p>\n<h1>Running a task</h1>\n<p>In order to start a task (which in our scenario will consist of simply firing up our browser with the app we’re creating), you have to search for it. In VS Code, pres the key combination <code class="language-text">[Ctrl]</code> + <code class="language-text">[Shift]</code> + <code class="language-text">[P]</code>. If you now search for ‘run task’, you will notice that it gives you the option to choose “<strong>Tasks: Run Task</strong>”, but with nothing to select from the dropdown menu.</p>\n<p>In order to create our task, we have to get started with Gulp first. With Gulp we will define our task after which it will be available to us in the beforementioned dropdown menu.</p>\n<h1>Initializing package.json</h1>\n<p><code class="language-text">Package.json</code> is essentially your npm configuration. It contains metadata about your application like name, version, author as well as dependencies, files, etc. You could do without it but that would mean our dependencies wouldn’t be saved along with the application (and I do like that)!</p>\n<p>In order to do so, issue the following commands:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">    $ cd C:\\Users\\Jeroen\\Documents\\AngularJS\\Examples\n    $ npm init</code></pre>\n      </div>\n<p>You will now have to enter some information to setup the package.json file and after that we can get started (and finished) with Gulp.</p>\n<h1>Installing Gulp</h1>\n<p>We need two Gulp-related packages to do what we want it to do: Gulp and Gulp-Open. The first one will provide the general Gulp environment while the second one will provide a way for us to open the browser.</p>\n<p>The following commands will install these packages:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">    $ npm install --global gulp\n    $ npm install --save-dev gulp\n    $ npm install --save-dev gulp-open</code></pre>\n      </div>\n<h1>Setting up gulpfile.js</h1>\n<p>Now it’s time to create our Task. In order to do so, go to your project’s root folder (in my case: <code class="language-text">\\Examples\\</code>) and create a new file called <code class="language-text">gulpfile.js</code>.</p>\n<p>Afterwards, add the following contents:</p>\n<div class="gatsby-highlight">\n      <pre class="language-js"><code class="language-js"><span class="token keyword">var</span> gulp <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token keyword">var</span> open <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">\'gulp-open\'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n\ngulp<span class="token punctuation">.</span><span class="token function">task</span><span class="token punctuation">(</span><span class="token string">\'default\'</span><span class="token punctuation">,</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    gulp<span class="token punctuation">.</span><span class="token function">src</span><span class="token punctuation">(</span><span class="token string">\'./app/html/app.html\'</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">pipe</span><span class="token punctuation">(</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>What it does is simple: create a new task called ‘default’ and make it open the <code class="language-text">app.html</code> file. This will prompt you for the default program to open .html files with (if you didn’t have that set already) and subsequently open it with that program.</p>\n<h1>Launching the browser</h1>\n<p>The last step is simply executing the given task. You have two options here: either you use the beforementioned <code class="language-text">[Ctrl]</code> + <code class="language-text">[Shift]</code> + <code class="language-text">[P]</code> method which will spawn a second window with some console output, or you simply enter <code class="language-text">$ gulp</code> in the command prompt at the location of your gulpfile.</p>\n<p>This will give you an output that resembles this</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/gulp-5bfbd7cd931666365f70d8118a446ae7-5dcc0.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 6.353591160220995%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAABCAYAAADeko4lAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAASElEQVQI1yXGOwrAIBBAwdXCNGpwNURIEYKo9z/hy68YGJlj0Fqnz0m5Tup2UNedEgopJDQoGpUcM37xOOs+xhrECiLm9/5xA9hDF1r2oLlLAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="gulp"\n        title=""\n        src="/static/gulp-5bfbd7cd931666365f70d8118a446ae7-c83f1.png"\n        srcset="/static/gulp-5bfbd7cd931666365f70d8118a446ae7-569e3.png 240w,\n/static/gulp-5bfbd7cd931666365f70d8118a446ae7-93400.png 480w,\n/static/gulp-5bfbd7cd931666365f70d8118a446ae7-c83f1.png 960w,\n/static/gulp-5bfbd7cd931666365f70d8118a446ae7-5dcc0.png 1086w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>and also opens <code class="language-text">app.html</code> in your favorite browser.</p>',fields:{tagSlugs:["/tags/gulp/","/tags/angular-js/"]},frontmatter:{title:"Launching your first WebApp in Visual Studio Code through Gulp",tags:["Gulp","AngularJS"],date:"2015-08-28T00:00:00.000Z",description:"What you’ll read here is just a quick overview of setting up gulp and Visual Studio Code to get your first AngularJS app working."}}},pathContext:{slug:"/posts/launching-your-first-webapp-in-visual-studio-code-through-gulp/"}}}});
//# sourceMappingURL=path---posts-launching-your-first-webapp-in-visual-studio-code-through-gulp-aaa4493321fc1b372b6f.js.map