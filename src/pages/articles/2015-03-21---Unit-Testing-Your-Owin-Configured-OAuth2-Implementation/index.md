---
title: "How to unit test your OWIN-configured OAuth2 implementation"
date: "2015-03-21T00:00:00.000Z"
layout: post
draft: false
path: "/posts/unit-testing-your-owin-configured-oauth2-implementation/"
category: "Testing"
tags:
  - "C#"
  - "Unit Testing"
  - "ASP.NET"
  - "Dependency Injection"
  - "Authentication"
description: "Unit testing your OAuth2 API"
---

# Introduction

I recently started implementing OAuth2 in a project by following [this wonderful blog series by Taiseer Joudeh](http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/). So far everything is going great but one thing I’m missing is unit tests to make sure everything works fine in the way that I’ve set it up. There’s a lot more to it than just configuring a few options for OAuth so I’d like to have peace of mind on this vital aspect of my application.

Unit-testing in isolated, minimal environments is great to demonstrate a concept but it’s not always as easy to implement them in an actual environment where there are a lot more components at play. This situation presented itself to me in the form of dependency injection: I have Unity wired up to provide me with repositories and contexts (all in the spirit of unit-testing the separate layers) but the issue arises when I have to adhere to limitations imposed to me by OWIN, Unity and proper unit-testing principles.

What follows is an example of how you can unit-test your OWIN-powered, Unity-injected Web Api 2 OAuth implementation. For the full implementation of this project you can take a look at Moviepicker on Github.

---

I will assume that you have followed the first part of Taiseer’s blogseries. However in order to make sure we are on the same page, here are some relevant pieces of code:

```csharp
public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
{
    private readonly IUserRepository _userRepository;

    public SimpleAuthorizationServerProvider(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
    {
        context.Validated();
    }

    public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
    {
        context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

        var user = await _userRepository.FindUserAsync(context.UserName, context.Password);
        if (user == null)
        {
            context.SetError("invalid_grant", "The username or password is incorrect.");
            return;
        }

        var identity = new ClaimsIdentity(context.Options.AuthenticationType);
        identity.AddClaim(new Claim("sub", context.UserName));
        identity.AddClaim(new Claim("role", "user"));
        context.Validated(identity);
    }
}
```

This is where we verify the user and client’s credentials. Notice that the client is always considered valid since at this point of the series we assume a single client. Later on, this is expanded to multiple clients.
One thing to note here is that I have a user repository injected in my provider: this abstraction on top of the database context allows me to set the stage in the unit-test.

Next up is the `StartUp` class which replaced the `Global.asax` entry point and – amongst other things – configures the OWIN layer.

```csharp
public class Startup
{
    public virtual HttpConfiguration GetInjectionConfiguration()
    {
        var configuration = new HttpConfiguration();
        var container = new UnityContainer();
        container.RegisterType<IUserRepository, UserRepository>(new TransientLifetimeManager());
        container.RegisterType<IMovieRepository, MovieRepository>(new TransientLifetimeManager());
        container.RegisterInstance(new MoviepickerContext());
        configuration.DependencyResolver = new UnityConfig(container);
        return configuration;
    }

    public void Configuration(IAppBuilder app)
    {
        var configuration = GetInjectionConfiguration();

        // OAuth configuration
        var oAuthServerOptions = new OAuthAuthorizationServerOptions
        {
            AllowInsecureHttp = true,
            TokenEndpointPath = new PathString("/token"),
            AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
            Provider = new SimpleAuthorizationServerProvider((IUserRepository) configuration.DependencyResolver.GetService(typeof (IUserRepository)))
        };

        app.UseOAuthAuthorizationServer(oAuthServerOptions);
        app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        WebApiConfig.Register(configuration);
        app.UseCors(CorsOptions.AllowAll);
        app.UseWebApi(configuration);
    }
}
```


What catches the eye here is the configuration of Unity, more specifically that it is separated from the rest of the configuration and is in fact overridable (notice the `virtual` keyword). Similarly, you can see that the provider being passed to the OAuth authorization options uses our DI-approach to retrieve the repository we decide to inject.

The reason I went with this approach is simply because I didn’t have another choice: I can’t inject a resource in the `StartUp` class simply because that class is the entry point (or at least, I don’t know of any. If you do, let me know!). So what do we do when we can’t inject our dependencies? That’s right, we ~~mock it~~ extract the injected behaviour and create a subclass to inject the test-specific behaviour like that. If you are up-to-date with your design pattern knowledge, you may recognize [the Template Method Pattern](https://en.wikipedia.org/wiki/Template_method_pattern) in this.

```csharp
private class TestStartupConfiguration : Startup
{
    public static MoviepickerContext Context;
    public static IUserRepository UserRepository;
    public static HttpConfiguration HttpConfiguration;

    public override HttpConfiguration GetInjectionConfiguration()
    {
        var container = new UnityContainer();
        container.RegisterInstance(UserRepository);
        container.RegisterInstance(Context);
        HttpConfiguration.DependencyResolver = new UnityConfig(container);
        return HttpConfiguration;
    }
}
```

At first sight this code must strike you as troublesome: there are static members in there! The reason why becomes more clear when you take a look at what the `Microsoft.Owin.Testing` package provides for us: creating an in-memory test server uses a creator pattern which does not allow you to pass in arguments, nor does it provide you any control over that startup configuration. In essence this means that we cannot inject our repositories the normal way.

This should make it more clear:

```csharp
[TestClass]
public class AuthorizationTests
{
    private AccountController _accountController;
    private MoviepickerContext _context;
    private UserRepository _userRepository;

    [TestInitialize]
    public void Initialize()
    {
        var configuration = new HttpConfiguration();
        _context = new MoviepickerContext(DbConnectionFactory.CreateTransient());
        _userRepository = new UserRepository(_context);
        _accountController = new AccountController(_userRepository) { Configuration = configuration };
        TestStartupConfiguration.Context = _context;
        TestStartupConfiguration.UserRepository = _userRepository;
        TestStartupConfiguration.HttpConfiguration = configuration;
    }

    [TestMethod]
    [TestCategory("Unit_AUTHORIZATION")]
    public async Task GetToken_WithoutRegisteredUser_ReturnsBadRequest()
    {
        var user = TestDataProvider.GetUserModel();

        using (var server = TestServer.Create<TestStartupConfiguration>())
        {
            var response = await server.CreateRequest("/token").And(x => x.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("username", user.Username),
                new KeyValuePair<string, string>("password", user.Password),
                new KeyValuePair<string, string>("grant_type", "password")
            })).PostAsync();

            response.IsSuccessStatusCode.Should().BeFalse();
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }

    [TestMethod]
    [TestCategory("Unit_AUTHORIZATION")]
    public async Task GetToken_WithRegisteredUser_ReturnsToken()
    {
        var user = TestDataProvider.GetUserModel();
        await _accountController.RegisterAsync(user);

        using (var server = TestServer.Create<TestStartupConfiguration>())
        {
            var response = await server.CreateRequest("/token").And(x => x.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("username", user.Username),
                new KeyValuePair<string, string>("password", user.Password),
                new KeyValuePair<string, string>("grant_type", "password")
            })).PostAsync();

            response.IsSuccessStatusCode.Should().BeTrue();
            (await response.Content.ReadAsStringAsync()).Should().NotBeNullOrWhiteSpace();
        }
    }

    [TestMethod]
    [TestCategory("Unit_AUTHORIZATION")]
    public async Task GetToken_WithInvalidCredentials_ReturnsBadRequest()
    {
        var user = TestDataProvider.GetUserModel();
        await _accountController.RegisterAsync(user);

        using (var server = TestServer.Create<TestStartupConfiguration>())
        {
            var response = await server.CreateRequest("/token").And(x => x.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("username", user.Username),
                new KeyValuePair<string, string>("password", user.Password + "this can't work"),
                new KeyValuePair<string, string>("grant_type", "password")
            })).PostAsync();

            response.IsSuccessStatusCode.Should().BeFalse();
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }
}
```

You may recognize the test-databasecontext creation approach in the `Initialize()` method since this was presented in my post on unit-testing with Effort. You can also see how we use these static fields exactly: before every test the repositories are recreated and assigned to our new configuration, essentially overwriting anything that might have remained from a previous run. Since MSTest executes test sequentially by default, this should not pose any troubles.

Looking at a particular test we can tell it is very straightforward to set up the OWIN middleware: create an in-memory server by passing it our configuration and.. you’re done. The Owin testing package provides you some helpful tools as well to make it more comfortable building the requests.

As always, the asserting package used is FluentAssertions and on top of that there are the `Microsoft.Owin.Hosting`, `Microsoft.Owin.Host.HttpListener` and `Microsoft.Owin.Testing` packages.

# Conclusion

Testing your OAuth implementation can be done (should be done?) without opening your browser and trying every call in the pipeline just to make sure everything still works. By using the provided `Microsoft.Owin.Testing` package you can easily mimic the actual Owin layer although there are some hoops to jump through when you have additional complexity like dependency injection. Nevertheless I am very pleased by the way unit testing is officially supported (take some notes, Entity-Framework!).