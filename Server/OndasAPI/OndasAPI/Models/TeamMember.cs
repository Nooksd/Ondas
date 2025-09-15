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
    protected TeamMember() { }

    public TeamMember(int teamId, int employeeId, DateTime? startDate = null)
    {
        TeamId = teamId;
        EmployeeId = employeeId;

        Validate();
    }

    private void Validate()
    {
        if (TeamId <= 0)
            throw new ArgumentException("Equipe é obrigatória");

        if (EmployeeId <= 0)
            throw new ArgumentException("Funcionário é obrigatório");
    }
}