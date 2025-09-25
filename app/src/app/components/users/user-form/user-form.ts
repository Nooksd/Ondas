import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  loadUser,
  createUser,
  updateUser,
  clearSelectedUser,
  clearError,
} from 'app/store/user/user.actions';
import { selectSelectedUser, selectUserLoading } from 'app/store/user/user.selectors';
import { UserDTO } from 'app/store/user/user.state';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.scss'],
})
export class UserForm implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userForm: FormGroup;
  isEditMode = signal<boolean>(false);
  userId = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  selectedUser = signal<UserDTO | null>(null);
  private alive = true;

  constructor() {
    this.userForm = this.createForm();
    this.setupSubscriptions();
  }

  ngOnInit() {
    this.setupRoute();
  }

  ngOnDestroy() {
    this.alive = false;
    this.store.dispatch(clearSelectedUser());
    this.store.dispatch(clearError());
  }

  private createForm(): FormGroup {
    return this.fb.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          UserForm.userNameValidator,
        ],
      ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.minLength(6), Validators.maxLength(100)]],
      roles: [['Viewer']],
    });
  }

  private setupRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.userId.set(id);
      this.store.dispatch(loadUser({ id: id }));
      this.userForm.get('password')?.disable();
      this.userForm
        .get('password')
        ?.setValidators([Validators.minLength(6), Validators.maxLength(100)]);
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.isEditMode.set(false);
      this.userId.set(null);
      this.userForm.get('password')?.enable();
      this.userForm
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(100)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  private setupSubscriptions() {
    this.store
      .select(selectUserLoading)
      .pipe(takeWhile(() => this.alive))
      .subscribe((loading) => {
        this.isLoading.set(loading);
      });

    this.store
      .select(selectSelectedUser)
      .pipe(takeWhile(() => this.alive))
      .subscribe((user) => {
        this.selectedUser.set(user);
        if (user && this.isEditMode()) {
          this.populateForm(user);
        }
      });
  }

  private populateForm(user: UserDTO) {
    this.userForm.patchValue({
      userName: user.userName,
      email: user.email,
      password: '',
      roles: user.roles,
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: UserDTO = {
        ...formValue,
      };

      if (this.isEditMode() && this.userId()) {
        this.store.dispatch(
          updateUser({
            id: this.userId()!,
            user: { ...userData, id: this.userId()! },
          })
        );
      } else {
        this.store.dispatch(createUser({ user: userData }));
      }
    }
  }

  goBack() {
    this.router.navigate(['/usuarios']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string | null {
    const field = this.userForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) return 'Este campo é obrigatório';
      if (field.errors['email']) return 'Digite um email válido';
      if (field.errors['minlength'])
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength'])
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (fieldName === 'userName' && field.errors['invalidUserName'])
        return 'Apenas letras e números (sem espaço)';
    }

    return null;
  }

  private static userNameValidator(control: import('@angular/forms').AbstractControl) {
    const value = control.value as string;
    return /^[a-zA-Z0-9]+$/.test(value) ? null : { invalidUserName: true };
  }
}
