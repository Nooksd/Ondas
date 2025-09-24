using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OndasAPI.DTOs;
using OndasAPI.Models;
using OndasAPI.Pagination;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
[Produces("application/json")]
[ApiConventionType(typeof(DefaultApiConventions))]
public class EmployeesController(IUnitOfWork unitOfWork) : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    [Authorize("Viewer")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDTO>>> GetEmployees([FromQuery] PaginationParameters pagination, string? q, bool isActive = true)
    {
        var employees = await _unitOfWork.EmployeeRepository.GetEmployeesAsync(pagination, q ?? "", isActive);

        var metadata = new
        {
            employees?.CurrentPage,
            employees?.PageSize,
            employees?.TotalPages,
            employees?.TotalCount,
            employees?.HasNext,
            employees?.HasPrevious,
        };

        var employeesDto = employees?.Adapt<IEnumerable<EmployeeDTO>>();

        Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(metadata));

        var response = new
        {
            Employees = employeesDto,
            Metadata = metadata
        };

        return Ok(response);
    }

    [Authorize("Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDTO>> GetEmployee(int id)
    {
        var employee = await _unitOfWork.EmployeeRepository.GetAsync(x => x.Id == id);

        if (employee is null)
        {
            return NotFound("Funcionário não encontrado");
        }

        var employeeDto = employee.Adapt<EmployeeDTO>();

        return Ok(employeeDto);
    }

    [Authorize("Editor")]
    [HttpPost]
    public async Task<ActionResult<EmployeeDTO>> PostEmployee(EmployeeDTO employeeDto)
    {
        var employee = employeeDto.Adapt<Employee>();

        var createdEmployee = _unitOfWork.EmployeeRepository.Create(employee);
        await _unitOfWork.CommitAsync();

        var createdEmployeeDto = createdEmployee.Adapt<EmployeeDTO>();

        return CreatedAtAction("GetEmployee", new { id = createdEmployeeDto.Id }, createdEmployeeDto);
    }

    [Authorize("Editor")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<EmployeeDTO>> PutEmployee(int id, EmployeeDTO employeeDto)
    {
        var employee = employeeDto.Adapt<Employee>();

        if (id != employee.Id)
        {
            return BadRequest("IDs não correspondem");
        }

        var updatedEmployee = _unitOfWork.EmployeeRepository.Update(employee);
        await _unitOfWork.CommitAsync();

        var updatedEmployeeDto = updatedEmployee.Adapt<EmployeeDTO>();

        return Ok(updatedEmployeeDto);
    }

    [Authorize("Editor")]
    [HttpPatch("activate/{id:int}")]
    public async Task<ActionResult<EmployeeDTO>> ActivateEmployee(int id)
    {
        var employee = await _unitOfWork.EmployeeRepository.ActivateEmployeeAsync(id);
        if (employee is null)
        {
            return NotFound("Funcionário não encontrado ou já ativo");
        }

        await _unitOfWork.CommitAsync();

        var employeeDto = employee.Adapt<EmployeeDTO>();

        return Ok(employeeDto);
    }

    [Authorize("Editor")]
    [HttpPatch("deactivate/{id:int}")]
    public async Task<ActionResult<EmployeeDTO>> DeactivateEmployee(int id)
    {
        var employee = await _unitOfWork.EmployeeRepository.DeactivateEmployeeAsync(id);
        if (employee is null)
        {
            return NotFound("Funcionário não encontrado ou já inativo");
        }

        await _unitOfWork.CommitAsync();

        var employeeDto = employee.Adapt<EmployeeDTO>();

        return Ok(employeeDto);
    }

    [Authorize("Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<EmployeeDTO>> DeleteEmployee(int id)
    {
        var employee = await _unitOfWork.EmployeeRepository.GetAsync(x => x.Id == id);
        if (employee is null)
        {
            return NotFound("Funcionário não encontrado");
        }

        _unitOfWork.EmployeeRepository.Delete(employee);
        await _unitOfWork.CommitAsync();

        var employeeDto = employee.Adapt<EmployeeDTO>();

        return Ok(employeeDto);

    }
}
