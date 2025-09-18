using MimeKit;
using MimeKit.Utils;
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

            foreach (var service in services)
            {
                if (service.Status == ServiceStatus.Concluido)
                    continue;

                var alreadyEmail = config.SendEmails && await _unitOfWork.NotificationLogRepository.ExistsAsync(service.Id, config.Id, NotificationType.Email, offset);
                var alreadySms = config.SendSms && await _unitOfWork.NotificationLogRepository.ExistsAsync(service.Id, config.Id, NotificationType.Sms, offset);


                if (config.SendEmails && !alreadyEmail && !string.IsNullOrEmpty(service.Customer?.Email))
                {
                    var message = BuildEmailMessage(service, config, "");

                    await _emailSender.SendEmailAsync(message);

                    _unitOfWork.NotificationLogRepository.Create(new NotificationLog
                    {
                        ServiceId = service.Id,
                        NotificationConfigId = config.Id,
                        Type = NotificationType.Email,
                        SentAt = DateTime.UtcNow,
                        OffsetDaysBefore = offset,
                        Recipient = service.Customer.Email,
                        MessageSummary = $"Valor: {service.Price:N2}; Venc: {service.PaymentDueDate:yyyy-MM-dd}"
                    });

                    await _unitOfWork.CommitAsync();
                }

                if (config.SendSms && !alreadySms && !string.IsNullOrEmpty(service.Customer?.Phone))
                {
                    if (config.SmsProvider == SmsProvider.Twilio)
                    {
                        var message = BuildSmsMessage(service, config);

                        await _smsSender.SendSmsAsync(service.Customer!.Phone, Regex.Replace(message, "<.*?>", string.Empty));

                        _unitOfWork.NotificationLogRepository.Create(new NotificationLog
                        {
                            ServiceId = service.Id,
                            NotificationConfigId = config.Id,
                            Type = NotificationType.Sms,
                            SentAt = DateTime.UtcNow,
                            OffsetDaysBefore = offset,
                            Recipient = service.Customer.Phone,
                            MessageSummary = $"SMS: Valor {service.Price:N2}; Venc: {service.PaymentDueDate:yyyy-MM-dd}"
                        });

                        await _unitOfWork.CommitAsync();
                    }
                }
            }
        }
    }

    private static string AssetsEmailFolder => Path.Combine(Directory.GetCurrentDirectory(), "Assets", "Email");

    private static string BuildSmsMessage(Service service, NotificationConfig config)
    {
        var pix = string.IsNullOrWhiteSpace(config.DefaultPixKey) ? "" : $"<p>PIX: <b>{config.DefaultPixKey}</b></p>";
        var html = $@" <p>Olá {service.Customer?.Name},</p> <p>Esta é uma notificação de cobrança.</p> <p><b>Valor:</b> R$ {service.Price:N2}</p> <p><b>Vencimento:</b> {service.PaymentDueDate:yyyy-MM-dd}</p> {pix} <p>Descrição: {service.Description}</p> <p>Atenciosamente,<br/>Seu piscinero</p> ";
        return html;
    }


    public static MimeMessage BuildEmailMessage(Service service, NotificationConfig config, string paymentLink)
    {
        var msg = new MimeMessage();
        msg.To.Add(new MailboxAddress(service.Customer?.Name ?? string.Empty, service.Customer?.Email ?? string.Empty));
        msg.Subject = $"Cobrança - Vencimento {service.PaymentDueDate:dd/MM/yyyy}";

        var htmlTemplate = @"
        <table width=""100%"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background-color:#f4f6f8;padding:20px 0;"">
          <tr>
            <td align=""center"">
              <table width=""600"" cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""background-color:#ffffff;border-radius:8px;overflow:hidden;"">
                <!-- header image -->
                <tr>
                  <td style=""padding:0;"">
                    <img src=""{{HEADER_IMG}}"" alt=""Piscineiro - logo/header"" width=""600"" style=""display:block;width:100%;height:auto;border:0;line-height:0;"">
                  </td>
                </tr>

                <tr>
                  <td style=""padding:24px;font-family:Arial,Helvetica,sans-serif;color:#1b2b3a;"">
                    <h1 style=""margin:0 0 12px 0;font-size:20px;font-weight:700;color:#0b3a66;"">Olá, {{CustomerName}}</h1>

                    <p style=""margin:0 0 12px 0;font-size:14px;line-height:1.5;color:#34495e;"">
                      Esta é uma notificação de cobrança referente ao serviço abaixo.
                    </p>

                    <table cellpadding=""0"" cellspacing=""0"" role=""presentation"" style=""width:100%;margin:14px 0 18px 0;border-collapse:collapse;"">
                      <tr>
                        <td style=""font-size:14px;color:#55606a;padding:8px 0;width:50%""><strong>Serviço:</strong> {{Description}}</td>
                        <td style=""font-size:14px;color:#55606a;padding:8px 0;text-align:right;""><strong>Valor:</strong> R$ {{Price}}</td>
                      </tr>
                      <tr>
                        <td style=""font-size:14px;color:#55606a;padding:8px 0;width:50%""><strong>Data/Serviço:</strong> {{ServiceDate}}</td>
                        <td style=""font-size:14px;color:#55606a;padding:8px 0;text-align:right;""><strong>Vencimento:</strong> {{DueDate}}</td>
                      </tr>
                    </table>

                    <div style=""background:#f1f6fb;border:1px solid #e6eef8;padding:12px;border-radius:6px;font-size:14px;color:#10375c;text-align:center;"">
                      <div style=""font-weight:700;margin-bottom:6px"">PIX:</div>
                      <div style=""font-size:16px;letter-spacing:0.5px"">{{PixKey}}</div>
                    </div>

                    <p style=""font-size:13px;color:#7b8895;margin-top:18px;line-height:1.4;"">
                      Caso já tenha efetuado o pagamento, ignore esta mensagem. Em caso de dúvidas responda este e-mail.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style=""background:#f7f9fb;padding:16px;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7b8895;"">
                    <img src=""{{FOOTER_IMG}}"" alt=""logo footer"" width=""120"" style=""display:block;margin:0 auto 8px auto;"">
                    <div style=""margin-top:8px;font-size:11px;color:#9aa6b3;"">
                      Você está recebendo este e-mail porque contratou nossos serviços. <br/>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>";

        var html = htmlTemplate
            .Replace("{{CustomerName}}", service.Customer?.Name ?? "Cliente")
            .Replace("{{Description}}", service.Description ?? "")
            .Replace("{{Price}}", service.Price.ToString("N2"))
            .Replace("{{DueDate}}", service.PaymentDueDate.ToString("dd/MM/yyyy") ?? "")
            .Replace("{{PixKey}}", config.DefaultPixKey ?? "")
            .Replace("{{ServiceDate}}", service.ServiceDate.ToString("dd/MM/yyyy"))
            .Replace("{{PaymentLink}}", paymentLink ?? "#");

        var headerLocal = Path.Combine(AssetsEmailFolder, "Assinatura.png");
        var footerLocal = Path.Combine(AssetsEmailFolder, "Logo.png");

        BodyBuilder builder = new()
        {
            TextBody = $"Olá {service.Customer?.Name},\n\nCobrança: R$ {service.Price:N2}\nVencimento: {service.PaymentDueDate:dd/MM/yyyy}\nPIX: {config.DefaultPixKey}\n\nAtenciosamente, Ondas"
        };

        if (File.Exists(headerLocal))
        {
            var header = builder.LinkedResources.Add(headerLocal);
            header.ContentId = MimeUtils.GenerateMessageId();
            html = html.Replace("{{HEADER_IMG}}", $"cid:{header.ContentId}");
        }
        else
        {
            html = html.Replace("{{HEADER_IMG}}", "");
        }

        if (File.Exists(footerLocal))
        {
            var footer = builder.LinkedResources.Add(footerLocal);
            footer.ContentId = MimeUtils.GenerateMessageId();
            html = html.Replace("{{FOOTER_IMG}}", $"cid:{footer.ContentId}");
        }
        else
        {
            html = html.Replace("{{FOOTER_IMG}}", "");
        }

        builder.HtmlBody = html;
        msg.Body = builder.ToMessageBody();

        return msg;
    }
}