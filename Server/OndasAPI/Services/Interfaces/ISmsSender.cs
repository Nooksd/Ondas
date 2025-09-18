namespace OndasAPI.Services.Interfaces;

public interface ISmsSender
{
    Task<Task> SendSmsAsync(string toPhone, string message);
}