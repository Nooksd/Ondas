using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class AddressDTO
{
    [Required(ErrorMessage = "CEP é obrigatório")]
    [StringLength(9, MinimumLength = 8, ErrorMessage = "CEP deve ter 8 ou 9 caracteres")]
    [RegularExpression(@"^\d{5}-?\d{3}$", ErrorMessage = "Formato de CEP inválido")]
    public string PostalCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "Estado é obrigatório")]
    [StringLength(2, MinimumLength = 2, ErrorMessage = "UF deve ter 2 caracteres")]
    public string Region { get; set; } = string.Empty;

    [Required(ErrorMessage = "Cidade é obrigatória")]
    [StringLength(100, ErrorMessage = "Cidade não pode exceder 100 caracteres")]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "Bairro é obrigatório")]
    [StringLength(100, ErrorMessage = "Bairro não pode exceder 100 caracteres")]
    public string? Neighborhood { get; set; }

    [Required(ErrorMessage = "Rua é obrigatória")]
    [StringLength(200, ErrorMessage = "Rua não pode exceder 200 caracteres")]
    public string Street { get; set; } = string.Empty;

    [Required(ErrorMessage = "Número é obrigatório")]
    [Range(1, int.MaxValue, ErrorMessage = "Número deve ser maior que zero")]
    public int Number { get; set; }

    [StringLength(50, ErrorMessage = "Complemento não pode exceder 50 caracteres")]
    public string? Complement { get; set; }
}
