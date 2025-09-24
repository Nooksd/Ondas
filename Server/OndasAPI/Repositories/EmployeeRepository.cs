using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class EmployeeRepository(AppDbContext context) : Repository<Employee>(context), IEmployeeRepository
{
    public async Task<Employee?> ActivateEmployeeAsync(int id)
    {
        var employee = await GetAsync(x => x.Id == id);

        if (employee is null || employee.IsActive)
        {
            return null;
        }
        employee.Reactivate();

        Update(employee);

        return employee;
    }

    public async Task<Employee?> DeactivateEmployeeAsync(int id)
    {
        var employee = await GetAsync(x => x.Id == id);

        if (employee is null || !employee.IsActive)
        {
            return null;
        }

        employee.Deactivate();

        Update(employee);

        return employee;
    }

    public async Task<PagedList<Employee>> GetEmployeesAsync(PaginationParameters pagination, string q, bool isActive)
    {
        var query = GetAll().Where(x => x.IsActive == isActive);

        if (!string.IsNullOrWhiteSpace(q))
        {
            var qLower = q.Trim().ToLower();

            query = query.Where(p => p.Name.ToLower().Contains(qLower));
        }

        query = query.OrderBy(p => p.Name);


        var paginatedEmployees = await PagedList<Employee>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        return paginatedEmployees;
    }

}
