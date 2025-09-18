using OndasAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace OndasAPI.DTOs;

public class ChangeServiceStatusDTO
{
    [Required]
    public ServiceStatus NewStatus { get; set; }
    public DateTime? PaymentDate { get; set; }
}
