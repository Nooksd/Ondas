using Newtonsoft.Json;
using OndasAPI.Validations;
using System.ComponentModel.DataAnnotations;

namespace OndasAPI.Models;

public enum ServiceStatus
{
    Agendado = 1,
    EmAndamento = 2,
    AguardandoPagamento = 3,
    AtrasoNoPagamento = 4,
    Concluido = 5,
    Cancelado = 6
}

public class Service : EntityBase
{
    [Required(ErrorMessage = "Cliente é obrigatório")]
    public int CustomerId { get; set; }


    [Required(ErrorMessage = "Equipe é obrigatória")]
    public int TeamId { get; set; }


    [Required(ErrorMessage = "Preço é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a zero")]
    public decimal Price { get; set; }


    [Required(ErrorMessage = "Data do serviço é obrigatória")]
    public DateTime ServiceDate { get; set; }

    [Required(ErrorMessage = "Duração do serviço é obrigatória")]
    public TimeSpan ServiceDuration { get; set; }


    [Required(ErrorMessage = "Data de pagamento é obrigatória")]
    [FutureDate]
    public DateTime PaymentDueDate { get; set; }


    [StringLength(500, MinimumLength = 10, ErrorMessage = "Descrição deve ter entre 10 e 500 caracteres")]
    public string Description { get; set; } = string.Empty;


    public ServiceStatus Status { get; set; } = ServiceStatus.Agendado;

    public DateTime? PaymentDate { get; set; }



    [JsonIgnore]
    public virtual Customer? Customer { get; set; }

    [JsonIgnore]
    public virtual Team? Team { get; set; }
}