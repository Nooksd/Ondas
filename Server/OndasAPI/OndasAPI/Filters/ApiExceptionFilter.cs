using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace OndasAPI.Filters;

public class ApiExceptionFilter(ILogger<ApiExceptionFilter> logger) : IExceptionFilter
{
    private readonly ILogger<ApiExceptionFilter> _logger = logger;

    public void OnException(ExceptionContext context)
    {
        _logger.LogError(context.Exception, "An unhandled exception occurred: {message}", context.Exception.Message);

        context.Result = new ObjectResult("An unexpected error occurred. Please try again later.")
        {
            StatusCode = StatusCodes.Status500InternalServerError,
        };
    }
}
