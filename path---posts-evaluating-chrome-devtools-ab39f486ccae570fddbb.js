webpackJsonp([0x9f14b78f2815],{497:function(e,a){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/Users/jeroenvannevel/Documents/source/vannevel.net/src/pages/articles/2019-01-19---Evaluating-Chrome-Devtools/index.md absPath of file >>> MarkdownRemark",html:'<p>While debugging with some <code class="language-text">console.log</code> statements I noticed that the values logged seemed to differ from what they initially said. Upon uncollapsing the log entry it would consistently show a <code class="language-text">NaN</code> value for some property values while it clearly stated the proper value above it.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/console-log-827ff2858062ac2c4198046cce6b994d-451f7.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 31.806615776081426%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAGCAYAAADDl76dAAAACXBIWXMAAAsSAAALEgHS3X78AAAA3klEQVQY06VQW07EMAzsnTkCd+AAfPCxfHMBToKgLWq33WbZ5mUnmZ1k/5AQSFia2JnYYzudKrCur1iXB8zTM/b9if4Rn+MLYgzkI6wN5D22TRjvMMbw7rCdFIacD3x3CaUUdAWAxndczncYhnuSA0qeoHpsCaoFOWeiQCQjpUROmhe5caqMtSoBXT28NVj6A8a3A2JI7C4tMbCz947wLQZuRT9Zm7AGEhNOfcY2Fq7guO4OZyNFK5SQhlrwG5pglgSzXNB/WPzXuqoafIA9e9ivyJUj5nni59s/TfQdVxJO0yNtDLzaAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Console output"\n        title=""\n        src="/static/console-log-827ff2858062ac2c4198046cce6b994d-c83f1.png"\n        srcset="/static/console-log-827ff2858062ac2c4198046cce6b994d-569e3.png 240w,\n/static/console-log-827ff2858062ac2c4198046cce6b994d-93400.png 480w,\n/static/console-log-827ff2858062ac2c4198046cce6b994d-c83f1.png 960w,\n/static/console-log-827ff2858062ac2c4198046cce6b994d-451f7.png 1179w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>As it turns out this is caused by Chrome re-evaluating the object with the data it has at the moment you uncollapse it rather than just showing you what the values were at that moment in time. There is a small info icon that does aim to explain this behaviour but its wording does not really clarify the most important aspect, which is that it re-evaluates it without the original context.</p>\n<p>We can quickly verify this behaviour ourselves by defining an object, logging it and making a change to the object prior to uncollapsing:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/demo-initial-2b917fed2abcdb1ce14a216f70da00d0-11e6d.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 250px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 52.400000000000006%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAABJ0AAASdAHeZh94AAABL0lEQVQoz51Si26EIBDk/z/wLjZtqlfRi7WxKsjbKQvH9ZH0eukmIysswzAsM8aAoDcNJRSCD1hXBRFzZ21ak1JC67i+KUiR64UQcdRYF53qpRRpniUyGyf5gtfDEEktjscJp5NEMBKbWDHPC/q+jyQS587G/xVt28J7i4ejBn8xkXQCBQshgOC9h70oSodoC+dcVOxRaij2PdfmfEeO/TK3Z4WEaZrQdR3qusY4jjHnaJoGSqnr5nvAiJlQvCqnh/BZlBXm8U9CIiIVnHNUVZVIyzX+E1cPCUROvpE1xmTColiKgE2a5OF3/34QUjt47zAMQ1JJUJtF126pFchX5zyqg8LT4xAPdjc9ZfQhVfTCxU9S66zLr5w6ICRS/+XFfwOL/YtnLjC/v928yr3xAUV6DzVALdGWAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Declaring an object"\n        title=""\n        src="/static/demo-initial-2b917fed2abcdb1ce14a216f70da00d0-11e6d.png"\n        srcset="/static/demo-initial-2b917fed2abcdb1ce14a216f70da00d0-477d9.png 240w,\n/static/demo-initial-2b917fed2abcdb1ce14a216f70da00d0-11e6d.png 250w"\n        sizes="(max-width: 250px) 100vw, 250px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Change a value on the object:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/demo-action-b99803a6e89c5daf98a27b7e300a6b21-bbffd.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 284px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 62.323943661971825%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAACXBIWXMAABJ0AAASdAHeZh94AAABZUlEQVQoz5WSCWrEMAxFc//LlV4gNDTLTJaJl0wcy8uv5JkWSgtNBcIKRt9PX6n6rkdd19juWzn7roXbNwz9ALnbrIU1FsZoPs2j1gbbpvnOQHOtlMK6rmjfW1REhBQTzMWArOdGQtdZpECgw8HajZtFILBA4OYV3jtcB8I03kF0IOeMlBIkKuLGQAH3y1YElfIYhh3ICZ4FjREKxXWGVnupRWQaI5bFlfozRLgQhhBgmGJaZkZfWPSGeZ6ZxONc5K+qEjFJy15prXHfdx5PxrSQx+TVyJbISGeyOo4Dkk3TYJqmn2/n/K3+K6sYYyEUKqFMKYK8mJwfhHwazQtin89E8VAIZe3DcIFzOxtOPL6F0gt/R7y+rLwce4qyeCiUQrizf7KIQA6HI6hbeI6cT41bBEVAsm0bjOMV13GEd/zzKsJbfTypcDqeW07o28BU+Zel/FOQWND7gKHb2cvIzed/kd/yA9LlquMfDixRAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Change property value"\n        title=""\n        src="/static/demo-action-b99803a6e89c5daf98a27b7e300a6b21-bbffd.png"\n        srcset="/static/demo-action-b99803a6e89c5daf98a27b7e300a6b21-1e1a9.png 240w,\n/static/demo-action-b99803a6e89c5daf98a27b7e300a6b21-bbffd.png 284w"\n        sizes="(max-width: 284px) 100vw, 284px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>If we now uncollapse the previous log statement, we can see it got re-evaluated based on our current context</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/demo-result-093fba728f79ad28128d2d4e8cab31ff-69b3b.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 298px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 79.86577181208054%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAYAAAAWGF8bAAAACXBIWXMAABJ0AAASdAHeZh94AAABy0lEQVQ4y5VUi3KbMBDk//8xJXVaMOYl0PuBtndynMEOrlvN3EiAbnV7u6Ia+gFt20Ibg647Q8kVRmusi8S68tpAKwUpJc36MxS05nfX97xvXVYsy4LKe48UE+YfE7z0aFqNc6uQ/DW5H3pKNlhEogROmiDmDT9rDWMkcgZF/ooqxlgAzWzgrYcQlpIc8pYQQiAwTXOEc7SHWDjv4F0mJhExBjyOAshVjvOI7tJhHHui3mIYBmzbttuaD9f76kqFXAUHA3AFTIGBvkcu8y2Rnx/BCiBXx4Cn06nQezXyi+9flFmlvr9QryIJEAl8pZDo2oR3EqwZA8YlHdK8q5BpMKg2GmISRZhxcLh0pHQKcDZDriSUStB2uwM8rHD/EAwBC0W2SGh/hweSucQe7Ai02m/wmmyyKsyCAf1n0pNe7kDvKN8+WGeLcSP5Tc0WarKwZPQtbUWsuq7RNA3O5zP12T2v8GaFRInBk4UsmVh7RFp7Qw7wV9GmaSKPjuV6cc+v1vlur8paSyda1O9vJUGIGcFJ/Pogccb43D7PVObTQqCeNfQjMLZ4koezrP5xn/7qwxQ9JUfUbw63m8a3YK/o/0QlDVWS8kvD/mv8AdQR5xJofqJxAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Uncollapse log statement"\n        title=""\n        src="/static/demo-result-093fba728f79ad28128d2d4e8cab31ff-69b3b.png"\n        srcset="/static/demo-result-093fba728f79ad28128d2d4e8cab31ff-b83ef.png 240w,\n/static/demo-result-093fba728f79ad28128d2d4e8cab31ff-69b3b.png 298w"\n        sizes="(max-width: 298px) 100vw, 298px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Interestingly it looks like the evaluation is only done on the first collapse: subsequent alterations to the property and collapsing/uncollapsing does not change the existing log statement.</p>',fields:{tagSlugs:["/tags/java-script/","/tags/google-chrome/","/tags/debugging/"]},frontmatter:{title:"Evaluating Chrome Devtools",tags:["JavaScript","Google Chrome","Debugging"],date:"2019-01-19T00:03:00.000Z",description:"Simple console log statements are not as innocent as they might seem."}}},pathContext:{slug:"/posts/evaluating-chrome-devtools/"}}}});
//# sourceMappingURL=path---posts-evaluating-chrome-devtools-ab39f486ccae570fddbb.js.map