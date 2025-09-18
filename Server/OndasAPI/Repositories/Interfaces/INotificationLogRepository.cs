using OndasAPI.Models;

namespace OndasAPI.Repositories.Interfaces;

public interface INotificationLogRepository : IRepository<NotificationLog>
{
    Task<bool> ExistsAsync(int serviceId, int configId, NotificationType type, int offset);
}
