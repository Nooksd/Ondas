using System.ComponentModel.DataAnnotations;

namespace OndasAPI.Models;

public enum SmsProvider
{
    None = 0,
    Twilio = 1,
}
public enum NotificationMode
{
    Email = 1,
    Sms = 2,
    EmailAndSms = 3
}

public class NotificationConfig : EntityBase
{
    public NotificationMode Mode { get; set; } = NotificationMode.Email;

    public bool SendEmails => Mode == NotificationMode.Email || Mode == NotificationMode.EmailAndSms;
    [StringLength(200)] public string? SmtpHost { get; set; }
    public int? SmtpPort { get; set; }
    public bool SmtpUseSsl { get; set; } = true;
    [StringLength(200)] public string? SmtpUser { get; set; }
    [StringLength(500)] public string? SmtpPassword { get; set; }
    [StringLength(200)] public string? FromEmail { get; set; }
    [StringLength(200)] public string? FromName { get; set; }

    public bool SendSms => Mode == NotificationMode.Sms || Mode == NotificationMode.EmailAndSms;
    public SmsProvider SmsProvider { get; set; } = SmsProvider.None;
    [StringLength(200)] public string? TwilioAccountSid { get; set; }
    [StringLength(200)] public string? TwilioAuthToken { get; set; }
    [StringLength(50)] public string? TwilioFromNumber { get; set; }


    [Range(0, 30)]
    public int DaysBeforeDueToNotify { get; set; } = 2;
    public bool NotifyOnDueDate { get; set; } = true;
    public bool Active { get; set; } = true;

    [StringLength(200)]
    public string? DefaultPixKey { get; set; }

    [StringLength(5)]
    public string PreferredSendTime { get; set; } = "09:00";
}