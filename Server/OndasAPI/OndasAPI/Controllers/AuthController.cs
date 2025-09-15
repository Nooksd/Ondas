using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OndasAPI.DTOs;
using OndasAPI.Models;
using OndasAPI.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Produces("application/json")]
public class AuthController(ITokenService tokenService, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration) : ControllerBase
{

    private readonly ITokenService _tokenService = tokenService;
    private readonly UserManager<AppUser> _userManager = userManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;
    private readonly IConfiguration _configuration = configuration;

    [HttpPost("login")]
    public async Task<ActionResult<ResponseDTO>> Login([FromBody] LoginDTO loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email!);
        var isPasswordCorrect = await _userManager.CheckPasswordAsync(user!, loginDto.Password!);

        if (user == null || !isPasswordCorrect)
        {
            return Unauthorized("Email ou senha incorretos");
        }

        var userRoles = await _userManager.GetRolesAsync(user);

        var authClaims = new List<Claim> {
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Email, user.Email!),
            new("email", user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        ResponseDTO response = new()
        {
            Status = "Success",
            Message = "Login efetuado com sucesso"
        };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var accessToken = _tokenService.GenerateAcessToken(authClaims, _configuration);
        var refreshToken = _tokenService.GenerateRefreshToken();
        var refreshTokenValidity = _configuration["JWT:RefreshTokenValidityInMinutes"];

        _ = int.TryParse(refreshTokenValidity, out int refreshTokenValidityInMinutes);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(refreshTokenValidityInMinutes);

        await _userManager.UpdateAsync(user);

        var accessTokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

        Response.Cookies.Append("AccessToken", accessTokenString);
        Response.Cookies.Append("RefreshToken", refreshToken);

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<ResponseDTO>> Register([FromBody] RegisterDTO registerDto)
    {
        var userExists = await _userManager.FindByEmailAsync(registerDto.Email!);

        if (userExists is not null)
        {
            return Conflict("Usuário já registrado");
        }

        AppUser user = new()
        {
            Email = registerDto.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = registerDto.Username,
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password!);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        ResponseDTO response = new()
        {
            Status = "success",
            Message = "Registro efetuado com sucesso"
        };

        return CreatedAtAction("login", response);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<ResponseDTO>> RefreshToken()
    {
        string? refreshToken = HttpContext.Request.Cookies["RefreshToken"];
        string? accessToken = HttpContext.Request.Cookies["AccessToken"];

        if (string.IsNullOrWhiteSpace(refreshToken) || string.IsNullOrWhiteSpace(accessToken))
        {
            return BadRequest("Invalid client request ");
        }

        var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken!, _configuration);
        if (principal == null)
        {
            return BadRequest("Invalid token");
        }

        var email = principal.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest("Email claim not found");
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
        {
            return BadRequest("Invalid token");
        }

        var newAcessToken = _tokenService.GenerateAcessToken([.. principal.Claims], _configuration);
        var newRefreshToken = _tokenService.GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        var refreshTokenValidity = _configuration["JWT:RefreshTokenValidityInMinutes"];

        _ = int.TryParse(refreshTokenValidity, out int refreshTokenValidityInMinutes);

        user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(refreshTokenValidityInMinutes);
        await _userManager.UpdateAsync(user);

        var newAccessTokenString = new JwtSecurityTokenHandler().WriteToken(newAcessToken);

        Response.Cookies.Append("AccessToken", newAccessTokenString);
        Response.Cookies.Append("RefreshToken", newRefreshToken);

        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return BadRequest("Email claim not found");
        }

        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
        {
            return BadRequest("User not found");
        }

        user.RefreshToken = null;
        await _userManager.UpdateAsync(user);

        Response.Cookies.Delete("AccessToken");
        Response.Cookies.Delete("RefreshToken");

        return Ok();
    }

    [Authorize("Admin")]
    [HttpPost("revoke/{id}")]
    public async Task<ActionResult<ResponseDTO>> Revoke(int id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user == null)
        {
            return BadRequest("Usuário inexistente");
        }

        user.RefreshToken = null;

        await _userManager.UpdateAsync(user);

        return Ok(new ResponseDTO() { Status = "Sucesso", Message = "Acesso revogado" });

    }

    [Authorize("SuperAdmin")]
    [HttpPost("create-role")]
    public async Task<IActionResult> CreateRole(string roleName)
    {
        var roleExists = await _roleManager.RoleExistsAsync(roleName);

        if (roleExists)
        {
            return Conflict("Esse cargo já existe");
        }

        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));

        if (!result.Succeeded)
        {
            return StatusCode(500);
        }

        return Ok();
    }

    [Authorize("SuperAdmin")]
    [HttpPost("add-user-to-role")]
    public async Task<ActionResult<ResponseDTO>> AddUserToRole(string email, string roleName)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
        {
            return BadRequest("User não existe");
        }

        var result = await _userManager.AddToRoleAsync(user, roleName);

        if (!result.Succeeded)
        {
            return BadRequest($"Não foi possível adicionar {user.Email} para {roleName}");
        }

        ResponseDTO response = new()
        {
            Status = "Success",
            Message = "Cargo adicionado com sucesso",
        };

        return Ok(response);
    }
}
