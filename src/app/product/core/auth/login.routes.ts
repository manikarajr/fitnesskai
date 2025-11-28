import { Routes } from '@angular/router';

export const loginRoutes: Routes = [

  {
    path: '',
    loadComponent: () => import('./login/login').then(m => m.Login)
  }
];