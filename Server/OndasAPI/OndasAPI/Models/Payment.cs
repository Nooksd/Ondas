using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OndasAPI.Models;

public enum PaymentMethod
{
    CartaoCredito = 1,
    CartaoDebito = 2,
    Pix = 3,
    Dinheiro = 4,
    Transferencia = 5,
    Boleto = 6
}

public enum PaymentStatus
{
    Pendente = 1,
    Processando = 2,
    Aprovado = 3,
    Recusado = 4,
    Reembolsado = 5
}

public class Payment : EntityBase
{
    [Required(ErrorMessage = "Serviço é obrigatório")]
    public int ServiceId { get; private set; }

    [Required(ErrorMessage = "Método de pagamento é obrigatório")]
    public PaymentMethod Method { get; private set; }

    [Required(ErrorMessage = "Data do pagamento é obrigatória")]
    public DateTime PaymentDate { get; private set; }

    [Required(ErrorMessage = "Valor é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Valor deve ser maior ou igual a zero")]
    public decimal Amount { get; private set; }

    [Required(ErrorMessage = "Status do pagamento é obrigatório")]
    public PaymentStatus Status { get; private set; } = PaymentStatus.Pendente;


    [JsonIgnore]
    public virtual Service? Service { get; private set; }

    protected Payment() { }

    public Payment(int serviceId, PaymentMethod method, DateTime paymentDate,
                  decimal amount, string? transactionId = null, string? notes = null)
    {
        ServiceId = serviceId;
        Method = method;
        PaymentDate = paymentDate;
        Amount = amount;

        Validate();
    }

    public void UpdatePayment(PaymentMethod method, DateTime paymentDate, decimal amount,
                            string? transactionId = null, string? notes = null)
    {
        Method = method;
        PaymentDate = paymentDate;
        Amount = amount;
        UpdatedAt = DateTime.UtcNow;

        Validate();
    }

    public void ProcessPayment()
    {
        if (Status != PaymentStatus.Pendente)
            throw new InvalidOperationException("Pagamento já foi processado");

        Status = PaymentStatus.Processando;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ApprovePayment(string transactionId)
    {
        if (Status != PaymentStatus.Processando)
            throw new InvalidOperationException("Pagamento deve estar em processamento para ser aprovado");

        Status = PaymentStatus.Aprovado;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RejectPayment(string reason)
    {
        if (Status != PaymentStatus.Processando)
            throw new InvalidOperationException("Pagamento deve estar em processamento para ser recusado");

        Status = PaymentStatus.Recusado;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RefundPayment(string reason)
    {
        if (Status != PaymentStatus.Aprovado)
            throw new InvalidOperationException("Apenas pagamentos aprovados podem ser reembolsados");

        Status = PaymentStatus.Reembolsado;
        UpdatedAt = DateTime.UtcNow;
    }

    private void Validate()
    {
        if (ServiceId <= 0)
            throw new ArgumentException("Serviço é obrigatório");

        if (Amount <= 0)
            throw new ArgumentException("Valor deve ser maior que zero");

        if (PaymentDate > DateTime.UtcNow.AddDays(1))
            throw new ArgumentException("Data do pagamento não pode ser no futuro distante");
    }
}