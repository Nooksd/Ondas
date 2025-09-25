import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { ModalService } from 'app/services/modal.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import { deleteCustomer, loadCustomers } from 'app/store/customer/customer.actions';
import {
  selectCustomerLoading,
  selectCustomerPaginationInfo,
  selectCustomers,
} from 'app/store/customer/customer.selectors';
import { CustomerDTO, CustomerFilters, PaginationDTO } from 'app/store/customer/customer.state';

@Component({
  selector: 'app-customers',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './customers.html',
  styleUrls: ['./customers.scss'],
})
export class Customers {
  private store = inject(Store);
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private modal = inject(ModalService);

  customers = signal<CustomerDTO[] | null>(null);
  pagingInfo = signal<PaginationDTO | null>(null);
  isLoading = signal<boolean>(false);
  filter = signal<CustomerFilters>({
    page: 1,
    size: 10,
    q: '',
  });

  ngOnInit() {
    this.setupHeader();

    if (!this.customers() || this.customers()?.length === 0) {
      this.store.dispatch(loadCustomers({ query: this.filter() }));
    }
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Novo Cliente',
        onClick: () => {
          this.router.navigate(['/clientes/novo']);
        },
      },
    });
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

  constructor() {
    this.store.select(selectCustomers).subscribe((customers) => {
      this.customers.set(customers);
    });

    this.store.select(selectCustomerPaginationInfo).subscribe((paginationInfo) => {
      this.pagingInfo.set(paginationInfo);
    });

    this.store.select(selectCustomerLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  updateFilter(field: keyof CustomerFilters, event: Event) {
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

  searchCustomers() {
    this.store.dispatch(loadCustomers({ query: this.filter() }));
  }

  changePage(page: number) {
    const newFilter = {
      ...this.filter(),
      page: page,
    };
    this.filter.set(newFilter);
    this.store.dispatch(loadCustomers({ query: newFilter }));
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

  editCustomer(id: number) {
    this.router.navigate([`/clientes/${id}`]);
  }

  async deleteCustomer(id: number) {
    const ok = await this.modal.confirm(
      'Deletar cliente',
      'Deseja realmente deletar este cliente? Esta ação não pode ser desfeita.',
      'Deletar',
      'Cancelar'
    );

    if (!ok) return;

    this.store.dispatch(deleteCustomer({ id }));
  }
}
