using Microsoft.AspNetCore.Mvc.Filters;

namespace OndasAPI.Filters;

public class ApiLoggingFilter(ILogger<ApiLoggingFilter> logger) : IActionFilter
{
    private readonly ILogger<ApiLoggingFilter> _logger = logger;
    public void OnActionExecuted(ActionExecutedContext context)
    {
        _logger.LogInformation($"{DateTime.Now.ToLongTimeString()} | {context.ModelState}");
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        switch (context.HttpContext.Response.StatusCode)
        {
            case 401:
                _logger.LogWarning($"{DateTime.Now.ToLongTimeString()} | Unauthorized access attempt.");
                break;
            case 403:
                _logger.LogWarning($"{DateTime.Now.ToLongTimeString()} | Unauthorized access attempt.");
                break;
            case 201:
                _logger.LogWarning($"{DateTime.Now.ToLongTimeString()} | Object created.");
                break;
            default:
                break;
        }
    }
}
