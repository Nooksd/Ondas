using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class EmployeeRepository(AppDbContext context) : Repository<Employee>(context), IEmployeeRepository
{
    public async Task<PagedList<Employee>> GetEmployeesAsync(PaginationParameters pagination, string q)
    {
        var query = GetAll();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var qLower = q.Trim().ToLower();

            query = query.Where(p => p.Name.Contains(qLower, StringComparison.CurrentCultureIgnoreCase));
        }

        query = query.OrderBy(p => p.Name);


        var paginatedEmployees = await PagedList<Employee>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        return paginatedEmployees;
    }

}
