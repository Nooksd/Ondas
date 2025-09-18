using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;
using OndasAPI.Services.Interfaces;
using System.Text.RegularExpressions;

namespace OndasAPI.Services;

public class NotificationService(IUnitOfWork unitOfWork, IEmailSender emailSender, ISmsSender smsSender) : INotificationService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IEmailSender _emailSender = emailSender;
    private readonly ISmsSender _smsSender = smsSender;

    public async Task RunNotificationsAsync()
    {
        var config = await _unitOfWork.NotificationConfigRepository.GetSingletonAsync();
        if (config is null || !config.Active)
            return;

        var today = DateTime.UtcNow.Date;
        var offsets = new List<int>();

        if (config.DaysBeforeDueToNotify > 0)
            offsets.Add(config.DaysBeforeDueToNotify);

        if (config.NotifyOnDueDate)
            offsets.Add(0);

        foreach (var offset in offsets)
        {
            var targetDue = today.AddDays(offset);
            var services = await _unitOfWork.ServiceRepository.GetServicesByDueDateAsync(targetDue);

            foreach (var svc in services)
            {
                if (svc.Status == ServiceStatus.Concluido)
                    continue;

                var alreadyEmail = config.SendEmails && await _unitOfWork.NotificationLogRepository.ExistsAsync(svc.Id, config.Id, NotificationType.Email, offset);
                var alreadySms = config.SendSms && await _unitOfWork.NotificationLogRepository.ExistsAsync(svc.Id, config.Id, NotificationType.Sms, offset);

                var message = BuildMessage(svc, config);

                if (config.SendEmails && !alreadyEmail && !string.IsNullOrEmpty(svc.Customer?.Email))
                {
                    await _emailSender.SendEmailAsync(svc.Customer!.Email, svc.Customer.Name, $"Cobrança - Vencimento {svc.PaymentDueDate:yyyy-MM-dd}", message);

                    _unitOfWork.NotificationLogRepository.Create(new NotificationLog
                    {
                        ServiceId = svc.Id,
                        NotificationConfigId = config.Id,
                        Type = NotificationType.Email,
                        SentAt = DateTime.UtcNow,
                        OffsetDaysBefore = offset,
                        Recipient = svc.Customer.Email,
                        MessageSummary = $"Valor: {svc.Price:N2}; Venc: {svc.PaymentDueDate:yyyy-MM-dd}"
                    });

                    await _unitOfWork.CommitAsync();
                }

                if (config.SendSms && !alreadySms && !string.IsNullOrEmpty(svc.Customer?.Phone))
                {
                    if (config.SmsProvider == SmsProvider.Twilio)
                    {
                        await _smsSender.SendSmsAsync(svc.Customer!.Phone, StripHtml(message));

                        _unitOfWork.NotificationLogRepository.Create(new NotificationLog
                        {
                            ServiceId = svc.Id,
                            NotificationConfigId = config.Id,
                            Type = NotificationType.Sms,
                            SentAt = DateTime.UtcNow,
                            OffsetDaysBefore = offset,
                            Recipient = svc.Customer.Phone,
                            MessageSummary = $"SMS: Valor {svc.Price:N2}; Venc: {svc.PaymentDueDate:yyyy-MM-dd}"
                        });

                        await _unitOfWork.CommitAsync();
                    }
                }
            }
        }
    }


    private static string BuildMessage(Service svc, NotificationConfig config)
    {
        var pix = string.IsNullOrWhiteSpace(config.DefaultPixKey) ? "" : $"<p>PIX: <b>{config.DefaultPixKey}</b></p>";
        var html = $@"
            <p>Olá {svc.Customer?.Name},</p>
            <p>Esta é uma notificação de cobrança.</p>
            <p><b>Valor:</b> R$ {svc.Price:N2}</p>
            <p><b>Vencimento:</b> {svc.PaymentDueDate:yyyy-MM-dd}</p>
            {pix}
            <p>Descrição: {svc.Description}</p>
            <p>Atenciosamente,<br/>Seu piscinero</p>
        ";
        return html;
    }

    private static string StripHtml(string html) => Regex.Replace(html, "<.*?>", string.Empty);
}