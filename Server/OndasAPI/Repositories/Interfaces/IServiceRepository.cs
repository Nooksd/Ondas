using OndasAPI.Models;
using OndasAPI.Pagination;

namespace OndasAPI.Repositories.Interfaces;

public interface IServiceRepository : IRepository<Service>
{
    Task<PagedList<Service>> GetServicesAsync(PaginationParameters pagination, ServiceStatus? status, bool order);
}
