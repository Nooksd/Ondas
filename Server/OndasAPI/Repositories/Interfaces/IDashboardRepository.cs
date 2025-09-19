using OndasAPI.DTOs;

namespace OndasAPI.Repositories.Interfaces;

public interface IDashboardRepository
{
    Task<DashboardStatsDTO> GetDashboardStatsAsync(DateTime dataInicial, DateTime dataFinal);
}