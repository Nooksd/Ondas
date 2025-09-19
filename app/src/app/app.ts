import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<h1>{{ title() }}</h1>
    <router-outlet />`,
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('Ondas App');
}
