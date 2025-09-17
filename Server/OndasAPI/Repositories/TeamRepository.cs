using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class TeamRepository(AppDbContext context) : Repository<Team>(context), ITeamRepository
{
    public async Task<Team?> ActivateTeamAsync(int id)
    {
        var team = await GetAsync(x => x.Id == id);

        if (team is null || team.IsActive)
        {
            return null;
        }
        team.Reactivate();

        Update(team);

        return team;
    }

    public async Task<Team?> DeactivateTeamAsync(int id)
    {
        var team = await GetAsync(x => x.Id == id);

        if (team is null || !team.IsActive)
        {
            return null;
        }

        team.Deactivate();

        Update(team);

        return team;
    }

    public async Task<PagedList<Team>> GetTeamsAsync(PaginationParameters pagination, string q, bool isActive)
    {
        var query = GetAll().Where(x => x.IsActive == isActive);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var qLower = q.Trim().ToLower();

            query = query.Where(p => p.Name.Contains(qLower, StringComparison.CurrentCultureIgnoreCase));
        }

        query = query.OrderBy(p => p.Name);


        var paginatedTeams = await PagedList<Team>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        return paginatedTeams;
    }

    public async Task<Team?> GetTeamWithEmployeesAsync(int teamId)
    {
        return await _context.Set<Team>()
            .Include(t => t.TeamMembers)
            .ThenInclude(tm => tm.Employee)
            .FirstOrDefaultAsync(t => t.Id == teamId);
    }

}
