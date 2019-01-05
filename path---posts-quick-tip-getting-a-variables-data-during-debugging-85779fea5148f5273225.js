webpackJsonp([0x5ccdb8cb5425],{439:function(e,a){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"C:/Source/vannevelj.github.io/lumen/src/pages/articles/2015-06-09---Quick-Tip-Getting-A-Variables-Data-During-Debugging/index.md absPath of file >>> MarkdownRemark",html:'<p>Ever wanted a quick overview of an element in debug mode? If you want to know a value a couple of layers deep, you soon have something like this:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/layereddebuginfo-ca81bb322632bb643aef6642aa290496-27984.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 642px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 56.230529595015575%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAIAAADwazoUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABv0lEQVQoz21RDW+bMBDl//+kaZu2tlEgJR/AIEAwBAw2NsZAgLQZBXak0zZVe3o+2af7eL5T1J36aWV/W1tfV+bnp8OXlbF6tjHlJC9JLhbLSsrk+x2TIs44JlzyfSs1RfBYN9yNcVL3HnBjBOut+31tPKjm4+bHowa0wD6o1pNmOW7geOjoo0sdDa+x0t9uKDrrB2etO7oZ7O3z1kLa7vh88LS9uzWRbiHTCRkvSM76vr9ery8vr+M4zfOsiK5nhbCdo2W7QZRkeRFjekJnFCWYsCwX4KFMcCHvrHghb7ef84JJaS9NnjNorumW4YRRWoSYH6zTzvBclP7hMcBA55QAofM9eVbGcTzHSUYISXEYBPAEL1RMARjnlAJJlsIBlkLIUgzD8Dt5eJsY576/SA5RWII2xqWsSykhsqpqIAfFshKinKZp/gdK179llPqeH0bxOY5xltGcJRiLUjZ1U9d10zRsKQeFqo/JoBOkub4fRSEohAghBAimlELCZUHDeQEA8z7kv8lQDAq7nodQmCQY4qBzDBJwmt0B06Akb5q2ubQfO8PvYXqwP9hg1/fdfZFdt1wW2/Vt24Fn/h9+AfQNV4v59HzyAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Debug layers"\n        title=""\n        src="/static/layereddebuginfo-ca81bb322632bb643aef6642aa290496-27984.png"\n        srcset="/static/layereddebuginfo-ca81bb322632bb643aef6642aa290496-e1dd0.png 240w,\n/static/layereddebuginfo-ca81bb322632bb643aef6642aa290496-277b7.png 480w,\n/static/layereddebuginfo-ca81bb322632bb643aef6642aa290496-27984.png 642w"\n        sizes="(max-width: 642px) 100vw, 642px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>This poses several annoyances:</p>\n<ul>\n<li>You have to keep your mouse within boundaries.</li>\n<li>It obstructs your code.</li>\n<li>You have to scroll to see all properties.</li>\n<li>You can’t do anything else.</li>\n</ul>\n<p>An alternative which I very much like is <code class="language-text">?</code>. That’s right, a simple question mark. Use this in combination with your immediate window and it will print out all the data you normally get from hovering. For example as you can see in the image below: <code class="language-text">?_affectedProperties</code> will show me the string representation of the list. I can also use more complicated expressions like <code class="language-text">?_affectedProperties.ElementAt(0)</code> to get the detailed info of deeper layers.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/questionmarkimwind-f11d64465dc39b6cf86e11b57c135fb7-2a9c4.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 74.42965779467681%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB4ElEQVQ4y4WSy2+bQBDG+f/PvTXJoarS9tRb6+QWKa1MeD+N7fCywcZSW0NE0hqSfJ1dG4QoqIefhp3dGWa+GSGOIpT1H7y+vOD5+RVFHqH4qWH/wyBrosxtPBbOkQeHzkRx5OnB5f7ydM+sECdbFL8fUdc1DocKeZ4j3/8iu0dZlqiqwz/UdYW66tA5C28uPuPdp2u8ff8F5x+ucPHxuoWdzy4nOL+8Iian7wm9/crfDyHc3IoQ7xR8n8qYkpUUHZJqQCYU1YRm2OQzoOpWi7cMsPQjLAYQWAJVVaFpOseybMw8D543x3y+4Nzf+wjDCFEcI0lTZLvdKIJuOJhORUiyAtNyKGiFdLNFQqQdNtusJe3ddeEJJUkmFFj2MWE3eCxJ4+u/E1TNgijeQVFUOK6H1TrBOkk53cCxhP2kgm46pKEGwyCxSS/fD3iVYcT02mCb7UYrHvILimbyljXdoEEsWg0ZTaV92I9GK3RmSz5Rd+ZhRrCpsu8lTTagyYZhzKsN+JSPlTc6DyZkO8XWIaBAPwg5TMf2UcbYta03drRltqi6YcJ2XN4yq6Sv29hQhhPSlJmGOmnouDPMF0veEiNerVtN/7d/7R7efhMhn1am0YkJz9perVNOuslGK+rzF08+OUMVL1o0AAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Immediate Window"\n        title=""\n        src="/static/questionmarkimwind-f11d64465dc39b6cf86e11b57c135fb7-c83f1.png"\n        srcset="/static/questionmarkimwind-f11d64465dc39b6cf86e11b57c135fb7-569e3.png 240w,\n/static/questionmarkimwind-f11d64465dc39b6cf86e11b57c135fb7-93400.png 480w,\n/static/questionmarkimwind-f11d64465dc39b6cf86e11b57c135fb7-c83f1.png 960w,\n/static/questionmarkimwind-f11d64465dc39b6cf86e11b57c135fb7-2a9c4.png 1052w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    \nAlso worth mentioning is <a href="https://marketplace.visualstudio.com/items?itemName=OmarElabd.ObjectExporter">Object Exporter</a> which is an extension that does this for you.</p>',fields:{tagSlugs:["/tags/c/","/tags/debugging/","/tags/visual-studio/"]},frontmatter:{title:"Quick Tip: Getting a variable's data during debugging",tags:["C#","Debugging","Visual Studio"],date:"2015-06-09T00:00:00.000Z",description:"Ever wanted a quick overview of an element in debug mode?"}}},pathContext:{slug:"/posts/quick-tip-getting-a-variables-data-during-debugging/"}}}});
//# sourceMappingURL=path---posts-quick-tip-getting-a-variables-data-during-debugging-85779fea5148f5273225.js.map