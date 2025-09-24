import { Injectable, signal } from '@angular/core';

export interface HeaderConfig {
  component: any;
  inputs?: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly headerConfig = signal<HeaderConfig | null>(null);

  readonly config = this.headerConfig.asReadonly();

  setHeaderConfig(config: HeaderConfig) {
    this.headerConfig.set(config);
  }

  clearHeaderConfig() {
    this.headerConfig.set(null);
  }
}
