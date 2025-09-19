using Microsoft.EntityFrameworkCore;
using OndasAPI.Context;
using OndasAPI.DTOs;
using OndasAPI.Models;
using OndasAPI.Repositories.Interfaces;

namespace OndasAPI.Repositories;

public class DashboardRepository(AppDbContext context) : IDashboardRepository
{
    private readonly AppDbContext _context = context;

    public async Task<DashboardStatsDTO> GetDashboardStatsAsync(DateTime dataInicial, DateTime dataFinal)
    {
        var stats = new DashboardStatsDTO();

        var startDate = dataInicial.Date;
        var endDate = dataFinal.Date.AddDays(1).AddTicks(-1);

        var servicosConcluidos = await _context.Services
            .Where(s => s.Status == ServiceStatus.Concluido &&
                       s.ServiceDate >= startDate && s.ServiceDate <= endDate)
            .ToListAsync();

        stats.TotalReceita = servicosConcluidos.Sum(s => s.Price);

        var funcionariosAtivos = await _context.Employees
            .Where(e => e.IsActive)
            .ToListAsync();

        var totalDias = (dataFinal.Date - dataInicial.Date).Days + 1;
        var percentualDias = totalDias / 30.0;

        stats.DespesasTotais = funcionariosAtivos.Sum(f => f.Salary) * (decimal)percentualDias;

        stats.LucroLiquido = stats.TotalReceita - stats.DespesasTotais;

        var servicosNoPeríodo = await _context.Services
            .Include(s => s.Team)
                .ThenInclude(t => t.TeamMembers)
            .Where(s => s.ServiceDate >= startDate && s.ServiceDate <= endDate)
            .ToListAsync();

        var horasTrabalhadasPorEquipe = servicosNoPeríodo
            .GroupBy(s => s.Team!.Name)
            .ToDictionary(
                g => g.Key,
                g => g.Sum(s => s.ServiceDuration.TotalHours * s.Team!.TeamMembers.Count)
            );

        stats.AlocacaoPorEquipe = horasTrabalhadasPorEquipe;

        var totalHorasDisponiveis = funcionariosAtivos.Count * 8 * 5 * (totalDias / 7.0);
        var totalHorasTrabalhadas = horasTrabalhadasPorEquipe.Values.Sum();

        stats.AlocacaoEquipePercentual = totalHorasDisponiveis > 0
            ? (totalHorasTrabalhadas / totalHorasDisponiveis) * 100
            : 0;

        stats.ReceitaDiaria = servicosConcluidos
            .GroupBy(s => s.ServiceDate.Date)
            .Select(g => new ReceitaDiariaDTO
            {
                Data = g.Key,
                Valor = g.Sum(s => s.Price)
            })
            .OrderBy(r => r.Data)
            .ToList();

        var allDates = Enumerable.Range(0, totalDias)
            .Select(i => startDate.AddDays(i))
            .ToList();

        var receitaCompleta = allDates.Select(date =>
            stats.ReceitaDiaria.FirstOrDefault(r => r.Data == date) ??
            new ReceitaDiariaDTO { Data = date, Valor = 0 }
        ).ToList();

        stats.ReceitaDiaria = receitaCompleta;

        var servicosPorData = servicosNoPeríodo
            .GroupBy(s => s.ServiceDate.Date)
            .Select(g => new ServicosDataDTO
            {
                Data = g.Key,
                QuantidadeServicos = g.Count()
            })
            .ToList();

        var servicosCompletos = allDates.Select(date =>
            servicosPorData.FirstOrDefault(s => s.Data == date) ??
            new ServicosDataDTO { Data = date, QuantidadeServicos = 0 }
        ).ToList();

        stats.ServicosPorData = servicosCompletos.OrderBy(s => s.Data).ToList();

        var statusCounts = await _context.Services
            .Where(s => s.ServiceDate >= startDate && s.ServiceDate <= endDate)
            .GroupBy(s => s.Status)
            .Select(g => new StatusCountDTO
            {
                Status = g.Key,
                StatusNome = g.Key.ToString(),
                Quantidade = g.Count()
            })
            .ToListAsync();

        stats.StatusServicos = statusCounts;

        return stats;
    }
}