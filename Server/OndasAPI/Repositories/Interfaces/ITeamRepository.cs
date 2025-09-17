using OndasAPI.Models;
using OndasAPI.Pagination;

namespace OndasAPI.Repositories.Interfaces;

public interface ITeamRepository : IRepository<Team>
{
    Task<PagedList<Team>> GetTeamsAsync(PaginationParameters pagination, string q, bool isActive);
    Task<Team?> DeactivateTeamAsync(int id);
    Task<Team?> ActivateTeamAsync(int id);

    Task<Team?> GetTeamWithEmployeesAsync(int teamId);
}
