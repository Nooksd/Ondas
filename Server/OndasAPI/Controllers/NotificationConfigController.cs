// Controllers/NotificationConfigController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;
using OndasAPI.Services.Interfaces;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NotificationConfigController(IUnitOfWork unitOfWork, IEmailSender emailSender) : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IEmailSender _emailSender = emailSender;

    [Authorize("Admin")]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var config = await _unitOfWork.NotificationConfigRepository.GetSingletonAsync();
        if (config is null)
            return NotFound();
        return Ok(config);
    }

    [Authorize("Admin")]
    [HttpPut]
    public async Task<IActionResult> CreateOrUpdate([FromBody] NotificationConfig config)
    {
        if (config is null)
            return BadRequest();

        var result = await _unitOfWork.NotificationConfigRepository.CreateOrUpdateAsync(config);
        await _unitOfWork.CommitAsync();

        return Ok(result);
    }


    [Authorize("Admin")]
    [HttpPost("test/{email}")]
    public async Task<IActionResult> TestSend(string email)
    {
        var config = await _unitOfWork.NotificationConfigRepository.GetSingletonAsync();
        if (config is null)
            return NotFound();

        if (config.SendEmails && !string.IsNullOrWhiteSpace(email))
        {
            var msg = new MimeMessage();

            msg.To.Add(new MailboxAddress("teste", email));
            msg.Subject = "teste";

            var builder = new BodyBuilder
            {
                HtmlBody = "<p>Este é um email de teste enviado pela API Ondas.</p>",
                TextBody = "Este é um email de teste enviado pela API Ondas."
            };

            msg.Body = builder.ToMessageBody();

            await _emailSender.SendEmailAsync(msg);
        }

        return Ok(new { ok = true });
    }
}
