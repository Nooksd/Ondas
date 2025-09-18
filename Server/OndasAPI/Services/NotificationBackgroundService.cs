using OndasAPI.Services.Interfaces;

namespace OndasAPI.Services;

public class NotificationBackgroundService(IServiceProvider provider, ILogger<NotificationBackgroundService> logger) : BackgroundService
{
    private readonly IServiceProvider _provider = provider;
    private readonly ILogger<NotificationBackgroundService> _logger = logger;
    private readonly TimeSpan _delay = TimeSpan.FromMinutes(2);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("NotificationBackgroundService started.");
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _provider.CreateScope();
                var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();

                await notificationService.RunNotificationsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao rodar NotificationService");
            }

            await Task.Delay(_delay, stoppingToken);
        }
    }
}
