using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class ChangePasswordDTO
{
    public string? CurrentPassword { get; set; }

    [Required]
    public string? NewPassword { get; set; }
}
