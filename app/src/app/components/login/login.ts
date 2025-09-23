import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from 'app/store/auth/auth.actions';
import { selectAuthLoading } from 'app/store/auth/auth.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  private fb = inject(FormBuilder);
  private store = inject(Store);

  passwordVisible = signal(false);

  form: FormGroup;

  loading = toSignal(this.store.select(selectAuthLoading), { initialValue: false });

  togglePassword() {
    this.passwordVisible.update((v) => !v);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.value;
    this.store.dispatch(login({ credentials: { email, password } }));
  }
}
