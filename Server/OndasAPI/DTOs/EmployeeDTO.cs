using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class EmployeeDTO
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 100 caracteres")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Cargo é obrigatório")]
    [StringLength(50, ErrorMessage = "Cargo não pode exceder 50 caracteres")]
    public string? Role { get; set; }

    [Required(ErrorMessage = "CPF é obrigatório")]
    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "Formato de CPF inválido")]
    public string? Cpf { get; set; }

    [Required(ErrorMessage = "Salário é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Salário deve ser maior ou igual a zero")]
    public decimal Salary { get; set; }

    public bool IsActive { get; set; } = true;
}
