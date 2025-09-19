import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Protected } from './components/protected/protected';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: '**',
    component: Protected,
  },
];
