using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class RoleDTO
{
    [Required(ErrorMessage = "Role is required")]
    public string? RoleName { get; set; }
}
