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
    public DateTime PaymentDate { get; set; }

    [Required(ErrorMessage = "Status é obrigatório")]
    public ServiceStatus Status { get; private set; } = ServiceStatus.Agendado;

    [Required(ErrorMessage = "Descrição é obrigatória")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "Descrição deve ter entre 10 e 500 caracteres")]
    public string Description { get; private set; } = string.Empty;

    public int? PaymentId { get; private set; }

    public DateTime? CompletionDate { get; private set; }

    public DateTime? PaymentDueDate { get; private set; }


    [JsonIgnore]
    public virtual Customer? Customer { get; private set; }

    [JsonIgnore]
    public virtual Team? Team { get; private set; }

    [JsonIgnore]
    public virtual Payment? Payment { get; private set; }

    protected Service() { }

    public Service(int customerId, int teamId, decimal price, DateTime serviceDate,
                  string description, DateTime? paymentDueDate = null)
    {
        CustomerId = customerId;
        TeamId = teamId;
        Price = price;
        ServiceDate = serviceDate;
        Description = description.Trim();
        PaymentDueDate = paymentDueDate;

        Validate();
    }

    public void UpdateService(int teamId, decimal price, DateTime serviceDate,
                            string description, DateTime? paymentDueDate = null)
    {
        TeamId = teamId;
        Price = price;
        ServiceDate = serviceDate;
        Description = description.Trim();
        PaymentDueDate = paymentDueDate;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    public void MarkAsCompleted()
    {
        if (Status == ServiceStatus.Cancelado)
            throw new InvalidOperationException("Serviço cancelado não pode ser concluído");

        Status = ServiceStatus.Concluido;
        CompletionDate = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsAwaitingPayment()
    {
        if (Status != ServiceStatus.Concluido)
            throw new InvalidOperationException("Serviço deve estar concluído para aguardar pagamento");

        Status = ServiceStatus.AguardandoPagamento;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsPaymentDelayed()
    {
        if (Status != ServiceStatus.AguardandoPagamento)
            throw new InvalidOperationException("Serviço deve estar aguardando pagamento para ser marcado como atraso");

        Status = ServiceStatus.AtrasoNoPagamento;
        UpdatedAt = DateTime.UtcNow;
    }

    public void CancelService()
    {
        Status = ServiceStatus.Cancelado;
        UpdatedAt = DateTime.UtcNow;
    }

    public void LinkPayment(int paymentId)
    {
        if (paymentId <= 0)
            throw new ArgumentException("ID de pagamento inválido");

        PaymentId = paymentId;
        UpdatedAt = DateTime.UtcNow;
    }

    private void Validate()
    {
        if (CustomerId <= 0)
            throw new ArgumentException("Cliente é obrigatório");

        if (TeamId <= 0)
            throw new ArgumentException("Equipe é obrigatória");

        if (Price < 0)
            throw new ArgumentException("Preço não pode ser negativo");

        if (ServiceDate < DateTime.UtcNow.AddDays(-1))
            throw new ArgumentException("Data do serviço não pode ser no passado");

        if (string.IsNullOrEmpty(Description))
            throw new ArgumentException("Descrição é obrigatória");
    }
}