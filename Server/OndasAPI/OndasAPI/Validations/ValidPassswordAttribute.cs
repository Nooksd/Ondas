using System.ComponentModel.DataAnnotations;

namespace OndasAPI.Validations;

public class ValidPasswordAttribute : ValidationAttribute
{
    public bool RequireDigit { get; set; } = true;
    public bool RequireLowercase { get; set; } = true;
    public bool RequireUppercase { get; set; } = true;
    public bool RequireNonAlphanumeric { get; set; } = true;
    public int RequiredLength { get; set; } = 6;

    protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
    {
        if (value is null || string.IsNullOrEmpty(value.ToString()))
        {
            return new ValidationResult("Password is required");
        }

        var password = value.ToString()!;
        var errors = new List<string>();

        if (password.Length < RequiredLength)
        {
            errors.Add($"Password must be at least {RequiredLength} characters long");
        }

        if (RequireDigit && !password.Any(char.IsDigit))
        {
            errors.Add("Password must contain at least one digit (0-9)");
        }

        if (RequireLowercase && !password.Any(char.IsLower))
        {
            errors.Add("Password must contain at least one lowercase letter (a-z)");
        }

        if (RequireUppercase && !password.Any(char.IsUpper))
        {
            errors.Add("Password must contain at least one uppercase letter (A-Z)");
        }

        if (RequireNonAlphanumeric && !password.Any(ch => !char.IsLetterOrDigit(ch)))
        {
            errors.Add("Password must contain at least one special character (!@#$%^&* etc.)");
        }

        if (errors.Count > 0)
        {
            return new ValidationResult(string.Join("; ", errors));
        }

        return ValidationResult.Success!;
    }
}