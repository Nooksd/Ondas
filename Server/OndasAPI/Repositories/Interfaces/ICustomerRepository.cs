using OndasAPI.Models;
using OndasAPI.Pagination;

namespace OndasAPI.Repositories.Interfaces;

public interface ICustomerRepository : IRepository<Customer>
{
    Task<PagedList<Customer>> GetCustomersAsync(PaginationParameters pagination, string q);
}
