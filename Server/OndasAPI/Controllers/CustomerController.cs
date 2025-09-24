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
public class CustomerController(IUnitOfWork unitOfWork) : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    [Authorize("Viewer")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDTO>>> GetCustomers([FromQuery] PaginationParameters pagination, string? q) {
        var customers = await _unitOfWork.CustomerRepository.GetCustomersAsync(pagination, q ?? "");

        var metadata = new
        {
            customers?.CurrentPage,
            customers?.PageSize,
            customers?.TotalPages,
            customers?.TotalCount,
            customers?.HasNext,
            customers?.HasPrevious,
        };

        var customersDto = customers?.Adapt<IEnumerable<CustomerDTO>>();

        Response.Headers.Append("X-Pagination", JsonConvert.SerializeObject(metadata));

        var response = new
        {
            Customers = customersDto,
            Metadata = metadata
        };

        return Ok(response);
    }

    [Authorize("Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerDTO>> GetCustomer(int id)
    {
        var customer = await _unitOfWork.CustomerRepository.GetCustomerWithAddressAsync(id);

        if (customer is null)
        {
            return NotFound("Funcionário não encontrado");
        }

        var customerDto = customer.Adapt<CustomerDTO>();

        return Ok(customerDto);
    }

    [Authorize("Editor")]
    [HttpPost]
    public async Task<ActionResult<CustomerDTO>> PostCustomer(CustomerDTO customerDto)
    {
        var customerEntity = customerDto.Adapt<Customer>();

        var createdCustomer = _unitOfWork.CustomerRepository.Create(customerEntity);
        await _unitOfWork.CommitAsync();


        var createdWithAddress = await _unitOfWork.CustomerRepository.GetCustomerWithAddressAsync(createdCustomer.Id);
        var createdDto = createdWithAddress!.Adapt<CustomerDTO>();

        return CreatedAtAction(nameof(GetCustomer), new { id = createdDto.Id }, createdDto);
    }

    [Authorize("Editor")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<CustomerDTO>> PutCustomer(int id, CustomerDTO customerDto)
    {
        if (id != customerDto.Id)
            return BadRequest("IDs não correspondem");

        var existingCustomer = await _unitOfWork.CustomerRepository.GetCustomerWithAddressAsync(id);
        if (existingCustomer is null)
            return NotFound("Cliente não encontrado");

        customerDto.Adapt(existingCustomer);

        customerDto.Address.Adapt(existingCustomer.Address);

        _unitOfWork.AddressRepository.Update(existingCustomer.Address!);


        _unitOfWork.CustomerRepository.Update(existingCustomer);
        await _unitOfWork.CommitAsync();

        var updated = await _unitOfWork.CustomerRepository.GetCustomerWithAddressAsync(existingCustomer.Id);
        var updatedDto = updated!.Adapt<CustomerDTO>();

        return Ok(updatedDto);
    }

    [Authorize("Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<CustomerDTO>> DeleteCustomer(int id)
    {
        var customer = await _unitOfWork.CustomerRepository.GetCustomerWithAddressAsync(id);
        if (customer is null)
        {
            return NotFound("Funcionário não encontrado");
        }

        _unitOfWork.CustomerRepository.Delete(customer);
        _unitOfWork.AddressRepository.Delete(customer.Address!);
        await _unitOfWork.CommitAsync();

        var customerDto = customer.Adapt<CustomerDTO>();

        return Ok(customerDto);

    }
}