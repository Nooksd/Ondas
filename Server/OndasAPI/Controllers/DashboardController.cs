using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OndasAPI.DTOs;
using OndasAPI.Repositories.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace OndasAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DashboardController(IDashboardRepository dashboardRepository) : ControllerBase
{
    private readonly IDashboardRepository _dashboardRepository = dashboardRepository;

    [Authorize("Viewer")]
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDTO>> GetDashboardStats(
        [FromQuery, Required] DateTime dataInicial,
        [FromQuery, Required] DateTime dataFinal)
    {
        if (dataInicial > dataFinal)
        {
            return BadRequest("Data inicial não pode ser maior que data final");
        }

        if (dataFinal > DateTime.Now.Date)
        {
            return BadRequest("Data final não pode ser no futuro");
        }

        var daysDifference = (dataFinal - dataInicial).Days;
        if (daysDifference > 365)
        {
            return BadRequest("O período não pode exceder 365 dias");
        }


        var stats = await _dashboardRepository.GetDashboardStatsAsync(dataInicial, dataFinal);
        return Ok(stats);
    }

    [Authorize("Viewer")]
    [HttpGet("revenue-summary")]
    public async Task<ActionResult<object>> GetRevenueSummary(
        [FromQuery, Required] DateTime dataInicial,
        [FromQuery, Required] DateTime dataFinal)
    {
        if (dataInicial > dataFinal)
        {
            return BadRequest("Data inicial não pode ser maior que data final");
        }

        var stats = await _dashboardRepository.GetDashboardStatsAsync(dataInicial, dataFinal);

        return Ok(new
        {
            stats.TotalReceita,
            stats.DespesasTotais,
            stats.LucroLiquido,
            Periodo = new
            {
                Inicio = dataInicial.ToString("dd/MM/yyyy"),
                Fim = dataFinal.ToString("dd/MM/yyyy"),
                TotalDias = (dataFinal - dataInicial).Days + 1
            }
        });
    }

    [Authorize("Viewer")]
    [HttpGet("team-allocation")]
    public async Task<ActionResult<object>> GetTeamAllocation(
        [FromQuery, Required] DateTime dataInicial,
        [FromQuery, Required] DateTime dataFinal)
    {
        if (dataInicial > dataFinal)
        {
            return BadRequest("Data inicial não pode ser maior que data final");
        }

        var stats = await _dashboardRepository.GetDashboardStatsAsync(dataInicial, dataFinal);

        return Ok(new
        {
            stats.AlocacaoEquipePercentual,
            AlocacaoPorEquipe = stats.AlocacaoPorEquipe.Select(kvp => new
            {
                Equipe = kvp.Key,
                HorasTrabalhadas = Math.Round(kvp.Value, 2)
            }).ToList()
        });
    }

    [Authorize("Viewer")]
    [HttpGet("daily-revenue")]
    public async Task<ActionResult<List<ReceitaDiariaDTO>>> GetDailyRevenue(
        [FromQuery, Required] DateTime dataInicial,
        [FromQuery, Required] DateTime dataFinal)
    {
        if (dataInicial > dataFinal)
        {
            return BadRequest("Data inicial não pode ser maior que data final");
        }

        var stats = await _dashboardRepository.GetDashboardStatsAsync(dataInicial, dataFinal);
        return Ok(stats.ReceitaDiaria);
    }

    [Authorize("Viewer")]
    [HttpGet("services-by-date")]
    public async Task<ActionResult<List<ServicosDataDTO>>> GetServicesByDate(
        [FromQuery, Required] DateTime dataInicial,
        [FromQuery, Required] DateTime dataFinal)
    {
        if (dataInicial > dataFinal)
        {
            return BadRequest("Data inicial não pode ser maior que data final");
        }

        var stats = await _dashboardRepository.GetDashboardStatsAsync(dataInicial, dataFinal);
        return Ok(stats.ServicosPorData);
    }

    [Authorize("Viewer")]
    [HttpGet("service-status")]
    public async Task<ActionResult<List<StatusCountDTO>>> GetServiceStatus(
        [FromQuery, Required] DateTime dataInicial,
        [FromQuery, Required] DateTime dataFinal)
    {
        if (dataInicial > dataFinal)
        {
            return BadRequest("Data inicial não pode ser maior que data final");
        }

        var stats = await _dashboardRepository.GetDashboardStatsAsync(dataInicial, dataFinal);
        return Ok(stats.StatusServicos);
    }
}