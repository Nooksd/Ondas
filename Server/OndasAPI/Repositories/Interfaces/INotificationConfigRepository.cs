using OndasAPI.Models;

namespace OndasAPI.Repositories.Interfaces;

public interface INotificationConfigRepository : IRepository<NotificationConfig>
{
    Task<NotificationConfig?> GetSingletonAsync();
    Task<NotificationConfig> CreateOrUpdateAsync(NotificationConfig config);
}
