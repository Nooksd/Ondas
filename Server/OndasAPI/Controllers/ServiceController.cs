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
public class ServiceController(IUnitOfWork unitOfWork) : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    [Authorize("Viewer")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ServiceDTO>>> GetServices([FromQuery] PaginationParameters pagination, int? customerId, int? teamId)
    {
        var services = await _unitOfWork.ServiceRepository.GetServicesAsync(pagination, customerId, teamId);

        var servicesDto = services.Adapt<IEnumerable<ServiceDTO>>();

        return Ok(servicesDto);
    }

    [Authorize("Viewer")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ServiceDTO>> GetService(int id)
    {
        var service = await _unitOfWork.ServiceRepository.GetServiceWithIncludesAsync(id);

        if (service is null)
            return NotFound("Serviço não encontrado");

        var dto = service.Adapt<ServiceDTO>();
        return Ok(dto);
    }

    [Authorize("Editor")]
    [HttpPost]
    public async Task<ActionResult<ServiceDTO>> PostService(ServiceDTO serviceDto)
    {
        var customerExists = await _unitOfWork.CustomerRepository.GetAsync(c => c.Id == serviceDto.CustomerId) != null;
        var teamExists = await _unitOfWork.TeamRepository.GetAsync(t => t.Id == serviceDto.TeamId) != null;

        if (!customerExists)
            return BadRequest("Cliente não encontrado");
        if (!teamExists)
            return BadRequest("Equipe não encontrada");

        var serviceEntity = serviceDto.Adapt<Service>();

        var created = _unitOfWork.ServiceRepository.Create(serviceEntity);
        await _unitOfWork.CommitAsync();

        var createdWithIncludes = await _unitOfWork.ServiceRepository.GetServiceWithIncludesAsync(created.Id);
        var createdDto = createdWithIncludes!.Adapt<ServiceDTO>();

        return CreatedAtAction(nameof(GetService), new { id = createdDto.Id }, createdDto);
    }

    [Authorize("Editor")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ServiceDTO>> PutService(int id, ServiceDTO serviceDto)
    {
        if (id != serviceDto.Id)
            return BadRequest("IDs não correspondem");

        var existing = await _unitOfWork.ServiceRepository.GetServiceWithIncludesAsync(id);
        if (existing is null)
            return NotFound("Serviço não encontrado");

        serviceDto.Adapt(existing);

        _unitOfWork.ServiceRepository.Update(existing);
        await _unitOfWork.CommitAsync();

        var updated = await _unitOfWork.ServiceRepository.GetServiceWithIncludesAsync(existing.Id);
        var updatedDto = updated!.Adapt<ServiceDTO>();

        return Ok(updatedDto);
    }

    [Authorize("Editor")]
    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<ServiceDTO>> ChangeStatus(int id, ChangeServiceStatusDTO payload)
    {
        var service = await _unitOfWork.ServiceRepository.GetServiceWithIncludesAsync(id);
        if (service is null)
            return NotFound("Serviço não encontrado");

        service.Status = payload.NewStatus;

        if (payload.NewStatus == ServiceStatus.Concluido)
        {
            service.PaymentDate = payload.PaymentDate ?? DateTime.UtcNow;
        }
        else
        {
            if (payload.NewStatus != ServiceStatus.Concluido)
                service.PaymentDate = default;
        }

        _unitOfWork.ServiceRepository.Update(service);
        await _unitOfWork.CommitAsync();

        var updated = await _unitOfWork.ServiceRepository.GetServiceWithIncludesAsync(service.Id);
        var dto = updated!.Adapt<ServiceDTO>();

        return Ok(dto);
    }

    [Authorize("Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<ServiceDTO>> DeleteService(int id)
    {
        var service = await _unitOfWork.ServiceRepository.GetAsync(s => s.Id == id);
        if (service is null)
            return NotFound("Serviço não encontrado");

        _unitOfWork.ServiceRepository.Delete(service);
        await _unitOfWork.CommitAsync();

        var dto = service.Adapt<ServiceDTO>();
        return Ok(dto);
    }
}
