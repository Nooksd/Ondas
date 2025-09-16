using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public class TeamMember : EntityBase
{
    [Required(ErrorMessage = "Equipe é obrigatória")]
    public int TeamId { get; private set; }

    [Required(ErrorMessage = "Funcionário é obrigatório")]
    public int EmployeeId { get; private set; }

    [JsonIgnore]
    public virtual Employee? Employee { get; private set; }

    [JsonIgnore]
    public virtual Team? Team { get; private set; }
}