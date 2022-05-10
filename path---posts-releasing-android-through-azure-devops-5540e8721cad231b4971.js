webpackJsonp([0xe02a368704c2],{513:function(e,a){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2019-06-04---Releasing-Android-Through-Azure-DevOps/index.md absPath of file >>> MarkdownRemark",html:'<p>Releasing an Android app manually is cumbersome: you have to build your .apk/app bundle, find your key to sign it with and step through the Google Play console to get it all out the door. Certainly for small apps where you might have a small improvement to make every now and then, it often feels like more effort than you really want to put into it.</p>\n<p>In this short walkthrough I’ll lay out the general steps on how to setup your Azure DevOps pipeline in such a way that a single commit to the <code class="language-text">master</code> branch will trigger a new App Store release.</p>\n<p>I will assume that you already have a working Android app released on the App Store and have the certificate available.</p>\n<h2>Summary</h2>\n<p>We will create a pipeline that executes the gradle task and signs it with our private key. We create a Google Developer service account and link it to our Google Play project. We’ll then connect the Google Developer service account to an Azure DevOps service connection. We use that service connection to execute a deploy task to the Google Play store.</p>\n<h2>Setting up CI</h2>\n<p>Go ahead and create a new pipeline based on the Android template. Connect it to your Github repo and changed the generated <code class="language-text">azure-pipelines.yml</code> with the following configuration:</p>\n<div class="gatsby-highlight">\n      <pre class="language-yml"><code class="language-yml">trigger:\n- master\n\npool:\n  vmImage: &#39;macos-latest&#39;\n\nsteps:\n- task: Gradle@2\n  inputs:\n    workingDirectory: &#39;&#39;\n    gradleWrapperFile: &#39;gradlew&#39;\n    gradleOptions: &#39;-Xmx3072m&#39;\n    publishJUnitResults: false\n    testResultsFiles: &#39;**/TEST-*.xml&#39;\n    tasks: &#39;assembleRelease&#39;\n\n- task: DownloadSecureFile@1\n  inputs:\n    secureFile: &#39;calcubaker.jks&#39;\n\n- task: AndroidSigning@3\n  inputs:\n    apkFiles: &#39;**/*.apk&#39;\n    apksignerKeystoreFile: &#39;calcubaker.jks&#39;\n    apksignerKeystorePassword: &#39;$(keystorePassword)&#39;\n    apksignerKeystoreAlias: &#39;$(keyAlias)&#39;\n    apksignerKeyPassword: &#39;$(keyPassword)&#39;\n    zipalign: false\n\n- task: CopyFiles@2\n  inputs:\n    Contents: &#39;**/*.apk&#39;\n    TargetFolder: &#39;$(build.artifactStagingDirectory)&#39;\n\n- task: PublishBuildArtifacts@1\n  inputs:\n    PathtoPublish: &#39;$(Build.ArtifactStagingDirectory)&#39;\n    ArtifactName: &#39;drop&#39;\n    publishLocation: &#39;Container&#39;</code></pre>\n      </div>\n<p>Couple of things to note here:</p>\n<ul>\n<li>Make sure to specify <code class="language-text">assembleRelease</code> and <code class="language-text">assembleDebug</code> as appropriate (default is <code class="language-text">assembleDebug</code>)</li>\n<li>I uploaded the keystore to the “Secure Files” location. More info on that <a href="https://docs.microsoft.com/en-us/azure/devops/pipelines/library/secure-files?view=azure-devops">here</a></li>\n<li>Specify your passwords as secret variables in the pipeline configuration</li>\n</ul>\n<h2>Setting up CD</h2>\n<p>You really only need one task here which really simplifies a lot for us. Make sure you add the <a href="https://marketplace.visualstudio.com/items?itemName=ms-vsclient.google-play">Google Play extension</a> to your organization. Once you’ve done that, add the “Google Play Release” task with a similar configuration:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-92b22.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 48.51517107811492%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAACToAAAk6AGCYwUcAAABOUlEQVQoz42S527DMAyE9f7v158FggRZXoq1py+kMtwUaREDH0gPnI48CxsLZl/gQ4CUEvM8I1C/LEujXY+K9db5iFIyURBThvcOS60QUk6QF0WCETFGhHir3nuknFHpo1wI6lNKDe5vwrdDfSLRXOHInFAk6J29H12BWqiWZ7/U3Hp2ba19ij7cc20HVq4LxNexw+YwYHu+4CgtBpPR64RB59afVcJuCs2xc645fjhb17Iivk8jtsTmJLEfNA6TwWFc2RM7ej7PCl3XtT233dHY+Q0i0Bg8MuOsIfQrRiPwe3LIgfHyMwWRcqGNlBYKw84ZobXGinmDhjG2jcuC7IxD8Ol1dA7S+QBhjMF/sCCHwWilmtPMSRPx/ke0v4NCi/TsY0FFYn3fY5zG5wG/SZ8Kcv2Z8l/wLq9gmgolNcewMwAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Google Play release task definition"\n        title=""\n        src="/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-c83f1.png"\n        srcset="/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-569e3.png 240w,\n/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-93400.png 480w,\n/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-c83f1.png 960w,\n/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-23e13.png 1440w,\n/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-10d8f.png 1920w,\n/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-6bb82.png 2880w,\n/static/google-play-release-task-7bcf8bca9a4af1903b7ce3797a6849a4-92b22.png 3098w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p><em>note: I’m not entirely sure why the release has the <code class="language-text">-unsigned</code> suffix but given that it succesfully releases on the App Store, I assume it’s not an issue.</em></p>\n<p>When you <a href="https://buddy.works/knowledge/deployments/google-play-private-key-and-permissions">create the service endpoint</a> in the Google Developers Console, you <em>have</em> to  give it a role, even though the step is marked as optional. Failure to do so will make it doesn’t show up in the Google Play Console (which is where you can connect the service account to your project).</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-ca539.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 63.84113811499703%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAAACXBIWXMAACToAAAk6AGCYwUcAAABfklEQVQ4y5VSi3KDIBD0//+wnZr4VkQhiUZ84fYOo2OazjRlZoeDg2VvOU9rhdPJRxAEDmEY4nw+Q2uNoe9hug7GmB3dY939ss/wxmlG074m53kGpTDbBdZah2VZHKzd5ud9hifUhI+owUVXqKoKUkrkRYHufsNn0iPKNCopUJbS5dcz67k1LiGEwPV6RdM08Ij0rcFKWPWGibApnA+x17YtoihCnufIsgxxEiOOY+dlQUrZzyAI0ZOf7wyvJZn8KVEUElFEl8/75zB836f8CUmSIE1TejhDIcgWoUjlWt6Th/yyKGvyQ0ES+LAoyataQSnlfruuaxfLh2eVblFU1AGDPRA+FN7uM77CGleaGwO0VNntbiH18Gd5aZo4/zZSR9iZEUJqKN3saLsRdzM/lfIKYJqmnWgnpBC6mSDqAUXdI68MhvG1lJ9jOSSOsWsbhuUXyWSel43slwvH9ab2SSH3DitLpXF9xL5cLpeXC+8OR9gPowPH7MvR6P8SfgNGl/Mm1vnSkQAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Service account role"\n        title=""\n        src="/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-c83f1.png"\n        srcset="/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-569e3.png 240w,\n/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-93400.png 480w,\n/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-c83f1.png 960w,\n/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-23e13.png 1440w,\n/static/service-account-role-3cb4e230b17f43f0215ca1d55a4c6192-ca539.png 1687w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>You will now be able to connect your service account to the project.</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/google-play-api-16ad816412389f179ffd555eecdf7c21-3e7a9.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 49.45152683071449%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAKCAYAAAC0VX7mAAAACXBIWXMAACToAAAk6AGCYwUcAAABeElEQVQoz3VSW07DMBDMeYGChITEBRBFQgihghDigxvwx4lomygP5+k4zmPYceoq/aDSdMfe9Xh3nCDOcqg8R1U3wDTh6/sHZ3cvuH3+xMX9BufCVxJX69eZrze4FM61j1cPb7h5+sD14zuCtm1R1zWstej7Hr/bLeI0RZJmiOLYxVLyjW6RZBnqRjtOkB+h5xhUVYVcOqQwBaMochcURYE0Sdx+K8VN07ioCeGN1DBnjIFhFNiuQwD5sch3GIYhyrKEUsrx3W6HWDrNpLtC9vVBlBewfhzHEwSD/LHVSfxbCrJDcop1crM/wLpR4KKsh2E4gRPMK31MLjvc7/euM65pC8F9XkbOSHsIWscY8CZ6Qi84thf03jrxXB0FlJpjKg9XOO81qoMVxrQIKFIvDOaj8AC594o5jk14r4dxQmsHGV/ewFjorkfXi4c8xG5YuByZonyQrXxGHJv5pagV0c72TtxzK3AdsgP/KL5DP+J/mPOzr8WBE382Mu+nDmuN3AAAAABJRU5ErkJggg==\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Connect Google Play to Service Account"\n        title=""\n        src="/static/google-play-api-16ad816412389f179ffd555eecdf7c21-c83f1.png"\n        srcset="/static/google-play-api-16ad816412389f179ffd555eecdf7c21-569e3.png 240w,\n/static/google-play-api-16ad816412389f179ffd555eecdf7c21-93400.png 480w,\n/static/google-play-api-16ad816412389f179ffd555eecdf7c21-c83f1.png 960w,\n/static/google-play-api-16ad816412389f179ffd555eecdf7c21-23e13.png 1440w,\n/static/google-play-api-16ad816412389f179ffd555eecdf7c21-10d8f.png 1920w,\n/static/google-play-api-16ad816412389f179ffd555eecdf7c21-6bb82.png 2880w,\n/static/google-play-api-16ad816412389f179ffd555eecdf7c21-3e7a9.png 3373w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>When you create the service connection inside Azure DevOps, make sure to use the auto-generated email address associated with the Google Service account.</p>\n<p>That’s it! You now have a fully integrated CI/CD pipeline for your Android apps. I have also provided integration with App Center in my own pipeline just to test out how it works but this is optional. I did search for a Fabric.io task but there isn’t any — this might be important in case you want to integrate with beta testers outside of the Google Play environment. App Center provides a fairly seemless integration with Azure DevOps which makes it easy for packaged Android builds to get picked up and distributed.</p>\n<p>The end result is 20 minutes in-between a push to <code class="language-text">master</code> and a notification from the Play store that my update is live, without any action undertaken by me in the meantime.</p>\n<h2>References</h2>\n<ul>\n<li><a href="https://docs.microsoft.com/en-gb/azure/devops/pipelines/languages/android?view=azure-devops">Build, test, and deploy Android apps</a></li>\n<li><a href="https://buddy.works/knowledge/deployments/google-play-private-key-and-permissions">Setting up a Google Play services account</a></li>\n<li><a href="https://docs.microsoft.com/en-us/appcenter/distribution/vsts-deploy">Distributing to App Center</a></li>\n</ul>',fields:{tagSlugs:["/tags/azure/","/tags/dev-ops/","/tags/android/","/tags/ci-cd/"]},frontmatter:{title:"Releasing Android through Azure DevOps",tags:["Azure","DevOps","Android","CI/CD"],date:"2019-06-04T23:00:00.000Z",description:"Configure CI/CD for Android on Azure DevOps"}}},pathContext:{slug:"/posts/releasing-android-through-azure-devops"}}}});
//# sourceMappingURL=path---posts-releasing-android-through-azure-devops-5540e8721cad231b4971.js.map