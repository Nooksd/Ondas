using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class CustomerRepository(AppDbContext context) : Repository<Customer>(context), ICustomerRepository
{
    public async Task<PagedList<Customer>> GetCustomersAsync(PaginationParameters pagination, string q, bool order)
    {
        var query = GetAll();

        if (!string.IsNullOrWhiteSpace(q))
        {
            var qLower = q.Trim().ToLower();

            query = query.Where(p => p.Name.Contains(qLower, StringComparison.CurrentCultureIgnoreCase));
        }

        query = query.Include(p => p.Address);

        query = order ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name);


        var paginatedCustomers = await PagedList<Customer>.ToPagedListAsync(query, pagination.Page, pagination.Size);

        return paginatedCustomers;
    }
}
