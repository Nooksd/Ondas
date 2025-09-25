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
import { EmployeeForm } from '@components/employees/employee-form/employee-form';

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
        data: { breadcrumb: 'Dashboard', title: 'Dashboard', routes: ['dashboard'] },
      },
      {
        path: 'servicos',
        component: Services,
        data: { breadcrumb: 'Serviços', tilte: 'Serviços', routes: ['servicos'] },
      },
      {
        path: 'clientes',
        data: { breadcrumb: 'Clientes', title: 'Clientes', routes: ['clientes'] },
        children: [
          {
            path: '',
            component: Customers,
          },
          {
            path: 'novo',
            component: CustomerForm,
            data: {
              breadcrumb: 'Clientes/Novo',
              title: 'Novo Cliente',
              routes: ['clientes', 'novo'],
            },
          },
          {
            path: ':id',
            component: CustomerForm,
            data: {
              breadcrumb: 'Clientes/Editar',
              title: 'Editar Cliente',
              routes: ['clientes', ':id'],
            },
          },
        ],
      },
      {
        path: 'funcionarios',
        data: { breadcrumb: 'Funcionários', title: 'Funcionários', routes: ['funcionarios'] },
        children: [
          {
            path: '',
            component: Employees,
          },
          {
            path: 'novo',
            component: EmployeeForm,
            data: {
              breadcrumb: 'Funcionários/Novo',
              title: 'Novo Funcionário',
              routes: ['funcionarios', 'novo'],
            },
          },
          {
            path: ':id',
            component: EmployeeForm,
            data: {
              breadcrumb: 'Funcionários/Editar',
              title: 'Editar Funcionário',
              routes: ['funcionarios', ':id'],
            },
          },
        ],
      },
      {
        path: 'equipes',
        component: Teams,
        data: { breadcrumb: 'Equipes', title: 'Equipes', routes: ['equipes'] },
      },
      {
        path: 'usuarios',
        component: Users,
        data: { breadcrumb: 'Usuários', title: 'Usuários', routes: ['usuarios'] },
      },
      {
        path: 'perfil',
        component: Profile,
        data: { breadcrumb: 'Perfil', title: 'Perfil', routes: ['perfil'] },
      },
      {
        path: 'configuracoes',
        component: Settings,
        data: { breadcrumb: 'Configurações', title: 'Configurações', routes: ['configuracoes'] },
      },
    ],
  },
  {
    path: '**',
    component: Error404,
  },
];
