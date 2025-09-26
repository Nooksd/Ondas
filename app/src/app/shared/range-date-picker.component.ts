import {
  Component,
  output,
  input,
  AfterViewInit,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';

@Component({
  selector: 'app-header-date-range-picker',
  standalone: true,
  template: `
    <div class="header-date-range-picker">
      <input
        #datePickerInput
        type="text"
        placeholder="Selecionar período"
        class="flatpickr-input"
      />
    </div>
  `,
  styles: [
    `
      .flatpickr-input {
        padding: 8px 12px;
        color: #003392;
        box-shadow: 0 3px 7px 0 rgba(23, 109, 198, 0.2);
        border-radius: 15px;
        min-width: 200px;
        font-size: 14px;
        background: white;
      }
    `,
  ],
})
export class RangeDatePickerComponent implements AfterViewInit, OnDestroy {
  initialStartDate = input<Date>();
  initialEndDate = input<Date>();
  onDatesChanged = input<(event: { startDate: Date; endDate: Date }) => void>();

  private datePickerInput = viewChild<ElementRef<HTMLInputElement>>('datePickerInput');
  private flatpickrInstance: any;

  ngAfterViewInit() {
    const input = this.datePickerInput()?.nativeElement;
    if (!input) return;

    this.flatpickrInstance = flatpickr(input, {
      mode: 'range',
      locale: Portuguese,
      dateFormat: 'd/m/Y',
      defaultDate: [
        this.initialStartDate() || this.getFirstDayOfMonth(),
        this.initialEndDate() || new Date(),
      ],
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length === 2) {
          const callback = this.onDatesChanged();
          if (callback) {
            callback({
              startDate: selectedDates[0],
              endDate: selectedDates[1],
            });
          }
        }
      },
    });
  }

  private getFirstDayOfMonth(): Date {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
