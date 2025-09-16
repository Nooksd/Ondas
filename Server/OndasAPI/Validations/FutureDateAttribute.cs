using System.ComponentModel.DataAnnotations;

namespace OndasAPI.Validations;

public class FutureDateAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null)
        {
            return ValidationResult.Success;
        }

        if (value is DateTime date)
        {
            if (date < DateTime.UtcNow)
            {
                return new ValidationResult("Data tem que ser futura");
            }

            return ValidationResult.Success;
        }

        return new ValidationResult("Valor inválido para data.");
    }
}
