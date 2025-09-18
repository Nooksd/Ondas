using OndasAPI.Repositories.Interfaces;
using OndasAPI.Services.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;

namespace OndasAPI.Services;

public class TwilioSmsSender(IUnitOfWork unitOfWork) : ISmsSender
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Task> SendSmsAsync(string toPhone, string message)
    {
        var config = await _unitOfWork.NotificationConfigRepository.GetSingletonAsync() ?? throw new InvalidOperationException("NotificationConfig não configurada.");

        TwilioClient.Init(config.TwilioAccountSid, config.TwilioAuthToken);

        _ = MessageResource.Create(
            body: message,
            from: new Twilio.Types.PhoneNumber(config.TwilioFromNumber),
            to: new Twilio.Types.PhoneNumber(toPhone)
        );

        return Task.CompletedTask;
    }
}
