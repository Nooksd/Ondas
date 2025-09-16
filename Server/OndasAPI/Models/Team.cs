using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public class Team : EntityBase
{
    [Required(ErrorMessage = "Nome da equipe é obrigatório")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 50 caracteres")]
    public string Name { get; private set; } = string.Empty;

    [JsonIgnore]
    public virtual ICollection<TeamMember> TeamMembers { get; private set; } = [];
}