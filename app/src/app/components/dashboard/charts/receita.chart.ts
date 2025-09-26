import { Component, computed, Input, Signal } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'receitas-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-wrapper">
      <canvas baseChart [data]="chartData()" [options]="chartOptions" type="line"></canvas>
    </div>
  `,
  styleUrls: [],
})
export class ReceitasChart {
  @Input() receitaDiaria!: Signal<{ data: string; valor: number }[]>;

  chartData = computed<ChartData<'line'>>(() => {
    return {
      labels: this.receitaDiaria().map((r) => this.formatDate(r.data)),
      datasets: [
        {
          label: 'Receita Diária',
          data: this.receitaDiaria().map((r) => r.valor),
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

  chartOptions: ChartConfiguration<'line'>['options'] = {
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
        ticks: {
          color: '#176dc6',
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
          color: '#176dc6',
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

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
}
