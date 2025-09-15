using OndasAPI.Context;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class EmployeeRepository(AppDbContext context) : Repository<Employee>(context), IEmployeeRepository
{

}
