using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.DTOs;
using OndasAPI.Models;
using OndasAPI.Pagination;
using System.Security.Claims;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Produces("application/json")]
public class UserController(UserManager<AppUser> userManager, AppDbContext context) : ControllerBase
{
    private readonly UserManager<AppUser> _userManager = userManager;
    private readonly AppDbContext _context = context;

    private readonly string[] _roles = ["Admin", "Editor", "Viewer"];

    [Authorize("Admin")]
    [HttpGet]
    public async Task<ActionResult> GetUsers([FromQuery] PaginationParameters pagination, string q = "")
    {
        var qLower = (q ?? "").Trim().ToLower();
        var query = _userManager.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(qLower))
        {
            query = query.Where(u => u.UserName != null && u.UserName.ToLower().Contains(qLower));
        }

        query = query.OrderBy(u => u.UserName);

        var paginatedUsers = await PagedList<AppUser>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        var metadata = new
        {
            paginatedUsers.CurrentPage,
            paginatedUsers.PageSize,
            paginatedUsers.TotalPages,
            paginatedUsers.TotalCount,
            paginatedUsers.HasNext,
            paginatedUsers.HasPrevious,
        };

        var usersList = paginatedUsers.ToList();
        var usersDto = usersList.Adapt<List<UserDTO>>();

        var userIds = usersList.Select(u => u.Id).ToList();

        var rolesQuery = from ur in _context.UserRoles
                         join r in _context.Roles on ur.RoleId equals r.Id
                         where userIds.Contains(ur.UserId)
                         select new { ur.UserId, r.Name };

        var rolesList = await rolesQuery.ToListAsync();

        var rolesById = rolesList
            .GroupBy(x => x.UserId)
            .ToDictionary(g => g.Key, g => g.Select(x => x.Name!).ToArray());

        foreach (var dto in usersDto)
        {
            if (dto.Id != null && rolesById.TryGetValue(dto.Id, out var roles))
                dto.Roles = roles;
            else
                dto.Roles = [];
        }

        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(metadata));

        var response = new
        {
            Users = usersDto,
            Metadata = metadata
        };

        return Ok(response);
    }



    [Authorize("Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        var roles = await _userManager.GetRolesAsync(user);

        var userDto = user.Adapt<UserDTO>();
        userDto.Roles = [.. roles];

        return Ok(userDto);
    }


    [Authorize("Admin")]
    [HttpPost]
    public async Task<IActionResult> PostUser([FromBody] UserDTO userDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (await _userManager.FindByEmailAsync(userDto.Email!) != null)
            return Conflict("Email já existe");

        AppUser user = new()
        {
            Email = userDto.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = userDto.UserName,
        };

        var result = await _userManager.CreateAsync(user, userDto.Password!);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        if (userDto.Roles != null && userDto.Roles.Length > 0)
        {
            await _userManager.AddToRolesAsync(user, userDto.Roles.Distinct());
        }

        var created = user.Adapt<UserDTO>();
        created.Roles = [.. (await _userManager.GetRolesAsync(user))];

        return CreatedAtAction(nameof(GetUser), new { id = created.Id }, created);
    }

    [Authorize("Admin")]
    [HttpPatch("{id}")]
    public async Task<IActionResult> PatchUser(string id, [FromBody] UpdateUserDTO updateUser)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        var superemail = Environment.GetEnvironmentVariable("SUPERADM_EMAIL") ?? "superadm@ondas.com";

        if (user.Email!.Equals(superemail))
        {
            return BadRequest("Superadm não pode ser editado");
        }


        if (!string.IsNullOrWhiteSpace(updateUser.UserName))
            user.UserName = updateUser.UserName;

        if (!string.IsNullOrWhiteSpace(updateUser.Email))
            user.Email = updateUser.Email;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            return BadRequest(updateResult.Errors);

        var updated = user.Adapt<UserDTO>();

        return Ok(updated);
    }

    [Authorize("Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        var superemail = Environment.GetEnvironmentVariable("SUPERADM_EMAIL") ?? "superadm@ondas.com";

        if (user.Email!.Equals(superemail))
        {
            return BadRequest("Superadm não pode ser deletado");
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }


    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangeOwnPassword([FromBody] ChangePasswordDTO changePasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = User;

        var currentUser = await _userManager.FindByEmailAsync(user.FindFirstValue(ClaimTypes.Email)!);
        if (currentUser is null)
            return Unauthorized();

        var changeResult = await _userManager.ChangePasswordAsync(currentUser, changePasswordDto.CurrentPassword!, changePasswordDto.NewPassword!);
        if (!changeResult.Succeeded)
            return BadRequest(changeResult.Errors);

        return Ok();
    }

    [Authorize("Admin")]
    [HttpPost("change-password/{id}")]
    public async Task<IActionResult> AdminChangePassword(string id, [FromBody] ChangePasswordDTO changePasswordDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetResult = await _userManager.ResetPasswordAsync(user, token, changePasswordDto.NewPassword!);

        if (!resetResult.Succeeded)
            return BadRequest(resetResult.Errors);

        return Ok();
    }

    [Authorize("Admin")]
    [HttpPost("revoke/{id}")]
    public async Task<IActionResult> RevokeRefreshToken(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        user.RefreshToken = null;
        user.RefreshTokenExpiryTime = DateTime.MinValue;
        await _userManager.UpdateAsync(user);

        return Ok();
    }

    [Authorize("Admin")]
    [HttpPost("add-role/{id}")]
    public async Task<IActionResult> AddUserToRole(string id, [FromBody] RoleDTO role)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        if (_roles.Contains(role.RoleName) == false)
            return BadRequest("Papel inválido");

        var result = await _userManager.AddToRoleAsync(user, role.RoleName!);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var userDto = user.Adapt<UserDTO>();

        var response = new
        {
            User = userDto,
            RoleName = role.RoleName!,
        };

        return Ok(response);
    }

    [Authorize("Admin")]
    [HttpPost("remove-role/{id}")]
    public async Task<IActionResult> RemoveUserFromRole(string id, [FromBody] RoleDTO role)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        if (!await _userManager.IsInRoleAsync(user, role.RoleName!))
            return BadRequest("Usuário não está neste papel");

        var result = await _userManager.RemoveFromRoleAsync(user, role.RoleName!);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var userDto = user.Adapt<UserDTO>();

        var response = new
        {
            User = userDto,
            RoleName = role.RoleName!,
        };

        return Ok(response);
    }
}
