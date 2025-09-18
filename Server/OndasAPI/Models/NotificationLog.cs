using System.ComponentModel.DataAnnotations;

namespace OndasAPI.Models;

public enum NotificationType { Email = 1, Sms = 2 }

public class NotificationLog : EntityBase
{
    public int ServiceId { get; set; }
    public int NotificationConfigId { get; set; }
    public NotificationType Type { get; set; }
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public int OffsetDaysBefore { get; set; } = 0;

    [StringLength(500)]
    public string? Recipient { get; set; }

    [StringLength(1000)]
    public string? MessageSummary { get; set; }
}
