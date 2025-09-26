import { Component, AfterViewInit, OnDestroy, ElementRef, input, viewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';

@Component({
  selector: 'app-single-date-picker',
  standalone: true,
  template: `
    <div class="single-date-picker">
      <input #datePickerInput type="text" placeholder="Selecionar data" class="flatpickr-input" />
    </div>
  `,
  styles: [
    `
      .flatpickr-input {
        padding: 8px 12px;
        color: #003392;
        box-shadow: 0 3px 7px 0 rgba(23, 109, 198, 0.2);
        border-radius: 8px;
        min-width: 180px;
        font-size: 14px;
        background: white;
      }
    `,
  ],
})
export class SingleDatePickerComponent implements AfterViewInit, OnDestroy {
  initialDate = input<Date | null>();

  onDateChanged = input<(event: { date: Date }) => void>();

  private datePickerInput = viewChild<ElementRef<HTMLInputElement>>('datePickerInput');
  private flatpickrInstance: any;

  ngAfterViewInit() {
    const inputEl = this.datePickerInput()?.nativeElement;
    if (!inputEl) return;

    this.flatpickrInstance = flatpickr(inputEl, {
      locale: Portuguese,
      dateFormat: 'd/m/Y',
      defaultDate: this.initialDate?.() ?? undefined,
      allowInput: true,
      onChange: (selectedDates: Date[]) => {
        if (selectedDates.length >= 1) {
          const cb = this.onDateChanged?.();
          if (cb) cb({ date: selectedDates[0] });
        }
      },
    });
  }

  getSelectedDate(): Date | null {
    return this.flatpickrInstance?.selectedDates?.[0] ?? null;
  }

  setDate(date: Date | string) {
    this.flatpickrInstance?.setDate(date, true);
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
