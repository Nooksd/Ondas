using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OndasAPI.Context;
using OndasAPI.Filters;
using OndasAPI.Models;
using OndasAPI.Repositories;
using OndasAPI.Repositories.Interfaces;
using OndasAPI.Services;
using OndasAPI.Services.Interfaces;
using Polly;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var superAdmEmail = Environment.GetEnvironmentVariable("SUPERADM_EMAIL") ?? "superadm@ondas.com";
var superAdmrPassword = Environment.GetEnvironmentVariable("SUPERADM_PASSWORD") ?? "Ondas@2025";

builder.Services.AddControllers(options =>
{
    options.Filters.Add(typeof(ApiLoggingFilter));
    options.Filters.Add(typeof(ApiExceptionFilter));
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
}).AddNewtonsoftJson();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddMemoryCache();

builder.Services.AddIdentity<AppUser, IdentityRole>().AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

var secretKey = builder.Configuration["JWT:SecretKey"] ?? throw new ArgumentException("Invalid SecretKey");
var validAudience = builder.Configuration["JWT:ValidAudience"];
var validIssuer = builder.Configuration["JWT:ValidIssuer"];

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Viewer", policy => policy.RequireRole("Viewer", "Editor", "Admin"))
    .AddPolicy("Editor", policy => policy.RequireRole("Editor", "Admin"))
    .AddPolicy("Admin", policy => policy.RequireRole("Admin"))
    .AddPolicy("SuperAdmin", policy => policy.RequireClaim(ClaimTypes.Email, superAdmEmail));


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        ValidAudience = validAudience,
        ValidIssuer = validIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Cookies["AccessToken"];
            if (!string.IsNullOrEmpty(accessToken))
            {
                context.Token = accessToken;
            }
            else
            {
                if (context.Request.Headers.TryGetValue("Authorization", out var authHeaders))
                {
                    var authHeader = authHeaders.FirstOrDefault();
                    if (!string.IsNullOrWhiteSpace(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        context.Token = authHeader["Bearer ".Length..].Trim();
                    }
                }

            }
            return Task.CompletedTask;
        }
    };
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 10,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
        sqlOptions.MigrationsAssembly("OndasAPI");
    });
});


builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<ITeamMemberRepository, TeamMemberRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();

builder.Services.AddScoped<INotificationConfigRepository, NotificationConfigRepository>();
builder.Services.AddScoped<INotificationLogRepository, NotificationLogRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();

builder.Services.AddScoped<IEmailSender, SmtpEmailSender>();
builder.Services.AddScoped<ISmsSender, TwilioSmsSender>();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddHostedService<NotificationBackgroundService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    var retryPolicy = Policy
        .Handle<Exception>()
        .WaitAndRetryAsync(
            retryCount: 10,
            sleepDurationProvider: _ => TimeSpan.FromSeconds(30),
            onRetry: (exception, timeSpan, retryCount, contextPolly) =>
            {
                logger.LogWarning(
                    exception,
                    "Tentativa {RetryCount} de conectar ao banco. Nova tentativa em {TimeSpan}...",
                    retryCount, timeSpan);
            });

    await retryPolicy.ExecuteAsync(async () =>
    {
        logger.LogInformation("Aplicando migrations...");
        await context.Database.MigrateAsync();

        string[] roleNames = ["Admin", "Editor", "Viewer"];
        foreach (var role in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        var superAdmEmail = Environment.GetEnvironmentVariable("SUPERADM_EMAIL") ?? "superadm@ondas.com";
        var superAdmrPassword = Environment.GetEnvironmentVariable("SUPERADM_PASSWORD") ?? "Ondas@2025";

        var superAdm = new AppUser { UserName = superAdmEmail, Email = superAdmEmail, EmailConfirmed = true };

        if (await userManager.FindByEmailAsync(superAdmEmail) is null)
        {
            await userManager.CreateAsync(superAdm, superAdmrPassword);
            await userManager.AddToRoleAsync(superAdm, "Admin");
        }
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Ondas API v1");
        options.RoutePrefix = "swagger";
    });
}
else
{
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
