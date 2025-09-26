import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { ModalService } from 'app/services/modal.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import {
  deleteService,
  loadServices,
  changeServiceStatus,
} from 'app/store/service/service.actions';
import { clearCustomers, loadCustomers } from 'app/store/customer/customer.actions';
import { clearTeams, loadTeams } from 'app/store/team/team.actions';
import { selectServiceLoading, selectServices } from 'app/store/service/service.selectors';
import { selectCustomers, selectCustomerLoading } from 'app/store/customer/customer.selectors';
import { selectTeams, selectTeamLoading } from 'app/store/team/team.selectors';
import { ServiceDTO, ServiceFilters, ServiceStatus } from 'app/store/service/service.state';
import { CustomerDTO } from 'app/store/customer/customer.state';
import { TeamDTO } from 'app/store/team/team.state';
import { RangeDatePickerComponent } from 'app/shared/range-date-picker.component';
import { SearchSelectComponent, SelectOption } from 'app/shared/search-select.component';
import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-services',
  imports: [CommonModule, RangeDatePickerComponent, SearchSelectComponent, DragDropModule],
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
  isLoading = signal<boolean>(false);

  customers = signal<CustomerDTO[]>([]);
  customerOptions = signal<SelectOption[]>([]);
  isCustomerLoading = signal<boolean>(false);
  selectedCustomer = signal<SelectOption | null>(null);

  teams = signal<TeamDTO[]>([]);
  teamOptions = signal<SelectOption[]>([]);
  isTeamLoading = signal<boolean>(false);
  selectedTeam = signal<SelectOption | null>(null);

  filter = signal<ServiceFilters>({
    customerId: null,
    teamId: null,
    initialDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    finalDate: new Date(),
  });

  statusColumns = [
    {
      status: ServiceStatus.Agendado,
      title: 'Agendado',
      color: '#3b82f6',
      services: signal<ServiceDTO[]>([]),
    },
    {
      status: ServiceStatus.EmAndamento,
      title: 'Em Andamento',
      color: '#f59e0b',
      services: signal<ServiceDTO[]>([]),
    },
    {
      status: ServiceStatus.AguardandoPagamento,
      title: 'Aguardando Pagamento',
      color: '#8b5cf6',
      services: signal<ServiceDTO[]>([]),
    },
    {
      status: ServiceStatus.AtrasoNoPagamento,
      title: 'Atraso no Pagamento',
      color: '#ef4444',
      services: signal<ServiceDTO[]>([]),
    },
    {
      status: ServiceStatus.Concluido,
      title: 'Concluído',
      color: '#10b981',
      services: signal<ServiceDTO[]>([]),
    },
    {
      status: ServiceStatus.Cancelado,
      title: 'Cancelado',
      color: '#6b7280',
      services: signal<ServiceDTO[]>([]),
    },
  ];

  ngOnInit() {
    this.setupHeader();
    this.setupSubscriptions();

    console.log(this.services());

    if (!this.services() || this.services()?.length === 0) {
      this.store.dispatch(loadServices({ query: this.filter() }));
    }
  }

  ngOnDestroy() {
    this.headerService.clearHeaderConfig();
  }

  private setupHeader() {
    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Novo Serviço',
        onClick: () => {
          this.router.navigate(['/servicos/novo']);
        },
      },
    });
  }

  private setupSubscriptions() {
    this.store.select(selectServices).subscribe((services) => {
      this.services.set(services);
      this.organizeServicesByStatus(services);
    });

    this.store.select(selectServiceLoading).subscribe((loading) => {
      this.isLoading.set(loading);
    });

    this.store.select(selectCustomers).subscribe((customers) => {
      this.customers.set(customers);
      this.customerOptions.set(
        customers.map((customer) => ({
          id: customer.id!,
          name: customer.name,
        }))
      );
    });

    this.store.select(selectCustomerLoading).subscribe((loading) => {
      this.isCustomerLoading.set(loading);
    });

    this.store.select(selectTeams).subscribe((teams) => {
      this.teams.set(teams);
      this.teamOptions.set(
        teams.map((team) => ({
          id: team.id!,
          name: team.name,
        }))
      );
    });

    this.store.select(selectTeamLoading).subscribe((loading) => {
      this.isTeamLoading.set(loading);
    });
  }

  private organizeServicesByStatus(services: ServiceDTO[] | null) {
    if (!services) return;

    this.statusColumns.forEach((column) => {
      const columnServices = services.filter((service) => service.status === column.status);
      column.services.set(columnServices);
    });
  }

  onCustomerSearch(searchTerm: string) {
    this.store.dispatch(
      loadCustomers({
        query: {
          page: 1,
          size: 5,
          q: searchTerm,
        },
      })
    );
  }

  onCustomerSelection(customer: SelectOption | null) {
    this.selectedCustomer.set(customer);
    this.filter.update((f) => ({ ...f, customerId: customer?.id || null }));

    this.store.dispatch(clearCustomers());

    this.searchServices();
  }

  onTeamSearch(searchTerm: string) {
    this.store.dispatch(
      loadTeams({
        query: {
          page: 1,
          size: 5,
          q: searchTerm,
          isActive: true,
        },
      })
    );
  }

  onTeamSelection(team: SelectOption | null) {
    this.selectedTeam.set(team);
    this.filter.update((f) => ({ ...f, teamId: team?.id || null }));

    this.store.dispatch(clearTeams());

    this.searchServices();
  }

  onDatesChanged(event: { startDate: Date; endDate: Date }) {
    this.filter.update((f) => ({
      ...f,
      initialDate: event.startDate,
      finalDate: event.endDate,
    }));

    this.searchServices();
  }

  searchServices() {
    this.store.dispatch(loadServices({ query: this.filter() }));
  }

  get connectedDropLists(): string[] {
    return this.statusColumns.map((column) => column.status.toString());
  }

  async onServiceDrop(event: CdkDragDrop<ServiceDTO[]>) {
    const prevListId = event.previousContainer.id;
    const currListId = event.container.id;

    const srcCol = this.statusColumns.find((c) => String(c.status) === prevListId);
    const destCol = this.statusColumns.find((c) => String(c.status) === currListId);

    if (!srcCol || !destCol) return;

    const movedService = event.previousContainer.data?.[event.previousIndex] as
      | ServiceDTO
      | undefined;
    if (!movedService || movedService.id == null) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        destCol.services.set([...event.container.data]);
      }
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      destCol.services.set([...event.container.data]);
      return;
    }
    const newStatus = Number(currListId);

    let date: Date | null = null;

    if (newStatus === 5) {
      date = await this.modal.pickDate('Data do pagamento');

      if (!date) return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    srcCol.services.set([...event.previousContainer.data]);
    destCol.services.set([...event.container.data]);

    this.store.dispatch(
      changeServiceStatus({
        id: movedService.id!,
        newStatus: { newStatus, paymentDate: date },
      })
    );
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(date));
  }

  private parseDurationToMs(duration: number | string | null | undefined): number {
    if (!duration && duration !== 0) return 0;

    if (typeof duration === 'number') {
      const n = duration;
      if (n > 1e9) {
        return Math.floor(n / 10000);
      }
      if (n > 1e6) {
        return Math.floor(n);
      }
      return Math.floor(n * 1000);
    }
    if (typeof duration === 'string') {
      const s = duration.trim();

      const isoMatch = s.match(/^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i);
      if (isoMatch) {
        const hours = parseInt(isoMatch[2] || '0', 10);
        const minutes = parseInt(isoMatch[3] || '0', 10);
        const seconds = parseInt(isoMatch[4] || '0', 10);
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
      }

      const parts = s.split(':').map((p) => parseInt(p, 10));
      if (parts.length === 3 && parts.every((p) => !isNaN(p))) {
        const [hh, mm, ss] = parts;
        return (hh * 3600 + mm * 60 + ss) * 1000;
      }
      if (parts.length === 2 && parts.every((p) => !isNaN(p))) {
        const [mm, ss] = parts;
        return (mm * 60 + ss) * 1000;
      }

      const asNumber = Number(s);
      if (!isNaN(asNumber)) {
        return this.parseDurationToMs(asNumber);
      }
    }

    return 0;
  }

  private pad2(n: number) {
    return String(n).padStart(2, '0');
  }

  getDuration(serviceDate: string | Date, serviceDuration: number | string): string {
    if (!serviceDate) return '';

    const start = new Date(serviceDate);
    if (isNaN(start.getTime())) return '';

    const durationMs = this.parseDurationToMs(serviceDuration);
    const end = new Date(start.getTime() + durationMs);

    const startHours = this.pad2(start.getHours());
    const startMinutes = this.pad2(start.getMinutes());
    const endHours = this.pad2(end.getHours());
    const endMinutes = this.pad2(end.getMinutes());

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
  }
}
