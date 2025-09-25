using OndasAPI.Models;

namespace OndasAPI.Repositories.Interfaces;

public interface IServiceRepository : IRepository<Service>
{
    Task<IEnumerable<Service>> GetServicesAsync(DateTime initialDate, DateTime finalDate, int? customerId = null, int? teamId = null);
    Task<Service?> GetServiceWithIncludesAsync(int id);
    Task<List<Service>> GetServicesByDueDateAsync(DateTime dueDate);
}
