using OndasAPI.Models;

namespace OndasAPI.DTOs;

public class DashboardStatsDTO
{
    public decimal TotalReceita { get; set; }
    public decimal DespesasTotais { get; set; }
    public decimal LucroLiquido { get; set; }
    public double AlocacaoEquipePercentual { get; set; }
    public Dictionary<string, double> AlocacaoPorEquipe { get; set; } = [];
    public List<ReceitaDiariaDTO> ReceitaDiaria { get; set; } = [];
    public List<ServicosDataDTO> ServicosPorData { get; set; } = [];
    public List<StatusCountDTO> StatusServicos { get; set; } = [];
}

public class ReceitaDiariaDTO
{
    public DateTime Data { get; set; }
    public decimal Valor { get; set; }
}

public class ServicosDataDTO
{
    public DateTime Data { get; set; }
    public int QuantidadeServicos { get; set; }
}

public class StatusCountDTO
{
    public ServiceStatus Status { get; set; }
    public string StatusNome { get; set; } = string.Empty;
    public int Quantidade { get; set; }
}

public class DashboardFilterDTO
{
    public DateTime DataInicial { get; set; }
    public DateTime DataFinal { get; set; }
}