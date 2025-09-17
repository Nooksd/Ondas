using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class ServiceRepository(AppDbContext context) : Repository<Service>(context), IServiceRepository
{
    public async Task<PagedList<Service>> GetServicesAsync(PaginationParameters pagination, ServiceStatus? status)
    {
        var query = GetAll();

        if (status is not null)
        {
            query = query.Where(p => p.Status == status);
        }

        query = query.OrderBy(p => p.ServiceDate);


        var paginatedServices = await PagedList<Service>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        return paginatedServices;
    }
}
