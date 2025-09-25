using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class ServiceRepository(AppDbContext context) : Repository<Service>(context), IServiceRepository
{
    public async Task<IEnumerable<Service>> GetServicesAsync(DateTime initialDate, DateTime finalDate, int? customerId = null, int? teamId = null)
    {
        var query = GetAll()
                    .Include(s => s.Customer)
                    .Include(s => s.Team)
                    .AsQueryable();

        var startDate = initialDate.Date;
        var endDate = finalDate.Date.AddDays(1).AddTicks(-1);

        query = query.Where(q => q.ServiceDate >= startDate && q.ServiceDate <= endDate);

        if (customerId.HasValue && customerId.Value > 0)
        {
            query = query.Where(s => s.CustomerId == customerId.Value);
        }

        if (teamId.HasValue && teamId.Value > 0)
        {
            query = query.Where(s => s.TeamId == teamId.Value);
        }

        query = query.OrderBy(s => s.ServiceDate);

        var services = await query.ToListAsync();

        return services;
    }

    public async Task<Service?> GetServiceWithIncludesAsync(int id)
    {
        return await _context.Set<Service>()
            .Include(s => s.Customer)
            .Include(s => s.Team)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<List<Service>> GetServicesByDueDateAsync(DateTime dueDate)
    {
        return await _context.Set<Service>()
            .Include(s => s.Customer)
            .Include(s => s.Team)
            .Where(s => s.PaymentDueDate == dueDate.Date
                        && s.Status != ServiceStatus.Concluido)
            .ToListAsync();
    }

}
