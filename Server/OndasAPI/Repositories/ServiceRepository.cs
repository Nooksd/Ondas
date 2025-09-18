using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class ServiceRepository(AppDbContext context) : Repository<Service>(context), IServiceRepository
{
    public async Task<PagedList<Service>> GetServicesAsync(PaginationParameters pagination, int? customerId = null, int? teamId = null)
    {
        var query = GetAll()
                    .Include(s => s.Customer)
                    .Include(s => s.Team)
                    .AsQueryable();

        if (customerId.HasValue && customerId.Value > 0)
        {
            query = query.Where(s => s.CustomerId == customerId.Value);
        }

        if (teamId.HasValue && teamId.Value > 0)
        {
            query = query.Where(s => s.TeamId == teamId.Value);
        }

        query = query.OrderBy(s => s.ServiceDate);

        var paginatedServices = await PagedList<Service>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        return paginatedServices;
    }

    public async Task<Service?> GetServiceWithIncludesAsync(int id)
    {
        return await _context.Set<Service>()
            .Include(s => s.Customer)
            .Include(s => s.Team)
            .FirstOrDefaultAsync(s => s.Id == id);
    }
}
