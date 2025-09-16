using Microsoft.AspNetCore.Identity;

namespace OndasAPI.Models;

public class AppUser : IdentityUser
{
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}

public static class Roles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Admin = "Admin";
    public const string Editor = "Editor";
    public const string Viewer = "Viewer";

    public static List<string> GetAllRoles()
    {
        return [SuperAdmin, Admin, Editor, Viewer];
    }
}