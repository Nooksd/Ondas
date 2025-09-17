using OndasAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class TeamDTO
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome da equipe é obrigatório")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 50 caracteres")]
    public string Name { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public List<TeamMemberDTO> TeamMembers { get; set; } = [];
}
