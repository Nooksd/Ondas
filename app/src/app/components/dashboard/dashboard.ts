import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadDashboardStats } from 'app/store/dashboard/dashboard.actions';
import { selectDashboardStats } from 'app/store/dashboard/dashboard.selectors';
import { DashboardStatsDTO, ServiceStatus } from 'app/store/dashboard/dashboard.state';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  store = inject(Store);

  stats = signal<DashboardStatsDTO | null>(null);

  // constructor() {
  //   this.store.select(selectDashboardStats).subscribe((stats) => {
  //     const currentDate = new Date();
  //     const fistDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  //     if (!stats) {
  //       this.store.dispatch(
  //         loadDashboardStats({
  //           query: {
  //             dataInicial: fistDayDate.toISOString().slice(0, 10),
  //             dataFinal: currentDate.toISOString().slice(0, 10),
  //           },
  //         })
  //       );
  //     }
  //     this.stats.set(stats);
  //   });
  // }

  ngOnInit() {
    this.loadMockData();
  }

  private loadMockData() {
    const mockData: DashboardStatsDTO = {
      totalReceita: 15231.45,
      despesasTotais: 3230.76,
      lucroLiquido: 12000.69,
      alocacaoEquipePercentual: 45,
      alocacaoPorEquipe: {
        'Equipe Frontend': 40,
        'Equipe Backend': 35,
        'Equipe Mobile': 25,
        'Equipe Design': 20,
        'Equipe QA': 15,
      },
      receitaDiaria: [
        { data: '2024-01-01', valor: 1200 },
        { data: '2024-01-02', valor: 1800 },
        { data: '2024-01-03', valor: 1500 },
        { data: '2024-01-04', valor: 2200 },
        { data: '2024-01-05', valor: 1900 },
        { data: '2024-01-06', valor: 2400 },
        { data: '2024-01-07', valor: 2100 },
      ],
      servicosPorData: [
        { data: '2024-01-01', quantidadeServicos: 5 },
        { data: '2024-01-02', quantidadeServicos: 8 },
        { data: '2024-01-03', quantidadeServicos: 3 },
        { data: '2024-01-04', quantidadeServicos: 12 },
        { data: '2024-01-05', quantidadeServicos: 7 },
        { data: '2024-01-06', quantidadeServicos: 15 },
        { data: '2024-01-07', quantidadeServicos: 9 },
      ],
      statusServicos: [
        { status: ServiceStatus.Agendado, statusNome: 'Agendado', quantidade: 15 },
        { status: ServiceStatus.EmAndamento, statusNome: 'Em Andamento', quantidade: 8 },
        {
          status: ServiceStatus.AguardandoPagamento,
          statusNome: 'Aguardando Pagamento',
          quantidade: 5,
        },
        { status: ServiceStatus.Concluido, statusNome: 'Concluído', quantidade: 25 },
        { status: ServiceStatus.Cancelado, statusNome: 'Cancelado', quantidade: 3 },
      ],
    };

    this.stats.set(mockData);
  }

  receitaChartData = computed<ChartData<'line'>>(() => {
    const receitas = this.stats()?.receitaDiaria || [];
    return {
      labels: receitas.map((r) => this.formatDate(r.data)),
      datasets: [
        {
          label: 'Receita Diária',
          data: receitas.map((r) => r.valor),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  });

  receitaChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: (context) =>
            `R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
        ticks: {
          callback: (value) => `R$ ${Number(value).toLocaleString('pt-BR')}`,
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 6,
      },
    },
  };

  equipesChartData = computed<ChartData<'bar'>>(() => {
    const equipes = this.stats()?.alocacaoPorEquipe || {};
    const entries = Object.entries(equipes);

    return {
      labels: entries.map(([nome]) => nome),
      datasets: [
        {
          label: 'Horas Alocadas',
          data: entries.map(([, horas]) => horas),
          backgroundColor: '#3b82f6',
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  });

  equipesChartOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        ticks: {
          color: '#000',
          autoSkip: false,
        },
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        right: 30,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  statusChartData = computed<ChartData<'doughnut'>>(() => {
    const statusData = this.stats()?.statusServicos || [];
    const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#c3dafe', '#dbeafe'];

    return {
      labels: statusData.map((s) => s.statusNome || this.getStatusName(s.status)),
      datasets: [
        {
          data: statusData.map((s) => s.quantidade),
          backgroundColor: colors.slice(0, statusData.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverBorderWidth: 3,
        },
      ],
    };
  });

  statusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  heatmapData = computed(() => {
    const servicosData = this.stats()?.servicosPorData || [];
    if (servicosData.length === 0) return { grid: [], labels: [], maxValue: 0 };

    const maxValue = Math.max(...servicosData.map((s) => s.quantidadeServicos));
    const rangeSize = Math.ceil(maxValue / 5);

    const weeks = [];
    for (let i = 0; i < servicosData.length; i += 7) {
      weeks.push(servicosData.slice(i, i + 7));
    }

    const grid = weeks.map((week) =>
      week.map((day) => {
        const intensity = Math.min(5, Math.ceil(day.quantidadeServicos / rangeSize) || 1);
        return {
          date: day.data,
          intensity,
          count: day.quantidadeServicos,
        };
      })
    );

    const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

    return { grid, labels, maxValue };
  });

  formatCurrency(value: number | null | undefined): string {
    if (value == null) return 'R$ 0,00';

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatPercentage(value: number | null | undefined): string {
    if (value == null) return '0%';

    return `${value}%`;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  private getStatusName(status: ServiceStatus): string {
    const statusNames = {
      [ServiceStatus.Agendado]: 'Agendado',
      [ServiceStatus.EmAndamento]: 'Em Andamento',
      [ServiceStatus.AguardandoPagamento]: 'Aguardando Pagamento',
      [ServiceStatus.AtrasoNoPagamento]: 'Atraso no Pagamento',
      [ServiceStatus.Concluido]: 'Concluído',
      [ServiceStatus.Cancelado]: 'Cancelado',
    };
    return statusNames[status] || 'Desconhecido';
  }
}
