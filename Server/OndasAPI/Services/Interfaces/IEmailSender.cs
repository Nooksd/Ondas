using MimeKit;

namespace OndasAPI.Services.Interfaces;
public interface IEmailSender
{
    Task SendEmailAsync(MimeMessage message);
}