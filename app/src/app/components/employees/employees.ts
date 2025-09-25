import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { ModalService } from 'app/services/modal.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import {
  activateEmployee,
  deactivateEmployee,
  deleteEmployee,
  loadEmployees,
} from 'app/store/employee/employee.actions';
import {
  selectEmployeeLoading,
  selectEmployeePaginationInfo,
  selectEmployees,
} from 'app/store/employee/employee.selectors';
import { EmployeeDTO, EmployeeFilters, PaginationDTO } from 'app/store/employee/employee.state';

@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './employees.html',
  styleUrls: ['./employees.scss'],
})
export class Employees {
  private store = inject(Store);
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private modal = inject(ModalService);

  employees = signal<EmployeeDTO[] | null>(null);
  pagingInfo = signal<PaginationDTO | null>(null);
  isLoading = signal<boolean>(false);
  filter = signal<EmployeeFilters>({
    page: 1,
    size: 10,
    q: '',
    isActive: true,
  });

  ngOnInit() {
    this.setupHeader();

    if (!this.employees() || this.employees()?.length === 0) {
      this.store.dispatch(loadEmployees({ query: this.filter() }));
    }
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Novo Funcionário',
        onClick: () => {
          this.router.navigate(['/funcionarios/novo']);
        },
      },
    });
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

  constructor() {
    this.store.select(selectEmployees).subscribe((employees) => {
      this.employees.set(employees);
    });

    this.store.select(selectEmployeePaginationInfo).subscribe((paginationInfo) => {
      this.pagingInfo.set(paginationInfo);
    });

    this.store.select(selectEmployeeLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  updateFilter(field: keyof EmployeeFilters, event: Event) {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const value = field === 'page' || field === 'size' ? parseInt(target.value) : target.value;

    const currentFilter = this.filter();
    const newFilter = {
      ...currentFilter,
      [field]: value,
    };

    if (field === 'q' || field === 'size') {
      newFilter.page = 1;
    }

    this.filter.set(newFilter);
  }

  updateIsActive(isActive: boolean) {
    const newFilter = {
      ...this.filter(),
      isActive: isActive,
    };
    this.filter.set(newFilter);
    this.store.dispatch(loadEmployees({ query: newFilter }));
  }

  searchEmployees() {
    console.log(this.filter());
    this.store.dispatch(loadEmployees({ query: this.filter() }));
  }

  changePage(page: number) {
    const newFilter = {
      ...this.filter(),
      page: page,
    };
    this.filter.set(newFilter);
    this.store.dispatch(loadEmployees({ query: newFilter }));
  }

  getStartItem(): number {
    const paging = this.pagingInfo();
    if (!paging) return 0;
    return (paging.currentPage - 1) * paging.pageSize + 1;
  }

  getEndItem(): number {
    const paging = this.pagingInfo();

    if (!paging) return 0;
    const end = paging.currentPage * paging.pageSize;
    return Math.min(end, paging.totalCount);
  }

  getVisiblePages(): number[] {
    const totalPages = this.pagingInfo()?.totalPages || 1;
    const currentPage = this.filter().page || 1;
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  editEmployee(id: number) {
    this.router.navigate([`/funcionarios/${id}`]);
  }

  toggleEmployeeStatus(id: number, status: boolean) {
    if (status) {
      this.store.dispatch(deactivateEmployee({ id }));
    } else {
      this.store.dispatch(activateEmployee({ id }));
    }
  }

  async deleteEmployee(id: number) {
    const ok = await this.modal.confirm(
      'Deletar funcionário',
      'Deseja realmente deletar este funcionário? Esta ação não pode ser desfeita.',
      'Deletar',
      'Cancelar'
    );

    if (!ok) return;

    this.store.dispatch(deleteEmployee({ id }));
  }

  formatSalary(salary: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(salary);
  }

  filteredEmployees = computed(() =>
    this.employees() ? this.employees()!.filter((t) => t.isActive === this.filter().isActive) : []
  );
}
