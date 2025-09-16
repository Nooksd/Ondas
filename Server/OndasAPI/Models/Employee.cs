using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public class Employee : EntityBase
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 100 caracteres")]
    public string Name { get; private set; } = string.Empty;

    [Required(ErrorMessage = "Cargo é obrigatório")]
    [StringLength(50, ErrorMessage = "Cargo não pode exceder 50 caracteres")]
    public string Role { get; private set; } = string.Empty;

    [Required(ErrorMessage = "CPF é obrigatório")]
    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "Formato de CPF inválido")]
    public string Cpf { get; private set; } = string.Empty;

    [Required(ErrorMessage = "Salário é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Salário deve ser maior ou igual a zero")]
    public decimal Salary { get; private set; }

    [JsonIgnore]
    public virtual ICollection<TeamMember> TeamMembers { get; private set; } = [];
}