using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    [ApiConventionType(typeof(DefaultApiConventions))]
    public class EmployeeController(IUnitOfWork unitOfWork) : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        [Authorize("Viewer")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees([FromQuery] PaginationParameters pagination, string? q)
        {
            var employees = await _unitOfWork.EmployeeRepository.GetEmployeesAsync(pagination, q ?? "");

            var metadata = new
            {
                employees?.CurrentPage,
                employees?.PageSize,
                employees?.TotalPages,
                employees?.TotalCount,
                employees?.HasNext,
                employees?.HasPrevious,
            };

            Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(metadata));

            return Ok(employees);
        }

        [Authorize("Viewer")]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _unitOfWork.EmployeeRepository.GetAsync(x => x.Id == id);

            return Ok(employee);
        }

        [Authorize("Editor")]
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            var createdEmployee = _unitOfWork.EmployeeRepository.Create(employee);
            await _unitOfWork.CommitAsync();

            return CreatedAtAction("GetEmployee", new { id = createdEmployee.Id }, createdEmployee);
        }

        [Authorize("Editor")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Employee>> PutEmployee(int id, Employee employee)
        {
            var updatedEmployee = _unitOfWork.EmployeeRepository.Update(employee);
            await _unitOfWork.CommitAsync();

            return Ok(updatedEmployee);
        }

        [Authorize("Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(int id)
        {
            var category = await _unitOfWork.EmployeeRepository.GetAsync(x => x.Id == id);
            if (category is null)
            {
                return NotFound("Funcionário não encontrado");
            }

            _unitOfWork.EmployeeRepository.Delete(category);
            await _unitOfWork.CommitAsync();

            return Ok(category);

        }
    }
}
