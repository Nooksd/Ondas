import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './store/auth/auth.interceptor';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { dashboardReducer } from './store/dashboard/dashboard.reducer';
import { customerReducer } from './store/customer/customer.reducer';
import { DashboardEffects } from './store/dashboard/dashboard.effects';
import { CustomerEffects } from './store/customer/customer.effects';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { employeeReducer } from './store/employee/employee.reducer';
import { EmployeeEffects } from './store/employee/employee.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHotToastConfig(),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideCharts(withDefaultRegisterables()),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      dashboard: dashboardReducer,
      customer: customerReducer,
      employee: employeeReducer,
    }),
    provideEffects([AuthEffects, DashboardEffects, CustomerEffects, EmployeeEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideHotToastConfig(),
  ],
};
