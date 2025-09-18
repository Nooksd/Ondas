using MailKit.Net.Smtp;
using MimeKit;
using OndasAPI.Repositories.Interfaces;
using OndasAPI.Services.Interfaces;

namespace OndasAPI.Services;
public class SmtpEmailSender(IUnitOfWork unitOfWork) : IEmailSender
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task SendEmailAsync(MimeMessage message)
    {
        var config = await _unitOfWork.NotificationConfigRepository.GetSingletonAsync() ?? throw new InvalidOperationException("NotificationConfig não configurada.");

        message.From.Add(new MailboxAddress(config.FromName ?? "Piscineiro", config.FromEmail ?? "no-reply@exemplo.com"));

        using var client = new SmtpClient();
        await client.ConnectAsync(config.SmtpHost ?? "localhost", config.SmtpPort ?? 25, config.SmtpUseSsl);
        if (!string.IsNullOrEmpty(config.SmtpUser))
        {
            await client.AuthenticateAsync(config.SmtpUser, config.SmtpPassword);
        }
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
