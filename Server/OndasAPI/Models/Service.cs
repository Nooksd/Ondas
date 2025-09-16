using OndasAPI.Validations;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public enum ServiceStatus
{
    Agendado = 1,
    Concluido = 2,
    AguardandoPagamento = 3,
    AtrasoNoPagamento = 4,
    Cancelado = 5
}

public class Service : EntityBase
{
    [Required(ErrorMessage = "Cliente é obrigatório")]
    public int CustomerId { get; private set; }


    [Required(ErrorMessage = "Equipe é obrigatória")]
    public int TeamId { get; private set; }


    [Required(ErrorMessage = "Preço é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a zero")]
    public decimal Price { get; private set; }


    [Required(ErrorMessage = "Data do serviço é obrigatória")]
    public DateTime ServiceDate { get; private set; }


    [Required(ErrorMessage = "Data de pagamento é obrigatória")]
    [FutureDate]
    public DateTime? PaymentDueDate { get; private set; }


    [StringLength(500, MinimumLength = 10, ErrorMessage = "Descrição deve ter entre 10 e 500 caracteres")]
    public string Description { get; private set; } = string.Empty;


    public ServiceStatus Status { get; private set; } = ServiceStatus.Agendado;

    public DateTime PaymentDate { get; set; }



    [JsonIgnore]
    public virtual Customer? Customer { get; private set; }

    [JsonIgnore]
    public virtual Team? Team { get; private set; }
}