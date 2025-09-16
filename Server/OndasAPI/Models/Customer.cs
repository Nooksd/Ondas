using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public class Customer : EntityBase
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 100 caracteres")]
    public string Name { get; private set; } = string.Empty;


    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [StringLength(100, ErrorMessage = "Email não pode exceder 100 caracteres")]
    public string Email { get; private set; } = string.Empty;


    [Required(ErrorMessage = "CPF é obrigatório")]
    [RegularExpression(@"^\d{3}\.\d{3}\.\d{3}-\d{2}$", ErrorMessage = "Formato de CPF inválido")]
    public string Cpf { get; private set; } = string.Empty;


    [Required(ErrorMessage = "Telefone é obrigatório")]
    [Phone(ErrorMessage = "Formato de telefone inválido")]
    [StringLength(20, ErrorMessage = "Telefone não pode exceder 20 caracteres")]
    public string Phone { get; private set; } = string.Empty;


    [Required(ErrorMessage = "Endereço é obrigatório")]
    public int AddressId { get; private set; }

    [JsonIgnore]
    public virtual Address? Address { get; private set; }
}