using OndasAPI.Models;
using OndasAPI.Pagination;

namespace OndasAPI.Repositories.Interfaces;

public interface IEmployeeRepository : IRepository<Employee>
{
    Task<PagedList<Employee>> GetEmployeesAsync(PaginationParameters pagination, string q);
}
