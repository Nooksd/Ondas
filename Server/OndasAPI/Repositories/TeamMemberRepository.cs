using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class TeamMemberRepository(AppDbContext context) : Repository<TeamMember>(context), ITeamMemberRepository
{
    public async Task<TeamMember> AddEmployeeAsync(int teamId, int employeeId)
    {
        var team = await _context.Set<Team>().FindAsync(teamId);
        if (team is null)
            throw new KeyNotFoundException("Time não encontrado.");

        var employee = await _context.Set<Employee>().FindAsync(employeeId);
        if (employee is null)
            throw new KeyNotFoundException("Funcionário não encontrado.");


        var exists = await _context.Set<TeamMember>()
            .AnyAsync(tm => tm.TeamId == teamId && tm.EmployeeId == employeeId);

        if (exists)
            throw new InvalidOperationException("Funcionário já é membro desse time.");

        var teamMember = new TeamMember
        {
            TeamId = teamId,
            EmployeeId = employeeId
        };

        var created = Create(teamMember);
        return created;
    }

    public async Task<TeamMember> RemoveEmployeeAsync(int teamId, int employeeId)
    {
        var teamMember = await _context.Set<TeamMember>()
            .FirstOrDefaultAsync(tm => tm.TeamId == teamId && tm.EmployeeId == employeeId);

        if (teamMember is null)
            throw new KeyNotFoundException("Membro do time não encontrado.");

        Delete(teamMember);

        return teamMember;
    }
}
