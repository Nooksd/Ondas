using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OndasAPI.DTOs;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Produces("application/json")]
[ApiConventionType(typeof(DefaultApiConventions))]
public class TeamsController(IUnitOfWork unitOfWork) : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    [Authorize("Viewer")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamDTO>>> GetTeams([FromQuery] PaginationParameters pagination, string? q, bool isActive = true)
    {
        var teams = await _unitOfWork.TeamRepository.GetTeamsAsync(pagination, q ?? "", isActive);

        var metadata = new
        {
            teams?.CurrentPage,
            teams?.PageSize,
            teams?.TotalPages,
            teams?.TotalCount,
            teams?.HasNext,
            teams?.HasPrevious,
        };

        var teamsDto = teams?.Adapt<IEnumerable<TeamDTO>>();

        Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(metadata));

        return Ok(teamsDto);
    }

    [Authorize("Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeamDTO>> GetTeam(int id)
    {
        var team = await _unitOfWork.TeamRepository.GetTeamWithEmployeesAsync(id);

        if (team is null)
        {
            return NotFound("Time não encontrado");
        }

        var teamDto = team.Adapt<TeamDTO>();

        return Ok(teamDto);
    }

    [Authorize("Editor")]
    [HttpPost]
    public async Task<ActionResult<TeamDTO>> PostTeam(TeamDTO teamDto)
    {
        var team = teamDto.Adapt<Team>();

        var createdTeam = _unitOfWork.TeamRepository.Create(team);
        await _unitOfWork.CommitAsync();

        var createdTeamDto = createdTeam.Adapt<TeamDTO>();

        return CreatedAtAction("GetTeam", new { id = createdTeamDto.Id }, createdTeamDto);
    }

    [Authorize("Editor")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<TeamDTO>> PutTeam(int id, TeamDTO teamDto)
    {
        var team = teamDto.Adapt<Team>();

        if (id != team.Id)
        {
            return BadRequest("IDs não correspondem");
        }

        var updatedTeam = _unitOfWork.TeamRepository.Update(team);
        await _unitOfWork.CommitAsync();

        var updatedTeamDto = updatedTeam.Adapt<TeamDTO>();

        return Ok(updatedTeamDto);
    }

    [Authorize("Editor")]
    [HttpPost("{teamId:int}/members/{employeeId:int}")]
    public async Task<ActionResult<TeamDTO>> AddMember(int teamId, int employeeId)
    {
        var team = await _unitOfWork.TeamRepository.GetAsync(t => t.Id == teamId);
        if (team is null)
            return NotFound("Time não encontrado.");

        var employee = await _unitOfWork.EmployeeRepository.GetAsync(e => e.Id == employeeId);
        if (employee is null)
            return NotFound("Funcionário não encontrado.");


        await _unitOfWork.TeamMemberRepository.AddEmployeeAsync(teamId, employeeId);
        await _unitOfWork.CommitAsync();

        var teamWithEmployees = await _unitOfWork.TeamRepository.GetTeamWithEmployeesAsync(teamId);
        var teamDto = teamWithEmployees?.Adapt<TeamDTO>();

        return Ok(teamDto);

    }

    [Authorize("Editor")]
    [HttpDelete("{teamId:int}/members/{employeeId:int}")]
    public async Task<ActionResult<TeamDTO>> RemoveMember(int teamId, int employeeId)
    {
        var team = await _unitOfWork.TeamRepository.GetAsync(t => t.Id == teamId);
        if (team is null)
            return NotFound("Time não encontrado.");


        await _unitOfWork.TeamMemberRepository.RemoveEmployeeAsync(teamId, employeeId);
        await _unitOfWork.CommitAsync();

        var teamWithEmployees = await _unitOfWork.TeamRepository.GetTeamWithEmployeesAsync(teamId);
        var teamDto = teamWithEmployees?.Adapt<TeamDTO>();

        return Ok(teamDto);

    }

    [Authorize("Editor")]
    [HttpPatch("activate/{id:int}")]
    public async Task<ActionResult<TeamDTO>> ActivateTeam(int id)
    {
        var team = await _unitOfWork.TeamRepository.ActivateTeamAsync(id);
        if (team is null)
        {
            return NotFound("Funcionário não encontrado ou já ativo");
        }

        await _unitOfWork.CommitAsync();

        var teamDto = team.Adapt<TeamDTO>();

        return Ok(teamDto);
    }

    [Authorize("Editor")]
    [HttpPatch("deactivate/{id:int}")]
    public async Task<ActionResult<TeamDTO>> DeactivateTeam(int id)
    {
        var team = await _unitOfWork.TeamRepository.DeactivateTeamAsync(id);
        if (team is null)
        {
            return NotFound("Funcionário não encontrado ou já inativo");
        }

        await _unitOfWork.CommitAsync();

        var teamDto = team.Adapt<TeamDTO>();

        return Ok(teamDto);
    }

    [Authorize("Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<TeamDTO>> DeleteTeam(int id)
    {
        var team = await _unitOfWork.TeamRepository.GetAsync(x => x.Id == id);
        if (team is null)
        {
            return NotFound("Time não encontrado");
        }

        _unitOfWork.TeamRepository.Delete(team);
        await _unitOfWork.CommitAsync();

        var teamDto = team.Adapt<TeamDTO>();

        return Ok(teamDto);

    }
}
