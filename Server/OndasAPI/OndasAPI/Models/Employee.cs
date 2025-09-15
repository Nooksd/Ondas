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
    public virtual ICollection<TeamMember> TeamMembers { get; private set; } = new List<TeamMember>();

    protected Employee() { }

    public Employee(string name, string role, string cpf, decimal salary)
    {
        Name = name.Trim();
        Role = role.Trim();
        Cpf = FormatCpf(cpf);
        Salary = salary;

        Validate();
    }

    public void Update(string name, string role, decimal salary)
    {
        Name = name.Trim();
        Role = role.Trim();
        Salary = salary;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    public void UpdateSalary(decimal newSalary)
    {
        if (newSalary < 0)
            throw new ArgumentException("Salário não pode ser negativo");

        Salary = newSalary;
        UpdatedAt = DateTime.UtcNow;
    }

    private string FormatCpf(string cpf)
    {
        var cleanCpf = new string(cpf.Where(char.IsDigit).ToArray());

        if (cleanCpf.Length != 11)
            throw new ArgumentException("CPF deve conter 11 dígitos");

        return $"{cleanCpf[..3]}.{cleanCpf[3..6]}.{cleanCpf[6..9]}-{cleanCpf[9..]}";
    }

    private void Validate()
    {
        if (string.IsNullOrEmpty(Name))
            throw new ArgumentException("Nome é obrigatório");

        if (string.IsNullOrEmpty(Role))
            throw new ArgumentException("Cargo é obrigatório");

        if (string.IsNullOrEmpty(Cpf) || Cpf.Length != 14)
            throw new ArgumentException("CPF inválido");

        if (Salary < 0)
            throw new ArgumentException("Salário não pode ser negativo");
    }
}