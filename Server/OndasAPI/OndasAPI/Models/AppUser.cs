using Microsoft.AspNetCore.Identity;

namespace OndasAPI.Models;

public class AppUser : IdentityUser
{
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}
