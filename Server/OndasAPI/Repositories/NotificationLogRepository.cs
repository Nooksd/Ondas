using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class NotificationLogRepository(AppDbContext context) : Repository<NotificationLog>(context), INotificationLogRepository
{
    public async Task<bool> ExistsAsync(int serviceId, int configId, NotificationType type, int offset)
    {
        return await _context.Set<NotificationLog>().AnyAsync(x =>
            x.ServiceId == serviceId
            && x.NotificationConfigId == configId
            && x.Type == type
            && x.OffsetDaysBefore == offset
            && x.SentAt.Date == DateTime.UtcNow.Date);
    }
}
