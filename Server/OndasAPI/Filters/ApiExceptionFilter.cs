using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace OndasAPI.Filters;

public class ApiExceptionFilter(ILogger<ApiExceptionFilter> logger, IWebHostEnvironment env) : IExceptionFilter
{
    private readonly ILogger<ApiExceptionFilter> _logger = logger;
    private readonly IWebHostEnvironment _env = env;

    public void OnException(ExceptionContext context)
    {
        var ex = context.Exception;
        var path = context.HttpContext.Request.Path;
        var requestId = context.HttpContext.TraceIdentifier;

        int statusCode;
        string title;
        object? details;

        switch (ex)
        {
            case ValidationException ve:
                statusCode = (int)HttpStatusCode.BadRequest;
                title = "Validation error";
                details = ve.ValidationResult?.ErrorMessage ?? ve.Message;
                _logger.LogWarning(ex, "[{RequestId}] Validation failure on {Path}: {Message}", requestId, path, ex.Message);
                break;

            case ArgumentException ae:
                statusCode = (int)HttpStatusCode.BadRequest;
                title = "Invalid argument";
                details = ae.Message;
                _logger.LogWarning(ex, "[{RequestId}] Argument error on {Path}: {Message}", requestId, path, ex.Message);
                break;

            case UnauthorizedAccessException _:
                statusCode = (int)HttpStatusCode.Unauthorized;
                title = "Unauthorized";
                details = ex.Message;
                _logger.LogWarning(ex, "[{RequestId}] Unauthorized access on {Path}", requestId, path);
                break;

            case KeyNotFoundException _:
                statusCode = (int)HttpStatusCode.NotFound;
                title = "Resource not found";
                details = ex.Message;
                _logger.LogWarning(ex, "[{RequestId}] Not found on {Path}: {Message}", requestId, path, ex.Message);
                break;

            case InvalidOperationException _:
                statusCode = (int)HttpStatusCode.BadRequest;
                title = "Invalid operation";
                details = ex.Message;
                _logger.LogWarning(ex, "[{RequestId}] Invalid operation on {Path}: {Message}", requestId, path, ex.Message);
                break;

            case DbUpdateConcurrencyException _:
                statusCode = (int)HttpStatusCode.Conflict;
                title = "Concurrency conflict";
                details = "The resource was modified by another process. Try again.";
                _logger.LogWarning(ex, "[{RequestId}] Concurrency conflict on {Path}", requestId, path);
                break;

            case DbUpdateException dbEx:
                statusCode = (int)HttpStatusCode.InternalServerError;
                title = "Database error";
                details = dbEx.InnerException?.Message ?? dbEx.Message;
                _logger.LogError(ex, "[{RequestId}] Database error on {Path}: {Message}", requestId, path, ex.Message);
                break;

            default:
                statusCode = (int)HttpStatusCode.InternalServerError;
                title = "Internal server error";
                details = ex.Message;
                _logger.LogError(ex, "[{RequestId}] Unhandled exception on {Path}: {Message}", requestId, path, ex.Message);
                break;
        }

        var problem = new ProblemDetails
        {
            Title = title,
            Status = statusCode,
            Detail = _env.IsDevelopment() ? $"{details}\n{ex.StackTrace}" : details?.ToString(),
            Instance = path
        };

        problem.Extensions["requestId"] = requestId;

        context.Result = new ObjectResult(problem)
        {
            StatusCode = statusCode
        };

        context.ExceptionHandled = true;
    }
}
