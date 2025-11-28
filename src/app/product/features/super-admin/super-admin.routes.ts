import { Routes } from '@angular/router';

export const superAdminRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/super-admin-dashboard/super-admin-dashboard').then(m => m.SuperAdminDashboard)
  }
];