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
import { CustomerForm } from '@components/customers/customer-form/customer-form';
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
        data: { breadcrumb: 'Dashboard', title: 'Dashboard' },
      },
      {
        path: 'servicos',
        component: Services,
        data: { breadcrumb: 'Serviços', title: 'Serviços' },
      },
      {
        path: 'clientes',
        data: { breadcrumb: 'Clientes', title: 'Clientes' },
        children: [
          {
            path: '',
            component: Customers,
          },
          {
            path: 'novo',
            component: CustomerForm,
            data: { breadcrumb: 'Clientes/Novo', title: 'Novo Cliente' },
          },
          {
            path: ':id',
            component: CustomerForm,
            data: { breadcrumb: 'Clientes/Editar', title: 'Editar Cliente' },
          },
        ],
      },
      {
        path: 'funcionarios',
        component: Employees,
        data: { breadcrumb: 'Funcionários', title: 'Funcionários' },
      },
      {
        path: 'times',
        component: Teams,
        data: { breadcrumb: 'Times', title: 'Times' },
      },
      {
        path: 'usuarios',
        component: Users,
        data: { breadcrumb: 'Usuários', title: 'Usuários' },
      },
      {
        path: 'perfil',
        component: Profile,
        data: { breadcrumb: 'Perfil', title: 'Perfil' },
      },
      {
        path: 'configuracoes',
        component: Settings,
        data: { breadcrumb: 'Configurações', title: 'Configurações' },
      },
    ],
  },
  {
    path: '**',
    component: Error404,
  },
];
