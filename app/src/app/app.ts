import { Component, Inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Ondas App');

  constructor(private toast: HotToastService) {
    this.toast.defaultConfig = {
      ...this.toast.defaultConfig,
      position: 'top-right',
      dismissible: true,
      duration: 1000,
      stacking: 'vertical',
      visibleToasts: 5,
    };
  }
}
