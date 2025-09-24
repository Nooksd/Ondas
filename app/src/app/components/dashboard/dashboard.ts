import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadDashboardStats } from 'app/store/dashboard/dashboard.actions';
import { selectDashboardStats } from 'app/store/dashboard/dashboard.selectors';
import { DashboardStatsDTO, ServiceStatus } from 'app/store/dashboard/dashboard.state';
import { EquipesChart } from './charts/equipes.chart';
import { StatusChart } from './charts/status.chart';
import { ReceitasChart } from './charts/receita.chart';
import { HeatmapChart } from './charts/heatmap.chart';
import { HeaderDateRangePickerComponent } from 'app/shared/range-date-picker.component';
import { HeaderService } from 'app/services/header.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, EquipesChart, StatusChart, ReceitasChart, HeatmapChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  store = inject(Store);
  private headerService = inject(HeaderService);

  stats = signal<DashboardStatsDTO | null>(null);
  startDate = signal<Date>(this.getFirstDayOfMonth());
  endDate = signal<Date>(new Date());

  constructor() {
    this.setupHeader();

    this.store.select(selectDashboardStats).subscribe((stats) => {
      if (!stats) {
        this.store.dispatch(
          loadDashboardStats({
            query: {
              dataInicial: this.startDate().toISOString().slice(0, 10),
              dataFinal: this.endDate().toISOString().slice(0, 10),
            },
          })
        );
      }
      this.stats.set(stats);
    });
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderDateRangePickerComponent,
      inputs: {
        initialStartDate: this.startDate(),
        initialEndDate: this.endDate(),
        onDatesChanged: (event: { startDate: Date; endDate: Date }) => this.onDatesChanged(event),
      },
    });
  }

  private loadStats(startDate: Date, endDate: Date) {
    this.store.dispatch(
      loadDashboardStats({
        query: {
          dataInicial: startDate.toISOString().slice(0, 10),
          dataFinal: endDate.toISOString().slice(0, 10),
        },
      })
    );
  }

  private getFirstDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  onDatesChanged(event: { startDate: Date; endDate: Date }) {
    this.startDate.set(event.startDate);
    this.endDate.set(event.endDate);

    this.loadStats(event.startDate, event.endDate);
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

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

  transformedStatusData = computed(() =>
    (this.stats()?.statusServicos || []).map((status) => ({
      statusNome: this.getStatusName(status.status) || 'Desconhecido',
      quantidade: status.quantidade,
    }))
  );
}
