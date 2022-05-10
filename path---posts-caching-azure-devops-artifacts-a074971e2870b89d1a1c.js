webpackJsonp([57119089648606],{495:function(e,t){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2019-06-03---Caching-Azure-DevOps-Artifacts/index.md absPath of file >>> MarkdownRemark",html:'<p>As part of my Azure DevOps pipeline, I’ve got a step to restore <code class="language-text">yarn</code> dependencies:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/pre-411da109e0676bf4f6f669486e9f86b8-eef6f.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 97.19813208805871%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAACXBIWXMAACToAAAk6AGCYwUcAAAB4klEQVQ4y51U226bQBTke6N+iJ/9mObJT1WVfoBVyapfiuNKreS4RKmdxpiruS5g7obJnq1jNWrTGlaMDohlmJndPdJ4PMZisUCSJPB9X4Dum6bB4XA4GzQ/yzJIg8EAk8kEeZ4jiiJBRvd9Bn0njUYjyLKMOI6x2+0QhqH4G422bc/GifDy8i1msxmqusZ+v0dZloKw7UFo2ztIw+EQ0+kUccRgmQYiFh4NtB3M/pqrbbek8Aqf5TmysgFLcqRFDX5xtMirhqP9L0o+t+YpPaoapHdKiPGdgy/KFjd3OuYcN4oGxYjx4JVYO8WrWHFs/BLyJsVHxcO372tIn1Yuvqoh1ibDymDYuClUN4MelDBYDSOseH0F/J3JqxpUeHBy3N4/Qnq/MDD/aSP0XBGq73l8cZJjNG23DDVueeWEsFiCPd9/tHVo6Yui6Lx1ToTIFRxSA44bwHVdBEEgUFVVP8L1j1vYlob4qJCOT5qmfyj8p+HfCS8u3uD6+oMg8Xh+dPwYY6dJ7Rk5viBUVVVYJGXPIHKqvRQul0uYpgnHcfgq27AsS2RJ9nsREgnZpHNMnYbQxe5fFZIqyu9ZJTWIPt1GEJJdalm0EJQlVXqueffpOl4oJDLKjkAREGHXjq3rOp4AQu+4KqWGSNEAAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Pipeline before the change"\n        title=""\n        src="/static/pre-411da109e0676bf4f6f669486e9f86b8-c83f1.png"\n        srcset="/static/pre-411da109e0676bf4f6f669486e9f86b8-569e3.png 240w,\n/static/pre-411da109e0676bf4f6f669486e9f86b8-93400.png 480w,\n/static/pre-411da109e0676bf4f6f669486e9f86b8-c83f1.png 960w,\n/static/pre-411da109e0676bf4f6f669486e9f86b8-23e13.png 1440w,\n/static/pre-411da109e0676bf4f6f669486e9f86b8-eef6f.png 1499w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>If you run your pipeline somewhat regularly then you’ll soon come to see this as a bottleneck. Indeed, if you actually take a look at the execution times of each step then you’ll notice that this task is responsible for a large part of the work. Given that it is not <em>that</em> common to update your dependencies (relative to other code changes), we should try and shave some time off here.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/pre-timing-dce82889715d176e3ce147a8263d6e26-e5628.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 49.76897689768977%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAACToAAAk6AGCYwUcAAAAo0lEQVQoz6WS2w7DMAhD+/+/um5rLiSBJPWglda9jiL5Cck6NixrfCLGiMIVVRps9n13SUSwvNIbKSXkRmi9uc1MzIzlEVds2wYqBJKiCz9hrfUkjCGAqhpyxhS6R2gdGmGmrIaEMeRvI5sxxlHdQRiU0AyzGnZd+AnbRWiXNsLWWUuEP/IvIR2E/d7bfDvMZ2RRQy/h9YcaN+uVCxfMOd2yyB9HKhR/y/kZCAAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Task timings"\n        title=""\n        src="/static/pre-timing-dce82889715d176e3ce147a8263d6e26-c83f1.png"\n        srcset="/static/pre-timing-dce82889715d176e3ce147a8263d6e26-569e3.png 240w,\n/static/pre-timing-dce82889715d176e3ce147a8263d6e26-93400.png 480w,\n/static/pre-timing-dce82889715d176e3ce147a8263d6e26-c83f1.png 960w,\n/static/pre-timing-dce82889715d176e3ce147a8263d6e26-23e13.png 1440w,\n/static/pre-timing-dce82889715d176e3ce147a8263d6e26-10d8f.png 1920w,\n/static/pre-timing-dce82889715d176e3ce147a8263d6e26-6bb82.png 2880w,\n/static/pre-timing-dce82889715d176e3ce147a8263d6e26-e5628.png 3030w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Luckily for us, Microsoft has already released <a href="https://github.com/microsoft/azure-pipelines-artifact-caching-tasks">a task</a> that can do exactly this. In order to get it to work we just need to add a single task. Note that you have to put your caching step <em>before</em> the regular restore step.</p>\n<p>You’ll need an Artifacts feed to publish the cached archives to.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/post-8956f17e6cfed5a3622f57d94f59bf0c-ab450.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 21.903731746890212%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAECAYAAACOXx+WAAAACXBIWXMAACToAAAk6AGCYwUcAAAAmUlEQVQY032P2wqCQBRF/f/vMvqFoJcoCm10HLVx7q0ciYpuBxb75bA2uyjLEmctXBPvF7xDSokxBu/9gnMOHwIppa8Uq3JNLUfkaOgu9o5jsAnRTwghUEqhtcbOxVmeM8ZImMWv5MJiu6/ZnRoOZ0WtJqpOL9nqyLG90DYNfd8vwiz5xUO4qTqmcSDF8DE5hufkPPWfMJN/bgPXNrUc0Y2AAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Pipeline with the cache"\n        title=""\n        src="/static/post-8956f17e6cfed5a3622f57d94f59bf0c-c83f1.png"\n        srcset="/static/post-8956f17e6cfed5a3622f57d94f59bf0c-569e3.png 240w,\n/static/post-8956f17e6cfed5a3622f57d94f59bf0c-93400.png 480w,\n/static/post-8956f17e6cfed5a3622f57d94f59bf0c-c83f1.png 960w,\n/static/post-8956f17e6cfed5a3622f57d94f59bf0c-23e13.png 1440w,\n/static/post-8956f17e6cfed5a3622f57d94f59bf0c-10d8f.png 1920w,\n/static/post-8956f17e6cfed5a3622f57d94f59bf0c-6bb82.png 2880w,\n/static/post-8956f17e6cfed5a3622f57d94f59bf0c-ab450.png 3698w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>The “Key file” is what the task will use to validate your cache and generate a new entry in case the file changed. We key on <code class="language-text">package.json</code> rather than <code class="language-text">yarn.lock</code> because there can be dependencies that themselves don’t depend on other packages — in which case those builds wouldn’t get cached. It does mean we will also invalidate the cache when other changes are made (e.g. the <code class="language-text">scripts</code>) but that is a small price to pay.</p>\n<p>The “Target folder” is the actual folder you want to cache, in this case it’s our resolved packages.</p>\n<p>The first time that you’ll now run your pipeline, it will not find a cache entry so execution timing will be as usual. However at the end of the pipeline it will execute a post-job step which takes the data inside <code class="language-text">node_modules</code> and caches it in your artifact repository.</p>\n<p>The next time the pipeline runs, your caching step will resolve the caching entry and restore the data. The usual restore step will now notice that the data is already there and skip on happily. There is still some cost involved with reading and writing the packages but it’s clearly faster than before. Strangely, the <code class="language-text">build</code> step has also gone down dramatically in cost — this is unexpected and I’d be happy to learn if anyone has a suggestion why this happened.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-028d6.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 50.85198797193452%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAACToAAAk6AGCYwUcAAAA7klEQVQoz52SWY4DIQxEuf9NszcYDJilxiaTSPlKdywhkEDPRZXdI27IzGDJqK0CExhzYv6wRATutJ0RfAAxIUvRCxwGtT5MB3JmuDvdQYHAxVQy5uiwsgd7gX2MtZdS4M7+AlKFIRFiCqjstVNel9JFu7ddUCyFGe4abuvLMUZQjijqg1RZfhisq+JvsJfnH8DECUm/PObAq474+KHQbx5EBCpxJb26qi8GPwJ9Ay0UU2gpt/9QflFZa4W7+Cu2x4ZAGgxrKFLRWlsePn3su3x8A286NimmFUqyAddZsoRZzyVr0u0ZDr7Mp5UB/wBCaROd+LfPhwAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Task timings"\n        title=""\n        src="/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-c83f1.png"\n        srcset="/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-569e3.png 240w,\n/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-93400.png 480w,\n/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-c83f1.png 960w,\n/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-23e13.png 1440w,\n/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-10d8f.png 1920w,\n/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-6bb82.png 2880w,\n/static/post-timing-702c3bcd87fcb4cf2a84e16f89f9f4cb-028d6.png 2993w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Looking at the execution times of my builds, you can see a clear difference between builds that had cached packages and those that had to restore it from scratch.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/updownupdownupdown-7f902d3960b0ad5b87757e9f9a398c70-bd266.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 896px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 48.660714285714285%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAACToAAAk6AGCYwUcAAABxklEQVQoz52S208TQRSH+/f54CXGeEErGChJkYgmmmh49s0HH4jRhLRVIa1EiZEEagAvoYJADBJEyqWNxhRtQUuh687szn7OzGrTCC86my/nzJzd3/zO7EQIFGAI/uLPuo95x1e+RqF+Y+aqee77BEFApOoo1is+GxWX4rbgkyZfdlnTFLYkq98U23sBP5yA747Z4ODRECzvVlksFXCE4qcMMfme8Pha22H28zKlnS1qbl3XhP1Y+pK6qFsBi34agmMr47Rm4roFz7YaRkgvPObS0+u0ZbqIP7nKlWe99I7dxPUELzdyunbDCit7HE0tj340ghf3tXB76h7H77fSPtSjRbuJpuOcGei0tYm115weiB3ccjY/SctgJ4m5Qe7OpLgznWBk+bl1YzYygh1DlzU9Ns8sDHPrVR9tj7rpy/WTmk+Tzb+w/zEUXJnkcKJFuznP0eQ5jiTP2njyYbt2FNNOOmwM8xjHUlFOPLgQ5skoh/pP0TV8zbo07Ufy5XVGPmR5U5wnV5zVMSRXeMtUYWYfzbXp4pyN774sGnuhw/elJZY2VynXoLILm1X+azTOUEqJ0NdBehJXCBw3zIVel/+A54W34xfqHsCobRNLbQAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Build times"\n        title=""\n        src="/static/updownupdownupdown-7f902d3960b0ad5b87757e9f9a398c70-bd266.png"\n        srcset="/static/updownupdownupdown-7f902d3960b0ad5b87757e9f9a398c70-ed2eb.png 240w,\n/static/updownupdownupdown-7f902d3960b0ad5b87757e9f9a398c70-9371d.png 480w,\n/static/updownupdownupdown-7f902d3960b0ad5b87757e9f9a398c70-bd266.png 896w"\n        sizes="(max-width: 896px) 100vw, 896px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>',fields:{tagSlugs:["/tags/azure/","/tags/dev-ops/","/tags/ci-cd/"]},frontmatter:{title:"Caching Azure DevOps artifacts",tags:["Azure","DevOps","CI/CD"],date:"2019-06-03T10:00:00.000Z",description:"Caching time-consuming tasks in your Azure DevOps pipeline"}}},pathContext:{slug:"/posts/caching-azure-devops-artifacts"}}}});
//# sourceMappingURL=path---posts-caching-azure-devops-artifacts-a074971e2870b89d1a1c.js.map