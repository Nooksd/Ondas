using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OndasAPI.DTOs;
using OndasAPI.Models;
using OndasAPI.Pagination;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Produces("application/json")]
public class UserController(UserManager<AppUser> userManager) : ControllerBase
{
    private readonly UserManager<AppUser> _userManager = userManager;

    private readonly string[] _roles = ["Admin", "Editor", "Viewer"];

    [Authorize("Admin")]
    [HttpGet]
    public async Task<ActionResult> GetUsers([FromQuery] PaginationParameters pagination, string q = "")
    {
        var qLower = (q ?? "").Trim().ToLower();

        var query = _userManager.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(qLower))
        {
            query = query.Where(u =>
                (u.UserName != null && u.UserName.Contains(qLower, StringComparison.CurrentCultureIgnoreCase)) ||
                (u.Email != null && u.Email.Contains(qLower, StringComparison.CurrentCultureIgnoreCase)));
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

        var roleTasks = usersList.Select(async u => new
        {
            u.Id,
            Roles = (await _userManager.GetRolesAsync(u)).ToArray()
        });

        var rolesResults = await Task.WhenAll(roleTasks);
        var rolesById = rolesResults.ToDictionary(x => x.Id, x => x.Roles);

        foreach (var dto in usersDto)
        {
            if (dto.Id != null && rolesById.TryGetValue(dto.Id, out var roles))
                dto.Roles = roles;
            else
                dto.Roles = [];
        }

        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(metadata));

        return Ok(usersDto);
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

        var user = userDto.Adapt<AppUser>();

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
    [HttpPut]
    public async Task<IActionResult> PutUser([FromBody] UserDTO userDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByIdAsync(userDto.Id!);
        if (user is null)
            return NotFound("Usuário não encontrado");

        if (!string.IsNullOrWhiteSpace(userDto.Username))
            user.UserName = userDto.Username;

        if (!string.IsNullOrWhiteSpace(userDto.Email))
            user.Email = userDto.Email;

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

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser is null)
            return Unauthorized();

        var changeResult = await _userManager.ChangePasswordAsync(currentUser, changePasswordDto.CurrentPassword!, changePasswordDto.NewPassword!);
        if (!changeResult.Succeeded)
            return BadRequest(changeResult.Errors);

        return Ok();
    }

    [Authorize("Admin")]
    [HttpPost("admin-change-password/{id}")]
    public async Task<IActionResult> AdminChangePassword(string id, [FromBody] string newPassword)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var resetResult = await _userManager.ResetPasswordAsync(user, token, newPassword);

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
    [HttpPost("{id}/add-role")]
    public async Task<IActionResult> AddUserToRole(string id, [FromBody] string newRole)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        if (_roles.Contains(newRole) == false)
            return BadRequest("Papel inválido");

        var result = await _userManager.AddToRoleAsync(user, newRole);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok();
    }

    [Authorize("Admin")]
    [HttpPost("{id}/remove-role")]
    public async Task<IActionResult> RemoveUserFromRole(string id, [FromBody] string roleName)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null)
            return NotFound("Usuário não encontrado");

        if (!await _userManager.IsInRoleAsync(user, roleName))
            return BadRequest("Usuário não está neste papel");

        var result = await _userManager.RemoveFromRoleAsync(user, roleName);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok();
    }
}
