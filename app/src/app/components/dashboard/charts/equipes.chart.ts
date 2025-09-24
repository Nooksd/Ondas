import { Component, computed, Input } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'equipes-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div [style.height.px]="chartHeight()">
      <canvas
        baseChart
        [data]="chartData()"
        [options]="chartOptions"
        type="bar"
        [height]="chartHeight()"
      ></canvas>
    </div>
  `,
  styleUrls: [],
})
export class EquipesChart {
  @Input() equipesData: Record<string, number> = {};

  chartHeight = computed(() => {
    const numBars = Object.keys(this.equipesData).length;
    const barHeight = 20;
    const barMargin = 7;
    const padding = 60;

    return Math.max(200, numBars * (barHeight + barMargin) + padding);
  });

  chartData = computed<ChartData<'bar'>>(() => {
    const entries = Object.entries(this.equipesData);

    return {
      labels: entries.map(([nome]) => nome),
      datasets: [
        {
          label: 'Horas Alocadas',
          data: entries.map(([, horas]) => horas),
          backgroundColor: '#3b82f6',
          barThickness: 20,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  });

  chartOptions: ChartConfiguration<'bar'>['options'] = {
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
          maxRotation: 0,
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        right: 30,
        top: 10,
        bottom: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          label: (context) => `${context.parsed.x} horas`,
        },
      },
    },
  };
}
