using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public class Team : EntityBase
{
    [Required(ErrorMessage = "Nome da equipe é obrigatório")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 50 caracteres")]
    public string Name { get; private set; } = string.Empty;

    [JsonIgnore]
    public virtual ICollection<TeamMember> TeamMembers { get; private set; } = new List<TeamMember>();

    protected Team() { }

    public Team(string name, string? description = null)
    {
        Name = name.Trim();

        Validate();
    }

    public void Update(string name, string? description = null)
    {
        Name = name.Trim();
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    private void Validate()
    {
        if (string.IsNullOrEmpty(Name))
            throw new ArgumentException("Nome da equipe é obrigatório");
    }
}