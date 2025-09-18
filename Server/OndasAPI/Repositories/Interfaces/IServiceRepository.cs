using OndasAPI.Models;
using OndasAPI.Pagination;

namespace OndasAPI.Repositories.Interfaces;

public interface IServiceRepository : IRepository<Service>
{
    Task<PagedList<Service>> GetServicesAsync(PaginationParameters pagination, int? customerId = null, int? teamId = null);
    Task<Service?> GetServiceWithIncludesAsync(int id);
    Task<List<Service>> GetServicesByDueDateAsync(DateTime dueDate);
}
