import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

export interface SelectOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-search-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-select-container" [class.open]="isOpen()">
      <div class="search-input-wrapper">
        <div class="search-icon">
          <div class="icon-search"></div>
        </div>
        <input
          type="text"
          class="search-input"
          [placeholder]="placeholder"
          [value]="displayValue()"
          (input)="onInputChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          #searchInput
        />
        <div class="dropdown-arrow" [class.rotated]="isOpen()">
          <div class="icon-arrow-down"></div>
        </div>
      </div>

      @if (isOpen()) {
      <div class="dropdown">
        <div class="dropdown-content">
          @if (loading()) {
          <div class="loading-item">Carregando...</div>
          } @else if (options().length === 0) {
          <div class="no-results">Nenhum resultado encontrado</div>
          } @else { @for (option of options(); track option.id) {
          <div
            class="dropdown-item"
            [class.selected]="selectedValue()?.id === option.id"
            (mousedown)="selectOption(option)"
          >
            {{ option.name }}
          </div>
          } }
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .search-select-container {
        position: relative;
        width: 100%;
        max-width: 300px;
      }

      .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        color: var(--color-primary-1);
        z-index: 1;
      }

      .dropdown-arrow {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        color: var(--color-primary-3);
        transition: transform 0.2s ease;
        z-index: 1;
      }

      .dropdown-arrow.rotated {
        transform: translateY(-50%) rotate(180deg);
      }

      .search-input {
        width: 100%;
        padding: 10px 40px 10px 40px;
        border: 1px solid var(--color-primary-3);
        border-radius: 8px;
        transition: all 0.2s ease;
        color: var(--color-primary-1);
        cursor: pointer;
      }

      .search-input:focus {
        outline: none;
        border-color: var(--color-primary-1);
        cursor: text;
      }

      .search-input::placeholder {
        color: var(--color-primary-3);
      }

      .open .search-input {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-color: var(--color-primary-1);
      }

      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid var(--color-primary-1);
        border-top: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
      }

      .dropdown-content {
        padding: 4px 0;
      }

      .dropdown-item {
        padding: 10px 16px;
        cursor: pointer;
        transition: background-color 0.15s ease;
        color: var(--color-primary-1);
      }

      .dropdown-item:hover {
        background-color: var(--color-primary-4);
      }

      .dropdown-item.selected {
        background-color: var(--color-primary-1);
        color: white;
      }

      .loading-item,
      .no-results {
        padding: 10px 16px;
        color: var(--color-primary-3);
        font-style: italic;
      }
    `,
  ],
})
export class SearchSelectComponent {
  private destroyRef = inject(DestroyRef);

  @Input() placeholder: string = 'Selecione...';
  @Input() options = signal<SelectOption[]>([]);
  @Input() loading = signal<boolean>(false);
  @Input() selectedValue = signal<SelectOption | null>(null);

  @Output() searchChange = new EventEmitter<string>();
  @Output() selectionChange = new EventEmitter<SelectOption | null>();

  isOpen = signal<boolean>(false);
  displayValue = signal<string>('');

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((searchTerm) => {
        if (searchTerm.length >= 3) {
          this.searchChange.emit(searchTerm);
        }
      });

    effect(() => {
      const selected = this.selectedValue();
      this.displayValue.set(selected ? selected.name : '');
    });
  }

  onFocus() {
    this.isOpen.set(true);
  }

  onBlur() {
    this.isOpen.set(false);
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.displayValue.set(value);

    if (value.length >= 3) {
      this.searchSubject.next(value);
    }

    const currentSelection = this.selectedValue();
    if (currentSelection && value !== currentSelection.name) {
      this.selectedValue.set(null);
      this.selectionChange.emit(null);
    }
  }

  selectOption(option: SelectOption) {
    this.selectedValue.set(option);
    this.displayValue.set(option.name);
    this.selectionChange.emit(option);
    this.isOpen.set(false);
  }
}
