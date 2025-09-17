using Microsoft.AspNetCore.Mvc.Filters;
using System.Diagnostics;
using System.Security.Claims;

namespace OndasAPI.Filters;

public class ApiLoggingFilter(ILogger<ApiLoggingFilter> logger) : IActionFilter
{
    private readonly ILogger<ApiLoggingFilter> _logger = logger;
    private const string StopwatchKey = "__RequestStopwatch";

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var http = context.HttpContext;
        var sw = Stopwatch.StartNew();
        http.Items[StopwatchKey] = sw;

        var req = http.Request;
        var user = http.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? http.User?.FindFirst(ClaimTypes.Email)?.Value
                   ?? http.User?.Identity?.Name
                   ?? "anonymous";

        var requestId = http.TraceIdentifier;
        var correlationId = req.Headers["X-Correlation-ID"].FirstOrDefault();

        _logger.LogInformation(
            "RequestStarted: {Method} {Path}{Query} | User:{User} | RequestId:{RequestId} | CorrelationId:{CorrelationId} | Action:{Action}",
            req.Method,
            req.Path,
            req.QueryString.HasValue ? req.QueryString.Value : string.Empty,
            user,
            requestId,
            string.IsNullOrWhiteSpace(correlationId) ? "(none)" : correlationId,
            context.ActionDescriptor.DisplayName
        );
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        var http = context.HttpContext;
        var req = http.Request;
        var res = http.Response;

        long elapsedMs = -1;
        if (http.Items.TryGetValue(StopwatchKey, out var swObj) && swObj is Stopwatch sw)
        {
            sw.Stop();
            elapsedMs = sw.ElapsedMilliseconds;
        }

        var user = http.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                   ?? http.User?.FindFirst(ClaimTypes.Email)?.Value
                   ?? http.User?.Identity?.Name
                   ?? "anonymous";

        var requestId = http.TraceIdentifier;
        var correlationId = req.Headers["X-Correlation-ID"].FirstOrDefault();
        var statusCode = res?.StatusCode ?? 0;
        var errorSummary = context.Exception?.Message;

        if (context.Exception != null || statusCode >= 500)
        {
            _logger.LogError(
                context.Exception,
                "RequestFinished (Error): {Method} {Path} | Status:{Status} | ElapsedMs:{Elapsed} | User:{User} | RequestId:{RequestId} | CorrelationId:{CorrelationId} | Error:{Error}",
                req.Method,
                req.Path,
                statusCode,
                elapsedMs,
                user,
                requestId,
                string.IsNullOrWhiteSpace(correlationId) ? "(none)" : correlationId,
                errorSummary ?? "(no message)"
            );
        }
        else if (statusCode >= 400)
        {
            _logger.LogWarning(
                "RequestFinished (ClientError): {Method} {Path} | Status:{Status} | ElapsedMs:{Elapsed} | User:{User} | RequestId:{RequestId} | CorrelationId:{CorrelationId}",
                req.Method,
                req.Path,
                statusCode,
                elapsedMs,
                user,
                requestId,
                string.IsNullOrWhiteSpace(correlationId) ? "(none)" : correlationId
            );
        }
        else
        {
            _logger.LogInformation(
                "RequestFinished: {Method} {Path} | Status:{Status} | ElapsedMs:{Elapsed} | User:{User} | RequestId:{RequestId} | CorrelationId:{CorrelationId}",
                req.Method,
                req.Path,
                statusCode,
                elapsedMs,
                user,
                requestId,
                string.IsNullOrWhiteSpace(correlationId) ? "(none)" : correlationId
            );
        }
    }
}
