import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';

interface ServiceByDate {
  data: string;
  quantidadeServicos: number;
}

interface CalendarDay {
  day: number;
  date: string;
  intensity: number;
  count: number;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'heatmap-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-header">
      <div class="heatmap-header-content">
        <h3 class="chart-title">Heatmap de serviços</h3>
        <div class="month-navigation">
          <button
            (click)="changeMonth(-1)"
            class="month-nav-btn"
            [disabled]="!canNavigatePrevious()"
            [class.disabled]="!canNavigatePrevious()"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <span class="month-label">{{ currentMonthName() }}</span>

          <button
            (click)="changeMonth(1)"
            class="month-nav-btn"
            [disabled]="!canNavigateNext()"
            [class.disabled]="!canNavigateNext()"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="map-center">
      <div class="heatmap-container">
        <div class="calendar-grid">
          <ng-container *ngFor="let day of calendarData(); trackBy: trackByDate">
            <div
              class="calendar-day"
              [class.not-current-month]="!day.isCurrentMonth"
              [class.has-services]="day.count > 0"
              [class.no-services]="day.count === 0 && day.isCurrentMonth"
              [attr.data-intensity]="day.intensity"
              [title]="day.count > 0 ? day.count + ' serviços em ' + day.date : 'Sem serviços'"
            >
              <span class="day-number">{{ day.day }}</span>
            </div>
          </ng-container>
        </div>

        <div class="weekday-labels">
          <span class="weekday-label">DOM</span>
          <span class="weekday-label">SEG</span>
          <span class="weekday-label">TER</span>
          <span class="weekday-label">QUA</span>
          <span class="weekday-label">QUI</span>
          <span class="weekday-label">SEX</span>
          <span class="weekday-label">SAB</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../dashboard.scss'],
})
export class HeatmapChart {
  @Input() set servicosPorData(v: ServiceByDate[] | null | undefined) {
    this._servicos.set(v || []);
    const first = this.getFirstMonthWithServicesFromArray(v || []);
    if (first && !this._currentMonth()) {
      this._currentMonth.set(first);
    } else if (!this._currentMonth() && !first) {
      this._currentMonth.set(new Date());
    }
  }

  private _servicos = signal<ServiceByDate[]>([]);
  private _currentMonth = signal<Date | null>(null);

  servicos = computed(() => this._servicos());
  currentMonth = computed(() => this._currentMonth() || new Date());

  constructor() {
    if (!this._currentMonth()) {
      const first = this.getFirstMonthWithServicesFromArray(this._servicos());
      if (first) {
        this._currentMonth.set(first);
      } else {
        this._currentMonth.set(new Date());
      }
    }
  }

  private getFirstMonthWithServicesFromArray(arr: ServiceByDate[]): Date | null {
    if (!arr || arr.length === 0) return null;
    const dates = arr
      .filter((i) => i.quantidadeServicos > 0)
      .map((i) => new Date(i.data + 'T00:00:00'))
      .sort((a, b) => a.getTime() - b.getTime());
    return dates.length > 0 ? new Date(dates[0].getFullYear(), dates[0].getMonth(), 1) : null;
  }

  private getNextMonthWithServicesFromArray(currentDate: Date, arr: ServiceByDate[]): Date | null {
    const futureMonths = arr
      .filter((item) => item.quantidadeServicos > 0)
      .map((item) => new Date(item.data + 'T00:00:00'))
      .filter((date) => {
        return (
          date.getFullYear() > currentDate.getFullYear() ||
          (date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() > currentDate.getMonth())
        );
      })
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureMonths.length > 0)
      return new Date(futureMonths[0].getFullYear(), futureMonths[0].getMonth(), 1);
    return null;
  }

  private getPreviousMonthWithServicesFromArray(
    currentDate: Date,
    arr: ServiceByDate[]
  ): Date | null {
    const pastMonths = arr
      .filter((item) => item.quantidadeServicos > 0)
      .map((item) => new Date(item.data + 'T00:00:00'))
      .filter((date) => {
        return (
          date.getFullYear() < currentDate.getFullYear() ||
          (date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() < currentDate.getMonth())
        );
      })
      .sort((a, b) => b.getTime() - a.getTime());

    if (pastMonths.length > 0)
      return new Date(pastMonths[0].getFullYear(), pastMonths[0].getMonth(), 1);
    return null;
  }

  canNavigateNext = computed(() => {
    const arr = this.servicos();
    return this.getNextMonthWithServicesFromArray(this.currentMonth(), arr) !== null;
  });

  canNavigatePrevious = computed(() => {
    const arr = this.servicos();
    return this.getPreviousMonthWithServicesFromArray(this.currentMonth(), arr) !== null;
  });

  changeMonth(direction: number) {
    const currentDate = this.currentMonth();
    let newMonth: Date | null = null;
    const arr = this.servicos();

    if (direction > 0) {
      newMonth = this.getNextMonthWithServicesFromArray(currentDate, arr);
    } else {
      newMonth = this.getPreviousMonthWithServicesFromArray(currentDate, arr);
    }

    if (newMonth) {
      this._currentMonth.set(newMonth);
    }
  }

  currentMonthName = computed(() => {
    const date = this.currentMonth();
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  });

  calendarData = computed(() => {
    const currentMonth = this.currentMonth();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const firstDayOfWeek = firstDay.getDay();

    const servicosData = this.servicos();
    const servicosMap = new Map<string, number>();
    servicosData.forEach((item) => {
      servicosMap.set(item.data, item.quantidadeServicos);
    });

    const maxServicos = Math.max(...servicosData.map((s) => s.quantidadeServicos), 1);

    const calendar: CalendarDay[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      const dateStr = date.toISOString().slice(0, 10);
      const count = servicosMap.get(dateStr) || 0;

      calendar.push({
        day,
        date: dateStr,
        intensity: 0,
        count,
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().slice(0, 10);
      const count = servicosMap.get(dateStr) || 0;

      let intensity = 0;
      if (count > 0) {
        intensity = Math.ceil((count / maxServicos) * 5) || 1;
      }

      calendar.push({
        day,
        date: dateStr,
        intensity,
        count,
        isCurrentMonth: true,
      });
    }

    let nextMonthDay = 1;
    while (calendar.length < 35) {
      const date = new Date(year, month + 1, nextMonthDay);
      const dateStr = date.toISOString().slice(0, 10);
      const count = servicosMap.get(dateStr) || 0;

      calendar.push({
        day: nextMonthDay,
        date: dateStr,
        intensity: 0,
        count,
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    return calendar;
  });

  trackByDate(_: number, item: CalendarDay) {
    return item.date;
  }
}
