using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class ChangePasswordDTO
{
    [Required]
    public string? CurrentPassword { get; set; }

    [Required]
    public string? NewPassword { get; set; }
}
