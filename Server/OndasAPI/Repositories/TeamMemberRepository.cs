using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class TeamMemberRepository(AppDbContext context) : Repository<TeamMember>(context), ITeamMemberRepository
{
}
