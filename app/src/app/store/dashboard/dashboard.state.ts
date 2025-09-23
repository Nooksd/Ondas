export interface ReceitaDiariaDTO {
  data: string;
  valor: number;
}

export interface ServicosDataDTO {
  data: string;
  quantidadeServicos: number;
}

export interface StatusCountDTO {
  status: ServiceStatus;
  statusNome: string | null;
  quantidade: number;
}

export enum ServiceStatus {
  Agendado = 1,
  EmAndamento = 2,
  AguardandoPagamento = 3,
  AtrasoNoPagamento = 4,
  Concluido = 5,
  Cancelado = 6,
}

export interface DashboardStatsDTO {
  totalReceita: number;
  despesasTotais: number;
  lucroLiquido: number;
  alocacaoEquipePercentual: number;
  alocacaoPorEquipe?: { [key: string]: number } | null;
  receitaDiaria?: ReceitaDiariaDTO[] | null;
  servicosPorData?: ServicosDataDTO[] | null;
  statusServicos?: StatusCountDTO[] | null;
}

export interface DashboardQuery {
  dataInicial: string;
  dataFinal: string;
}

export interface DashboardState {
  stats: DashboardStatsDTO | null;
  loading: boolean;
  error: string | null;
  lastQuery: DashboardQuery | null;
}

export const initialDashboardState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastQuery: null,
};
