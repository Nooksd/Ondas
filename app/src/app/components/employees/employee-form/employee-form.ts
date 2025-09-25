import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loadEmployee,
  createEmployee,
  updateEmployee,
  clearSelectedEmployee,
  clearError,
} from 'app/store/employee/employee.actions';
import {
  selectSelectedEmployee,
  selectEmployeeLoading,
} from 'app/store/employee/employee.selectors';
import { EmployeeDTO } from 'app/store/employee/employee.state';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './employee-form.html',
  styleUrls: ['./employee-form.scss'],
})
export class EmployeeForm implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  employeeForm: FormGroup;
  isEditMode = signal<boolean>(false);
  employeeId = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  selectedEmployee = signal<EmployeeDTO | null>(null);
  private alive = true;

  constructor() {
    this.employeeForm = this.createForm();
    this.setupSubscriptions();
  }

  ngOnInit() {
    this.setupRoute();
  }

  ngOnDestroy() {
    this.alive = false;
    this.store.dispatch(clearSelectedEmployee());
    this.store.dispatch(clearError());
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      role: ['', [Validators.required, Validators.maxLength(100)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      salary: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
    });
  }

  private setupRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.employeeId.set(Number(id));
      this.store.dispatch(loadEmployee({ id: Number(id) }));
    } else {
      this.isEditMode.set(false);
      this.employeeId.set(null);
    }
  }

  private setupSubscriptions() {
    this.store
      .select(selectEmployeeLoading)
      .pipe(takeWhile(() => this.alive))
      .subscribe((loading) => {
        this.isLoading.set(loading);
      });

    this.store
      .select(selectSelectedEmployee)
      .pipe(takeWhile(() => this.alive))
      .subscribe((employee) => {
        this.selectedEmployee.set(employee);
        if (employee && this.isEditMode()) {
          this.populateForm(employee);
        }
      });
  }

  private populateForm(employee: EmployeeDTO) {
    this.employeeForm.patchValue({
      name: employee.name,
      role: employee.role,
      cpf: employee.cpf,
      salary: employee.salary,
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      const employeeData: EmployeeDTO = {
        ...formValue,
      };

      if (this.isEditMode() && this.employeeId()) {
        this.store.dispatch(
          updateEmployee({
            id: this.employeeId()!,
            employee: { ...employeeData, id: this.employeeId()! },
          })
        );
      } else {
        this.store.dispatch(createEmployee({ employee: employeeData }));
      }
    }
  }

  goBack() {
    this.router.navigate(['/funcionarios']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.employeeForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['pattern']) {
        if (fieldName === 'cpf') return 'Formato: 000.000.000-00';
      }
      if (field.errors['min']) return 'Valor deve ser maior que 0';
    }

    return null;
  }

  formatCpf(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    this.employeeForm.get('cpf')?.setValue(value);
  }

  formatSalary(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').replace(/(\d{2})$/, '.$1');

    input.value = value;
    this.employeeForm.get('salary')?.setValue(value, { emitEvent: false });
  }

  toState(event: Event, controlPath: string) {
    const input = event.target as HTMLInputElement;
    const upper = input.value.toUpperCase().slice(0, 2);
    input.value = upper;
    this.employeeForm.get(controlPath)?.setValue(upper, { emitEvent: false });
  }
}
