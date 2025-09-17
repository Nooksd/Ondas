using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
namespace OndasAPI.Models;

public class TeamMember : EntityBase
{
    [Required(ErrorMessage = "Equipe é obrigatória")]
    public int TeamId { get; set; }

    [Required(ErrorMessage = "Funcionário é obrigatório")]
    public int EmployeeId { get; set; }

    public virtual Employee? Employee { get; set; }

    [JsonIgnore]
    public virtual Team? Team { get; set; }
}