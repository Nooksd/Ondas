using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class UpdateUserDTO
{
    public string? UserName { get; set; }

    [EmailAddress]
    public string? Email { get; set; }
}
