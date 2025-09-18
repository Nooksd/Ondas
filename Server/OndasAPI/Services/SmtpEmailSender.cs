using MailKit.Net.Smtp;
using MimeKit;
using OndasAPI.Repositories.Interfaces;
using OndasAPI.Services.Interfaces;

namespace OndasAPI.Services;
public class SmtpEmailSender(IUnitOfWork unitOfWork) : IEmailSender
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody)
    {
        var config = await _unitOfWork.NotificationConfigRepository.GetSingletonAsync() ?? throw new InvalidOperationException("NotificationConfig não configurada.");


        var msg = new MimeMessage();
        msg.From.Add(new MailboxAddress(config.FromName ?? "No-Reply", config.FromEmail ?? ""));
        msg.To.Add(new MailboxAddress(toName, toEmail));
        msg.Subject = subject;

        var builder = new BodyBuilder { HtmlBody = htmlBody };
        msg.Body = builder.ToMessageBody();

        using var client = new SmtpClient();

        await client.ConnectAsync(config.SmtpHost, config.SmtpPort ?? 25, config.SmtpUseSsl);
        if (!string.IsNullOrEmpty(config.SmtpUser))
        {
            await client.AuthenticateAsync(config.SmtpUser, config.SmtpPassword);
        }
        await client.SendAsync(msg);
        await client.DisconnectAsync(true);
    }
}
