import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgToastComponent, NgToastService, TOAST_POSITIONS } from 'ng-angular-popup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgToastComponent],
  template: `<router-outlet />
    <ng-toast [position]="TOAST_POSITIONS.TOP_RIGHT" [width]="350"></ng-toast>`,
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Ondas App');

  TOAST_POSITIONS = TOAST_POSITIONS;

  constructor(private toast: NgToastService) {}

  showSuccess() {
    this.toast.success('Success Message', 'Title', 3000);
  }

  showError() {
    this.toast.danger('Error Message', 'Error', 3000);
  }

  showInfo() {
    this.toast.info('Info Message', 'Information', 3000);
  }

  showWarning() {
    this.toast.warning('Warning Message', 'Warning', 3000);
  }
}
