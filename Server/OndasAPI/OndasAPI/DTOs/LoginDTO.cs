using OndasAPI.Validations;
using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class LoginDTO
{
    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [ValidPassword]
    public string? Password { get; set; }
}
