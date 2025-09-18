namespace OndasAPI.Services.Interfaces;
public interface IEmailSender
{
    Task SendEmailAsync(string toEmail, string toName, string subject, string htmlBody);
}