import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderService } from 'app/services/header.service';
import { HeaderButtonActionComponent } from 'app/shared/header-button-action.component';
import {
  loadCustomer,
  createCustomer,
  updateCustomer,
  clearSelectedCustomer,
  clearError,
} from 'app/store/customer/customer.actions';
import {
  selectSelectedCustomer,
  selectCustomerLoading,
  selectCustomerError,
} from 'app/store/customer/customer.selectors';
import { CustomerDTO } from 'app/store/customer/customer.state';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss'],
})
export class CustomerForm implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private headerService = inject(HeaderService);

  customerForm: FormGroup;
  isEditMode = signal<boolean>(false);
  customerId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedCustomer = signal<CustomerDTO | null>(null);
  private alive = true;

  constructor() {
    this.customerForm = this.createForm();
    this.setupSubscriptions();
  }

  ngOnInit() {
    this.setupRoute();
    this.setupHeader();
  }

  ngOnDestroy() {
    this.alive = false;
    this.headerService.clearHeaderConfig();
    this.store.dispatch(clearSelectedCustomer());
    this.store.dispatch(clearError());
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      address: this.fb.group({
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
        region: ['', [Validators.required, Validators.maxLength(50)]],
        city: ['', [Validators.required, Validators.maxLength(50)]],
        neighborhood: ['', [Validators.required, Validators.maxLength(100)]],
        street: ['', [Validators.required, Validators.maxLength(100)]],
        number: ['', [Validators.required, Validators.min(1)]],
        complement: ['', [Validators.maxLength(100)]],
      }),
    });
  }

  private setupRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.customerId.set(Number(id));
      this.store.dispatch(loadCustomer({ id: Number(id) }));
    } else {
      this.isEditMode.set(false);
      this.customerId.set(null);
    }
  }

  private setupHeader() {
    const title = this.isEditMode() ? 'Editar Cliente' : 'Novo Cliente';

    this.headerService.setHeaderConfig({
      component: HeaderButtonActionComponent,
      inputs: {
        buttonText: 'Voltar',
        onClick: () => {
          this.goBack();
        },
      },
    });
  }

  private setupSubscriptions() {
    // Loading state
    this.store
      .select(selectCustomerLoading)
      .pipe(takeWhile(() => this.alive))
      .subscribe((loading) => {
        this.isLoading.set(loading);
      });

    // Error state
    this.store
      .select(selectCustomerError)
      .pipe(takeWhile(() => this.alive))
      .subscribe((error) => {
        this.error.set(error);
      });

    // Selected customer for edit mode
    this.store
      .select(selectSelectedCustomer)
      .pipe(takeWhile(() => this.alive))
      .subscribe((customer) => {
        this.selectedCustomer.set(customer);
        if (customer && this.isEditMode()) {
          this.populateForm(customer);
        }
      });
  }

  private populateForm(customer: CustomerDTO) {
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      cpf: customer.cpf,
      phone: customer.phone,
      address: {
        postalCode: customer.address?.postalCode || '',
        region: customer.address?.region || '',
        city: customer.address?.city || '',
        neighborhood: customer.address?.neighborhood || '',
        street: customer.address?.street || '',
        number: customer.address?.number || '',
        complement: customer.address?.complement || '',
      },
    });
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      const customerData: CustomerDTO = {
        ...formValue,
        address: {
          ...formValue.address,
          number: Number(formValue.address.number),
        },
      };

      if (this.isEditMode() && this.customerId()) {
        this.store.dispatch(
          updateCustomer({
            id: this.customerId()!,
            customer: { ...customerData, id: this.customerId()! },
          })
        );
      } else {
        this.store.dispatch(createCustomer({ customer: customerData }));
      }

      // Após sucesso, voltar para lista
      setTimeout(() => {
        if (!this.error()) {
          this.goBack();
        }
      }, 1000);
    } else {
      // this.markFormGroupTouched();
    }
  }

  // private markFormGroupTouched() {
  //   Object.keys(this.customerForm.controls).forEach((key) => {
  //     const control = this.customerForm.get(key);
  //     control?.markAsTouched();

  //     if (control && typeof control.controls === 'object') {
  //       Object.keys(control.controls).forEach((nestedKey) => {
  //         control.get(nestedKey)?.markAsTouched();
  //       });
  //     }
  //   });
  // }

  goBack() {
    this.router.navigate(['/clientes']);
  }

  // Métodos utilitários para validação
  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.customerForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['email']) return 'Digite um email válido';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) {
        if (fieldName === 'cpf') return 'Formato: 000.000.000-00';
        if (fieldName === 'phone') return 'Formato: (00) 00000-0000';
        if (fieldName === 'address.postalCode') return 'Formato: 00000-000';
      }
      if (field.errors['min']) return 'Valor deve ser maior que 0';
    }

    return null;
  }

  // Métodos para formatação automática
  formatCpf(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    this.customerForm.get('cpf')?.setValue(value);
  }

  formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      if (value.length === 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      }
    }

    this.customerForm.get('phone')?.setValue(value);
  }

  formatPostalCode(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    this.customerForm.get('address.postalCode')?.setValue(value);
  }
}
