webpackJsonp([0x73e2db159682],{502:function(e,n){e.exports={data:{site:{siteMetadata:{title:"To kill a mocking bug",subtitle:"Unearthing curious .NET behaviour",author:{name:"Jeroen Vannevel",twitter:"VannevelJeroen"},disqusShortname:"",url:"https://vannevel.net"}},markdownRemark:{id:"/home/runner/work/vannevel.net/vannevel.net/src/pages/articles/2023-10-30---Exploring-Object-Layouts/index.md absPath of file >>> MarkdownRemark",html:'<h1>Background</h1>\n<p>The yearly <a href="https://devblogs.microsoft.com/dotnet/performance-improvements-in-net-8">“Performance improvements in .NET” blog post</a> is always a treasure trove of low-level knowledge on performance. This latest edition had several examples of significant improvements as a result of allocating smaller objects, rather than allocating less frequently. Of course no allocations are even better but at the same time allocations are part of life so they are unavoidable to some degree.<br>\nTake <a href="https://github.com/dotnet/runtime/pull/81251">PR #81251</a> for example: by replacing a couple of fields with a well-known value on an existing <code class="language-text">int</code> field, we can reduce the overall size of each object. After a bit of browsing I spotted <a href="https://github.com/dotnet/runtime/blob/b6b00ec9f606eca0c47e01b30e74ee0d37d561ab/src/libraries/System.Net.Ping/src/System/Net/NetworkInformation/Ping.cs#L21-L31">a similar pattern</a> in <code class="language-text">Ping</code> where it seemed I would be able to apply the same idea: <code class="language-text">bool _canceled</code> and <code class="language-text">bool _disposeRequested</code> could just as easily be flags for the existing <code class="language-text">int _status</code> field. The <code class="language-text">_status</code> field only supports a few values right now so we can easily tack more on.</p>\n<p>After a bit of playing around to figure out how to build the runtime locally and run a comparison benchmark, I ended up with this PR: <a href="https://github.com/dotnet/runtime/pull/94151">https://github.com/dotnet/runtime/pull/94151</a>. Lo and behold, BenchmarkDotNet claims we allocated the same amount after my changes. How is that possible when it literally stores less data?</p>\n<h1>Diagnosis</h1>\n<p>At first I looked at the issue through <a href="https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/debugger-download-tools">WinDbg</a>. To make things easy for ourselves we’ll create two class definitions with the fields of the <code class="language-text">Ping</code> class with and without the two booleans:</p>\n<div class="gatsby-highlight">\n      <pre class="language-cs"><code class="language-cs">using System.ComponentModel;\nusing System.Net.NetworkInformation;\nusing System.Diagnostics;\n\nvar a = new Ping();\nvar b = new Ping2();\n\nDebugger.Break();\npublic partial class Ping : Component\n{\n    private readonly ManualResetEventSlim _lockObject = new ManualResetEventSlim(initialState: true); // doubles as the ability to wait on the current operation\n    private SendOrPostCallback? _onPingCompletedDelegate;\n    private bool _disposeRequested;\n    private byte[]? _defaultSendBuffer;\n    private CancellationTokenSource? _timeoutOrCancellationSource;\n    private bool _canceled;\n    private int _status = 0;\n    public event PingCompletedEventHandler? PingCompleted;\n}\n\npublic partial class Ping2 : Component\n{\n    private readonly ManualResetEventSlim _lockObject = new ManualResetEventSlim(initialState: true); // doubles as the ability to wait on the current operation\n    private SendOrPostCallback? _onPingCompletedDelegate;\n    private byte[]? _defaultSendBuffer;\n    private CancellationTokenSource? _timeoutOrCancellationSource;\n    private int _status = 0;\n    public event PingCompletedEventHandler? PingCompleted;\n}</code></pre>\n      </div>\n<p>Compile this in release mode (<code class="language-text">dotnet build -c Release</code>) and load the .exe in WinDbg, you’ll see something along these lines:</p>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-fb2e5.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 54.392815306520895%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABm0lEQVQoz32S63LbIBCF9f6v1Z+dps0kzji+xEboZl1BSAghy6cLjh3H05qZb0AsnD27Ivix2CNODuA8AeMpFtsY+7hEXjQoK4nqHzS1hBDqStMo1LWLCQRP6wjLXUwfDUTbo5Y9ZDdAGws9WPTDSJxnt1fLDvxQUUJKmpcoaC7LCsaMUKpHoKREliYUKND3HY7HCdNkiQmn0wn3Q5HoMinAGCP22LMdsizxMXcnkK2iDC5b7pGUwBhDwkcveIsXJKfrtEQURQjDkGDIDqmPWWsROMtCCI9Syl+c5/nq6CJ0FaTS1tlZ8AxHkkRfgoyF2G63vgTn0Lm9CN6KXdYtOVwmuXfHCVd2ksZfgh8fO7y+vuBt8YbNZoPVauV7cSt0X/I79ZBz7nEOv5VcVbUvt+97aK19/x6NbpzwnhbenesfI9LbnyKkgp2OGOmg+WSgPunB+Nm456ONfxJaDyhFC5bXVGZGQgdPWVUY7YSu0whmO17a/8DXDDuQoJJom+r/Z2dy+HNX4zlW+BM95hdr8JvLu7PtFbf/FAr8BafiSDqW/C5cAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="WinDbg loaded"\n        title=""\n        src="/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-c83f1.png"\n        srcset="/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-569e3.png 240w,\n/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-93400.png 480w,\n/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-c83f1.png 960w,\n/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-23e13.png 1440w,\n/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-10d8f.png 1920w,\n/static/windbg-load-90d85e6794c14cb07409b794b5c15b71-fb2e5.png 2561w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Next, run the program so it hits the breakpoint we set via <code class="language-text">Debugger.Break()</code>:</p>\n<div class="gatsby-highlight">\n      <pre class="language-bash"><code class="language-bash">g</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-fb2e5.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 960px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 54.392815306520895%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAALCAYAAAB/Ca1DAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAByklEQVQoz4WS6Y6bMBSFef+n6iL1Ryt1U5s0URLAxmAwmMVsYTu9diaNZqZVLR2BfK+/u3rvfgaIhATnCXgksTvHCEQOlVfIixrFX1TqGlVlHioNtLa2Ct53P8UlyiBThVgqSKVR1i26fkQ/TOiGK+n2HcYZOT3mKQVUVgWyLEemFMZxgjEdPJ3nFEFTBI2mrrFtK7Z1xb9ORYF2IkMUcaqKIQgDiJg52zzP8BiPcD6fwRijiIrS1lgWgm4gbc9kT9n2OMQKSZJACOGgiRTONk0TARnHfr/H4XCAf7k4+LIsrzJ7CYzjmLKMCBohTZMH0PcDXAhijVJKMqbUj9HJlmDhK7XABSFo0XTYU8k2O/smZAEY9x/AIAhddlYsDOH7Pk23QE39tLJONrv1qa/a3DK8AxkLX5QcMhyPR5xOJ+d076XWBfWzQNd1f2BuKN2AX3HmYJxzN5xExo+hxEkKXVaoagPTdrQuA63HFb1bm5vsnaHeDfSvygYs0zQUSaCU1i2lnc1xnWa05ONtRP3v2Rb0pkFVKOR2APPVXr72W6jkT36Br5EhNU/f5/omDL7wGh+OEm93Ed78YHi/F/ho34n7u4b8WnwOS/wGosBCfIEQMccAAAAASUVORK5CYII=\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Breakpoint is hit and stacktrace is visible"\n        title=""\n        src="/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-c83f1.png"\n        srcset="/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-569e3.png 240w,\n/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-93400.png 480w,\n/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-c83f1.png 960w,\n/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-23e13.png 1440w,\n/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-10d8f.png 1920w,\n/static/windbg-breakpoint-443f60871aad5056ca7ce68b8a0299d0-fb2e5.png 2561w"\n        sizes="(max-width: 960px) 100vw, 960px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>At this point we can look for our previously-created <code class="language-text">Ping</code> objects with something like this:</p>\n<div class="gatsby-highlight">\n      <pre class="language-bash"><code class="language-bash"><span class="token operator">!</span>dumpheap -stat -type Ping</code></pre>\n      </div>\n<p>\n  <a\n    class="gatsby-resp-image-link"\n    href="/static/windbg-dumpheap-f6340caba0e8adbcd9ad16c9ffb61756-7f9db.png"\n    style="display: block"\n    target="_blank"\n    rel="noopener"\n  >\n  \n  <span\n    class="gatsby-resp-image-wrapper"\n    style="position: relative; display: block; ; max-width: 342px; margin-left: auto; margin-right: auto;"\n  >\n    <span\n      class="gatsby-resp-image-background-image"\n      style="padding-bottom: 35.96491228070175%; position: relative; bottom: 0; left: 0; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAHCAYAAAAIy204AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABkklEQVQozzVRa2/aQBDk//+bVkpVpcmHhFDUBNsUHBswftuxjevnYRsIaDpnKR9Od7s7Nzs7OynLBm9vr5jNZrB2Fuz9HouFAlVVoWkaHNfFnrksO6BtW6RpgrIskSQJDoccH3GElLXT+YyuO2JSlDX+Lpd4fp5itdJ5VlgoGizLwt62kec5fM9DEIQoigKmacJl7HsuDMNE0wr0fY+6rlGw0aRpjohCH3Ec8Mjbg21v4fs+PH6U6qIoGpVvNhu4VHzIMtZ8hGEA13GwXq8REiNJSdhxLEFgQ1UtHEdw5BBr3cN2a0JRlJFY13XGuzFWVQVLTcV8PifeZW4xWtM0JKyqDk9PPR5+Dfj+rcOPnx3u7i7YWQOunwO9SlE3DYaB8fXK0YOR9F1fYTp9QZJmOJ0GtMRIb0kouBALj48bzH+HeJm5uL838efV4Ej+OLL0dceFvRsGVW5HCz7ieHzLhpJI+jsSCtFDiApVlbOTwPFY41+REpAzV7MmUBIsP2T0ruUSpNLL5RO32433BWdu+Ov8B73y/gOhfkVhAAAAAElFTkSuQmCC\'); background-size: cover; display: block;"\n    >\n      <img\n        class="gatsby-resp-image-image"\n        style="width: 100%; height: 100%; margin: 0; vertical-align: middle; position: absolute; top: 0; left: 0; box-shadow: inset 0px 0px 0px 400px white;"\n        alt="Two results for classes Ping and Ping2"\n        title=""\n        src="/static/windbg-dumpheap-f6340caba0e8adbcd9ad16c9ffb61756-7f9db.png"\n        srcset="/static/windbg-dumpheap-f6340caba0e8adbcd9ad16c9ffb61756-d14e5.png 240w,\n/static/windbg-dumpheap-f6340caba0e8adbcd9ad16c9ffb61756-7f9db.png 342w"\n        sizes="(max-width: 342px) 100vw, 342px"\n      />\n    </span>\n  </span>\n  \n  </a>\n    </p>\n<p>Immediately we can see that both <code class="language-text">Ping</code> and <code class="language-text">Ping2</code> have one instance each. Crucially, both show up as having a total size of 80 bytes. This aligns with our BenchmarkDotNet findings that no allocation reduction was realised.</p>\n<p>To investigate deeper we can click on the link for the <code class="language-text">7ffcb254c7b8</code> Method Table which will execute <code class="language-text">!dumpheap -mt 7ffcb254c7b8</code>. This then tell us that the memory address for that object is located at <code class="language-text">01c0e5cc6ed0</code>. </p>\n<p>Clicking that link then executes <code class="language-text">!dumpobj /d 1c0e5cc6ed0</code> which gives us this nice overview of the object:</p>\n<div class="gatsby-highlight">\n      <pre class="language-log"><code class="language-log">0:000&gt; !dumpobj /d 1c0e5cc6ed0\nName:        Ping2\nMethodTable: 00007ffcb254c7b8\nEEClass:     00007ffcb2561b28\nTracked Type: false\nSize:        80(0x50) bytes\nFile:        C:\\Users\\jer_v\\source\\repos\\pingsize\\pingsize\\bin\\Release\\net8.0\\pingsize.dll\nFields:\n              MT    Field   Offset                 Type VT     Attr            Value Name\n0000000000000000  4000019        8 ...ponentModel.ISite  0 instance 0000000000000000 _site\n0000000000000000  400001a       10 ....EventHandlerList  0 instance 0000000000000000 _events\n00007ffcb2265fa0  4000018       98        System.Object  0   static 0000000000000000 s_eventDisposed\n00007ffcb254d520  4000009       18 ...ualResetEventSlim  0 instance 000001c0e5cc6f20 _lockObject\n00007ffcb22a92d0  400000a       20          System.Void  0 instance 0000000000000000 _onPingCompletedDelegate\n00007ffcb2431f88  400000b       28        System.Byte[]  0 instance 0000000000000000 _defaultSendBuffer\n00007ffcb22a92d0  400000c       30          System.Void  0 instance 0000000000000000 _timeoutOrCancellationSource\n00007ffcb22c2158  400000d       40          System.Byte  1 instance                0 _status\n00007ffcb22a92d0  400000e       38          System.Void  0 instance 0000000000000000 PingCompleted</code></pre>\n      </div>\n<p>Excellent! Now we see the exact layout of our fields in the object. Worth noting here that the object is 80 bytes — in decimal. In hexadecimal, that corresponds to 0x50. This is particularly relevant because the <code class="language-text">Offset</code> column specifies its values in hexadecimal as well.</p>\n<p>Note that the CLR chooses the most optimal layout for us. We can override this behaviour in structs so beware when using <code class="language-text">LayoutKind.Sequential</code>!</p>\n<blockquote>\n<p><strong>Object Layout</strong>  </p>\n<p>At this point we’ll take a step back and revise some CLR fundamentals: what does an object look like? For simplicity we’ll focus on 64-bit systems here. That means we can assume references are 8 bytes and objects (as a whole) are padded to an 8-byte boundary. Furthermore, every object contains two references by default: the Object Header and a reference to the Method Table. Both are 8 bytes so we know that the resulting object will be at least 16 bytes in size before we’ve even started counting our fields.</p>\n<p>Interestingly, the Method Header is actually defined with a negative offset (i.e. <code class="language-text">-8 bytes</code>). So our actual object at offset <code class="language-text">0</code> is the Method Table reference.</p>\n</blockquote>\n<p>With this knowledge in mind we can now use the offsets in the above output to show how the object is laid out. To simplify our life, we write a small console script to help with translating hexadecimal to decimal:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp"><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">+</span><span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">)</span>\n<span class="token punctuation">{</span>\n    Console<span class="token punctuation">.</span><span class="token function">WriteLine</span><span class="token punctuation">(</span>$<span class="token string">"{i}: {i:x}"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\nConsole<span class="token punctuation">.</span><span class="token function">Read</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>This outputs:</p>\n<div class="gatsby-highlight">\n      <pre class="language-log"><code class="language-log">0: 0\n8: 8\n16: 10\n24: 18\n32: 20\n40: 28\n48: 30\n56: 38\n64: 40\n72: 48\n80: 50\n88: 58\n96: 60</code></pre>\n      </div>\n<p>Armed with this information we can deduce the following object layout:</p>\n<div class="gatsby-highlight">\n      <pre class="language-log"><code class="language-log">Field                        Offset (hex)  Offset (dec)    Size (bytes)\n&lt;Object Header&gt;             -0x08         -8               8\n&lt;Method Table Pointer&gt;       0x00          0               8\n_site                        0x08          8               8\n_events                      0x10          16              8\n_lockObject                  0x18          24              8\n_onPingCompletedDelegate     0x20          32              8\n_defaultSendBuffer           0x28          40              8\n_timeoutOrCancellationSource 0x30          48              8\nPingCompleted                0x38          56              8\n_status                      0x40          64              4\n_disposeRequested            0x44          68              1\n_canceled                    0x45          69              1</code></pre>\n      </div>\n<blockquote>\n<p><strong>Object sizes</strong></p>\n<p>References are 8 bytes, but <code class="language-text">int</code> is a 32-bit integer (i.e. 4 bytes) while booleans are defined as a single byte.</p>\n</blockquote>\n<p>This gives us a total range of <code class="language-text">-0x08</code> to <code class="language-text">0x46</code>, which equates to <code class="language-text">0x4e</code> or 78 bytes. What gives? </p>\n<p>Remember the <em>Object Layout</em> section from above:</p>\n<blockquote>\n<p>(..) are padded to an 8-byte boundary</p>\n</blockquote>\n<p>78 is not a multiple of 8 so we need to add padding for that. Specifically, we need to add two bytes worth of padding (rounding up to the nearest multiple) so our object actually becomes</p>\n<div class="gatsby-highlight">\n      <pre class="language-log"><code class="language-log">Field                        Offset (hex)  Offset (dec)    Size (bytes)\n&lt;Object Header&gt;             -0x08         -8               8\n&lt;Method Table Pointer&gt;       0x00          0               8\n_site                        0x08          8               8\n_events                      0x10          16              8\n_lockObject                  0x18          24              8\n_onPingCompletedDelegate     0x20          32              8\n_defaultSendBuffer           0x28          40              8\n_timeoutOrCancellationSource 0x30          48              8\nPingCompleted                0x38          56              8\n_status                      0x40          64              4\n_disposeRequested            0x44          68              1\n_canceled                    0x45          69              1\n&lt;Padding&gt;                    0x46          70              2</code></pre>\n      </div>\n<p>This now gives us a valid object of 80 bytes. It also immediately makes it clear why our optimisation didn’t work: if you remove <code class="language-text">_disposeRequested</code> and <code class="language-text">_canceled</code> from the object definition then we end up with 76 bytes which is also not a multiple of 8. As a result, the CLR will introduce four bytes of padding and end up with an 80-byte object once again.</p>\n<h1>Simplified Diagnosis</h1>\n<p>Spelunking through WinDbg is certainly not trivial! Fortunately, there are projects out there that will help us a long way here. Using the <a href="https://github.com/SergeyTeplyakov/ObjectLayoutInspector">ObjectLayoutInspector</a> we can inspect the object size at runtime and print out a helpful overview. Add a reference to its NuGet package (<code class="language-text">&lt;PackageReference Include=&quot;ObjectLayoutInspector&quot; Version=&quot;0.1.4&quot; /&gt;</code>) and add the following to our application:</p>\n<div class="gatsby-highlight">\n      <pre class="language-csharp"><code class="language-csharp">ObjectLayoutInspector<span class="token punctuation">.</span>TypeLayout<span class="token punctuation">.</span><span class="token generic-method"><span class="token function">PrintLayout</span><span class="token punctuation">&lt;</span><span class="token class-name">Ping2</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>\n      </div>\n<p>Run the console application and we can see the following output:</p>\n<div class="gatsby-highlight">\n      <pre class="language-log"><code class="language-log">Type layout for &#39;Ping&#39;\nSize: 64 bytes. Paddings: 2 bytes (%3 of empty space)\n|=======================================================================|\n| Object Header (8 bytes)                                               |\n|-----------------------------------------------------------------------|\n| Method Table Ptr (8 bytes)                                            |\n|=======================================================================|\n|   0-7: ISite _site (8 bytes)                                          |\n|-----------------------------------------------------------------------|\n|  8-15: EventHandlerList _events (8 bytes)                             |\n|-----------------------------------------------------------------------|\n| 16-23: ManualResetEventSlim _lockObject (8 bytes)                     |\n|-----------------------------------------------------------------------|\n| 24-31: SendOrPostCallback _onPingCompletedDelegate (8 bytes)          |\n|-----------------------------------------------------------------------|\n| 32-39: Byte[] _defaultSendBuffer (8 bytes)                            |\n|-----------------------------------------------------------------------|\n| 40-47: CancellationTokenSource _timeoutOrCancellationSource (8 bytes) |\n|-----------------------------------------------------------------------|\n| 48-55: PingCompletedEventHandler PingCompleted (8 bytes)              |\n|-----------------------------------------------------------------------|\n| 56-59: Int32 _status (4 bytes)                                        |\n|-----------------------------------------------------------------------|\n|    60: Boolean _disposeRequested (1 byte)                             |\n|-----------------------------------------------------------------------|\n|    61: Boolean _canceled (1 byte)                                     |\n|-----------------------------------------------------------------------|\n| 62-63: padding (2 bytes)                                              |\n|=======================================================================|</code></pre>\n      </div>\n<p>This confirms out WinDbg findings: padding is applied to the end of the object and we’re seeing 16 bytes of overhead.</p>\n<h1>Conclusion</h1>\n<p>In this case, padding is inevitable. Even if we were to replace the <code class="language-text">int _status</code> with a <code class="language-text">byte _status</code>, we’d still use a single <code class="language-text">byte</code> on top of the previous boundary and thus incur seven bytes of padding. As a result, moving these fields into the status enum will gain no benefit from an object size perspective. </p>\n<p>This type of optimization shows most promise when used in a type that has multiple fields smaller than the pointer size — we only see effects if we’re able to go down to a lower multiple of our byte boundary. Of course, removing a reference field entirely will always yield results!</p>',fields:{tagSlugs:["/tags/c/","/tags/clr/","/tags/win-dbg/"]},frontmatter:{title:"Exploring Object Layouts",tags:["C#","CLR","WinDbg"],date:"2023-10-30T00:30:00.000Z",description:"Removing fields from an object should reduce that object's size. Why am I not seeing any difference?"}}},pathContext:{slug:"/posts/exploring-object-layouts"}}}});
//# sourceMappingURL=path---posts-exploring-object-layouts-9d75d548f3d8e8da5e76.js.map