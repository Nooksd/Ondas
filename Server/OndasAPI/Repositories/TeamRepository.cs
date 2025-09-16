using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class TeamRepository(AppDbContext appDbContext) : Repository<Team>(appDbContext), ITeamRepository
{
}
