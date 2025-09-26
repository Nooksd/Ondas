import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { ModalService } from 'app/services/modal.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import { deleteService, loadServices } from 'app/store/service/service.actions';
import {
  selectServiceLoading,
  selectServicePaginationInfo,
  selectServices,
} from 'app/store/service/service.selectors';
import { ServiceDTO, ServiceFilters, PaginationDTO } from 'app/store/service/service.state';
import { HeaderDateRangePickerComponent } from 'app/shared/header-range-date-picker.component';

@Component({
  selector: 'app-services',
  imports: [CommonModule, HeaderDateRangePickerComponent],
  standalone: true,
  templateUrl: './services.html',
  styleUrls: ['./services.scss'],
})
export class Services {
  private store = inject(Store);
  private router = inject(Router);
  private headerService = inject(HeaderService);
  private modal = inject(ModalService);

  services = signal<ServiceDTO[] | null>(null);
  pagingInfo = signal<PaginationDTO | null>(null);
  isLoading = signal<boolean>(false);
  filter = signal<ServiceFilters>({
    customerId: null,
    teamId: null,
    initialDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    finalDate: new Date(),
  });

  ngOnInit() {
    this.setupHeader();

    if (!this.services() || this.services()?.length === 0) {
      this.store.dispatch(loadServices({ query: this.filter() }));
    }
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Novo Serviço',
        onClick: () => {
          this.router.navigate(['/servicos/novo']);
        },
      },
    });
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

  constructor() {
    this.store.select(selectServices).subscribe((services) => {
      this.services.set(services);
    });

    this.store.select(selectServicePaginationInfo).subscribe((paginationInfo) => {
      this.pagingInfo.set(paginationInfo);
    });

    this.store.select(selectServiceLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });
  }

  onDatesChanged(event: { startDate: Date; endDate: Date }) {
    // console.log(this.services);
    // this.store.dispatch(loadServices({ query: this.filter() }));
  }

  searchServices() {
    this.store.dispatch(loadServices({ query: this.filter() }));
  }

  editService(id: number) {
    this.router.navigate([`/servicos/${id}`]);
  }

  async deleteService(id: number) {
    const ok = await this.modal.confirm(
      'Deletar serviço',
      'Deseja realmente deletar este serviço? Esta ação não pode ser desfeita.',
      'Deletar',
      'Cancelar'
    );

    if (!ok) return;

    this.store.dispatch(deleteService({ id }));
  }
}
