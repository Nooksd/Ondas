import { Component, computed, Input, Signal } from '@angular/core';
import { StatusCountDTO } from 'app/store/dashboard/dashboard.state';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'status-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <canvas baseChart [data]="chartData()" [options]="chartOptions" type="doughnut"></canvas>
  `,
  styleUrls: [],
})
export class StatusChart {
  @Input() statusData!: Signal<StatusCountDTO[]>;

  chartData = computed<ChartData<'doughnut'>>(() => {
    const labels = this.statusData().map((item) => item.statusNome);
    const data = this.statusData().map((item) => item.quantidade);
    const colors = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#c3dafe', '#dbeafe'];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, data.length),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverBorderWidth: 3,
        },
      ],
    };
  });

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
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
}
