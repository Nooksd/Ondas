import { Routes } from '@angular/router';
import { Login } from './components/login/login';

import { AuthGuard } from './guards/auth.guard';
import { Dashboard } from './components/dashboard/dashboard';
import { Profile } from './components/profile/profile';
import { Settings } from './components/settings/settings';
import { Ui } from './components/ui/ui';
import { Error404 } from './components/error404/error404';
import { Services } from '@components/services/services';
import { Customers } from '@components/customers/customers';
import { Employees } from '@components/employees/employees';
import { Teams } from '@components/teams/teams';
import { Users } from '@components/users/users';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Ui,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'servicos',
        component: Services,
      },
      {
        path: 'clientes',
        component: Customers,
      },
      {
        path: 'funcionarios',
        component: Employees,
      },
      {
        path: 'times',
        component: Teams,
      },
      {
        path: 'usuarios',
        component: Users,
      },
      {
        path: 'profile',
        component: Profile,
      },
      {
        path: 'settings',
        component: Settings,
      },
    ],
  },
  {
    path: '**',
    component: Error404,
  },
];
