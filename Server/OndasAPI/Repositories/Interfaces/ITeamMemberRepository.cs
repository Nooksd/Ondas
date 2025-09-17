using OndasAPI.Models;

namespace OndasAPI.Repositories.Interfaces;

public interface ITeamMemberRepository : IRepository<TeamMember>
{
    Task<TeamMember> AddEmployeeAsync(int teamId, int employeeId);
    Task<TeamMember> RemoveEmployeeAsync(int teamId, int employeeId);
}
