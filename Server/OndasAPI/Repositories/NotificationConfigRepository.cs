using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class NotificationConfigRepository(AppDbContext context) : Repository<NotificationConfig>(context), INotificationConfigRepository
{
    public async Task<NotificationConfig?> GetSingletonAsync()
    {
        return await _context.Set<NotificationConfig>().AsNoTracking().FirstOrDefaultAsync();
    }

    public async Task<NotificationConfig> CreateOrUpdateAsync(NotificationConfig config)
    {
        var existing = await _context.Set<NotificationConfig>().FirstOrDefaultAsync();

        if (existing is null)
        {
            _context.Set<NotificationConfig>().Add(config);
            return config;
        }

        existing.Mode = config.Mode;
        existing.SmtpHost = config.SmtpHost;
        existing.SmtpPort = config.SmtpPort;
        existing.SmtpUseSsl = config.SmtpUseSsl;
        existing.SmtpUser = config.SmtpUser;
        existing.SmtpPassword = config.SmtpPassword;
        existing.FromEmail = config.FromEmail;
        existing.FromName = config.FromName;

        existing.SmsProvider = config.SmsProvider;
        existing.TwilioAccountSid = config.TwilioAccountSid;
        existing.TwilioAuthToken = config.TwilioAuthToken;
        existing.TwilioFromNumber = config.TwilioFromNumber;

        existing.DaysBeforeDueToNotify = config.DaysBeforeDueToNotify;
        existing.NotifyOnDueDate = config.NotifyOnDueDate;
        existing.Active = config.Active;
        existing.DefaultPixKey = config.DefaultPixKey;
        existing.PreferredSendTime = config.PreferredSendTime;

        _context.Set<NotificationConfig>().Update(existing);
        return existing;
    }
}
