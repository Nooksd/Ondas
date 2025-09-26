import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SelectOption, SearchSelectComponent } from 'app/shared/search-select.component';
import { clearCustomers, loadCustomers } from 'app/store/customer/customer.actions';
import { selectCustomerLoading, selectCustomers } from 'app/store/customer/customer.selectors';
import { CustomerDTO } from 'app/store/customer/customer.state';
import {
  loadService,
  createService,
  updateService,
  clearSelectedService,
  clearError,
} from 'app/store/service/service.actions';
import { selectSelectedService, selectServiceLoading } from 'app/store/service/service.selectors';
import { ServiceDTO } from 'app/store/service/service.state';
import { clearTeams, loadTeams } from 'app/store/team/team.actions';
import { selectTeamLoading, selectTeams } from 'app/store/team/team.selectors';
import { TeamDTO } from 'app/store/team/team.state';
import { takeWhile } from 'rxjs/operators';
import { SingleDatePickerComponent } from 'app/shared/date-picker.component';

@Component({
  selector: 'app-service-form',
  imports: [CommonModule, ReactiveFormsModule, SearchSelectComponent, SingleDatePickerComponent],
  standalone: true,
  templateUrl: './service-form.html',
  styleUrls: ['./service-form.scss'],
})
export class ServiceForm implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  serviceForm: FormGroup;
  isEditMode = signal<boolean>(false);
  serviceId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  selectedService = signal<ServiceDTO | null>(null);
  private alive = true;

  customers = signal<CustomerDTO[]>([]);
  customerOptions = signal<SelectOption[]>([]);
  isCustomerLoading = signal<boolean>(false);
  selectedCustomer = signal<SelectOption | null>(null);

  teams = signal<TeamDTO[]>([]);
  teamOptions = signal<SelectOption[]>([]);
  isTeamLoading = signal<boolean>(false);
  selectedTeam = signal<SelectOption | null>(null);

  constructor() {
    this.serviceForm = this.createForm();
  }

  ngOnInit() {
    this.setupRoute();
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    this.store
      .select(selectServiceLoading)
      .pipe(takeWhile(() => this.alive))
      .subscribe((loading) => {
        this.isLoading.set(loading);
      });

    this.store
      .select(selectSelectedService)
      .pipe(takeWhile(() => this.alive))
      .subscribe((service) => {
        this.selectedService.set(service);
        if (service && this.isEditMode()) {
          this.populateForm(service);
        }
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

  ngOnDestroy() {
    this.alive = false;
    this.store.dispatch(clearSelectedService());
    this.store.dispatch(clearError());
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1)]],
      teamId: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(1)]],
      serviceDate: [new Date(), [Validators.required]],
      serviceDuration: ['', [Validators.required, this.timeSpanValidator]],
      paymentDueDate: [new Date(), [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      status: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  private setupRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.serviceId.set(Number(id));
      this.store.dispatch(loadService({ id: Number(id) }));
    } else {
      this.isEditMode.set(false);
      this.serviceId.set(null);
    }
  }

  private populateForm(service: ServiceDTO) {
    this.serviceForm.patchValue({
      customerId: service.customerId,
      teamId: service.teamId,
      price: service.price,
      serviceDate: service.serviceDate,
      paymentDueDate: service.paymentDueDate,
      serviceDuration: service.serviceDuration,
      description: service.description,
      status: service.status,
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
    this.serviceForm.patchValue({ customerId: customer?.id || null });

    this.store.dispatch(clearCustomers());
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
    this.serviceForm.patchValue({ teamId: team?.id || null });

    this.store.dispatch(clearTeams());
  }

  onServiceDateChange(event: { date: Date }) {
    this.serviceForm.patchValue({ serviceDate: event.date });
  }

  onPaymentDueDateChange(event: { date: Date }) {
    this.serviceForm.patchValue({ paymentDueDate: event.date });
  }

  onSubmit() {
    console.log(this.serviceForm.value);
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;
      const serviceData: ServiceDTO = {
        ...formValue,
      };

      if (this.isEditMode() && this.serviceId()) {
        this.store.dispatch(
          updateService({
            id: this.serviceId()!,
            service: { ...serviceData, id: this.serviceId()! },
          })
        );
      } else {
        this.store.dispatch(createService({ service: serviceData }));
      }
    }
  }

  goBack() {
    this.router.navigate(['/servicos']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  timeSpanValidator(control: any) {
    const value = control.value;
    if (value && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(value)) {
      return { invalidTimeSpan: true };
    }
    return null;
  }

  getFieldError(fieldName: string): string | null {
    const field = this.serviceForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }

    return null;
  }
}
