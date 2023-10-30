webpackJsonp([0x9da7747d567],{506:function(e,t){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2015-05-01---Hello-Linux/index.md absPath of file >>> MarkdownRemark",html:'<h1>Introduction</h1>\n<p>Like many other .NET developers I have been following the Build conference that’s going on right now. One of its biggest announcements (so far) was the release of Visual Studio Code and the accompanying CoreCLR for Linux and Mac. It sounds nice and all but I wanted to try this out myself. I have decided to get a Console Application working in Ubuntu 14.04 since we’ve all seen by now how to deploy an ASP.NET web application. While reading this post, keep in mind that I have basically never used Linux so it’s possible I took hoops that shouldn’t have been taken. In case I did, leave me a comment so I can learn from it. Note that in this blogpost I will be using the Mono runtime and not the .NET Core one. At the time of writing there was only documentation available for the former however you can always get started with .NET Core here.</p>\n<p>One of the things I am pleasantly surprised with is that there are several Yeoman templates available to create a solution structure. Whereas Visual Studio does that for you, it would have been a serious pain to have to do this yourself each time you create a new project in Visual Studio Code.</p>\n<p>Without further ado, let’s get to it!</p>\n<h1>The setup</h1>\n<p>I installed Ubuntu 14.04 on an old laptop, which means it’s an entirely fresh installation. If you have already been using Linux and/or Mono then you probably know what steps you can skip.</p>\n<p>We start by following the instructions <a href="http://docs.asp.net/en/latest/getting-started/installing-on-linux.html">here</a>. You can see that we follow the ASP.NET documentation even though we’re building a Console Application: the setup for either is very, very similar with just about two commands differently.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">echo &quot;deb http://download.mono-project.com/repo/debian wheezy main&quot; | sudo tee /etc/apt/sources.list.d/mono-xamarin.list</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-get update</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-get install Mono-Complete</code></pre>\n      </div>\n<p>Afterwards it’s time to install the DNVM. For more information about the .NET Version Manager you can take a look <a href="https://github.com/aspnet/home">here (Github)</a> and <a href="http://blogs.msdn.com/b/dotnet/archive/2015/04/29/net-announcements-at-build-2015.aspx">here (MSDN)</a>.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">curl -sSL https://raw.githubusercontent.com/aspnet/Home/dev/dnvminstall.sh | DNX_BRANCH=dev sh &amp;&amp; source ~/.dnx/dnvm/dnvm.sh</code></pre>\n      </div>\n<p>Next up is NodeJS. This will allow us to install Yeoman and in turn generate the project templates.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-get install nodejs</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-get install npm</code></pre>\n      </div>\n<p>One problem I had here was that there was <a href="https://stackoverflow.com/q/21168141/1864167">a naming conflict between node and nodejs</a> which are apparently different packages. This is solved by executing</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-get install nodejs-legacy</code></pre>\n      </div>\n<h1>Creating the solution</h1>\n<p>Afterwards create your own directory where we store our project. I did this in <code class="language-text">$HOME/Documents/code/yo-aspnet</code>.</p>\n<p>Now that we have this we can generate our project structure by first installing yo:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo npm install -g yo</code></pre>\n      </div>\n<p>and subsequently the generator:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo npm install -g generator-aspnet</code></pre>\n      </div>\n<p>When this is done, it’s time to pick the kind of project template we want to generate. Start yo</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">yo</code></pre>\n      </div>\n<p>and you will be prompted to select the kind of application you’re interested in. You should see a screen like this:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/choose-solution-template-353315b90d74426ccc52d4b8909fbf2a-77db8.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 63.86831275720165%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAAACXBIWXMAAAsSAAALEgHS3X78AAACC0lEQVQ4y42T2XLaQBBF9WgHvOAlJsRxgkASWKDRghYQm8FgSLDLqSyV//+Rm9sDJI6Dq/zQ1T2COX17GePBu8XXYI771gSfmyPtH/05Jh9T9MsBhpUQ+YWP/rt1nJSuERQshEUbQZH+wFl7nsMDG8bSGUKgC3uAlXujgdNqhvGHGNNP6cZnmDC+uUoweh8hPXHRe6uQnbaYTDH20D33MGBS487qa2Xzeg6BC3hu5Tz3MKv1NHx02cHM7GFImHwTuCSTKuQsv0sCDVy1bvG98wXLxhh39pB/6Ot46YwY57itdllqpJWKQjEBpVQXHTYQHzfROWowdrQ3Fk6K+3ZOWEJVMWFdTM0ISzvDrM7MF20MKj49yysrDRCY9MvbM6H2alD7f814VB5+dHxagJ9JiG+hj19piAe3jVXLxdxsUKGN7MyGKtQ0RIN42X9T/8+MfqXF3vg0hfFVwH54GF76SMptRCc20lKdaiz4nKziJJ9e3gU14iMLYmGxRjMRFqpcCxMBIdHmm78px9+YkssvKYyYNWMzw6LDHgVsuEw1RocNV/v1tW0VbewPdCfw0EL3rKkPScnVeyY7JYu6LWndcLmwW9XT8o3s1EV+7qLLycn0ZIrbSa5Vvgx5DtNTHnORF94UE2eAjBufHF8j5vOSJxbxWb0G+I/CKTd9xac34+uQUqU/z1fjtSpFwG+wfn7Bkt6GQQAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Choosing the solution template"\n        title=""\n        src="/static/choose-solution-template-353315b90d74426ccc52d4b8909fbf2a-c83f1.png"\n        srcset="/static/choose-solution-template-353315b90d74426ccc52d4b8909fbf2a-569e3.png 240w,\n/static/choose-solution-template-353315b90d74426ccc52d4b8909fbf2a-93400.png 480w,\n/static/choose-solution-template-353315b90d74426ccc52d4b8909fbf2a-c83f1.png 960w,\n/static/choose-solution-template-353315b90d74426ccc52d4b8909fbf2a-77db8.png 1215w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    \nUse the arrows keys to select “Console Application” and press enter. Give your project a name (in my case: “HelloWorld”) and everything should now have been created:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/console-solution-generated-a9e53ff433e7448bf77f25765dc204f0-77db8.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 63.86831275720165%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAAACXBIWXMAAAsSAAALEgHS3X78AAABi0lEQVQ4y42T2VLCQBBFeVNkiWEpCYoIZAOyTZKBQKIBrIKyeOH/f+baWUBRlDzcSqZn+uR296QUdS2snj3EPRfrF474iaXrmWSBNTT4ggK3roLVVNiJ7mQ45VH2vKDSsq1i0dYxb6gImirmogwuKvBFDVwYgteHdJAABHFyHaEXgayiwq9qtFAwEw0ELSuVWyU3ZTlTftjO9a9DX1ARtsZwaxoiiWGnRFj1OJWqn7m65uwE5JQYNHSwipwB8o3EIUtcJvGKctXZCbgZceyNGAd7iwPbYj9ZYyuH2I5CuOTYaE5hJW4JXghoC33EA4YPLSa9YdOfkVsl61l59EvH+J/ARYcG0dXBG2MaypSm/aVl20oVNE26CRbtT/6FZVMWh/CkARaSgZDuZPToIHxwCGCmffyZcBWYvSingHU7PEsuWvIxVvLrGpZUbuLmVXKxkyMsWuapj0X0/UMlr64QQE8BYcfB+yBIgcmmeTMoVOaZw6BlUONpMDQEfj+hCz1Om58M5Qgu6tKjn+MTKwFtAq7tg+AAAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Console solution is generated"\n        title=""\n        src="/static/console-solution-generated-a9e53ff433e7448bf77f25765dc204f0-c83f1.png"\n        srcset="/static/console-solution-generated-a9e53ff433e7448bf77f25765dc204f0-569e3.png 240w,\n/static/console-solution-generated-a9e53ff433e7448bf77f25765dc204f0-93400.png 480w,\n/static/console-solution-generated-a9e53ff433e7448bf77f25765dc204f0-c83f1.png 960w,\n/static/console-solution-generated-a9e53ff433e7448bf77f25765dc204f0-77db8.png 1215w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    \nNotice how it’s a very minimal template and only consists of a gitignore, a main class and the project configuration file. There is no <code class="language-text">AssemblyInfo</code>, no <code class="language-text">bin</code>/<code class="language-text">obj</code> folders, no <code class="language-text">app.config</code>, etc.</p>\n<p>More information about the generator can be found <a href="https://www.npmjs.com/package/generator-aspnet">here</a>.</p>\n<h1>Installing Visual Studio Code</h1>\n<p>Time to get that new editor up and running!</p>\n<p>Go to <a href="https://code.visualstudio.com">https://code.visualstudio.com</a> and download the zip file. Navigate to your Downloads folder and create a folder which will hold the unzipped content. I just left this in Downloads, you might as well put this elsewhere (which you probably should if you use Linux properly).</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">mkdir VSCode</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">unzip VSCode-linux-x64.zip -d VSCode</code></pre>\n      </div>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">cd VSCode</code></pre>\n      </div>\n<p>And start the editor with</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">./Code</code></pre>\n      </div>\n<p>Here’s one tricky thing: if you now look at Visual Code, there’s a good chance you’re seeing something like</p>\n<blockquote>\n<p>Cannot start Omnisharp because Mono version >=3.10.0 is required</p>\n</blockquote>\n<p>When you look at your own installed Mono version (<code class="language-text">mono --version</code>) you’ll notice that you have 3.2.8 installed. Likewise if you now try to execute the HelloWorld app, you will receive <code class="language-text">TypeLoadException</code> errors.</p>\n<p>Luckily this can be easily solved: install the <code class="language-text">mono-devel</code> package. This will overwrite your installed Mono with version 4.0.1 which is released just yesterday and everything will work flawlessly.</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">sudo apt-get install mono-devel</code></pre>\n      </div>\n<h1>Executing the Console application</h1>\n<p>There’s just one last thing left to do: create a .NET execution environment and execute our app.</p>\n<p>First create a default execution environment:</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">dnvm upgrade</code></pre>\n      </div>\n<p>and execute the app (from the directory where <code class="language-text">Program.cs</code> is contained):</p>\n<div class="gatsby-highlight">\n      <pre class="language-text"><code class="language-text">dnx . run</code></pre>\n      </div>\n<p>You should now see Hello World printed out!</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/helloworld-e853b1075bc016c5082fe1754cf11080-3a7de.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 630px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 6.0317460317460325%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAABCAIAAABR8BlyAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAQUlEQVQI12Pw1XHy03Px13VxVbJ0V7VxVrS0lzFxVbZyUbJ0UjB3U7F2kDV1VbaEiLgqWTnKmTormJsJadtIGAAAjVwMaQb1mk4AAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Hello World!"\n        title=""\n        src="/static/helloworld-e853b1075bc016c5082fe1754cf11080-3a7de.png"\n        srcset="/static/helloworld-e853b1075bc016c5082fe1754cf11080-6adbd.png 240w,\n/static/helloworld-e853b1075bc016c5082fe1754cf11080-13977.png 480w,\n/static/helloworld-e853b1075bc016c5082fe1754cf11080-3a7de.png 630w"\n        sizes="(max-width: 630px) 100vw, 630px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',fields:{tagSlugs:["/tags/c/","/tags/net/","/tags/linux/","/tags/visual-studio-code/","/tags/dnx/"]},frontmatter:{title:"Hello Linux!",tags:["C#",".NET","Linux","Visual Studio Code","DNX"],date:"2015-05-01T00:00:00.000Z",description:"Like many other .NET developers I have been following the Build conference that’s going on right now. One of its biggest announcements (so far) was the release of Visual Studio Code and the accompanying CoreCLR for Linux and Mac. It sounds nice and all but I wanted to try this out myself. I have decided to get a Console Application working in Ubuntu 14.04 since we’ve all seen by now how to deploy an ASP.NET web application."}}},pathContext:{slug:"/posts/hello-linux/"}}}});
//# sourceMappingURL=path---posts-hello-linux-e8bb8ffdccfc58a7b569.js.map